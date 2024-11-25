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
  let WALLPDA: anchor.web3.PublicKey;
  let PROPOSALPDA: anchor.web3.PublicKey;

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

    expect(wallAccount.artist).to.exist;
    expect(wallAccount.status).has.property("draft");
    expect(proposalAccount.status).has.property("draft");
    expect(projectAtaBalance.value.amount).to.eql(DEPOSIT_AMOUNT.toString());
  });
});
