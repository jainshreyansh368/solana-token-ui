//NOT WORKING
import {Token, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import {COMMITMENT, connection} from '../utils/connection'

export const createSupply = ( mintPublicKey, dest, authority, multiSigners, amount) => {
    const desti = new PublicKey(dest);
    const Ix = Token.createMintToInstruction(TOKEN_PROGRAM_ID, mintPublicKey, desti, authority, multiSigners, amount);
    sendTxUsingExternalSignature([Ix], connection, null, [], authority);
}


const sendTxUsingExternalSignature = async(
    instructions,
    connection,
    feePayer,
    signersExceptWallet,
    wallet //this is a public key
) => {

    let tx = new Transaction();
    tx.add(...instructions);
    tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

    tx.setSigners(
            ...(feePayer
            ? [(feePayer).publicKey, wallet] //change user
            : [wallet]), //change user
            ...signersExceptWallet.map(s => s.publicKey)
    );
    signersExceptWallet.forEach(acc => {
        tx.partialSign(acc);
    });
    
    const signedTransaction = await window.solana.signTransaction(tx);
    
    console.log(signedTransaction);

    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: COMMITMENT
    });

    console.log(signature);
}