use anchor_lang::prelude::*;

use crate::{
    state::{Expenses, Proposal, Receipt, User, Wall, MAX_RECEIPTS_SIZE},
    ExpensesError, UserError,
};

#[derive(Accounts)]
pub struct InitializeExpenses<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub wall_owner: SystemAccount<'info>,
    #[account(
      seeds = [b"user", wall_owner.key().as_ref()],
      bump = wall_owner_user_account.bump,
  )]
    pub wall_owner_user_account: Box<Account<'info, User>>,
    #[account(
    mut,
    seeds = [b"wall", wall_owner_user_account.key().as_ref(), wall.wall_seed.to_le_bytes().as_ref()],
    bump = wall.bump,
    has_one = wall_owner
  )]
    pub wall: Box<Account<'info, Wall>>,
    #[account(
      init,
      payer = signer,
      space = Expenses::INIT_SPACE,
      seeds = [b"expenses", wall.key().as_ref()],
      bump
    )]
    pub expenses: Box<Account<'info, Expenses>>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeExpenses<'info> {
    pub fn initialize_expenses(&mut self, bumps: &InitializeExpensesBumps) -> Result<()> {
        require!(
            self.signer.key() == self.wall.artist.unwrap(),
            UserError::InvalidArtist
        );

        self.expenses.set_inner(Expenses {
            bump: bumps.expenses,
            seeds: 0,
            wall: self.wall.key(),
            artist: self.signer.key(),
            total: 0,
            next: Pubkey::default(),
            receipts: [Pubkey::default(); MAX_RECEIPTS_SIZE],
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(seed: u16)]
pub struct RecordRecipt<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub wall_owner: SystemAccount<'info>,
    #[account(
        seeds = [b"user", wall_owner.key().as_ref()],
        bump = wall_owner_user_account.bump,
    )]
    pub wall_owner_user_account: Box<Account<'info, User>>,
    #[account(
      init,
      payer = signer,
      space = Receipt::INIT_SPACE,
      seeds = [b"receipt", wall.key().as_ref(), expenses.seeds.to_le_bytes().as_ref()],
      bump
    )]
    pub receipt: Box<Account<'info, Receipt>>,
    #[account(
      mut,
      seeds = [b"expenses", wall.key().as_ref()],
      bump = expenses.bump
    )]
    pub expenses: Box<Account<'info, Expenses>>,
    #[account(
      mut,
      seeds = [b"wall", wall_owner_user_account.key().as_ref(), wall.wall_seed.to_le_bytes().as_ref()],
      bump = wall.bump,
    )]
    pub wall: Box<Account<'info, Wall>>,
    #[account(
      mut,
      seeds = [b"proposal", wall.key().as_ref(), proposal.proposal_seed.to_le_bytes().as_ref()],
      bump = proposal.bump,
      has_one = wall
    )]
    pub proposal: Box<Account<'info, Proposal>>,
    pub system_program: Program<'info, System>,
}

impl<'info> RecordRecipt<'info> {
    pub fn record_receipt(&mut self, amount: u64, bumps: &RecordReciptBumps) -> Result<()> {
        require!(
            self.signer.key() == self.wall.artist.unwrap()
                && self.signer.key() == self.expenses.artist,
            UserError::InvalidArtist
        );

        let new_total = self.expenses.total.checked_add(amount).unwrap();

        require!(
            new_total <= self.proposal.offer_price.cost,
            ExpensesError::ExceedsBudget
        );

        self.receipt.set_inner(Receipt {
            bump: bumps.receipt,
            amount,
            created_at: Clock::get()?.unix_timestamp,
        });

        self.expenses.total = new_total;
        self.expenses.seeds = self.expenses.seeds.checked_add(1).unwrap();

        Ok(())
    }
}
