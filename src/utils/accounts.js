import { Account } from "@solana/web3.js";

import {
    validateMnemonic as bip39validateMnemonic,
    mnemonicToSeed as bip39mnemoincToSeed
} from "bip39";

import bs58 from "bs58";

// import bs58 from "bs58";
import { fromSeed as bip32FromSeed } from "bip32";
import { sign as naclSign } from "tweetnacl";

async function mnemonicToSeed(mnemonic){
    if(!bip39validateMnemonic(mnemonic)){
        throw new Error("Invalid seed phrase")
    }
    return await bip39mnemoincToSeed(mnemonic);
}

function getAccountFromSeed(seed, walletIndex, accountIndex = 0){
    const derivedSeed = bip32FromSeed(seed).derivePath(
        `m/501'/${walletIndex}'/0/${accountIndex}`
    ).privateKey;
  return new Account(
    naclSign.keyPair.fromSeed(derivedSeed).secretKey);
}

export const createAccount = async (secret) => {
  // Ed25519 byte array
  if (secret.includes(",")) {
    return new Account(
      secret
        .replace(/ /g, "")
        .split(",")
        .map(n => parseInt(n))
    );
  }
  // Base58 encoded Ed25519 byte array
  if (!secret.includes(" ")) {
    return new Account(bs58.decode(secret));
  }
  // Seed phrase
  const seed = await mnemonicToSeed(secret);
  return getAccountFromSeed(seed, 0, 0);
};

