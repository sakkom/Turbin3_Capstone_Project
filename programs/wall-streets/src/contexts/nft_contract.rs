use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3,
        mint_new_edition_from_master_edition_via_token, mpl_token_metadata::types::DataV2,
        CreateMasterEditionV3, CreateMetadataAccountsV3, MasterEditionAccount, Metadata,
        MetadataAccount, MintNewEditionFromMasterEditionViaToken, ID,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

use crate::state::{User, Wall};
use crate::ContractError;

#[derive(Accounts)]
#[instruction(metadata_bump: u8, edition_bump: u8)]
pub struct InitContractNft<'info> {
    #[account(mut)]
    pub admin: Signer<'info>, //node wallet?
    #[account(
      mut,
      seeds = [b"wall", wall.wall_owner_user_account.key().as_ref(), wall.wall_seed.to_le_bytes().as_ref()],
      bump = wall.bump,
    )]
    pub wall: Box<Account<'info, Wall>>,
    #[account(
    init,
    payer = admin, //weird, should be nodewallet?
    seeds = [b"contract", wall.key().as_ref()],
    bump,
    mint::decimals = 0,
    mint::authority = wall,
    mint::freeze_authority = wall,
  )]
    pub nft_mint: Box<Account<'info, Mint>>,
    ///CHECK:
    #[account(
      mut,
      // seeds = [b"metadata", metadata_program.key().as_ref(), nft_mint.key().as_ref()],
      // seeds::program = metadata_program.key(),
      // bump = metadata_bump
    )]
    pub metadata: UncheckedAccount<'info>,
    ///CHECK:
    #[account(
      mut,
      // seeds = [b"metadata", metadata_program.key().as_ref(), nft_mint.key().as_ref(), b"edition"],
      // seeds::program = metadata_program.key(),
      // bump = edition_bump
    )]
    pub edition: UncheckedAccount<'info>,
    #[account(
      init,
      payer = admin,
      associated_token::mint = nft_mint,
      associated_token::authority = admin,
    )]
    pub admin_ata: Box<Account<'info, TokenAccount>>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = ID)]
    pub metadata_program: Program<'info, Metadata>,
}

impl<'info> InitContractNft<'info> {
    pub fn create_metadata(&mut self, bumps: &InitContractNftBumps) -> Result<()> {
        let seeds = [
            b"wall",
            self.wall.wall_owner_user_account.as_ref(),
            &self.wall.wall_seed.to_le_bytes()[..],
            &[self.wall.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let token_data: DataV2 = DataV2 {
            name: "test".to_string(),
            symbol: "CTR".to_string(),
            uri: "image".to_string(),
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        let cpi_accounts = CreateMetadataAccountsV3 {
            metadata: self.metadata.to_account_info(),
            mint: self.nft_mint.to_account_info(),
            payer: self.admin.to_account_info(),
            system_program: self.system_program.to_account_info(),
            mint_authority: self.wall.to_account_info(),
            update_authority: self.wall.to_account_info(),
            rent: self.rent.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.metadata_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        create_metadata_accounts_v3(cpi_ctx, token_data, false, true, None)?;

        self.wall.nft_bump = Some(bumps.nft_mint);

        Ok(())
    }

    pub fn create_master_edition(&mut self) -> Result<()> {
        let seeds = [
            b"wall",
            self.wall.wall_owner_user_account.as_ref(),
            &self.wall.wall_seed.to_le_bytes()[..],
            &[self.wall.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = CreateMasterEditionV3 {
            payer: self.admin.to_account_info(),
            mint: self.nft_mint.to_account_info(),
            metadata: self.metadata.to_account_info(),
            edition: self.edition.to_account_info(),
            mint_authority: self.wall.to_account_info(),
            update_authority: self.wall.to_account_info(),
            rent: self.rent.to_account_info(),
            system_program: self.system_program.to_account_info(),
            token_program: self.token_program.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.metadata_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        create_master_edition_v3(cpi_ctx, Some(2))?;

        Ok(())
    }

    pub fn mint_to_admin(&mut self) -> Result<()> {
        let seeds = [
            b"wall",
            self.wall.wall_owner_user_account.as_ref(),
            &self.wall.wall_seed.to_le_bytes()[..],
            &[self.wall.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: self.nft_mint.to_account_info(),
            to: self.admin_ata.to_account_info(),
            authority: self.wall.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        mint_to(cpi_ctx, 1)?;

        Ok(())
    }
}

//wall_owner + artist
#[derive(Accounts)]
#[instruction(metadata_bump: u8, edition_bump: u8)]
pub struct MintContract<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
    mut,
    seeds = [b"wall", wall.wall_owner_user_account.key().as_ref(), wall.wall_seed.to_le_bytes().as_ref()],
    bump = wall.bump,
  )]
    pub wall: Box<Account<'info, Wall>>,
    ///CHECK:
    #[account(mut)]
    pub edition_mark_pda: UncheckedAccount<'info>,

    #[account(
      mut, //?
      seeds = [b"contract", wall.key().as_ref()],
      bump = wall.nft_bump.unwrap(),
    )]
    pub metadata_mint: Box<Account<'info, Mint>>,
    #[account(
      mut,//?
      seeds = [b"metadata", metadata_program.key().as_ref(), metadata_mint.key().as_ref()],
      seeds::program = metadata_program.key(),
      bump = metadata_bump
    )]
    pub metadata: Box<Account<'info, MetadataAccount>>,
    #[account(
      mut,
      seeds = [b"metadata", metadata_program.key().as_ref(), metadata_mint.key().as_ref(), b"edition"],
      seeds::program = metadata_program.key(),
      bump = edition_bump
    )]
    pub master_edition: Box<Account<'info, MasterEditionAccount>>,
    #[account(
      mut,
      associated_token::mint = metadata_mint,
      associated_token::authority = admin,
    )]
    pub admin_ata: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
      init,
      payer = signer,
      seeds = [b"contract", wall.key().as_ref(), signer.key().as_ref()],
      bump,
      mint::decimals = 0,
      mint::authority = signer,
      mint::freeze_authority = signer,
)]
    pub new_mint: Box<Account<'info, Mint>>,
    #[account(
      init,
      payer = signer,
      associated_token::mint = new_mint,
      associated_token::authority = signer,
    )]
    pub new_mint_ata: Box<Account<'info, TokenAccount>>,
    ///CHECK
    #[account(mut)]
    pub new_metadata: UncheckedAccount<'info>,
    ///CHECK
    #[account(mut)]
    pub new_edition: UncheckedAccount<'info>,

    // pub edition_authority: SystemAccount<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(address = ID)]
    pub metadata_program: Program<'info, Metadata>,
}

impl<'info> MintContract<'info> {
    pub fn mint_new_mint(&mut self) -> Result<()> {
        let cpi_accounts = MintTo {
            mint: self.new_mint.to_account_info(),
            to: self.new_mint_ata.to_account_info(),
            authority: self.signer.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

        mint_to(cpi_ctx, 1)?;

        Ok(())
    }

    pub fn mint_nft(&mut self) -> Result<()> {
        require!(
            self.admin_ata.amount == 1,
            ContractError::InvalidTokenBalance
        );

        let seeds = [
            b"wall",
            self.wall.wall_owner_user_account.as_ref(),
            &self.wall.wall_seed.to_le_bytes()[..],
            &[self.wall.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        // let edition_number = self.master_edition.supply;
        let edition_number = 1;

        let cpi_accounts = MintNewEditionFromMasterEditionViaToken {
            edition_mark_pda: self.edition_mark_pda.to_account_info(),
            metadata_mint: self.metadata_mint.to_account_info(),
            metadata: self.metadata.to_account_info(),
            master_edition: self.master_edition.to_account_info(),
            token_account: self.admin_ata.to_account_info(),
            token_account_owner: self.admin.to_account_info(),
            new_mint: self.new_mint.to_account_info(),
            new_metadata: self.new_metadata.to_account_info(),
            new_edition: self.new_edition.to_account_info(),
            new_mint_authority: self.signer.to_account_info(),
            new_metadata_update_authority: self.signer.to_account_info(),
            payer: self.signer.to_account_info(),
            rent: self.rent.to_account_info(),
            token_program: self.token_program.to_account_info(),
            system_program: self.system_program.to_account_info(),
        };

        let cpi_program = self.metadata_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        mint_new_edition_from_master_edition_via_token(cpi_ctx, edition_number)?;

        Ok(())
    }
}
