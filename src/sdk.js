const ethers = require('ethers')
const {swap, contractAbi} = require('./contracts')
const {events} = require('./events')

/**
 * Create an instance of the SDK object.
 *
 * @param {Object} obj - configuration object for the SDK instance.
 * @param {Provider} obj.web3Provider - the handler object for the interaction with the chain.
 * @param {string} obj.jsonRpcProvider - the RPC provider URL.
 * @param {Object} obj.signer - the signer object.
 * @param {string} obj.signer.privateKey - the private key of the signer.
 * @param {string} obj.network - the network of the chain
 * @param {bool} obj.avoidPrivateKeySigner - flag to avoid the private key when jsonRpcProvider is enabled
 */
function SDK({web3Provider, jsonRpcProvider, signer = null, network = '', avoidPrivateKeySigner = false}) {
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
        if (typeof signer === 'undefined' || signer === null)
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
SDK.prototype.on = function(eventName, callback) {
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
SDK.prototype.off = function(eventName, callback = null) {
    const event = this.eventsCollectorCallbacks.find((eventItem) => {
        return eventItem.name === eventName
    })

    if (!event)
        throw new Error('event not supported.')

    if (callback != null && typeof callback != 'function')
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
SDK.prototype.__emit = function(eventName, params = {}) {
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
SDK.prototype.setBlocksNumberConfirmationRequired = function(blocksNumberConfirmationRequired = 0) {
    this.blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
}

/**
 * Create the swap 
 * 
 * @param {Object} obj - createSwap configuration object.
 * @param {number} obj.ethMaker - the ethereum amount provided by the creator of the swap.
 * @param {string} obj.taker - the taker (counterparty) of the swap.
 * @param {number} obj.ethTaker - the ethereum amount provided by the taker (counterparty) of the swap.
 * @param {Array} obj.assetsMaker - the assets (ERC20/ERC721/ERC1155) provided by the creator of the swap
 * @param {Array} obj.assetsTaker - the assets (ERC20/ERC721/ERC1155) provided by the taker (counterparty) of the swap
 * @param {string} obj.referralAddress - the referral address of the transaction.
 */
SDK.prototype.createSwap = async function({ethMaker, taker, ethTaker, assetsMaker = [], assetsTaker = [], referralAddress = ''}) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
        throw new Error('you cannot create a swap when you\'re in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction.')

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
            await this.contract.createSwapIntent(swapIntent, assetsMaker, assetsTaker, referralAddress).then((tx) => {
                this.__emit('createSwapTransactionCreated', {tx})
                await tx.wait(this.blocksNumberConfirmationRequired).then((receipt) => {
                    this.__emit('createSwapTransactionMined', {receipt})
                }).catch((error) => {
                    this.__emit('createSwapTransactionError', {error, typeError : 'waitError'})
                    throw new Error(error)
                })
            }).catch((error) => {
                this.__emit('createSwapTransactionError', {error, typeError : 'createSwapIntentError'})
                throw new Error(error)
            })
        } catch (error) {
            throw new Error(error)
        }
    } else if (this.isWeb3Provider) {
        try {
            const signer = this.provider.getSigner(addressMaker)
            const contract = this.contract.connect(signer)
            await contract.createSwapIntent(swapIntent, assetsMaker, assetsTaker, referralAddress).then((tx) => {
                this.__emit('createSwapTransactionCreated', {tx})
                await tx.wait(this.blocksNumberConfirmationRequired).then((receipt) => {
                    this.__emit('createSwapTransactionMined', {receipt})
                }).catch((error) => {
                    this.__emit('createSwapTransactionError', {error, typeError : 'waitError'})
                })
            }).catch((error) => {
                this.__emit('createSwapTransactionError', {error, typeError : 'createSwapIntentError'})
                throw new Error(error)
            })
        } catch (error) {
            throw new Error(error)
        }
    }
}

/**
 * Close the swap. Only the taker (counterparty) can close it.
 * 
 * @param {string} maker - the swap creator address.
 * @param {number} swapId - the identifier of the swap.
 * @param {string} referralAddress - the referral address of the transaction.
 */
SDK.prototype.closeSwap = async function(maker, swapId, referralAddress = '') {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
        throw new Error('you cannot close a swap when you\'re in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction.')

    if (this.isJsonRpcProvider) {
        try {
            await this.contract.closeSwapIntent(maker, swapId, referralAddress).then((tx) => {
                this.__emit('closeSwapTransactionCreated', {tx})
                await tx.wait(this.blocksNumberConfirmationRequired).then((receipt) => {
                    this.__emit('closeSwapTransactionMined', {receipt})
                }).catch((error) => {
                    this.__emit('closeSwapTransactionError', {error, typeError : 'waitError'})
                    throw new Error(error)
                })
            }).catch((error) => {
                this.__emit('closeSwapTransactionError', {error, typeError : 'closeSwapIntentError'})
                throw new Error(error)
            })
        } catch (error) {
            throw new Error(error)
        }
    } else if (this.isWeb3Provider) {
        try {
            const signer = (await this.provider.listAccounts())[0]
            const contract = this.contract.connect(signer)
            await contract.closeSwapIntent(maker, swapId, referralAddress).then((tx) => {
                this.__emit('closeSwapTransactionCreated', {tx})
                await tx.wait(this.blocksNumberConfirmationRequired).then((receipt) => {
                    this.__emit('closeSwapTransactionMined', {receipt})
                }).catch((error) => {
                    this.__emit('closeSwapTransactionError', {error, typeError : 'waitError'})
                    throw new Error(error)
                })
            }).catch((error) => {
                this.__emit('closeSwapTransactionError', {error, typeError : 'closeSwapIntentError'})
                throw new Error(error)
            })
        } catch (error) {
            throw new Error(error)
        }
    }
}

/**
 * Cancel the swap. Only the maker (creator) can cancel it.
 * 
 * @param {number} swapId - the identifier of the swap.
 */
SDK.prototype.cancelSwap = async function(swapId) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
        throw new Error('you cannot cancel a swap when you\'re in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction.')

    if (this.isJsonRpcProvider) {
        try {
            await this.contract.cancelSwapIntent(swapId).then((tx) => {
                this.__emit('cancelSwapTransactionCreated', {tx})
                await tx.wait(this.blocksNumberConfirmationRequired).then((receipt) => {
                    this.__emit('cancelSwapTransactionMined', {receipt})
                }).catch((error) => {
                    this.__emit('cancelSwapTransactionError', {error, typeError : 'waitError'})
                    throw new Error(error)
                })
            }).catch((error) => {
                this.__emit('cancelSwapTransactionError', {error, typeError : 'cancelSwapIntentError'})
                throw new Error(error)
            })
        } catch (error) {
            throw new Error(error)
        }
    } else if (this.isWeb3Provider) {
        try {
            const signer = (await this.provider.listAccounts())[0]
            const contract = this.contract.connect(signer)
            await contract.cancelSwapIntent(swapId).then((tx) => {
                this.__emit('cancelSwapTransactionCreated', {tx})
                await tx.wait(this.blocksNumberConfirmationRequired).then((receipt) => {
                    this.__emit('cancelSwapTransactionMined', {receipt})
                }).catch((error) => {
                    this.__emit('cancelSwapTransactionError', {error, typeError : 'waitError'})
                    throw new Error(error)
                })
            }).catch((error) => {
                this.__emit('cancelSwapTransactionError', {error, typeError : 'cancelSwapIntentError'})
                throw new Error(error)
            })
        } catch (error) {
            throw new Error(error)
        }
    }
}

/**
 * Edit the taker (counterparty) of the swap. Only the maker (creator) can edit it.
 * 
 * @param {number} swapId - the identifier of the swap.
 * @param {string} addressTaker - the address of the taker (counterparty).
 */
SDK.prototype.editTaker = async function(swapId, addressTaker) {
    if (this.avoidPrivateKeySigner && this.isJsonRpcProvider)
        throw new Error('you cannot edit the taker of a swap when you\'re in jsonRpcProvider mode with avoidPrivateKeySigner param set to true. In this mode you should just read data from the blockchain, not write a transaction.')

    if (this.isJsonRpcProvider) {
        try {
            await this.contract.editCounterPart(swapId, addressTaker).then((tx) => {
                this.__emit('editTakerTransactionCreated', {tx})
                await tx.wait(this.blocksNumberConfirmationRequired).then((receipt) => {
                    this.__emit('editTakerTransactionMined', {receipt})
                }).catch((error) => {
                    this.__emit('editTakerTransactionError', {error, typeError : 'waitError'})
                    throw new Error(error)
                })
            }).catch((error) => {
                this.__emit('editTakerTransactionError', {error, typeError : 'editCounterpartError'})
                throw new Error(error)
            })
        } catch (error) {
            throw new Error(error)
        }
    } else if (this.isWeb3Provider) {
        try {
            const signer = (await this.provider.listAccounts())[0]
            const contract = this.contract.connect(signer)
            await contract.editCounterPart(swapId, addressTaker).then((tx) => {
                this.__emit('editTakerTransactionCreated', {tx})
                await tx.wait(this.blocksNumberConfirmationRequired).then((receipt) => {
                    this.__emit('editTakerTransactionMined', {receipt})
                }).catch((error) => {
                    this.__emit('editTakerTransactionError', {error, typeError : 'waitError'})
                    throw new Error(error)
                })
            }).catch((error) => {
                this.__emit('editTakerTransactionError', {error, typeError : 'editCounterpartError'})
                throw new Error(error)
            })
        } catch (error) {
            throw new Error(error)
        }
    }
}

/**
 * Returns the swap main details information.
 * 
 * @param {string} maker - the swap creator address.
 * @param {number} swapId - the identifier of the swap.
 */
SDK.prototype.getSwapDetails = async function(maker, swapId) {
    try {
        return (await this.contract.getSwapIntentByAddress(maker, swapId))
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Returns the assets details involved in the swap.
 * 
 * @param {number} swapId - the identifier of the swap.
 */
SDK.prototype.getSwapAssets = async function(swapId) {
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
SDK.prototype.getERC20WhiteList = async function(erc20Address) {
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
SDK.prototype.getNFTBlacklist = async function(assetAddress) {
    try {
        return (await this.contract.getNFTBlacklist(assetAddress))
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * Returns the payment struct configuration of the smart contract.
 */
SDK.prototype.getPayment = async function() {
    try {
        return (await this.contract.getPaymentStruct())
    } catch (error) {
        throw new Error(error)
    }
}

/**
 * SDK.Utils class. This class contains some utility methods for the SDK.
 * 
 * @class SDK.Utils
 */
SDK.prototype.Utils = function() {
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
SDK.prototype.Utils.prototype.addERC20Asset = function(address, tokenAmount) {
    if (isNaN(tokenAmount))
        throw new Error('tokenAmount must be a numeric value.')
    this.assetsArray.push([address, this.tokenConstants.ERC20, [], [tokenAmount], [0], []])
}

/**
 * Add an ERC721 token item to the assets Array.
 * 
 * @param {string} address - the ERC721 token address.
 * @param {Array} tokenIds - the ids of the ERC721 token used.
 */
SDK.prototype.Utils.prototype.addERC721Asset = function(address, tokenIds = []) {
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
SDK.prototype.Utils.prototype.addERC1155Asset = function(address, tokenIds = [], tokenAmounts = []) {
    if (!(tokenIds instanceof Array))
        throw new Error('tokenIds must be an array.')
    if (!(tokenAmounts instanceof Array))
        throw new Error('tokenAmounts must be an array.')
    if (tokenIds.length != tokenAmounts.length)
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
SDK.prototype.Utils.prototype.clearAssetsArray = function() {
    this.assetsArray = []
}

/**
 * Returns the assets Array
 */
SDK.prototype.Utils.prototype.getAssetsArray = function() {
    return this.assetsArray
}

/**
 * SDK.WebSocketProvider class. This class contains the WebSocket Provider objects to listen the events emitted by the smart contract.
 * 
 * @class SDK.WebSocketProvider
 */
SDK.prototype.WebSocketProvider = function({wssUrl, network = null}) {
    if (typeof wssUrl != 'string')
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
 * 
 */
SDK.prototype.WebSocketProvider.prototype.onSwapEvent = function(callback) {
    if (typeof callback != 'function' && callback != null)
        throw new Error('callback must be a Function.')

    const filter = {
        address: this.contractAddressWebSocketProvider,
        topics: [
            ethersJs.utils.id('swapEvent(address,uint256,uint8,uint256,address,address)'),
        ]
    }

    this.webSocketProvider.on(filter, (event) => {
        if (callback)
            callback(event)
    })
}

/**
 * Execute the callback when a CounterpartEvent is emitted by the smart contract.
 * 
 * @param {Function} callback - the callback function to execute.
 * 
 */
SDK.prototype.WebSocketProvider.prototype.onCounterpartEvent = function(callback) {
    if (typeof callback != 'function' && callback != null)
        throw new Error('callback must be a Function.')

    const filter = {
        address: this.contractAddressWebSocketProvider,
        topics: [
            ethersJs.utils.id('swapEvent(uint256,address)'),
        ]
    }

    this.webSocketProvider.on(filter, (event) => {
        if (callback)
            callback(event)
    })
}

/**
 * Execute the callback when a PaymentReceived is emitted by the smart contract.
 * 
 * @param {Function} callback - the callback function to execute.
 * 
 */
SDK.prototype.WebSocketProvider.prototype.onPaymentReceived = function(callback) {
    if (typeof callback != 'function' && callback != null)
        throw new Error('callback must be a Function.')

    const filter = {
        address: this.contractAddressWebSocketProvider,
        topics: [
            ethersJs.utils.id('paymentReceived(address,uint256)'),
        ]
    }

    this.webSocketProvider.on(filter, (event) => {
        if (callback)
            callback(event)
    })
}

module.exports = SDK