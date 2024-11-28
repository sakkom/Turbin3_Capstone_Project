use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;

use crate::{
    signed_project,
    state::{Expenses, Multisig, Proposal, Role, Status, User, Wall},
    ExpensesError, MultisigError, UserError, WallError,
};
use anchor_spl::token::{transfer_checked, Mint, Token, TokenAccount, TransferChecked};

#[derive(Accounts)]
pub struct SettleProject<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub artist: SystemAccount<'info>,
    pub wall_owner: SystemAccount<'info>,
    #[account(
    mut,
    seeds = [b"multisig", multisig.wall.key().as_ref()],
    bump = multisig.bump,
    has_one = wall,
    has_one = wall_owner,
    has_one = artist,
  )]
    pub multisig: Box<Account<'info, Multisig>>,
    #[account(
    seeds = [b"user", wall_owner.key().as_ref()],
    bump = wall_owner_user_account.bump,
    constraint = wall_owner_user_account.role == Role::WallOwner @ UserError::UnauthorizedRole
  )]
    pub wall_owner_user_account: Box<Account<'info, User>>,
    #[account(
      mut,
      seeds = [b"wall", wall_owner_user_account.key().as_ref(), wall.wall_seed.to_le_bytes().as_ref()],
      bump = wall.bump,
      has_one = wall_owner,
    )]
    pub wall: Box<Account<'info, Wall>>,
    #[account(
      mut,
      seeds = [b"expenses", wall.key().as_ref()],
      bump = expenses.bump
  )]
    pub expenses: Box<Account<'info, Expenses>>,
    #[account(
      mut,
      seeds = [b"proposal", wall.key().as_ref(), proposal.proposal_seed.to_le_bytes().as_ref()],
      bump = proposal.bump,
      has_one = wall
    )]
    pub proposal: Box<Account<'info, Proposal>>,
    pub usdc_mint: Box<Account<'info, Mint>>,
    #[account(
      mut,
      associated_token::mint = usdc_mint,
      associated_token::authority = wall,
    )]
    pub project_ata: Box<Account<'info, TokenAccount>>,
    #[account(
      init_if_needed,
      payer = signer,
      associated_token::mint = usdc_mint,
      associated_token::authority = wall_owner,
    )]
    pub wall_owner_ata: Box<Account<'info, TokenAccount>>,
    #[account(
      init_if_needed,
      payer = signer, //weird
      associated_token::mint = usdc_mint,
      associated_token::authority = artist,
    )]
    pub artist_ata: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> SettleProject<'info> {
    pub fn settle_project(&mut self) -> Result<()> {
        require!(
            self.multisig.is_kick_off,
            MultisigError::RequireKickOffStatus
        );

        signed_project(&self.signer, &mut self.multisig, &self.wall)?;

        if self.multisig.is_wall_owner_signed && self.multisig.is_artist_signed {
            self.wall.status = Status::DONE;

            let (unused_cost, artist_payment) = self.calulate_amounts()?;

            self.refund_unused_cost(unused_cost)?;
            self.send_budghet_to_artist(artist_payment)?;

            self.multisig.is_settled = true;
        }

        Ok(())
    }

    pub fn calulate_amounts(&self) -> Result<(u64, u64)> {
        let budget = self
            .proposal
            .offer_price
            .cost
            .checked_add(self.proposal.offer_price.profit)
            .unwrap();
        require!(budget == self.project_ata.amount, WallError::InvalidBudget);

        let unused_cost = self
            .proposal
            .offer_price
            .cost
            .checked_sub(self.expenses.total)
            .unwrap();

        let artist_payment = self
            .proposal
            .offer_price
            .profit
            .checked_add(self.expenses.total)
            .unwrap();

        Ok((unused_cost, artist_payment))
    }

    pub fn refund_unused_cost(&mut self, unused_cost: u64) -> Result<()> {
        require!(
            self.wall.proposal.unwrap() == self.proposal.key(),
            WallError::UnmuchedProposal
        );
        require!(
            self.expenses.total <= self.proposal.offer_price.cost,
            ExpensesError::ExceedsBudget
        );

        let cpi_accounts = TransferChecked {
            from: self.project_ata.to_account_info(),
            to: self.wall_owner_ata.to_account_info(),
            mint: self.usdc_mint.to_account_info(),
            authority: self.wall.to_account_info(),
        };

        let seeds = [
            b"wall",
            self.wall_owner_user_account.to_account_info().key.as_ref(),
            &self.wall.wall_seed.to_le_bytes()[..],
            &[self.wall.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        transfer_checked(cpi_ctx, unused_cost, self.usdc_mint.decimals)?;

        Ok(())
    }

    pub fn send_budghet_to_artist(&mut self, artist_payment: u64) -> Result<()> {
        let cpi_accounts = TransferChecked {
            from: self.project_ata.to_account_info(),
            to: self.artist_ata.to_account_info(),
            mint: self.usdc_mint.to_account_info(),
            authority: self.wall.to_account_info(),
        };

        let seeds = [
            b"wall",
            self.wall_owner_user_account.to_account_info().key.as_ref(),
            &self.wall.wall_seed.to_le_bytes()[..],
            &[self.wall.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        transfer_checked(cpi_ctx, artist_payment, self.usdc_mint.decimals)?;

        Ok(())
    }
}
