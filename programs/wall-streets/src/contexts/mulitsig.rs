use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;

use crate::errors::MultisigError;
use crate::state::{Multisig, Proposal, Role, Status, User, Wall};
use crate::UserError;
use anchor_spl::token::{transfer_checked, Mint, Token, TokenAccount, TransferChecked};

#[derive(Accounts)]
pub struct KickOffProject<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub artist: SystemAccount<'info>,
    #[account(
    mut,
    seeds = [b"multisig", multisig.wall.key().as_ref()],
    bump = multisig.bump,
    has_one = wall,
    has_one = wall_owner,
    has_one = artist,
  )]
    pub multisig: Box<Account<'info, Multisig>>,
    pub wall_owner: SystemAccount<'info>,
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
    pub system_program: Program<'info, System>,
}

impl<'info> KickOffProject<'info> {
    pub fn kick_off_project(&mut self) -> Result<()> {
        require!(
            (self.signer.key() == self.multisig.artist
                && self.signer.key() == self.wall.artist.unwrap())
                || (self.signer.key() == self.multisig.wall_owner
                    && self.signer.key() == self.wall.wall_owner),
            MultisigError::InvalidMultisigSigners
        );

        self.signed_project()?;

        if self.multisig.is_wall_owner_signed && self.multisig.is_artist_signed {
            self.wall.status = Status::ACTIVE;
        }

        Ok(())
    }

    pub fn signed_project(&mut self) -> Result<()> {
        if self.signer.key() == self.multisig.wall_owner.key() {
            require!(
                !self.multisig.is_wall_owner_signed,
                MultisigError::AlreadySigned
            );

            self.multisig.is_wall_owner_signed = true;
        } else if self.signer.key() == self.multisig.artist.key() {
            require!(
                !self.multisig.is_artist_signed,
                MultisigError::AlreadySigned
            );

            self.multisig.is_artist_signed = true;
        } else {
            return err!(MultisigError::InvalidMultisigSigners);
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CancelProject<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub artist: SystemAccount<'info>,
    #[account(
      mut,
      close = signer,
      seeds = [b"multisig", multisig.wall.key().as_ref()],
      bump = multisig.bump,
      has_one = wall,
      has_one = wall_owner,
    )]
    pub multisig: Box<Account<'info, Multisig>>,
    pub wall_owner: SystemAccount<'info>,
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
      mut,
      close = artist,
      seeds = [b"proposal", wall.key().as_ref(), proposal.proposal_seed.to_le_bytes().as_ref()],
      bump = proposal.bump,
      has_one = wall,
      has_one = artist
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CancelProject<'info> {
    pub fn cancel_project(&mut self) -> Result<()> {
        require!(
            self.signer.key() == self.wall.wall_owner
                && (self.signer.key() == self.multisig.wall_owner),
            MultisigError::UnauthorizedSigner
        );
        require!(
            !(self.multisig.is_wall_owner_signed && self.multisig.is_artist_signed),
            MultisigError::NotCancelBool
        );

        self.wall.artist = None;
        self.wall.proposal = None;
        self.wall.status = Status::PENDING;

        Ok(())
    }

    pub fn refund_project_deposit(&mut self) -> Result<()> {
        let amount = self.project_ata.amount;

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            from: self.project_ata.to_account_info(),
            to: self.wall_owner_ata.to_account_info(),
            authority: self.wall.to_account_info(),
            mint: self.usdc_mint.to_account_info(),
        };

        let seeds = [
            b"wall",
            self.wall_owner_user_account.to_account_info().key.as_ref(),
            &self.wall.wall_seed.to_le_bytes()[..],
            &[self.wall.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer_checked(cpi_ctx, amount, self.usdc_mint.decimals)?;

        Ok(())
    }
}
