const SDK = require('./sdk')
const ethers = require('ethers')
const {erc20Abi, erc721Abi, contractAbi} = require('./contracts')

const run = async ({web3Provider, jsonRpcProvider, signer, network}) => {
    const sdk = new SDK({web3Provider, jsonRpcProvider, signer, network})

    /*const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/2e0470fe4ffc49c88fac54d0e71ce37c')
    const signerTest = new ethers.Wallet('c04f58758ce2e5899720db676f24540f74c0f9abe11b2bfe261b68024be94a47', provider)
    const contractSwap = new ethers.Contract('0xa562d875A22425FE6685dB46d6D39c8d458D3805', contractAbi, provider)

    let latestEvents = await contractSwap.queryFilter('swapEvent', -100000)
    latestEvents.forEach((ev) => {
        const {_swapId} = ev.args
        console.log(_swapId.toNumber())
    })
    let contractERC20 = new ethers.Contract('0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735', erc20Abi, provider)
    contractERC20 = contractERC20.connect(signerTest)
    let contractERC721 = new ethers.Contract('0x03c7e0134eca40c82266636f6b62cb6419d4e9b9', erc721Abi, provider)
    contractERC721 = contractERC721.connect(signerTest)
    
    try {
        await contractERC20.approve('0xa562d875A22425FE6685dB46d6D39c8d458D3805', ethers.BigNumber.from((20000000000000000000).toString()).toString())
        await contractERC721.approve('0xa562d875A22425FE6685dB46d6D39c8d458D3805', 11)
        await contractERC721.approve('0xa562d875A22425FE6685dB46d6D39c8d458D3805', 12)
    } catch (error) {
        console.log(error)
    }*/
    
    //list information
    //const {ROYALTYENGINEADDRESS, TRADESQUAD, PARTNERSQUAD, VAULT} = await sdk.getReferenceAddress() it's working
    //const {flagFlatFee, flagRoyalties, flatFee, bps, scalePercent} = await sdk.getPayment() it's working
    
    //write functions

    const assetsArray = new sdk.AssetsArray()

    assetsArray.addERC721Asset('0x03c7e0134eca40c82266636f6b62cb6419d4e9b9', [11,12])
    assetsArray.addERC20Asset('0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735', 20000000000000000000) //20 DAI

    const assetsMaker = assetsArray.getAssetsArray()

    /*sdk.on('createSwapTransactionCreated', (param) => { //it's working
        console.log('createSwapTransactionCreated fired, params -> ', param)
    })

    sdk.on('createSwapTransactionMined', (param) => { //it's working
        console.log('createSwapTransactionMined fired, params -> ', param)
    })

    sdk.on('createSwapTransactionError', (param) => { //it's working
        console.log('createSwapTransactionError fired')
    })*/

    /*sdk.on('closeSwapTransactionCreated', (param) => { //it's working
        console.log('closeSwapTransactionCreated fired, params -> ', param)
    })

    sdk.on('closeSwapTransactionMined', (param) => { //it's working
        console.log('closeSwapTransactionMined fired, params -> ', param)
    })

    sdk.on('closeSwapTransactionError', (param) => { //it's working
        console.log('closeSwapTransactionError fired')
    })*/

    /*sdk.on('editTakerTransactionCreated', (param) => { //it's working
        console.log('editTakerTransactionCreated fired, params -> ', param)
    })

    sdk.on('editTakerTransactionMined', (param) => { //it's working
        console.log('editTakerTransactionMined fired, params -> ', param)
    })

    sdk.on('editTakerTransactionError', (param) => { //it's working
        console.log('editTakerTransactionError fired')
    })*/

    /*sdk.on('cancelSwapTransactionCreated', (param) => { //it's working
        console.log('cancelSwapTransactionCreated fired, params -> ', param)
    })

    sdk.on('cancelSwapTransactionMined', (param) => { //it's working
        console.log('cancelSwapTransactionMined fired, params -> ', param)
    })

    sdk.on('cancelSwapTransactionError', (param) => { //it's working
        console.log('cancelSwapTransactionError fired')
    })*/

    try {
        /*  
            //it's working
            await sdk.createSwap({
                ethMaker : 100000000000000000, //0.1 ETH creator
                taker : '0x87B96FE67F93bc795B7bb6957A4812DA1ec5e4Cf', //counterpart address
                ethTaker : 1000000000000000000, //1 ETH requested to the counterpart
                swapEnd : 0, //no expires date
                assetsMaker : assetsMaker //assets of the maker
            })
        */
        /*
            //it's working
            await sdk.closeSwap({
                maker : '0x39F7fc333C56D8b8a42F55EC9212C99F07DcbC91',
                swapId : 1
            })
        */
        /*
            //it's working
            await sdk.editTaker(2, '0xD67df04F318B1675416482F0029c55a9fF259D11')
        */
        /*
            //it's working
            await sdk.cancelSwap(2)
        */
    } catch (error) {
        console.log(error)
    }


    /*getNFTBlacklist
    getERC20WhiteList
    getSwapAssets
    getSwapDetails

    editTaker
    cancelSwap
    closeSwap
    createSwap
    setBlocksNumberConfirmationRequired
    on
    off*/

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