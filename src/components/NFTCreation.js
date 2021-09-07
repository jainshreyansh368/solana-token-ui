//NFT creation

import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { MintLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection } from "../utils/connection";
import { sendTxUsingExternalSignature } from "./externalWallet";
import { createAssociatedTokenAccount } from "./associatedAccounts";
import { createSupply } from "./initial_supply";

export const NFTCreation = async (pubKey) => {
  const mintAccount = Keypair.generate();

  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: pubKey,
    newAccountPubkey: mintAccount.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      MintLayout.span,
      "singleGossip"
    ),
    space: MintLayout.span,
    programId: TOKEN_PROGRAM_ID,
  });

  const initMintIx = Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    mintAccount.publicKey,
    1, //DECIMALS
    pubKey, //mint Auth
    null //freeze Auth
  );

  const revokeMint = Token.createSetAuthorityInstruction(
    TOKEN_PROGRAM_ID,
    mintAccount.publicKey,
    null,
    "MintTokens",
    pubKey,
    []
  );
  /*
    const authority = async setAuthority(
    account: PublicKey,
    newAuthority: PublicKey | null,
    authorityType: AuthorityType,
    currentAuthority: pubkey,
    multiSigners: Array<Signer>,
  ): Promise<void> {
*/
  /*
    await sendAndConfirmTransaction(
      'SetAuthority',
      this.connection,
      new Transaction().add(
        Token.createSetAuthorityInstruction(
          this.programId,
          account,
          null,
          "mintAuthority",
          currentAuthorityPublicKey,
          [],
        ),
      ),
    );
*/
  await sendTxUsingExternalSignature(
    [createAccountIx, initMintIx],
    connection,
    null,
    [mintAccount],
    new PublicKey(pubKey)
  );
  const res = await createAssociatedTokenAccount(
    "",
    true,
    mintAccount.publicKey,
    pubKey
  );

  createSupply(mintAccount.publicKey, res, pubKey, [], 100);

  await sendTxUsingExternalSignature(
    [revokeMint],
    connection,
    null,
    [],
    new PublicKey(pubKey)
  );

  return mintAccount;
};
