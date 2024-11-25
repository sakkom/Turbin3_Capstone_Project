use anchor_lang::prelude::*;

use crate::{
    state::{ArtistFeature, OfferPrice, Proposal, Role, User, Wall},
    UserError, WallError,
};

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
            wall: self.wall.key(),
            offer_price,
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
