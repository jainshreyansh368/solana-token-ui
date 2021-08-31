import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { connection } from "./connection";

export const AirDrop = async(pubKey) => {
        if(pubKey){
            console.log("Starting Air-Drop");
            let airDropSignature = await connection.requestAirdrop(
                pubKey,
                LAMPORTS_PER_SOL,
            );
            const done = await connection.confirmTransaction(airDropSignature);
            if(done) console.log("Completed Air-Drop");
        }
        else console.log("Get Yourself Connected First")
}