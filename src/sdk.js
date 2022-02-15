const ethers = require('ethers')
const {swap, contractAbi, erc721Abi} = require('./contracts')
const {events} = require('./events')

/**
 * Create an instance of the NFTTraderSDK object.
 *
 * @param {Object} obj - configuration object for the SDK instance.
 * @param {Provider} obj.web3Provider - the handler object for the interaction with the chain.
 * @param {string} obj.jsonRpcProvider - the RPC provider URL.
 * @param {string} obj.network - the network of the chain
 * @param {Object} obj.signer - the signer object.
 * @param {string} obj.signer.privateKey - the private key of the signer.
 * @param {bool} obj.avoidPrivateKeySigner - flag to avoid the private key when jsonRpcProvider is enabled
 */
function NFTTraderSDK({web3Provider, jsonRpcProvider, network, signer = null, avoidPrivateKeySigner = false}) {
    this.provider = null
    this.contractAddress = null
    this.contract = null
    this.signer = null
    this.isJsonRpcProvider = false
    this.isWeb3Provider = false
    this.blocksNumberConfirmationRequired = 3
    this.avoidPrivateKeySigner = avoidPrivateKeySigner
    this.events = events
    this.eventsCollectorCallbacks = []

    this.events.forEach((event) => {
        this.eventsCollectorCallbacks.push({
            name : event,
            callbacks : []
        })
    })

    if (web3Provider && jsonRpcProvider)
        throw new Error('just one provider at a time is supported.')

    if (typeof jsonRpcProvider !== 'string' && typeof jsonRpcProvider !== 'undefined')
        throw new Error('jsonRpcProvider must be a string -> Eg. https://rinkeby.infura.io/v3/...')

    if (typeof web3Provider === 'string' && typeof web3Provider !== 'undefined')
        throw new Error('web3Provider must be an object -> Eg. window.ethereum')

    if (swap[network] === void 0)
        throw new Error('network not supported.')

    if (typeof jsonRpcProvider === 'string') {
        if (this.avoidPrivateKeySigner === false) {
            if (typeof signer === 'undefined' || signer === null)
                throw new Error('signer is mandatory if you use a JSON RPC Provider.')
            if (signer['privateKey'] === void 0)
                throw new Error('signer object must have a privateKey property.')
        }
        
        this.isJsonRpcProvider = true
    }

    if (typeof web3Provider !== 'undefined' && web3Provider !== null) {
        this.isWeb3Provider = true
    }

    try {
        if (this.isJsonRpcProvider) {
            this.provider = new ethers.providers.JsonRpcProvider(jsonRpcProvider)
            if (this.avoidPrivateKeySigner === false) {
                try {
                    this.signer = new ethers.Wallet(signer.privateKey, this.provider)
                } catch (error) {
                    throw new Error('provide a valid private key for the signer.')
                }
            }
        } else if (this.isWeb3Provider) {
            this.provider = new ethers.providers.Web3Provider(web3Provider)
        }

        this.contractAddress = swap[network]
        this.contract = new ethers.Contract(this.contractAddress, contractAbi, this.provider)

        if (this.isJsonRpcProvider && this.avoidPrivateKeySigner === false)
            this.contract = this.contract.connect(this.signer)
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Append a callback function from the event queue. Used for intercepting the event during the creation/closing/canceling of the deal and for the changing of the taker.
 *
 * @param {string} eventName - the name of the event.
 * @param {Function} callback - the callback function to execute once the event is fired.
 */
NFTTraderSDK.prototype.on = function(eventName, callback) {
    const event = this.eventsCollectorCallbacks.find((eventItem) => {
        return eventItem.name === eventName
    })

    if (!event)
        throw new Error('event not supported.')

    event.callbacks.push(callback)
}

/**
 * Remove a callback function from the event queue.
 *
 * @param {string} eventName - the name of the event.
 * @param {Function} callback - the callback function to execute once the event is fired.
 */
NFTTraderSDK.prototype.off = function(eventName, callback = null) {
    const event = this.eventsCollectorCallbacks.find((eventItem) => {
        return eventItem.name === eventName
    })
    
    if (!event)
        throw new Error('event not supported.')

    if (callback !== null && typeof callback !== 'function' && typeof callback !== 'undefined')
        throw new Error('callback must be a Function.')

    if (callback) {
        const index = event.callbacks.findIndex((func) => {
            return func.toString() === callback.toString()
        })
        event.callbacks.splice(index, 1)
    } else {
        event.callbacks = []
    }
}

/**
 * Used to fire events internally. Used internally, no reason to interact with this method directly.
 *
 * @param {string} eventName - the name of the event.
 * @param {Object} params - the params to give to the callback function
 */
NFTTraderSDK.prototype.__emit = function(eventName, params = {}) {
    const event = this.eventsCollectorCallbacks.find((eventItem) => {
        return eventItem.name === eventName
    })

    if (!event)
        throw new Error(error)

    event.callbacks.forEach((callback) => {
        callback(params)
    })
}

/**
 * Set the block numbers to wait in which consider a transaction mined by the createSwap, cancelSwap, closeSwap and editTaker methods.
 *
 * @param {number} blocksNumberConfirmationRequired - the number of the mined blocks to wait for considering a transaction valid.
 */
NFTTraderSDK.prototype.setBlocksNumberConfirmationRequired = function(blocksNumberConfirmationRequired) {
    if (blocksNumberConfirmationRequired < 1)
        throw new Error('blocksNumberConfirmationRequired cannot be lower than one.')
    this.blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
}

/**
 * Create the swap 
 * 
 * @param {Object} createSwapObj - the createSwap configuration object
 * @param {number} createSwapObj.ethMaker - the ethereum amount provided by the creator of the swap.
 * @param {string} createSwapObj.taker - the taker (counterparty) of the swap.
 * @param {number} createSwapObj.ethTaker - the ethereum amount provided by the taker (counterparty) of the swap.
 * @param {number} createSwapObj.swapEnd - the number of the days representing the validity of the swap
 * @param {Array} createSwapObj.assetsMaker - the assets (ERC20/ERC721/ERC1155) provided by the creator of the swap
 * @param {Array} createSwapObj.assetsTaker - the assets (ERC20/ERC721/ERC1155) provided by the taker (counterparty) of the swap
 * @param {string} createSwapObj.referralAddress - the referral address of the transaction.
 * @param {number} gasLimit - the gas limit of the transaction
 * @param {string} gasPrice - the gas price of the transaction
 */
NFTTraderSDK.prototype.createSwap = async function({ethMaker, taker, ethTaker, swapEnd = 0, assetsMaker = [], assetsTaker = [], referralAddress = '0x0000000000000000000000000000000000000000'}, gasLimit = 2000000, gasPrice = null) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
        throw new Error('you cannot create a swap when you\'re in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction.')
    if(swapEnd < 0)
        throw new Error('swapEnd cannot be lower than zero.')

    const swapId = 0
    const addressMaker = this.isJsonRpcProvider ? this.signer.address : ((await this.provider.listAccounts())[0])
    const discountMaker = false
    const valueMaker = ethers.BigNumber.from(ethMaker.toString())
    const flatFeeMaker = 0
    const addressTaker = taker
    const discountTaker = false
    const valueTaker = ethers.BigNumber.from(ethTaker.toString())
    const flatFeeTaker = 0
    const swapStart = 0
    const flagFlatFee = false
    const flagRoyalties = false
    const status = 0
    const royaltiesMaker = 0
    const royaltiesTaker = 0
    const swapIntent = [
        swapId,
        addressMaker,
        discountMaker,
        valueMaker.toString(),
        flatFeeMaker,
        addressTaker,
        discountTaker,
        valueTaker.toString(),
        flatFeeTaker,
        swapStart,
        swapEnd,
        flagFlatFee,
        flagRoyalties,
        status,
        royaltiesMaker,
        royaltiesTaker
    ]

    let hasSquad = false
    let fee

    try {
        const {flagFlatFee, flatFee} = await this.getPayment()
        fee = flagFlatFee ? flatFee.toNumber() : 0

        const {TRADESQUAD, PARTNERSQUAD} = await this.getReferenceAddress()
        
        const contractTradeSquad = new ethers.Contract(TRADESQUAD, erc721Abi, this.provider)
        const contractPartnerSquad = new ethers.Contract(PARTNERSQUAD, erc721Abi, this.provider)
        
        const balanceTradeSquad = await contractTradeSquad.balanceOf(addressMaker)
        const balancePartnerSquad = await contractPartnerSquad.balanceOf(addressMaker)

        if (balanceTradeSquad.toNumber() > 0 || balancePartnerSquad.toNumber() > 0)
            hasSquad = true
        
    } catch (error) {
        throw new Error(error)
    }

    let txOverrides = {}
    txOverrides['value'] = hasSquad ? valueMaker.toString() : (valueMaker.add(fee)).toString()
    gasLimit && (txOverrides['gasLimit'] = gasLimit)
    gasPrice && (txOverrides['gasPrice'] = gasPrice)

    let signerTx
    let contract = this.contract

    if (this.isWeb3Provider) {
        signerTx = this.provider.getSigner(addressMaker)
        contract = this.contract.connect(signerTx)
    }

    try {       
        let tx = await contract.createSwapIntent(swapIntent, assetsMaker, assetsTaker, referralAddress, {...txOverrides})
        this.__emit('createSwapTransactionCreated', {tx})
        try {
            let receipt = await tx.wait(this.blocksNumberConfirmationRequired)
            this.__emit('createSwapTransactionMined', {receipt})
        } catch (error) {
            this.__emit('createSwapTransactionError', {error, typeError : 'waitError'})
        }
    } catch (error) {
        this.__emit('createSwapTransactionError', {error, typeError : 'createSwapIntentError'})
    }
}

/**
 * Close the swap. Only the taker (counterparty) can close it if its address is specified. Otherwise everyone can close the swap.
 * 
 * @param {Object} closeSwapObj - the closeSwap configuration object
 * @param {string} closeSwapObj.maker - the maker (creator) of the swap.
 * @param {number} closeSwapObj.swapId - the identifier of the swap.
 * @param {string} closeSwapObj.referralAddress - the referral address of the transaction.
 * @param {string} closeSwapObj.referralAddress - the referral address of the transaction.
 * @param {string} closeSwapObj.referralAddress - the referral address of the transaction.
 * @param {number} gasLimit - the gas limit of the transaction
 * @param {string} gasPrice - the gas price of the transaction
 */
NFTTraderSDK.prototype.closeSwap = async function({maker, swapId, referralAddress = '0x0000000000000000000000000000000000000000'}, gasLimit = 2000000, gasPrice = null) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
        throw new Error('you cannot close a swap when you\'re in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction.')

    try {
        let hasSquad = false
        const {flagFlatFee, flatFee} = await this.getPayment()
        const fee = flagFlatFee ? flatFee.toNumber() : 0
        const taker = this.isJsonRpcProvider ? this.signer.address : ((await this.provider.listAccounts())[0])
        const {valueTaker} = await this.getSwapDetails(maker, swapId)
        const {TRADESQUAD, PARTNERSQUAD} = await this.getReferenceAddress()
        const contractTradeSquad = new ethers.Contract(TRADESQUAD, erc721Abi, this.provider)
        const contractPartnerSquad = new ethers.Contract(PARTNERSQUAD, erc721Abi, this.provider)
        
        const balanceTradeSquad = await contractTradeSquad.balanceOf(taker)
        const balancePartnerSquad = await contractPartnerSquad.balanceOf(taker)

        let txOverrides = {}
        txOverrides['value'] = hasSquad ? valueTaker.toString() : (valueTaker.add(fee)).toString()
        gasLimit && (txOverrides['gasLimit'] = gasLimit)
        gasPrice && (txOverrides['gasPrice'] = gasPrice)

        if (balanceTradeSquad.toNumber() > 0 || balancePartnerSquad.toNumber() > 0)
            hasSquad = true

        let senderTx
        let signerTx
        let contract = this.contract
    
        if (this.isWeb3Provider) {
            senderTx = (await this.provider.listAccounts())[0]
            signerTx = this.provider.getSigner(senderTx)
            contract = this.contract.connect(signerTx)
        }
        
        try {
            let tx = await contract.closeSwapIntent(maker, swapId, referralAddress, {...txOverrides})
            this.__emit('closeSwapTransactionCreated', {tx})
            try {
                let receipt = await tx.wait(this.blocksNumberConfirmationRequired)
                this.__emit('closeSwapTransactionMined', {receipt})
            } catch (error) {
                this.__emit('closeSwapTransactionError', {error, typeError : 'waitError'})
            }
        } catch (error) {
            this.__emit('closeSwapTransactionError', {error, typeError : 'closeSwapIntentError'})
        }
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Cancel the swap. Only the maker (creator) can cancel it.
 * 
 * @param {number} swapId - the identifier of the swap.
 * @param {number} gasLimit - the gas limit of the transaction
 * @param {string} gasPrice - the gas price of the transaction
 */
NFTTraderSDK.prototype.cancelSwap = async function(swapId, gasLimit = 2000000, gasPrice = null) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
        throw new Error('you cannot cancel a swap when you\'re in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction.')

    let txOverrides = {}
    gasLimit && (txOverrides['gasLimit'] = gasLimit)
    gasPrice && (txOverrides['gasPrice'] = gasPrice)

    let senderTx
    let signerTx
    let contract = this.contract

    if (this.isWeb3Provider) {
        senderTx = (await this.provider.listAccounts())[0]
        signerTx = this.provider.getSigner(senderTx)
        contract = this.contract.connect(signerTx)
    }

    try {
        let tx = await contract.cancelSwapIntent(swapId, {...txOverrides})
        this.__emit('cancelSwapTransactionCreated', {tx})
        try {
            let receipt = await tx.wait(this.blocksNumberConfirmationRequired)
            this.__emit('cancelSwapTransactionMined', {receipt})
        } catch (error) {
            this.__emit('cancelSwapTransactionError', {error, typeError : 'waitError'})
        }
    } catch (error) {
        this.__emit('cancelSwapTransactionError', {error, typeError : 'cancelSwapIntentError'})
    }
}

/**
 * Edit the taker (counterparty) of the swap. Only the maker (creator) can edit it.
 * 
 * @param {number} swapId - the identifier of the swap.
 * @param {string} addressTaker - the address of the taker (counterparty).
 * @param {number} gasLimit - the gas limit of the transaction
 * @param {string} gasPrice - the gas price of the transaction
 */
NFTTraderSDK.prototype.editTaker = async function(swapId, addressTaker, gasLimit = 2000000, gasPrice = null) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
        throw new Error('you cannot edit the taker of a swap when you\'re in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction.')

    let txOverrides = {}
    gasLimit && (txOverrides['gasLimit'] = gasLimit)
    gasPrice && (txOverrides['gasPrice'] = gasPrice)

    let senderTx
    let signerTx
    let contract = this.contract

    if (this.isWeb3Provider) {
        senderTx = (await this.provider.listAccounts())[0]
        signerTx = this.provider.getSigner(senderTx)
        contract = this.contract.connect(signerTx)
    }

    try {
        let tx = await contract.editCounterPart(swapId, addressTaker, {...txOverrides})
        this.__emit('editTakerTransactionCreated', {tx})
        try {
            let tx = await tx.wait(this.blocksNumberConfirmationRequired)
            this.__emit('editTakerTransactionMined', {receipt})
        } catch (error) {
            this.__emit('editTakerTransactionError', {error, typeError : 'waitError'})
        }
    } catch (error) {
        this.__emit('editTakerTransactionError', {error, typeError : 'editCounterpartError'})
    }
}

/**
 * Returns the swap main details information.
 * 
 * @param {string} maker - the swap creator address.
 * @param {number} swapId - the identifier of the swap.
 */
NFTTraderSDK.prototype.getSwapDetails = async function(maker, swapId) {
    try {
        return ({ id, addressMaker, discountMaker, valueMaker, flatFeeMaker, addressTaker, discountTaker, valueTaker, flatFeeTaker, swapStart, swapEnd, flagFlatFee, flagRoyalties, status, royaltiesMaker, royaltiesTaker } = (await this.contract.getSwapIntentByAddress(maker, swapId)))
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Returns the assets details involved in the swap.
 * 
 * @param {number} swapId - the identifier of the swap.
 */
NFTTraderSDK.prototype.getSwapAssets = async function(swapId) {
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

/**
 * Returns true if the ERC20 token is whitelisted by the smart contract.
 * 
 * @param {string} erc20Address - the ERC20 token address
 */
NFTTraderSDK.prototype.isERC20WhiteListed = async function(erc20Address) {
    try {
        return (await this.contract.getERC20WhiteList(erc20Address))
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Returns true if the ERC721/ERC1155 token is blacklisted by the smart contract.
 * 
 * @param {string} assetAddress - the ERC721/ERC1155 token address
 */
NFTTraderSDK.prototype.isNFTBlacklisted = async function(assetAddress) {
    try {
        return (await this.contract.getNFTBlacklist(assetAddress))
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Returns the payment struct configuration of the smart contract.
 */
NFTTraderSDK.prototype.getPayment = async function() {
    try {
        return ({ flagFlatFee, flagRoyalties, flatFee, bps, scalePercent } = (await this.contract.payment()))
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Returns the reference address struct configuration of the smart contract.
 */
NFTTraderSDK.prototype.getReferenceAddress = async function() {
    try {
        return ({ ROYALTYENGINEADDRESS, TRADESQUAD, PARTNERSQUAD, VAULT } = (await this.contract.referenceAddress()))
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Returns the reference address struct configuration of the smart contract.
 */
NFTTraderSDK.prototype.isBannedAddress = async function(address) {
    try {
        return await this.contract.bannedAddress(address)
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Returns the instance of ethers used internally to this module
 */
NFTTraderSDK.prototype.getEthersJSInstance = function() {
   return ethers 
}

/**
 * NFTTraderSDK.AssetsArray class. This class represents an array of assets
 * 
 * @class SDK.AssetsArray
 */
NFTTraderSDK.prototype.AssetsArray = function() {
    this.assetsArray = []
    this.tokenConstants = {
        ERC20 : 0,
        ERC721 : 1,
        ERC1155 : 2
    }
}

/**
 * Add an ERC20 token item to the assets Array.
 * 
 * @param {string} address - the ERC20 token address.
 * @param {number} tokenAmount - the amount of the token used.
 */
NFTTraderSDK.prototype.AssetsArray.prototype.addERC20Asset = function(address, tokenAmount) {
    if (isNaN(tokenAmount))
        throw new Error('tokenAmount must be a numeric value.')
    this.assetsArray.push([address, this.tokenConstants.ERC20, [], [(ethers.BigNumber.from(tokenAmount.toString())).toString()], [0], []])
}

/**
 * Add an ERC721 token item to the assets Array.
 * 
 * @param {string} address - the ERC721 token address.
 * @param {Array} tokenIds - the ids of the ERC721 token used.
 */
NFTTraderSDK.prototype.AssetsArray.prototype.addERC721Asset = function(address, tokenIds = []) {
    if (!(tokenIds instanceof Array))
        throw new Error('tokenIds must be an array.')
    if (tokenIds.length === 0)
        throw new Error('tokenIds must have at least one element.')
    this.assetsArray.push([address, this.tokenConstants.ERC721, tokenIds, [], [], []])
}

/**
 * Add an ERC1155 token item to the assets Array.
 * 
 * @param {string} address - the ERC1155 token address.
 * @param {Array} tokenIds - the ids of the ERC1155 token used.
 * @param {Array} tokenAmounts - the amounts of the ERC1155 token used.
 * 
 */
NFTTraderSDK.prototype.AssetsArray.prototype.addERC1155Asset = function(address, tokenIds = [], tokenAmounts = []) {
    if (!(tokenIds instanceof Array))
        throw new Error('tokenIds must be an array.')
    if (!(tokenAmounts instanceof Array))
        throw new Error('tokenAmounts must be an array.')
    if (tokenIds.length !== tokenAmounts.length)
        throw new Error('tokenIds array must have the same size of tokenAmounts array.')
    if (tokenIds.length === 0)
        throw new Error('tokenIds must have at least one element.')
    if (tokenAmounts.length === 0)
        throw new Error('tokenAmounts must have at least one element.')

    this.assetsArray.push([address, this.tokenConstants.ERC1155, tokenIds, tokenAmounts, [], []])
}

/**
 * Clear the assets Array
 */
NFTTraderSDK.prototype.AssetsArray.prototype.clearAssetsArray = function() {
    this.assetsArray = []
}

/**
 * Returns the assets Array
 */
NFTTraderSDK.prototype.AssetsArray.prototype.getAssetsArray = function() {
    return this.assetsArray
}

/**
 * NFTTraderSDK.WebSocketProvider class. This class contains the WebSocket Provider objects to listen the events emitted by the smart contract.
 * 
 * @class SDK.WebSocketProvider
 */
NFTTraderSDK.prototype.WebSocketProvider = function({wssUrl, network = null}) {
    if (typeof wssUrl !== 'string')
        throw new Error('wssUrl must be a string.')
    
    try {
        if (network)
            this.webSocketProvider = new ethers.providers.WebSocketProvider(wssUrl)
        else
            this.webSocketProvider = new ethers.providers.WebSocketProvider(wssUrl, network)

        this.contractAddressWebSocketProvider = this.contractAddress
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Execute the callback when a SwapEvent is emitted by the smart contract.
 * 
 * @param {Function} callback - the callback function to execute.
 * @param {Object} topicObject - the topic object for filtering a specific swapEvent
 * @param {string} topicObject.creator - the creator address of the swap.
 * @param {number} topicObject.time - the creation time of the swap.
 * @param {number} topicObject.status - the status of the swap.
 */
NFTTraderSDK.prototype.WebSocketProvider.prototype.onSwapEvent = function(callback, {creator = null, time = null, status = null}) {
    if (callback === null || typeof callback === 'undefined')
        throw new Error('callback must be provided')
    if (typeof callback !== 'function')
        throw new Error('callback must be a Function.')

    const filter = {
        address: this.contractAddressWebSocketProvider,
        topics: [
            ethersJs.utils.id('swapEvent(address,uint256,uint8,uint256,address,address)'),
            creator ? creator : null,
            time ? time : null,
            status ? status : null
        ]
    }

    this.webSocketProvider.on(filter, (event) => {
        callback(event)
    })
}

/**
 * Execute the callback when a CounterpartEvent is emitted by the smart contract.
 * 
 * @param {Function} callback - the callback function to execute.
 * @param {Object} topicObject - the topic object for filtering a specific counterpartEvent
 * @param {number} topicObject.swapId - the swap identifier.
 * @param {string} topicObject.counterpart - the address of the counterpart.
 * 
 */
NFTTraderSDK.prototype.WebSocketProvider.prototype.onCounterpartEvent = function(callback, {swapId = null, counterpart = null}) {
    if (callback === null || typeof callback === 'undefined')
        throw new Error('callback must be provided')
    if (typeof callback !== 'function')
        throw new Error('callback must be a Function.')

    const filter = {
        address: this.contractAddressWebSocketProvider,
        topics: [
            ethersJs.utils.id('counterpartEvent(uint256,address)'),
            swapId ? swapId : null,
            counterpart ? counterpart : null
        ]
    }

    this.webSocketProvider.on(filter, (event) => {
        callback(event)
    })
}

/**
 * Execute the callback when a PaymentReceived is emitted by the smart contract.
 * 
 * @param {Function} callback - the callback function to execute.
 * @param {Object} topicObject - the topic object for filtering a specific paymentReceived.
 * @param {string} topicObject.payer - the address of the payer.
 * 
 */
NFTTraderSDK.prototype.WebSocketProvider.prototype.onPaymentReceived = function(callback, {payer = null}) {
    if (callback === null || typeof callback === 'undefined')
        throw new Error('callback must be provided')
    if (typeof callback !== 'function')
        throw new Error('callback must be a Function.')

    const filter = {
        address: this.contractAddressWebSocketProvider,
        topics: [
            ethersJs.utils.id('paymentReceived(address,uint256)'),
            payer ? payer : null
        ]
    }

    this.webSocketProvider.on(filter, (event) => {
        callback(event)
    })
}

module.exports = NFTTraderSDK