use anchor_lang::prelude::*;

#[account]
pub struct Multisig {
    pub bump: u8,
    pub wall: Pubkey,
    pub wall_owner: Pubkey,
    pub artist: Pubkey,
    pub is_wall_owner_signed: bool,
    pub is_artist_signed: bool,
    // pub expire_date: i64,
    pub is_kick_off: bool,
    pub is_settled: bool,
}

impl Space for Multisig {
    const INIT_SPACE: usize = 8 + 1 + 32 + 32 + 32 + 1 + 1 + 1 + 1;
}
