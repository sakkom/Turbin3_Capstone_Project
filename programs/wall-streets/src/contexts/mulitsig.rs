use anchor_lang::prelude::*;

use crate::errors::MultisigError;
use crate::state::{Multisig, Role, Status, User, Wall};
use crate::UserError;

#[derive(Accounts)]
pub struct KickOffMultisig<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
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
    pub artist: SystemAccount<'info>,
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

impl<'info> KickOffMultisig<'info> {
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
