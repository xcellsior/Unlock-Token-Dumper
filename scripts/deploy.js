// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const impersonateAddress = '';



async function main() {

  const DumpTruck = await hre.ethers.getContractFactory("DumpTruck");
  const dumpTruck = await DumpTruck.deploy();
  const [owner] = await ethers.getSigners()
  const transactionCount = await owner.getTransactionCount()
  console.log(transactionCount);
  console.log("Deploying contracts with the account:", owner.address);

  await dumpTruck.deployed();

  console.log(
    `DumpTruck deployed to ${dumpTruck.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
