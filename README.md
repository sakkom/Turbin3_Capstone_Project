# wall streets 

## Overview
An escrow-based mural project execution system with deed and rights NFT tokenization.

## Flow
*Note: This documentation focuses on financial flows.*

**1.Project Initialization**
A wall owner Registers a wall and waits for proposals.

- The budget vault is empty at this points.
```
  .initializeWall(budget)
  .accountsPartial({ wallOwner, wall, usdcMint, projectAta, ... })
  .signers([wallOwner]) 
```
```
  Status::PENDING;
```
**2.Project Proposal & Approval**

An artist submits mock-ups within the budget range.
- The artist-feature manages an artist's approaches to walls.

A wall-owner selects one proposal

- Deposits required funds into the vault.
- For security measures, status changes to DRAFT.
```
  .initializeProposal(offerPrice)
  .accountsPartial({ artist, artistFeature, wall, proposal, ... })
  .signers([artist]) 
```
```
  .approveProposal(deposit_amount)
  .accountsPartial({ proposal, projectAta, wallOwnerAta, ... })
  .signers([wallOwner])  
```
```
  Status::DRAFT;
```
**3.Project Kick-off**
A wall-owner and an artist verify each other to formally start the project.

- System sets flags to true and resets signature states after confirmation.
- Status changes to ACTIVE, enabling financial operations.
```
  .kickOffProject()
  .accountsPartial({ signer, wallOwner, artist, wall, multisig, ... })
  .signers([]) // Per wall owner & artist 
```
```
  pub struct Multisig {
      ...
      pub is_wall_owner_signed: bool,
      pub is_artist_signed: bool,
      pub is_kick_off: bool,
      pub is_settled: bool,
      // pub expire_date: i64,
  }
```
```
  Status::ACTIVE;
```
**3.Financial Management**
An artist records project expenses.

- Create receipts for each epense entry.
- Validates total expenses against the proposal's cost limit.
```
  pub struct Expenses {
      pub bump: u8,
      pub seeds: u16,
      pub wall: Pubkey,
      pub artist: Pubkey,
      pub total: u64,
  }
```
```
  .initializeExpenses()
  .accountsPartial({ expenses, ... })
```
```
  .recordRecipt(receiptAmount)
  .accountsPartial({ proposal, expenses, ... })
  .signers([artist]) 
```
**4.Financial Settlement**
A wall-owner and an artist confirm project completion through multisig.

- Transfers profit to the artist from the budget.
- Refunds remaining costs to the wall-owner.
```
  .settleProject()
  .accounts({ signer, multisig, projectAta, artistAta, expenses, ... })
  .signers([]) // Per wall owner & artist 
```
**5.NFT Creation & Recording**
Upon settlement confirmation, system mints immutable NFT.

- Create master edition NFT with limited supply.
- Set wall as the authority.
- Program retains the master mint.

*Preserves NFT reference in user accounts prior to wall account closure.*
```
  .initNft(dataV2)
  .accountsPartial({
    nodeWallet,
    nftMint,
    archiveAta,
    wallOwnerUserAccount,
    artistUserAccount,
    metadataProgram,
  })
  .signers([nodeWallet]) 
```
```
  create_master_edition_v3(cpi_ctx, Some(2))?;
```
```
  pub struct User {
      // pub next: Pubkey,
      pub wall_mints: [Pubkey; MAP_TABLE_SIZE],
  }
```
**6.NFT Distribution**
A wall-owner? and an aritst mint their controllable edition NFTs.

- Each edition NFT is accompanied by immutable contract data.
- Status changes to DONE, making the official project completion.
```
  .mintNft()
  .accounts({ signer, newMintAta, ... })
  .signers([]) // Per wall owner & artist  
```
```
  mint_new_edition_from_master_edition_via_token(cpi_ctx, edition_number)?;
```
```
  Status::DONE;
```
**7.Account Closing**
After project completion, system closes all project-related accounts.

*Note: Receipt accounts retention and IPFS/Arweave links may be required.*
```
      .closeAccounts()
      .accountsPartial({ wall, proposal, expenses, multisig, ... })
      .remainingAccounts(receipts)
      .signers([nodeWallet])
```
