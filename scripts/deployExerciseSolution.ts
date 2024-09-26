import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {
    // Ensure environment variables are set
    if (!process.env.SEPOLIA_RPC_URL || !process.env.SEPOLIA_PRIVATE_KEY) {
        throw new Error("Please set your .env variables (SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY)");
    }

    // Initialize provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    // Addresses for ERC20 contracts
    const teacherERC20Address = "0xD829b447AbABDb689C1F6DC81CCe3d29b37c5992"; 
    const exerciseSolutionTokenAddress = "0x140A07834C61971d4eC24861c8B4eB0c142c95aa"; 

    // Load ABI and bytecode for ExerciseSolution
    const contractPath = path.join(__dirname, "../artifacts/contracts/ExerciseSolution.sol/ExerciseSolution.json");
    const contractJSON = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

    const exerciseSolutionABI = contractJSON.abi;
    const exerciseSolutionBytecode = contractJSON.bytecode;

    // Create a ContractFactory for deployment
    const exerciseSolutionFactory = new ethers.ContractFactory(
        exerciseSolutionABI,
        exerciseSolutionBytecode,
        wallet
    );

    // Deploy the ExerciseSolution contract
    console.log("Deploying ExerciseSolution...");
    const exerciseSolutionContract = await exerciseSolutionFactory.deploy(teacherERC20Address, exerciseSolutionTokenAddress);

    // Wait for deployment to complete
    await exerciseSolutionContract.deployed();

    console.log(`ExerciseSolution deployed to: ${exerciseSolutionContract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
