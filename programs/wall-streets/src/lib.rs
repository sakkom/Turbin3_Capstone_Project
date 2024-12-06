use anchor_lang::prelude::*;

declare_id!("NuRUuEzwhe5VFVJhZNGSzhZKPeeiyq1RhdeDQLiNgCa");

pub mod contexts;
pub use contexts::*;
pub mod errors;
pub use errors::*;
pub mod state;
pub use state::OfferPrice;
use state::{Multisig, Wall};

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

    pub fn kick_off_project(ctx: Context<KickOffProject>) -> Result<()> {
        ctx.accounts.kick_off_project()?;

        Ok(())
    }

    pub fn cancel_project(ctx: Context<CancelProject>) -> Result<()> {
        ctx.accounts.cancel_project()?;
        ctx.accounts.refund_project_deposit()?;

        Ok(())
    }

    pub fn initialize_expenses(ctx: Context<InitializeExpenses>) -> Result<()> {
        ctx.accounts.initialize_expenses(&ctx.bumps)?;
        Ok(())
    }

    pub fn record_recipt(ctx: Context<RecordRecipt>, amount: u64) -> Result<()> {
        ctx.accounts.record_receipt(amount, &ctx.bumps)?;
        Ok(())
    }

    pub fn settle_project(ctx: Context<SettleProject>) -> Result<()> {
        ctx.accounts.settle_project()?;
        Ok(())
    }

    pub fn init_nft(ctx: Context<InitContractNft>) -> Result<()> {
        ctx.accounts.create_metadata(&ctx.bumps)?;
        ctx.accounts.mint_to_archive()?;
        ctx.accounts.create_master_edition()?;

        ctx.accounts.push_wall_mint()?;

        Ok(())
    }

    pub fn mint_nft(ctx: Context<MintContract>, metadata_bump: u8, edition_bump: u8) -> Result<()> {
        ctx.accounts.mint_edition_mint()?;
        ctx.accounts.create_edition(&ctx.program_id)?;

        Ok(())
    }

    pub fn close_accounts(ctx: Context<CloseAccounts>) -> Result<()> {
        ctx.accounts.close_accounts()?;

        let wall = ctx.accounts.wall.key();

        for remainig in ctx.remaining_accounts.iter() {
            for i in 0..ctx.accounts.expenses.seeds {
                let i_bytes = i.to_le_bytes();
                let seeds = [b"receipt".as_ref(), wall.as_ref(), i_bytes.as_ref()];

                let (receipt_pda, _) = Pubkey::find_program_address(&seeds, &ctx.program_id);

                if receipt_pda == remainig.key() {
                    let dest = ctx.accounts.signer.lamports();
                    **ctx.accounts.signer.lamports.borrow_mut() =
                        dest.checked_add(remainig.lamports()).unwrap();
                    **remainig.lamports.borrow_mut() = 0;

                    break;
                }
            }
        }
        Ok(())
    }
}

pub fn signed_project<'info>(
    signer: &Signer<'info>,
    multisig: &mut Account<'info, Multisig>,
    wall: &Account<'info, Wall>,
) -> Result<()> {
    require!(
        (signer.key() == multisig.artist && signer.key() == wall.artist.unwrap())
            || (signer.key() == multisig.wall_owner && signer.key() == wall.wall_owner),
        MultisigError::InvalidMultisigSigners
    );

    if signer.key() == multisig.wall_owner.key() {
        require!(!multisig.is_wall_owner_signed, MultisigError::AlreadySigned);

        multisig.is_wall_owner_signed = true;
    } else if signer.key() == multisig.artist.key() {
        require!(!multisig.is_artist_signed, MultisigError::AlreadySigned);

        multisig.is_artist_signed = true;
    } else {
        return err!(MultisigError::InvalidMultisigSigners);
    }

    Ok(())
}
