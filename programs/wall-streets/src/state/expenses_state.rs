use anchor_lang::prelude::*;

#[account]
pub struct Expenses {
    pub bump: u8,
    pub seeds: u16,
    pub wall: Pubkey,
    pub artist: Pubkey,
    pub total: u64,
}

impl Space for Expenses {
    const INIT_SPACE: usize = 8 + 1 + 2 + 32 + 32 + 8;
}

#[account]
pub struct Receipt {
    pub bump: u8,
    pub amount: u64,
    // pub image_hash
    pub created_at: i64,
}

impl Space for Receipt {
    const INIT_SPACE: usize = 8 + 1 + 8 + 8;
}
