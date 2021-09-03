import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {PublicKey} from '@solana/web3.js';
import { findAssociatedTokenAccountPublicKey } from './associatedAccounts';
import { connection } from '../utils/connection';
import { sendTxUsingExternalSignature } from './externalWallet';

export const transferTokenHandler = async(owner, 
    dest, 
    token,
    amount) => {
    const ownerPub = new PublicKey(owner);
    const tokenPub = new PublicKey(token);
    const destPub = new PublicKey(dest);

    //ASSUMING THAT BOTH OWNER AND DESTINATION HAS AN ACCOUNT ASSOCIATED

    //Finding Associated Account of owner
    const assOwnerAccount = await findAssociatedTokenAccountPublicKey(ownerPub, tokenPub);
    console.log(assOwnerAccount.toString());

    //Finding the Asscociated Account of destination
    const assDestAccount = await findAssociatedTokenAccountPublicKey(destPub, tokenPub);
    console.log(assDestAccount.toString());

    const ix  = Token.createTransferInstruction(
            TOKEN_PROGRAM_ID, //PROGRAM_ID
            assOwnerAccount, //Associated Owner Account
            assDestAccount, //Associated Destination Account
            ownerPub, //Owner
            [], //multisigners
            amount //Amount
    );
    
    // Assuming that the source and the feepayer are the same
    sendTxUsingExternalSignature(
        [ix], connection, null, [], ownerPub
    );
}