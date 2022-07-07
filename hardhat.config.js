require("dotenv").config()

require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

module.exports = {
    solidity: {
        compilers: [{ version: "0.8.7" }, { version: "0.6.6" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        rinkeby: {
            url: process.env.RINEKBY_RPC_URL || "",
            accounts: [process.env.PRIVATE_KEY || ""],
            chainId: 4,
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "INR",
        coinmarketcap: process.env.COINMARKETCAP_KEY || "",
        token: "MATIC",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            // 4: 1, // rinbeby,
            // 31332: 1, // hardhat
        },
        users: {
            default: 1,
        },
    },
}
