// https://eth-goerli.g.alchemy.com/v2/wmbxgFroCbRhuzNyWxJJfDC0_qrfVcQD

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/wmbxgFroCbRhuzNyWxJJfDC0_qrfVcQD',
      accounts: ['58bc88e24ee1281af974a1192fbe7654a202ec46c8e3cf9ac6a8af682bc14c24']
    }
  }
}