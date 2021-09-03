//NOT WORKING
import {Token, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { connection } from '../utils/connection';
import { sendTxUsingExternalSignature } from './externalWallet';

export const createSupply = ( mintPublicKey, dest, authority, multiSigners, amount) => {
    const desti = new PublicKey(dest);
    const Ix = Token.createMintToInstruction(TOKEN_PROGRAM_ID, mintPublicKey, desti, authority, multiSigners, amount);
    sendTxUsingExternalSignature([Ix], connection, null, [], authority);
}