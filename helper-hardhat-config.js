//automation of chainId, and ethusdpricefeed of cl contract

const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  137: {
    name: "polyon",
    ethUsdPriceFeed: "tempExample",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

//export so it can be imported
module.exports = { networkConfig, developmentChains, DECIMALS, INITIAL_ANSWER };
