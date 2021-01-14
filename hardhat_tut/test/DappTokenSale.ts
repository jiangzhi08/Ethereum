import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { DappToken__factory, DappToken } from "../typechain";
import { DappTokenSale__factory, DappTokenSale } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("DappTokenSale ...", async () => {
  let dappToken: DappToken;
  let dappTokenSale: DappTokenSale;
  const accounts = await ethers.getSigners();
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokenPrice = 1000000000000000; // in wei
  var tokensAvailable = 750000;
  var numberOfTokens;

  beforeEach(async () => {
    // 1
    const signers = await ethers.getSigners();

    // 2
    const dappTokenFactory = (await ethers.getContractFactory(
      "DappToken",
      signers[0]
    )) as DappToken__factory;
    dappToken = await dappTokenFactory.deploy(1000000);
    await dappToken.deployed();

    const dappTokenSaleFactory = (await ethers.getContractFactory(
      "DappTokenSale",
      signers[0]
    )) as DappTokenSale__factory;
    dappTokenSale = await dappTokenSaleFactory.deploy(
      dappToken.address,
      tokenPrice
    );
    await dappTokenSale.deployed();

    const totalSupply = await dappToken.totalSupply();
    expect(totalSupply).to.eq(1000000);
    expect(dappToken.address).to.properAddress;

    const price = await dappTokenSale.tokenPrice();
    expect(price).to.eq(tokenPrice);
    expect(dappTokenSale.address).to.properAddress;
  });

  // 4
  describe("DappTokenSale ......", async () => {
    it("facilitates token buying", async () => {
      await dappToken
        .connect(admin)
        .transfer(dappTokenSale.address, tokensAvailable);
      numberOfTokens = 10;
      await dappTokenSale.connect(buyer).buyTokens(numberOfTokens);
      const tokenSold = await dappTokenSale.tokensSold();
      expect(tokenSold).to.eq(numberOfTokens);

      const balance = await dappToken.balanceOf(buyer.address);
      expect(balance).to.eq(numberOfTokens);

      const balance1 = await dappToken.balanceOf(dappTokenSale.address);
      expect(balance1).to.eq(tokensAvailable - numberOfTokens);
    });

    it("ends token sale", async () => {
      await dappToken
        .connect(admin)
        .transfer(dappTokenSale.address, tokensAvailable);
      numberOfTokens = 10;
      await dappTokenSale.connect(buyer).buyTokens(numberOfTokens);

      await dappTokenSale.connect(admin).endSale();
      const balance = await dappToken.balanceOf(admin.address);
      expect(balance).to.eq(999990);

      const balance1 = await ethers.provider.getBalance(dappTokenSale.address);
      expect(balance1).to.eq(0);
    });
  });
});
