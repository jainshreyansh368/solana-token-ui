// version 0.1
import React, { useEffect, useState } from 'react';
import './App.css';
import { AirDrop } from './utils/airDrop';
import { createAssociatedTokenAccount } from './components/associatedAccounts'
import { createSupply } from './components/initial_supply';
import {TokenCreation} from './components/tokenCreation';

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


    const TokenCreationHandler = async() => {
        const createdTokenAccount = await TokenCreation(pubKey);
        
        setMintKey(createdTokenAccount.publicKey.toString());

        const res = await createAssociatedTokenAccount(
            "",
            true,
            createdTokenAccount.publicKey,
            pubKey
        );

        setAsAccount(res); //associatedAccount
        
        createSupply(
            createdTokenAccount.publicKey,
            res,
            pubKey,
            [],
            1000000000
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
