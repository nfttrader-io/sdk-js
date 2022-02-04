const SDK = require('./sdk')

const run = ({web3Provider, jsonRpcProvider, signer, network}) => {
    const sdk = new SDK({web3Provider, jsonRpcProvider, signer, network})
    //const utils = new sdk.Utils()
    sdk.test()
}

run({
    web3Provider : null,
    jsonRpcProvider : 'https://rinkeby.infura.io/v3/2e0470fe4ffc49c88fac54d0e71ce37c', 
    signer : {
        privateKey : 'c04f58758ce2e5899720db676f24540f74c0f9abe11b2bfe261b68024be94a47'
    },
    network: 'RINKEBY'
})

module.exports = SDK