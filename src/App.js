// version 0.0
import React, { useEffect, useState } from 'react'
import {Keypair, PublicKey, SystemProgram} from '@solana/web3.js';
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { connection } from './utils/connection'
import './App.css'
import { AirDrop } from './utils/airDrop';
import { sendTxUsingExternalSignature } from './components/externalWallet'
import { createAssociatedTokenAccount } from './components/associatedAccounts'
import { createSupply } from './components/initial_supply';

const App = () => {
    const [count, setCount] = useState();
    const [pubKey, setPubKey] = useState();
    const [mintKey, setMintKey] = useState();
    const [asAccount, setAsAccount] = useState(null);

    useEffect(() => {}, [pubKey])

    
/////////////////////////////////////////////////////////////Connections////////////////////////////////////////////    
    const getConnectedWallet = async()=> {    
    const provider = await window.solana;
    if(provider){
        setPubKey(provider.publicKey);
        localStorage.setItem("pubKey", provider.pubKey);
    }
    else console.log("Try to connect again");
    }

    const connectWallet = async() => {
        const provider = window.solana;
        console.log(provider);
        if(provider){
                setCount(count + 1);
                await window.solana.connect();
                window.solana.on("connect", () => console.log("connect"));
                getConnectedWallet();
            }
        else window.open("https://phantom.app/", "_blank")
    }

    const disconnectWallet = () => {
        window.solana.disconnect();
        localStorage.removeItem('pubKey')
        setPubKey();
    }

////////////////////////////////////////////////////////TOKEN CREATIONS////////////////////////////////////////////////
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

        setMintKey(mintAccount.publicKey.toString());
        return mintAccount;
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const TokenCreationHandler = async() => {
        const createdTokenAccount = await TokenCreation();
        const res = await createAssociatedTokenAccount(
            "",
            true,
            createdTokenAccount.publicKey,
            pubKey
        );
        
        setAsAccount(res); //associatedAccount

        createSupply(
            createdTokenAccount.publicKey,
            pubKey,
            pubKey,
            [],
            10
        )
    }

return (
        <div className = "App">
            <h1>Hey: { pubKey ? pubKey.toString() : ""}</h1>
            <button onClick = {connectWallet}>Connect Here!</button>
            <button onClick = {disconnectWallet}>Disconnect Here!</button>
            <br />
            <br />
            <button onClick={() => AirDrop(pubKey)}>AirDrop</button>
            <button onClick={TokenCreationHandler}>TokenCreation</button>
            <h2>MINT ACCOUNT: {mintKey ? mintKey : ''}</h2>
            <a  href={`https://explorer.solana.com/address/${mintKey}?cluster=devnet`}>Take me to my Token</a>
            {asAccount ? (
                <h5>
                    The created Associated account is : {asAccount}
                </h5>
            ):
            (<br />)}
        </div>
    )
}
export default App
