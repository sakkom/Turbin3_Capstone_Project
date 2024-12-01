use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Default)]
pub enum Status {
    #[default]
    PENDING,
    DRAFT,
    ACTIVE,
    DONE,
}

#[account]
#[derive(Default)]
pub struct Wall {
    pub bump: u8,
    pub wall_seed: u16,
    pub wall_owner: Pubkey,
    pub wall_owner_user_account: Pubkey,
    pub artist: Option<Pubkey>,
    // pub prie: Price,
    // pub address: Address,
    pub project_ata: Pubkey,
    pub status: Status,
    pub proposal_seeds: u64,
    pub proposal: Option<Pubkey>, //優先
    pub nft_bump: Option<u8>,
}

impl Space for Wall {
    const INIT_SPACE: usize = 8 + 1 + 2 + 32 + 32 + (1 + 32) + 32 + 2 + 8 + (1 + 32) + (1 + 1);
}
