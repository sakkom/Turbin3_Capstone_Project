use anchor_lang::prelude::*;

use crate::{
    errors::WallError,
    state::{Expenses, Multisig, Proposal, Status, Wall},
};

#[derive(Accounts)]
pub struct CloseAccounts<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      mut,
      close = signer,
      seeds = [b"wall", wall.wall_owner_user_account.key().as_ref(), wall.wall_seed.to_le_bytes().as_ref()],
      bump = wall.bump,
    )]
    pub wall: Box<Account<'info, Wall>>,
    #[account(
      mut,
      close = signer,
      seeds = [b"proposal", wall.key().as_ref(), proposal.proposal_seed.to_le_bytes().as_ref()],
      bump = proposal.bump,
      has_one = wall,
    )]
    pub proposal: Box<Account<'info, Proposal>>,
    #[account(
      mut,
      close = signer,
      seeds = [b"expenses", wall.key().as_ref()],
      bump = expenses.bump,
      has_one = wall,
    )]
    pub expenses: Box<Account<'info, Expenses>>,
    #[account(
    mut,
    close = signer,
    seeds = [b"multisig", multisig.wall.key().as_ref()],
    bump = multisig.bump,
    has_one = wall,
  )]
    pub multisig: Box<Account<'info, Multisig>>,

    pub system_program: Program<'info, System>,
}

impl<'info> CloseAccounts<'info> {
    pub fn close_accounts(&mut self) -> Result<()> {
        require!(
            self.wall.status == Status::DONE,
            WallError::UnexpectedStatus
        );

        Ok(())
    }

    // pub fn close_receipts(
    //     &mut self,
    //     remaining_accounts: &[AccountInfo<'info>],
    //     program_id: &Pubkey,
    //     // ctx: Context<CloseAccounts>,
    // ) -> Result<()> {
    //     let wall = self.wall.key();

    //     for remainig in remaining_accounts.iter() {
    //         for i in 0..self.expenses.seeds {
    //             let i_bytes = i.to_le_bytes();
    //             let seeds = [b"receipt".as_ref(), wall.as_ref(), i_bytes.as_ref()];

    //             let (receipt_pda, _) = Pubkey::find_program_address(&seeds, program_id);

    //             if receipt_pda == remainig.key() {
    //                 let dest = self.signer.lamports();
    //                 **self.signer.lamports.borrow_mut() =
    //                     dest.checked_add(remainig.lamports()).unwrap();
    //                 **remainig.lamports.borrow_mut() = 0;

    //                 break;
    //             }
    //         }
    //     }
    //     Ok(())
    // }
}
