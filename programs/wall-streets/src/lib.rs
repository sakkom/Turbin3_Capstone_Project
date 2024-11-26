use anchor_lang::prelude::*;

declare_id!("52RpWzznoBMHkRJsHNyXXsU5AxqZxYXn9KcyyL8jNJsA");

pub mod contexts;
pub use contexts::*;
pub mod errors;
pub use errors::*;
pub mod state;
pub use state::OfferPrice;

#[program]
pub mod wall_streets {
    use state::OfferPrice;

    use super::*;

    pub fn initialize_user(
        ctx: Context<InitializeUser>,
        name: String,
        role_number: u8,
    ) -> Result<()> {
        ctx.accounts
            .initialize_user(name, role_number, &ctx.bumps)?;

        Ok(())
    }

    pub fn initialize_artist(ctx: Context<InitializeArtist>) -> Result<()> {
        ctx.accounts.initialize_artist(&ctx.bumps)?;

        Ok(())
    }

    pub fn initialize_wall(ctx: Context<InitializeWall>) -> Result<()> {
        ctx.accounts.initialize_wall(&ctx.bumps)?;

        Ok(())
    }

    pub fn initialize_proposal(
        ctx: Context<InitializeProposal>,
        offer_price: OfferPrice,
    ) -> Result<()> {
        ctx.accounts.initialize_proposal(offer_price, &ctx.bumps)?;

        Ok(())
    }

    pub fn approve_proposal(ctx: Context<ApproveProposal>, amount: u64) -> Result<()> {
        ctx.accounts.approve_proposal()?;
        ctx.accounts.deposit_expenses(amount)?;
        ctx.accounts.initialize_multising_account(&ctx.bumps)?;

        Ok(())
    }

    pub fn kick_off_project(ctx: Context<KickOffMultisig>) -> Result<()> {
        ctx.accounts.kick_off_project()?;

        Ok(())
    }
}
