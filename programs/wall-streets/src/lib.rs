use anchor_lang::prelude::*;

declare_id!("52RpWzznoBMHkRJsHNyXXsU5AxqZxYXn9KcyyL8jNJsA");

pub mod contexts;
pub use contexts::*;
pub mod errors;
pub use errors::*;
pub mod state;

#[program]
pub mod wall_streets {
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
}
