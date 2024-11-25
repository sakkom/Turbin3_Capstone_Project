use crate::state::Status;
use anchor_lang::prelude::*;

#[account]
pub struct Proposal {
    pub bump: u8,
    pub proposal_seed: u64,
    pub artist: Pubkey,
    pub wall: Pubkey,
    // image_hash,
    pub offer_price: OfferPrice,
    //term
    pub status: Status,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct OfferPrice {
    pub cost: u64,
    pub profit: u64,
}

impl Space for Proposal {
    const INIT_SPACE: usize = 8 + 1 + 8 + 32 + 32 + 8 + 8 + 2;
}
