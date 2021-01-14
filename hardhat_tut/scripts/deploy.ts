import { ethers } from "hardhat";

async function main() {
  // const factory = await ethers.getContractFactory("Counter");
  const factory = await ethers.getContractFactory("DappToken");

  // If we had constructor arguments, they would be passed into deploy()
  // let contract = await factory.deploy();
  let dappToken = await factory.deploy(1000000);

  // The address the Contract WILL have once mined
  console.log(dappToken.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log(dappToken.deployTransaction.hash);

  // The contract is NOT deployed yet; we must wait until it is mined
  await dappToken.deployed();

  const factoryDappTokenSale = await ethers.getContractFactory("DappTokenSale");
  var tokenPrice = 1000000000000000; // in wei
  let dappTokenSale = await factoryDappTokenSale.deploy(
    dappToken.address,
    tokenPrice
  );
  console.log(dappTokenSale.address);
  console.log(dappTokenSale.deployTransaction.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
