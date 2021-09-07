// version 0.1
import React, { useEffect, useState } from 'react';
import { AirDrop } from './utils/airDrop';
import { createAssociatedTokenAccount } from './components/associatedAccounts'
import { createSupply } from './components/initial_supply';
import {TokenCreation} from './components/tokenCreation';
import {transferTokenHandler} from './components/transferToken';
import { NFTCreation } from "./components/NFTCreation";
import './App.css';

const App = () => {
    const [count, setCount] = useState();
    const [pubKey, setPubKey] = useState();
    const [mintKey, setMintKey] = useState();
    const [asAccount, setAsAccount] = useState(null);
    const [owner, setOwner] = useState();
    const [destination, setDestination] = useState();
    const [transferToken, settransferToken] = useState();
    const [amount, setAmount] = useState();
    const [NFTpubkey, setNFTpubkey] = useState();

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
    
  const NFTCreationHandler = async () => {
    const NFTCreated = await NFTCreation(pubKey);
    setNFTpubkey(NFTCreated.publicKey.toString());
  };



////////////////////////////////////////////////////////TRANSFER-TOKENS//////////////////////////////////////////////////////////
    const handleOwnerChange = (e) => {
        e.preventDefault();
        setOwner(e.target.value);
    }

    const handleDestinationChange = (e) => {
        e.preventDefault();
        setDestination(e.target.value);
    }

    const handleTokenMintChange = (e) => {
        e.preventDefault();
        settransferToken(e.target.value);
    }

    const handleTokenAmountChange = (e) => {
        e.preventDefault();
        setAmount(e.target.value);
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
            <button onClick={NFTCreationHandler}>NFTCreation</button>
            <h2>MINT ACCOUNT: {mintKey ? mintKey : ''}</h2>
            <a  href={`https://explorer.solana.com/address/${mintKey}?cluster=devnet`}>Take me to my Token</a>
            <br /><br />
            <a  href={`https://explorer.solana.com/address/${NFTpubkey}?cluster=devnet`}>View NFT Minted</a>
            {asAccount ? (
                <h5>
                    The created Associated account is : {asAccount}
                </h5>
            ):
            (<br />)}
            <br />
            <br />
            <br />
            <br />
            <h1>Transfer Tokens</h1>
            <form>
                
                <label htmlFor=""> Owner: </label>
                <input type="text" placeholder="Public Account Address" onChange={handleOwnerChange} />
                <br />
                <br />

                <label htmlFor=""> Destination: </label>
                <input type="text" placeholder="Public Account Address" onChange={handleDestinationChange} />
                <br />
                <br />

                <label htmlFor=""> Token-Mint: </label>
                <input type="text" placeholder="Public Account Address" onChange={handleTokenMintChange} />                        
                <br />
                <br />

                <label htmlFor=""> Amount: </label>
                <input type="text" placeholder="Token Value" onChange={handleTokenAmountChange} />                        
                <br />
                <br />
            </form>
            <button onClick = {() => transferTokenHandler(owner, destination, transferToken, amount)}> Transfer </button>
        </div>
    )
}
export default App
