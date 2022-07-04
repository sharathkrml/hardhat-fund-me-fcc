const { assert, expect } = require("chai")
const { BigNumber } = require("ethers")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async () => {
    let fundMe, deployer, MockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        // deploy fundme contract
        // using hardhat deploy
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        MockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", () => {
        it("sets aggregator address correctly", async () => {
            const response = await fundMe.priceFeed()
            assert.equal(response, MockV3Aggregator.address)
        })
    })
    describe("fund", async () => {
        it("fails if you don't send enough eth", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("updates addressToAmountFunded ", async () => {
            await fundMe.fund({ value: sendValue })
            let responseValue = await fundMe.addressToAmountFunded(deployer)
            expect(responseValue.toString()).to.equal(sendValue)
        })
        it("updates funders", async () => {
            await fundMe.fund({ value: sendValue })
            let funder = await fundMe.funders(0)
            expect(funder).to.equal(deployer)
        })
    })
    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("withdraw ETH from a single founder", async () => {
            // Arrage
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            // Act
            let res = await fundMe.withdraw()
            let receipt = await res.wait(1)

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            // Assert

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance
                    .add(receipt.gasUsed.mul(receipt.effectiveGasPrice))
                    .toString()
            )
        })
        it("withdraw with multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                let txn = await fundMe
                    .connect(accounts[i])
                    .fund({ value: sendValue })
                let receipt = await txn.wait(1)
            }
            // Arrage
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )
            const res = await fundMe.withdraw()
            const receipt = await res.wait(1)
            const { gasUsed, effectiveGasPrice } = receipt

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.address
            )
            assert.equal(endingFundMeBalance.toString(), "0")
            await expect(fundMe.funders(0)).to.be.reverted
            // check all addressToAmountFunded
            for (let i = 1; i < 6; i++) {
                let fund = await fundMe.addressToAmountFunded(
                    accounts[i].address
                )
                assert.equal(fund.toString(), 0)
            }
        })
        it("only allows owner to wthdraw", async () => {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerContract = await fundMe.connect(attacker)
            await expect(attackerContract.withdraw()).to.be.revertedWith(
                "FundMe__NotOwner"
            )
        })
    })
})
