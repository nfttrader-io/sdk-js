const ethers = require('ethers')
const {swap, contractAbi} = require('./contracts')

function SDK({web3Provider, jsonRpcProvider, signer, network}) {
    this.provider = null
    this.contractAddress = null
    this.contract = null
    this.signer = null
    this.isJsonRpcProvider = false
    this.isWeb3Provider = false

    if (web3Provider && jsonRpcProvider)
        throw new Error('just one provider at a time is supported.')

    if (typeof jsonRpcProvider != 'string' && typeof jsonRpcProvider != 'undefined')
        throw new Error('jsonRpcProvider must be a string -> Eg. https://rinkeby.infura.io/v3/...')

    if (typeof web3Provider == 'string' && typeof web3Provider != 'undefined')
        throw new Error('web3Provider must be an object -> Eg. window.ethereum')

    if (swap[network] === void 0)
        throw new Error('network not supported.')

    if (typeof jsonRpcProvider == 'string') {
        if (typeof signer == 'undefined' || signer == null)
            throw new Error('signer is mandatory if you use a JSON RPC Provider.')
        if (signer['privateKey'] === void 0)
            throw new Error('signer object must have a privateKey property.')
        
        this.isJsonRpcProvider = true
    }

    if (typeof web3Provider != 'undefined' && web3Provider != null) {
        this.isWeb3Provider = true
    }

    try {
        if (this.isJsonRpcProvider) {
            this.provider = new ethers.providers.JsonRpcProvider(jsonRpcProvider)
            try {
                this.signer = new ethers.Wallet(signer.privateKey, this.provider)
            } catch (error) {
                throw new Error('provide a valid private key for the signer.')
            }
            
        } else if (this.isWeb3Provider) {
            this.provider = new ethers.providers.Web3Provider(web3Provider)
        }

        this.contractAddress = swap[network]
        this.contract = new ethers.Contract(this.contractAddress, contractAbi, this.provider)
    } catch (error) {
        throw new Error(error)
    }
}

SDK.prototype.createSwap = async function ({ethMaker, taker, ethTaker, assetsMaker, assetsTaker, referralAddress}) {
    const payment = await this.getPayment()
    const swapId = 0
    const addressMaker = this.isJsonRpcProvider ? this.signer.address : ((await this.provider.listAccounts())[0])
    const discountMaker = false
    const valueMaker = ethMaker
    const flatFeeMaker = payment.flagFlatFee ? payment.flatFee.toNumber() : 0
    const addressTaker = taker
    const discountTaker = false
    const valueTaker = ethTaker
    const flatFeeTaker = 0
    const swapStart = 0
    const swapEnd = 0
    const flagFlatFee = false
    const flagRoyalties = false
    const status = 0
    const royaltiesMaker = 0
    const royaltiesTaker = 0
    const swapIntent = [
        swapId,
        addressMaker,
        discountMaker,
        valueMaker,
        flatFeeMaker,
        addressTaker,
        discountTaker,
        valueTaker,
        flatFeeTaker,
        swapStart,
        swapEnd,
        flagFlatFee,
        flagRoyalties,
        status,
        royaltiesMaker,
        royaltiesTaker
    ]

    if (this.isJsonRpcProvider) {
        try {
            await this.contract.createSwapIntent(swapIntent, assetsMaker, assetsTaker, referralAddress)
        } catch (error) {
            throw new Error(error)
        }
    } else if (this.isWeb3Provider) {
        try {
            const signer = this.provider.getSigner(addressMaker)
            const contract = this.contract.connect(signer)
            await contract.createSwapIntent(swapIntent, assetsMaker, assetsTaker, referralAddress)
        } catch (error) {
            throw new Error(error)
        }
    }
}

SDK.prototype.closeSwap = async function ({swapCreator, swapId, referralAddress}) {
    if (this.isJsonRpcProvider) {
        try {
            await this.contract.closeSwapIntent(swapCreator, swapId, referralAddress)
        } catch (error) {
            throw new Error(error)
        }
    } else if (this.isWeb3Provider) {
        try {
            const signer = (await this.provider.listAccounts())[0]
            const contract = this.contract.connect(signer)
            await contract.closeSwapIntent(swapCreator, swapId, referralAddress)
        } catch (error) {
            throw new Error(error)
        }
    }
}

SDK.prototype.cancelSwap = async function ({swapId}) {
    if (this.isJsonRpcProvider) {
        try {
            await this.contract.cancelSwapIntent(swapId)
        } catch (error) {
            throw new Error(error)
        }
    } else if (this.isWeb3Provider) {
        try {
            const signer = (await this.provider.listAccounts())[0]
            const contract = this.contract.connect(signer)
            await contract.cancelSwapIntent(swapId)
        } catch (error) {
            throw new Error(error)
        }
    }
}

SDK.prototype.editTaker = async function ({swapId, addressTaker}) {
    if (this.isJsonRpcProvider) {
        try {
            await this.contract.editCounterPart(swapId, addressTaker)
        } catch (error) {
            throw new Error(error)
        }
    } else if (this.isWeb3Provider) {
        try {
            const signer = (await this.provider.listAccounts())[0]
            const contract = this.contract.connect(signer)
            await contract.editCounterPart(swapId, addressTaker)
        } catch (error) {
            throw new Error(error)
        }
    }
}

SDK.prototype.getSwapDetails = async function (addressMaker, swapId) {
    try {
        return (await this.contract.getSwapIntentByAddress(addressMaker, swapId))
    } catch (error) {
        throw new Error(error)
    }
}

SDK.prototype.getSwapAssets = async function (swapId) {
    try {
        const swapStructMakerSize = await this.contract.getSwapStructSize(swapId, true)
        const swapStructTakerSize = await this.contract.getSwapStructSize(swapId, false)
        
        let assetsMaker = []
        let assetsTaker = []

        for(let i = 0; i < swapStructMakerSize; i++) {
            assetsMaker.push(await this.contract.getSwapStruct(swapId, true, i))
        }
        for(let i = 0; i < swapStructTakerSize; i++) {
            assetsTaker.push(await this.contract.getSwapStruct(swapId, false, i))
        }

        return {
            assetsMaker,
            assetsTaker
        }
    } catch (error) {
        throw new Error(error)
    }
}

SDK.prototype.getERC20WhiteList = async function (erc20Address) {
    try {
        return (await this.contract.getERC20WhiteList(erc20Address))
    } catch (error) {
        throw new Error(error)
    }
}

SDK.prototype.getNFTBlacklist = async function (assetAddress) {
    try {
        return (await this.contract.getNFTBlacklist(assetAddress))
    } catch (error) {
        throw new Error(error)
    }
}

SDK.prototype.getPayment = async function () {
    try {
        return (await this.contract.getPaymentStruct())
    } catch (error) {
        throw new Error(error)
    }
}

SDK.prototype.Utils = function () {
    this.assetsArray = []
    this.tokenConstants = {
        ERC20 : 0,
        ERC721 : 1,
        ERC1155 : 2
    }
}

SDK.prototype.Utils.prototype.addERC20Asset = function ({address, tokenAmount}) {
    if (isNaN(tokenAmount))
        throw new Error('tokenAmount must be a numeric value.')
    this.assetsArray.push([address, this.tokenConstants.ERC20, [], [tokenAmount], [0], []])
}

SDK.prototype.Utils.prototype.addERC721Asset = function ({address, tokenIds = []}) {
    if (!(tokenIds instanceof Array))
        throw new Error('tokenIds must be an array.')
    if (tokenIds.length == 0)
        throw new Error('tokenIds must have at least one element.')
    this.assetsArray.push([address, this.tokenConstants.ERC721, tokenIds, [], [], []])
}

SDK.prototype.Utils.prototype.addERC1155Asset = function ({address, tokenIds = [], tokenAmounts = []}) {
    if (!(tokenIds instanceof Array))
        throw new Error('tokenIds must be an array.')
    if (!(tokenAmounts instanceof Array))
        throw new Error('tokenAmounts must be an array.')
    if (tokenIds.length != tokenAmounts.length)
        throw new Error('tokenIds array must have the same size of tokenAmounts array.')
    if (tokenIds.length == 0)
        throw new Error('tokenIds must have at least one element.')
    if (tokenAmounts.length == 0)
        throw new Error('tokenAmounts must have at least one element.')

    this.assetsArray.push([address, this.tokenConstants.ERC1155, tokenIds, tokenAmounts, [], []])
}

SDK.prototype.Utils.prototype.clearAssetsArray = function () {
    this.assetsArray = []
}

SDK.prototype.Utils.prototype.getAssetsArray = function () {
    return this.assetsArray
}

module.exports = SDK