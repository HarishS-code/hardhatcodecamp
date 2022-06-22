const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe;
      let mockV3Aggregator;
      let deployer;
      let fundvalue = ethers.utils.parseEther("1");
      beforeEach(async () => {
        // const accounts = await ethers.getSigners()
        // deployer = accounts[0]
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });
      describe("fund", async function () {
        it("funds the contract", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
        it("updated the datastrcuture", async () => {
          await fundMe.fund({ value: fundvalue });
          const response = await fundMe.getAddressToAmountFunded(deployer);
          console.log(response);
          assert.equal(response.toString(), fundvalue.toString());
        });
        it("checking funders array", async () => {
          await fundMe.fund({ value: fundvalue });
          const response = await fundMe.getFunder(0);
          assert.equal(response, deployer);
        });
      });

      describe("withdraw", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: fundvalue });
        });
        it("withdraw money ", async function () {
          const startingbalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const deploybalance = await fundMe.provider.getBalance(deployer);

          const actionresponse = await fundMe.withdraw();
          const transactionreceipt = await actionresponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionreceipt;
          const gas = gasUsed.mul(effectiveGasPrice);
          const ending = await fundMe.provider.getBalance(fundMe.address);
          const endingdeployer = await fundMe.provider.getBalance(deployer);

          assert.equal(ending, 0);
          assert.equal(
            startingbalance.add(deploybalance).toString(),
            endingdeployer.add(gas).toString()
          );
        });
      });
    });
