const { networkConfig } = require("../helper-hardhat-config")
const { getNamedAccounts, deployments, network } = require("hardhat")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    console.log(deploy, log)
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log(chainId)
    // when going for localhost,we wanna use a mock
    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [], //priceFeed address
        log: true,
    })
}
