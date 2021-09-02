import { clusterApiUrl, Connection } from '@solana/web3.js';

export const COMMITMENT = "singleGossip";   

export const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed'
)