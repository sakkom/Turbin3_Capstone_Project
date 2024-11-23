use anchor_lang::prelude::*;

#[account]
pub struct Proposal {
    pub bump: u8,
    // image_hash,
    pub offer_price: OfferPrice,
    //term
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct OfferPrice {
    pub cost: u64,
    pub profit: u64,
}
