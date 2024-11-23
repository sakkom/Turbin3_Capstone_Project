use anchor_lang::prelude::*;

use crate::errors::UserError;
use crate::state::{ArtistFeature, Role, User};

#[derive(Accounts)]
pub struct InitializeArtist<'info> {
    #[account(mut)]
    pub artist: Signer<'info>,
    #[account(
      mut,
      seeds = [b"user", artist.key().as_ref()],
      bump = user_account.bump,
      constraint = user_account.role == Role::Artist @ UserError::UnauthorizedRole
    )]
    pub user_account: Box<Account<'info, User>>,
    #[account(
      init,
      payer = artist,
      space = ArtistFeature::INIT_SPACE,
      seeds = [b"feature", user_account.key().as_ref(), &[Role::Artist as u8]],
      bump
    )]
    pub artist_feature: Box<Account<'info, ArtistFeature>>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeArtist<'info> {
    pub fn initialize_artist(&mut self, bumps: &InitializeArtistBumps) -> Result<()> {
        let artist_feature = &mut self.artist_feature;
        artist_feature.bump = bumps.artist_feature;

        let user_account = &mut self.user_account;
        user_account.is_artist = true;

        Ok(())
    }
}
