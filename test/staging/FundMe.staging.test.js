const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundeMe", async () => {
          let fundMe, deployer
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("allows people to fund & withdraw", async () => {
              await (await fundMe.fund({ value: sendValue })).wait()
              await (await fundMe.withdraw()).wait()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.address
              )
              console.log(endingBalance)
              assert.equal(endingBalance.toString(), "0")
          })
      })
