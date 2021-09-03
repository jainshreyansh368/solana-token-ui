//initial creation of Token.

import {Keypair, PublicKey, SystemProgram} from '@solana/web3.js';
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { connection } from '../utils/connection';
import { sendTxUsingExternalSignature } from '../components/externalWallet';

export const TokenCreation = async(pubKey) => {
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
        
        return mintAccount;
}