import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();
async function checkBalance() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("SEPOLIA_PRIVATE_KEY is not defined");
    }
    const wallet = new ethers.Wallet(privateKey, provider);

    const teacherERC20Address = "0xD829b447AbABDb689C1F6DC81CCe3d29b37c5992";

    const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)"];
    const erc20Contract = new ethers.Contract(teacherERC20Address, ERC20_ABI, provider);

    // Check balance
    const balance = await erc20Contract.balanceOf(wallet.address);
    console.log(`Balance: ${balance.toString()}`);
}

checkBalance().catch(console.error);
