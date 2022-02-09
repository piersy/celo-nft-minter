require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/52752'/0'/0",
      },
    },
    local: {
      url: "http://localhost:8545",
      accounts: [
        "0x9c8370d0f52a6429b6ceb0a8f124d639ab3e9c8149dd329c698fb8f46e3ad012",
        "0xa4f3f26e7f134976074a78ebe8498494d94dfb0c9225d1e146b6dbf072a62433",
        "0xfd506df2eb8c0a2ac7d8fb9243e0e7ddc3f8b74398fc2ce97aea5b56bb1a7b9e",
      ],
    },
  },
  solidity: "0.8.4",
};
