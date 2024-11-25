use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use crate::state::{Role, Status, User, Wall};

#[derive(Accounts)]
pub struct InitializeWall<'info> {
    #[account(mut)]
    pub wall_owner: Signer<'info>,
    #[account(
      mut,
      seeds = [b"user", wall_owner.key().as_ref()],
      bump = user_account.bump,
      constraint = user_account.role == Role::WallOwner
    )]
    pub user_account: Box<Account<'info, User>>,
    #[account(
      init,
      payer = wall_owner,
      space = Wall::INIT_SPACE,
      seeds = [b"wall", user_account.key().as_ref(), user_account.wall_seeds.to_le_bytes().as_ref()],
      bump
    )]
    pub wall: Box<Account<'info, Wall>>,
    pub usdc_mint: Box<Account<'info, Mint>>,
    #[account(
      init,
      payer = wall_owner,
      associated_token::mint = usdc_mint,
      associated_token::authority = wall,
    )]
    pub project_ata: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> InitializeWall<'info> {
    pub fn initialize_wall(&mut self, bumps: &InitializeWallBumps) -> Result<()> {
        msg!("Starting initialize_wall");

        let wall_seed = self.user_account.wall_seeds;

        self.wall.set_inner(Wall {
            bump: bumps.wall,
            wall_seed,
            wall_owner: self.wall_owner.key(),
            artist: None,
            project_ata: self.project_ata.key(),
            status: Status::PENDING,
            proposal_seeds: 0,
        });

        self.user_account.wall_seeds += 1;

        msg!("Wall initialized");
        Ok(())
    }
}
