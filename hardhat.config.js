require("@nomiclabs/hardhat-waffle");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const contract42069420 = '0x16c81e797dc5c8d2711138bd5e33a2b59606cfe26c3b6bcd3a1c468b9004049e';

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      forking: {
        url: "https://arb-mainnet.g.alchemy.com/v2/nV81Jj6-GmCpG0TXJFEatqUZ0lJ3tLR3",
        accounts:[contract42069420]
      }
    }
  }
};
