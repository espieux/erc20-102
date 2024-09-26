import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function checkAllowance() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("SEPOLIA_PRIVATE_KEY is not defined in the environment variables");
    }
    const wallet = new ethers.Wallet(privateKey, provider);

    const teacherERC20Address = "0xD829b447AbABDb689C1F6DC81CCe3d29b37c5992"; 
    const exerciseSolutionAddress = "0x1455bD34d7e087d17742ba7CA218A7d247A5290e"; 

    const ERC20_ABI = ["function allowance(address owner, address spender) view returns (uint256)"];
    const erc20Contract = new ethers.Contract(teacherERC20Address, ERC20_ABI, provider);

    // Check allowance
    const allowance = await erc20Contract.allowance(wallet.address, exerciseSolutionAddress);
    console.log(`Allowance: ${allowance.toString()}`);
}

checkAllowance().catch(console.error);
