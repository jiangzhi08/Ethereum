const DappToken = artifacts.require("./DappToken.sol");

contract("DappToken", (accounts) => {
  before(async () => {
    this.DappToken = await DappToken.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.DappToken.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("lists tasks", async () => {
    const totalSupply = await this.DappToken.totalSupply();
    assert.equal(totalSupply.toNumber(), 1000000);
  });
});
