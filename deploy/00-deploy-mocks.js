const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANS,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log(deployer)
    if (developmentChains.includes(network.name)) {
        log("Deployig mocks!!!")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANS],
        })
        log("MOCKS DEPLOYED!!")
        log("----------------------------------------------")
    }
}
// To run onlt this script
module.exports.tags = ["all", "mocks"]
