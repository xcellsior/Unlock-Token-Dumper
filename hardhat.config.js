import "@nomiclabs/hardhat-toolbox";

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: process.env.NODE_URL,
      }
    },
  },
  etherscan: {
    apiKey: ''
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1
          }
        }
      },    
    ]
  },
  mocha: {
    timeout: 0,
  },
  paths: {
    sources: "./contracts",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  }
};

export default config;
