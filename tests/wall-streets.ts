import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { WallStreets } from "../target/types/wall_streets";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
} from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

describe("wall-streets", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.WallStreets as Program<WallStreets>;

  const payer = provider.wallet as NodeWallet;

  let LOCALNET_USDC_MINT: anchor.web3.PublicKey;
  let PROJECT_ATA: anchor.web3.PublicKey;
  let WALLPDA: anchor.web3.PublicKey;

  const ROLE_NUMBER = 2;
  const WALLSEEDS = new anchor.BN(0);

  const userAccountPda = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user"), provider.publicKey.toBuffer()],
    program.programId
  )[0];

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
  });

  it("Is initialized user!", async () => {
    const name = "wall-funer";
    await program.methods
      .initializeUser(name, ROLE_NUMBER)
      .accountsPartial({
        signer: provider.wallet.publicKey,
        userAccount: userAccountPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const userAccount = await program.account.user.fetch(userAccountPda);
    console.log("user account initial data", userAccount);

    expect(userAccount.wallMints).to.have.lengthOf(30);
  });

  it("Is initialized wall!", async () => {
    const userAccount = await program.account.user.fetch(userAccountPda);
    // console.log("user account initial data", userAccount);

    const seed = new anchor.BN(userAccount.wallSeeds);
    console.log("beforeseed", seed);

    WALLPDA = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("wall"), userAccountPda.toBuffer(), seed.toBuffer("le", 2)],
      program.programId
    )[0];

    PROJECT_ATA = anchor.web3.PublicKey.findProgramAddressSync(
      [
        WALLPDA.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        LOCALNET_USDC_MINT.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];

    await program.methods
      .initializeWall()
      .accountsPartial({
        wallOwner: provider.wallet.publicKey,
        userAccount: userAccountPda,
        wall: WALLPDA,
        usdcMint: LOCALNET_USDC_MINT,
        projectAta: PROJECT_ATA,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    const wallAccount = await program.account.wall.fetch(WALLPDA);
    console.log("wall initial data", wallAccount);

    const afterUserAccount = await program.account.user.fetch(userAccountPda);
    console.log("after seeds", afterUserAccount.wallSeeds);
  });
});
