import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function setMinter() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("SEPOLIA_PRIVATE_KEY is not defined in the environment variables");
    }
    const wallet = new ethers.Wallet(privateKey, provider);

    // Replace with your deployed contract addresses
    const exerciseSolutionTokenAddress = "0x140A07834C61971d4eC24861c8B4eB0c142c95aa"; 
    const exerciseSolutionAddress = "0x1455bD34d7e087d17742ba7CA218A7d247A5290e";

    // ABI for setting minter
    const EXERCISE_SOLUTION_TOKEN_ABI = [
        "function setMinter(address minterAddress, bool isMinter) external"
    ];

    // Connect to the ExerciseSolutionToken contract
    const exerciseSolutionToken = new ethers.Contract(
        exerciseSolutionTokenAddress,
        EXERCISE_SOLUTION_TOKEN_ABI,
        wallet
    );

    // Set ExerciseSolution as a minter
    const tx = await exerciseSolutionToken.setMinter(exerciseSolutionAddress, true);
    console.log(`Setting minter TX hash: ${tx.hash}`);
    await tx.wait();
    console.log("ExerciseSolution set as a minter.");
}

setMinter().catch(console.error);
