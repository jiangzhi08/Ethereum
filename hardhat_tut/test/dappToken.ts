import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { DappToken__factory, DappToken } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("DappToken ...", () => {
  let dappToken: DappToken;

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
    const totalSupply = await dappToken.totalSupply();

    // 3
    expect(totalSupply).to.eq(1000000);
    expect(dappToken.address).to.properAddress;
  });

  // 4
  describe("DappToken ......", async () => {
    it("initializes the contract with the correct values", async () => {
      const totalSupply = await dappToken.totalSupply();
      expect(totalSupply).to.eq(1000000);

      const name = await dappToken.name();
      expect(name).to.eq("DApp Token");

      const symbol = await dappToken.symbol();
      expect(symbol).to.eq("DAPP");

      const standard = await dappToken.standard();
      expect(standard).to.eq("DApp Token v1.0");
    });

    it("allocates the initial supply upon deployment", async () => {
      const totalSupply = await dappToken.totalSupply();
      const accounts = await ethers.getSigners();
      // for (const account of accounts) {
      //   console.log(account.address);
      // }
      const adminBalance = await dappToken.balanceOf(accounts[0].address);
      expect(adminBalance).to.eq(totalSupply);
    });

    it("transfers token ownership", async () => {
      const [owner, addr1] = await ethers.getSigners();

      // expect(
      //   await dappToken.transfer(addr1.address, 99999999999999999999999)
      // ).to.throw(
      //   new Error(
      //     `overflow (fault="overflow", operation="BigNumber.from", value=1e+23, code=NUMERIC_FAULT, version=bignumber/5.0.13)`
      //   )
      // );

      // expect(await dappToken.transfer(addr1.address, 250000)).to.true;
      await dappToken.transfer(addr1.address, 250000);
      const addr1Balance = await dappToken.balanceOf(addr1.address);
      expect(addr1Balance).to.eq(250000);
      const ownerBalance = await dappToken.balanceOf(owner.address);
      expect(ownerBalance).to.eq(750000);
    });

    it("approves tokens for delegated transfer", async () => {
      const [owner, addr1] = await ethers.getSigners();

      await dappToken.approve(addr1.address, 100);
      const allowance = await dappToken.allowance(owner.address, addr1.address);
      expect(allowance).to.eq(100);
    });

    it("handles delegated token transfers", async () => {
      const [
        owner,
        addr1,
        fromAccount,
        toAccount,
        spendingAccount,
      ] = await ethers.getSigners();

      await dappToken.connect(owner).transfer(fromAccount.address, 100);
      await dappToken.connect(fromAccount).approve(spendingAccount.address, 10);
      await dappToken
        .connect(spendingAccount)
        .transferFrom(fromAccount.address, toAccount.address, 10);

      const fromAccountBalance = await dappToken.balanceOf(fromAccount.address);
      expect(fromAccountBalance).to.eq(90);

      const toAccountBalance = await dappToken.balanceOf(toAccount.address);
      expect(toAccountBalance).to.eq(10);

      const allowance = await dappToken.allowance(
        fromAccount.address,
        spendingAccount.address
      );
      expect(allowance).to.eq(0);
    });
  });
});
