use crate::state::Wall;
use anchor_lang::prelude::*;

pub const MAP_TABLE_SIZE: usize = 30;
pub const MAX_LIFE_PROJECTS: usize = 15;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq)]
#[repr(u8)]
pub enum Role {
    Fun = 0,
    Artist = 1,
    WallOwner = 2,
}

#[account]
pub struct User {
    pub bump: u8,
    pub name: String,
    // pub next: Pubkey,
    pub wall_mints: [Pubkey; MAP_TABLE_SIZE],
    pub role: Role,
    pub is_artist: bool,
    pub wall_seeds: u16,
}

impl Space for User {
    const INIT_SPACE: usize = 8 + 1 + (4 + 32) + (32 * MAP_TABLE_SIZE) + 1 + 1 + 2;
}

#[account]
pub struct ArtistFeature {
    pub bump: u8,
    // pub next: Pubkey,
    pub projects: [Wall; MAX_LIFE_PROJECTS],
}

impl Space for ArtistFeature {
    const INIT_SPACE: usize = 8 + 1 + (Wall::INIT_SPACE - 8) * MAX_LIFE_PROJECTS;
}
