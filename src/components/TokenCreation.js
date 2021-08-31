const TokenCreation = async() => {
    const mintAccount = Keypair.generate();
    
    const createAccountIx = SystemProgram.createAccount({
        fromPubkey: pubKey,
        newAccountPubkey: mintAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(
            MintLayout.span,
            "singleGossip"
        ),
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID
    })
    const initMintIx = Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        9, //DECIMALS 
        pubKey, //mint Auth
        null, //freeze Auth
    )
    await sendTxUsingExternalSignature(
        [createAccountIx, initMintIx],
        connection,
        null,
        [mintAccount],
        new PublicKey(pubKey)
    );
    
    return mintAccount.publicKey.toString()
}