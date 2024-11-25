use anchor_lang::prelude::*;

use crate::{
    state::{ArtistFeature, OfferPrice, Proposal, Role, Status, User, Wall},
    ExpensesError, UserError, WallError,
};
use anchor_spl::token::{transfer_checked, Mint, Token, TokenAccount, TransferChecked};

#[derive(Accounts)]
pub struct InitializeProposal<'info> {
    #[account(mut)]
    pub artist: Signer<'info>,
    pub wall_owner: SystemAccount<'info>,
    #[account(
    seeds = [b"user", artist.key().as_ref()],
    bump = artist_user_account.bump,
    constraint = artist_user_account.role == Role::Artist @ UserError::UnauthorizedRole
  )]
    pub artist_user_account: Box<Account<'info, User>>,
    #[account(
    seeds = [b"user", wall_owner.key().as_ref()],
    bump = wall_owner_user_account.bump,
    constraint = wall_owner_user_account.role == Role::WallOwner @ UserError::UnauthorizedRole
  )]
    pub wall_owner_user_account: Box<Account<'info, User>>,
    #[account(
    mut,
    seeds = [b"feature", artist_user_account.key().as_ref(), &[Role::Artist as u8]],
    bump = artist_feature.bump
  )]
    pub artist_feature: Box<Account<'info, ArtistFeature>>,
    #[account(
    mut,
    seeds = [b"wall", wall_owner_user_account.key().as_ref(), wall.wall_seed.to_le_bytes().as_ref()],
    bump = wall.bump
  )]
    pub wall: Box<Account<'info, Wall>>,
    #[account(
      init,
      payer = artist,
      space = Proposal::INIT_SPACE,
      seeds = [b"proposal", wall.key().as_ref(), wall.proposal_seeds.to_le_bytes().as_ref()],
      bump
    )]
    pub proposal: Box<Account<'info, Proposal>>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeProposal<'info> {
    pub fn initialize_proposal(
        &mut self,
        offer_price: OfferPrice,
        bumps: &InitializeProposalBumps,
    ) -> Result<()> {
        self.proposal.set_inner(Proposal {
            bump: bumps.proposal,
            proposal_seed: self.wall.proposal_seeds,
            artist: self.artist_user_account.key(),
            wall: self.wall.key(),
            offer_price,
            status: Status::default(),
        });

        self.push_offer_wall()?;

        self.wall.proposal_seeds += 1;

        Ok(())
    }

    pub fn push_offer_wall(&mut self) -> Result<()> {
        if let Some(index) = self
            .artist_feature
            .offer_wall
            .iter()
            .position(|&pubkey| pubkey == Pubkey::default())
        {
            self.artist_feature.offer_wall[index] = self.proposal.key();
            Ok(())
        } else {
            msg!("make next offer_wall account");
            Err(error!(WallError::NoSpaceAvailable))
        }
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct ApproveProposal<'info> {
    #[account(mut)]
    pub wall_owner: Signer<'info>,
    pub artist: SystemAccount<'info>,
    #[account(
    seeds = [b"user", artist.key().as_ref()],
    bump = artist_user_account.bump,
    constraint = artist_user_account.role == Role::Artist @ UserError::UnauthorizedRole
  )]
    pub artist_user_account: Box<Account<'info, User>>,
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
    has_one = project_ata
  )]
    pub wall: Box<Account<'info, Wall>>,
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
      mut,
      associated_token::mint = usdc_mint,
      associated_token::authority = wall_owner,
    )]
    pub wall_owner_ata: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl<'info> ApproveProposal<'info> {
    pub fn approve_proposal(&mut self) -> Result<()> {
        require!(
            self.artist_user_account.key() == self.proposal.artist.key(),
            UserError::InvalidArtist
        );
        require!(
            self.wall.status == Status::PENDING,
            WallError::UnexpectedStatus
        );
        require!(self.wall.proposal.is_none(), WallError::ProposalExsits);

        let wall = &mut self.wall;
        wall.artist = Some(self.artist_user_account.key());
        wall.proposal = Some(self.proposal.key());
        wall.status = Status::DRAFT;

        let proposal = &mut self.proposal;
        proposal.status = Status::DRAFT;

        Ok(())
    }

    pub fn deposit_expenses(&mut self, amount: u64) -> Result<()> {
        let offer_price = self
            .proposal
            .offer_price
            .cost
            .checked_add(self.proposal.offer_price.profit)
            .unwrap();

        require!(amount >= offer_price, ExpensesError::InsufficientDeposit);
        require!(
            self.wall_owner_ata.amount >= amount,
            ExpensesError::InsufficientTokenBalance
        );

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            from: self.wall_owner_ata.to_account_info(),
            to: self.project_ata.to_account_info(),
            mint: self.usdc_mint.to_account_info(),
            authority: self.wall_owner.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(cpi_ctx, amount, self.usdc_mint.decimals)?;

        Ok(())
    }
}

// #[derive(Accounts)]
// pub struct RejectProposal<'info> {

// }
