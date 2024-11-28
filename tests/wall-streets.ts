import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { WallStreets } from "../target/types/wall_streets";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

describe("wall-streets", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.WallStreets as Program<WallStreets>;

  const payer = provider.wallet as NodeWallet;
  let wallOwner = anchor.web3.Keypair.generate();

  let LOCALNET_USDC_MINT: anchor.web3.PublicKey;
  let PROJECT_ATA: anchor.web3.PublicKey;
  let WALL_OWENER_ATA: anchor.web3.PublicKey;
  let ARTIST_ATA: anchor.web3.PublicKey;
  let WALLPDA: anchor.web3.PublicKey;
  let PROPOSALPDA: anchor.web3.PublicKey;
  let MULTISIG_ACCOUNT: anchor.web3.PublicKey;
  let EXPENSES_PDA: anchor.web3.PublicKey;

  const FUN = new anchor.BN(0);
  const ARTIST_NUMBER = new anchor.BN(1);
  const WALL_OWNER_NUMBER = new anchor.BN(2);
  const DECIMALS = 6;
  const DECIMAL_MULTIPLIER = 10 ** DECIMALS;
  const OFFERPRICE = {
    cost: new anchor.BN(1000 * DECIMAL_MULTIPLIER),
    profit: new anchor.BN(200 * DECIMAL_MULTIPLIER),
  };
  const DEPOSIT_AMOUNT = new anchor.BN(1200 * DECIMAL_MULTIPLIER);

  const DEFAULTPUBKEY = anchor.web3.PublicKey.default;

  const [artistUserAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user"), provider.publicKey.toBuffer()],
    program.programId
  );

  const [wallOwnerUserAccountPda] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), wallOwner.publicKey.toBuffer()],
      program.programId
    );

  const [artistFeature] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("feature"),
      artistUserAccountPda.toBuffer(),
      ARTIST_NUMBER.toBuffer("le", 1),
    ],
    program.programId
  );

  before(async () => {
    LOCALNET_USDC_MINT = await createMint(
      provider.connection,
      payer.payer,
      provider.wallet.publicKey,
      provider.wallet.publicKey,
      6,
      undefined,
      undefined,
      TOKEN_PROGRAM_ID
    );

    const wallOwnerAirdrop = await provider.connection.requestAirdrop(
      wallOwner.publicKey,
      1 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(wallOwnerAirdrop);

    WALL_OWENER_ATA = (
      await getOrCreateAssociatedTokenAccount(
        provider.connection,
        wallOwner,
        LOCALNET_USDC_MINT,
        wallOwner.publicKey
      )
    ).address;

    await mintTo(
      provider.connection,
      payer.payer,
      LOCALNET_USDC_MINT,
      WALL_OWENER_ATA,
      provider.publicKey,
      DEPOSIT_AMOUNT.toNumber()
    );

    const balance = await provider.connection.getTokenAccountBalance(
      WALL_OWENER_ATA
    );
    console.log("usdc balance", balance.value.uiAmount);
  });

  it("Is initialized Artist!", async () => {
    const name = "painter";
    await program.methods
      .initializeUser(name, ARTIST_NUMBER.toNumber())
      .accountsPartial({
        signer: provider.wallet.publicKey,
        userAccount: artistUserAccountPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const userAccount = await program.account.user.fetch(artistUserAccountPda);
    // console.log("user account initial data", userAccount);

    // expect(userAccount.wallMints).to.have.lengthOf(30);
    expect(userAccount.role).to.have.property("artist");
  });

  it("Is Initialize Artist Feature", async () => {
    await program.methods
      .initializeArtist()
      .accountsPartial({
        artist: provider.wallet.publicKey,
        userAccount: artistUserAccountPda,
        artistFeature,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const artistFeatureAccount = await program.account.artistFeature.fetch(
      artistFeature
    );
    const userAccount = await program.account.user.fetch(artistUserAccountPda);

    expect(userAccount.isArtist).to.be.true;
    expect(artistFeatureAccount.offerWall).to.have.lengthOf(15);
    expect(artistFeatureAccount).to.be.exist;
  });

  it("Is initialized Wall Owner!", async () => {
    const name = "waller";
    await program.methods
      .initializeUser(name, WALL_OWNER_NUMBER.toNumber())
      .accountsPartial({
        signer: wallOwner.publicKey,
        userAccount: wallOwnerUserAccountPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallOwner])
      .rpc();

    const userAccount = await program.account.user.fetch(
      wallOwnerUserAccountPda
    );
    // console.log("user account initial data", userAccount);

    // expect(userAccount.wallMints).to.have.lengthOf(30);
    expect(userAccount.role).to.have.property("wallOwner");
  });

  it("Is initialized wall!", async () => {
    const userAccount = await program.account.user.fetch(
      wallOwnerUserAccountPda
    );
    // console.log("user account initial data", userAccount);

    const seed = new anchor.BN(userAccount.wallSeeds);
    // console.log("beforeseed", seed);

    WALLPDA = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("wall"),
        wallOwnerUserAccountPda.toBuffer(),
        seed.toBuffer("le", 2),
      ],
      program.programId
    )[0];

    [PROJECT_ATA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        WALLPDA.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        LOCALNET_USDC_MINT.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    await program.methods
      .initializeWall()
      .accountsPartial({
        wallOwner: wallOwner.publicKey,
        userAccount: wallOwnerUserAccountPda,
        wall: WALLPDA,
        usdcMint: LOCALNET_USDC_MINT,
        projectAta: PROJECT_ATA,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([wallOwner])
      .rpc();

    const wallAccount = await program.account.wall.fetch(WALLPDA);
    const afterUserAccount = await program.account.user.fetch(
      wallOwnerUserAccountPda
    );
    const afterSeeds = seed.toNumber() + 1;
    expect(afterUserAccount.wallSeeds).to.eql(afterSeeds);
  });

  it("Is initialize proposal!", async () => {
    // for (let i = 0; i <= 15; i++) {

    const beforeWallAccount = await program.account.wall.fetch(WALLPDA);
    const beforeProposalSeeds = beforeWallAccount.proposalSeeds;

    [PROPOSALPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("proposal"),
        WALLPDA.toBuffer(),
        beforeWallAccount.proposalSeeds.toBuffer("le", 8),
      ],
      program.programId
    );

    // if (i >= 15) {
    //   expect.fail("not space because array length of 15");
    // }

    // try {
    await program.methods
      .initializeProposal(OFFERPRICE)
      .accountsPartial({
        artist: provider.wallet.publicKey,
        wallOwner: wallOwner.publicKey,
        artistUserAccount: artistUserAccountPda,
        wallOwnerUserAccount: wallOwnerUserAccountPda,
        artistFeature: artistFeature,
        wall: WALLPDA,
        proposal: PROPOSALPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const afterWallAccount = await program.account.wall.fetch(WALLPDA);
    const artistFeatureAccount = await program.account.artistFeature.fetch(
      artistFeature
    );
    const proposalAccount = await program.account.proposal.fetch(PROPOSALPDA);

    // expect(artistFeatureAccount.offerWall[i]).to.not.eql(DEFAULTPUBKEY);
    // expect(artistFeatureAccount.offerWall[i]).to.eql(proposalPda);
    expect(afterWallAccount.proposalSeeds.toNumber()).to.eql(
      beforeProposalSeeds.toNumber() + 1
    );
    expect(proposalAccount.offerPrice.cost.toNumber()).to.eql(
      OFFERPRICE.cost.toNumber()
    );
    expect(proposalAccount.offerPrice.profit.toNumber()).to.eql(
      OFFERPRICE.profit.toNumber()
    );
    // } catch (err) {
    //   if (i >= 15) {
    //     console.log("not space & make space");
    //   } else {
    //     console.log(i);
    //     console.log("Unexpected error");
    //   }
    // }
    // }
  });

  it("Is approve proposal!", async () => {
    const beforeProposalAccount = await program.account.proposal.fetch(
      PROPOSALPDA
    );
    const [testProposal] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("proposal"),
        WALLPDA.toBuffer(),
        beforeProposalAccount.proposalSeed.toBuffer("le", 8),
      ],
      program.programId
    );

    [MULTISIG_ACCOUNT] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("multisig"), WALLPDA.toBuffer()],
      program.programId
    );

    await program.methods
      .approveProposal(DEPOSIT_AMOUNT)
      .accountsPartial({
        wallOwner: wallOwner.publicKey,
        artist: provider.wallet.publicKey,
        wallOwnerUserAccount: wallOwnerUserAccountPda,
        artistUserAccount: artistUserAccountPda,
        wall: WALLPDA,
        proposal: testProposal,
        usdcMint: LOCALNET_USDC_MINT,
        projectAta: PROJECT_ATA,
        wallOwnerAta: WALL_OWENER_ATA,
        multisig: MULTISIG_ACCOUNT,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([wallOwner])
      .rpc();

    const wallAccount = await program.account.wall.fetch(WALLPDA);
    const proposalAccount = await program.account.proposal.fetch(PROPOSALPDA);
    const projectAtaBalance = await provider.connection.getTokenAccountBalance(
      PROJECT_ATA
    );
    const multisigAccount = await program.account.multisig.fetch(
      MULTISIG_ACCOUNT
    );

    expect(wallAccount.artist).to.exist;
    expect(wallAccount.status).has.property("draft");
    expect(proposalAccount.status).has.property("draft");
    expect(projectAtaBalance.value.amount).to.eql(DEPOSIT_AMOUNT.toString());
    expect(multisigAccount).to.be.exist;
  });

  it("Is kick off project!", async () => {
    await program.methods
      .kickOffProject()
      .accountsPartial({
        signer: wallOwner.publicKey,
        wallOwner: wallOwner.publicKey,
        artist: provider.wallet.publicKey,
        wallOwnerUserAccount: wallOwnerUserAccountPda,
        wall: WALLPDA,
        multisig: MULTISIG_ACCOUNT,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallOwner])
      .rpc();

    const firstSigned = await program.account.multisig.fetch(MULTISIG_ACCOUNT);

    await program.methods
      .kickOffProject()
      .accountsPartial({
        signer: provider.wallet.publicKey,
        wallOwner: wallOwner.publicKey,
        artist: provider.wallet.publicKey,
        wallOwnerUserAccount: wallOwnerUserAccountPda,
        wall: WALLPDA,
        multisig: MULTISIG_ACCOUNT,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer.payer])
      .rpc();

    const secondSigned = await program.account.multisig.fetch(MULTISIG_ACCOUNT);
    const wallAccount = await program.account.wall.fetch(WALLPDA);

    expect(secondSigned.isKickOff).to.be.true;
    expect(wallAccount.status).to.have.property("active");
  });

  // it("Is cancel project", async () => {
  //   const multisigAccountData = await program.account.multisig.fetch(
  //     MULTISIG_ACCOUNT
  //   );
  //   // require(!is_wall_owner_signed && !is_artist_signed);

  //   await program.methods
  //     .cancelProject()
  //     .accountsPartial({
  //       signer: wallOwner.publicKey,
  //       wallOwner: wallOwner.publicKey,
  //       artist: provider.wallet.publicKey,
  //       wallOwnerUserAccount: wallOwnerUserAccountPda,
  //       wall: WALLPDA,
  //       multisig: MULTISIG_ACCOUNT,
  //       projectAta: PROJECT_ATA,
  //       wallOwnerAta: WALL_OWENER_ATA,
  //       proposal: PROPOSALPDA,
  //       usdcMint: LOCALNET_USDC_MINT,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([wallOwner])
  //     .rpc();

  //   const wallAccount = await program.account.wall.fetch(WALLPDA);

  //   const wallOwnerAtaBalance =
  //     await provider.connection.getTokenAccountBalance(WALL_OWENER_ATA);

  //   expect(wallAccount.artist).to.be.null;
  //   expect(wallAccount.proposal).to.be.null;
  //   expect(wallAccount.status).to.have.property("pending");
  //   expect(wallOwnerAtaBalance.value.amount).to.be.eql(
  //     DEPOSIT_AMOUNT.toString()
  //   );
  // });

  it("Is initial expenses", async () => {
    [EXPENSES_PDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("expenses"), WALLPDA.toBuffer()],
      program.programId
    );

    await program.methods
      .initializeExpenses()
      .accountsPartial({
        signer: provider.wallet.publicKey,
        wallOwner: wallOwner.publicKey,
        wallOwnerUserAccount: wallOwnerUserAccountPda,
        wall: WALLPDA,
        expenses: EXPENSES_PDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const expensesAccount = await program.account.expenses.fetch(EXPENSES_PDA);

    expect(expensesAccount).to.be.exist;
  });

  it("Is record recipt!", async () => {
    const expensesAccount = await program.account.expenses.fetch(EXPENSES_PDA);
    const seed = new anchor.BN(expensesAccount.seeds);

    const [reciptPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("recipt"), WALLPDA.toBuffer(), seed.toBuffer("le", 2)],
      program.programId
    );

    const recieptAmount = new anchor.BN(900 * DECIMAL_MULTIPLIER);

    await program.methods
      .recordRecipt(recieptAmount)
      .accountsPartial({
        signer: provider.wallet.publicKey,
        wallOwner: wallOwner.publicKey,
        wallOwnerUserAccount: wallOwnerUserAccountPda,
        wall: WALLPDA,
        expenses: EXPENSES_PDA,
        proposal: PROPOSALPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const afterExpensesAccount = await program.account.expenses.fetch(
      EXPENSES_PDA
    );

    expect(afterExpensesAccount.total.toNumber()).to.be.eql(
      expensesAccount.total.toNumber() + recieptAmount.toNumber()
    );
    expect(afterExpensesAccount.seeds).to.be.eql(expensesAccount.seeds + 1);
  });

  it("Is first settle signed", async () => {
    [ARTIST_ATA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        provider.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        LOCALNET_USDC_MINT.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    ASSOCIATED_TOKEN_PROGRAM_ID;
    await program.methods
      .settleProject()
      .accounts({
        signer: provider.wallet.publicKey,
        artist: provider.wallet.publicKey,
        wallOwner: wallOwner.publicKey,
        wallOwnerUserAccount: wallOwnerUserAccountPda,
        wall: WALLPDA,
        multisig: MULTISIG_ACCOUNT,
        usdcMint: LOCALNET_USDC_MINT,
        projectAta: PROJECT_ATA,
        wallOwnerAta: WALL_OWENER_ATA,
        artistAta: ARTIST_ATA,
        proposal: PROPOSALPDA,
        expenses: EXPENSES_PDA,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    const multisigAccount = await program.account.multisig.fetch(
      MULTISIG_ACCOUNT
    );

    expect(multisigAccount.isKickOff).to.be.true;
    expect(multisigAccount.isSettled).to.be.false;
    expect(multisigAccount.isArtistSigned).to.be.true;
    expect(multisigAccount.isWallOwnerSigned).to.be.false;
  });

  it("Is first settle signed", async () => {
    [ARTIST_ATA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        provider.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        LOCALNET_USDC_MINT.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    ASSOCIATED_TOKEN_PROGRAM_ID;
    await program.methods
      .settleProject()
      .accounts({
        signer: wallOwner.publicKey,
        artist: provider.wallet.publicKey,
        wallOwner: wallOwner.publicKey,
        wallOwnerUserAccount: wallOwnerUserAccountPda,
        wall: WALLPDA,
        multisig: MULTISIG_ACCOUNT,
        usdcMint: LOCALNET_USDC_MINT,
        projectAta: PROJECT_ATA,
        wallOwnerAta: WALL_OWENER_ATA,
        artistAta: ARTIST_ATA,
        proposal: PROPOSALPDA,
        expenses: EXPENSES_PDA,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([wallOwner])
      .rpc();

    const multisigAccount = await program.account.multisig.fetch(
      MULTISIG_ACCOUNT
    );
    const artistAtaBalance = await provider.connection.getTokenAccountBalance(
      ARTIST_ATA
    );
    // console.log(artistAtaBalance.value.uiAmount);

    expect(multisigAccount.isKickOff).to.be.true;
    expect(multisigAccount.isSettled).to.be.true;
    expect(multisigAccount.isArtistSigned).to.be.true;
    expect(multisigAccount.isWallOwnerSigned).to.be.true;
  });
});
