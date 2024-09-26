import { ethers } from "ethers";

// Replace with actual values used during deployment
const teacherERC20Address = "0xD829b447AbABDb689C1F6DC81CCe3d29b37c5992";
const exerciseSolutionTokenAddress = "0xDc9CA764a3B77Ed80dc6a2E1D4cA921d46A83085";

// Encode arguments in ABI format
const encodedArgs = ethers.utils.defaultAbiCoder.encode(
  ["address", "address"], // Constructor argument types
  [teacherERC20Address, exerciseSolutionTokenAddress] // Constructor argument values
);

console.log(`ABI-Encoded Constructor Arguments: ${encodedArgs}`);
