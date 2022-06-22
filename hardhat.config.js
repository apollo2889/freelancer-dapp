require('@nomiclabs/hardhat-waffle');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.local' });

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: `${process.env.POKT_RINKEBY_URL}`,
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`],
    },
  },
};
