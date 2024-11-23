use anchor_lang::prelude::*;

use crate::errors::UserError;
use crate::state::{Role, User};

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      init,
      payer = signer,
      space = User::INIT_SPACE,
      seeds = [b"user", signer.key().as_ref()],
      bump
    )]
    pub user_account: Account<'info, User>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeUser<'info> {
    pub fn initialize_user(
        &mut self,
        name: String,
        role_number: u8,
        bumps: &InitializeUserBumps,
    ) -> Result<()> {
        require!(name.len() > 0 && name.len() < 33, UserError::NameTooLong);

        let role = match role_number {
            0 => Role::Fun,
            1 => Role::Artist,
            2 => Role::WallOwner,
            _ => return Err(UserError::InvalidRole.into()),
        };

        let user = &mut self.user_account;
        user.bump = bumps.user_account;
        user.name = name;
        user.role = role;
        user.is_artist = false;

        Ok(())
    }
}
