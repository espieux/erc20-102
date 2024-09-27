import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {
    // Ensure environment variables are set
    if (!process.env.ARB_SEPOLIA_URL || !process.env.PRIVATE_KEY) {
        throw new Error("Please set your .env variables (ARB_SEPOLIA_URL, PRIVATE_KEY)");
    }

    // Initialize provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.ARB_SEPOLIA_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Paths for ABI and bytecode files
    const exerciseSolutionTokenPath = path.join(__dirname, "../artifacts/contracts/ExerciseSolutionToken.sol/ExerciseSolutionToken.json");
    const exerciseSolutionPath = path.join(__dirname, "../artifacts/contracts/ExerciseSolution.sol/ExerciseSolution.json");

    // Load ABI and bytecode for ExerciseSolutionToken
    const exerciseSolutionTokenJSON = JSON.parse(fs.readFileSync(exerciseSolutionTokenPath, "utf-8"));
    const exerciseSolutionTokenABI = exerciseSolutionTokenJSON.abi;
    const exerciseSolutionTokenBytecode = exerciseSolutionTokenJSON.bytecode;

    // Load ABI and bytecode for ExerciseSolution
    const exerciseSolutionJSON = JSON.parse(fs.readFileSync(exerciseSolutionPath, "utf-8"));
    const exerciseSolutionABI = exerciseSolutionJSON.abi;
    const exerciseSolutionBytecode = exerciseSolutionJSON.bytecode;

    // Deploy ExerciseSolutionToken
    console.log("Deploying ExerciseSolutionToken...");
    const exerciseSolutionTokenFactory = new ethers.ContractFactory(
        exerciseSolutionTokenABI,
        exerciseSolutionTokenBytecode,
        wallet
    );
    const exerciseSolutionTokenContract = await exerciseSolutionTokenFactory.deploy("SolutionToken", "SLT");
    await exerciseSolutionTokenContract.deployed();
    console.log(`ExerciseSolutionToken deployed to: ${exerciseSolutionTokenContract.address}`);

    // Addresses for ERC20 contracts
    const teacherERC20Address = "0x5ADeBf74a71360Be295534274041ceeD6A39977a";
    const exerciseSolutionTokenAddress = exerciseSolutionTokenContract.address;

    // Deploy ExerciseSolution
    console.log("Deploying ExerciseSolution...");
    const exerciseSolutionFactory = new ethers.ContractFactory(
        exerciseSolutionABI,
        exerciseSolutionBytecode,
        wallet
    );
    const exerciseSolutionContract = await exerciseSolutionFactory.deploy(teacherERC20Address, exerciseSolutionTokenAddress);
    await exerciseSolutionContract.deployed();
    console.log(`ExerciseSolution deployed to: ${exerciseSolutionContract.address}`);

    // Grant ExerciseSolution contract the minter role
    console.log("Granting minting rights to ExerciseSolution...");
    const setMinterTx = await exerciseSolutionTokenContract.setMinter(exerciseSolutionContract.address, true);
    await setMinterTx.wait();
    console.log("Minting rights granted to ExerciseSolution!");

    console.log(`Deployment completed successfully!`);
    console.log(`ExerciseSolutionToken: ${exerciseSolutionTokenContract.address}`);
    console.log(`ExerciseSolution: ${exerciseSolutionContract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
