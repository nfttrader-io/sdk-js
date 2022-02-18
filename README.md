# NFT Trader Javascript SDK

Welcome to the official repository of the P2P OTC NFT Trader platform developed by the official NFT Trader team!

The primary goal with this package is to offer web3 developers a simple design to integrate our robust NFT Trader technology inside other external DApps (Decentralized Applications). This is open for all developers who would like to unlock the ability for your applications and protocols to have a system which allows for the secure swapping of NFTs (erc721), ERC20, ERC1155 tokens on Ethereum and other digital assets on EVM congruent chains.

The package is available for Node.js and browser platforms.

## Installation

Using npm:

```sh
npm install @nfttrader/sdk-js
```

Using local js file:

```html
<script src="/path/to/your/js/nfttrader-sdk.js"></script>
```

## CommonJS usage

```js
const NFTTraderSDK = require('@nfttrader/sdk-js')
const sdk = new NFTTraderSDK(...)
```

## Browser usage

```js
const sdk = new NFTTraderSDK(...)
```

## Introduction

The `NFTTraderSDK` class object is the action to which you can interact with the NFT Trader Smart Contract in a convenient manner. It contains a set of methods that allow you to simplify the interaction process with the blockchain.
The SDK is compatible on the following blockchains:

- Ethereum Mainnet
- Ethereum Rinkeby
- Ethereum Ropsten
- Ethereum Kovan
- Ethereum Goerli
- Polygon
- Polygon Mumbai
- xDai chain (Gnosis chain)

### What Can I Do With This SDK?

With the NFT Trader Javascript SDK you can create a swap order, finalize a swap order, edit the Taker of the order or cancel a swap order. Furthermore, it provides you some other utility based methods that allow you to read details of the order book, listen to specific events from the smart contract and includes helper functions in order to help you format the parameters of the NFT Trader Smart Contract in the correct way. We will describe everything in more detail throughout the next sections, so do not worry if you don't fully understand what has already been stated. 🤓

The end purpose is very simple once you learn how to master the SDK. You will be able to include these sets of functionalities directly into your own platform and enable the swapping features for NFTs, ERC20 tokens and other digital assets. This is a very useful tool for many applications, particularly if you are planning to build a game with a swap market feature for trading game assets or an application / market in which you want to integrate a method for your users to swap assets with other users. There are many web3 protocols which will find this SDK useful for the purpose of trading digital assets.

## Table Of Contents

- [How the swap works](#how-the-swap-works)
- [Initialize the NFTTraderSDK object](#initialize-the-nfttradersdk-object)
- [Instance methods](#instance-methods)
- [Create a swap](#create-a-swap)
- [Close a swap](#close-a-swap)
- [Cancel a swap](#cancel-a-swap)
- [Edit taker](#edit-taker)
- [SDK events](#sdk-events)
- [Read methods](#read-methods)
- [Other methods](#other-methods)
- [Utilities](#utilities)
- [WebSocket provider](#websocket-provider)

## How The Swap Works

The following scheme describes visually how the swap logic works.

![how-swap-works-nfttrader](https://user-images.githubusercontent.com/98824505/153170940-22bbb678-beff-4f6f-ac27-b221a608a927.png)

Here is a more in depth explanation for the image above.
The swap "cycle" is composed by the following phases:

- Create swap phase (mandatory)
- Close swap phase (optional)
- Edit Taker phase (optional)
- Cancel swap phase (optional)

#### Create Swap Phase

The creation of the swap is marked as "mandatory" because it is the first operation you need to do in order to start the interaction with the system. When you are in this phase you can define the assets that will be included with the trades (ex. the Creator assets and the Taker assets), the Taker (Counterparty) of the swap, the duration and other parameters will be described in the next sections.
Once a user has created the swap, the NFT Trader Smart Contract will emit a `swapEvent` with some useful data you can track for fulfilling your needs.
Furthermore, the SDK will emit other events placed at the javascript level in order to give you the ability to avoid listening directly the events on the blockchain. These types of events will be described in the next sections.

#### Close Swap Phase

This phase is marked as "optional" since is not mandatory for the Taker (counterparty) of the swap to close it. The Taker could be a specific address or everyone (it depends how the swap is configured in the **Creation Swap phase**).
If the swap is to be closed by the Taker, the NFT Trader Smart Contract will emit a `swapEvent` with some useful data that you can track to fulfill your needs.
As for the **Creation Swap Phase**, the SDK will emit events placed at the javascript level in order to track the transaction status.

#### Edit Taker Phase

This phase is marked as "optional" since is not mandatory for the Creator to edit the Taker address. It could be useful for the Creator to edit the Taker if he wants to change the counterparty because he has found a new person interested with their deal. This phase can be performed only by the Creator of the swap and no one else.
Once a user has changed the Taker, the NFT Trader Smart Contract will emit a `counterpartEvent` with the data related to the new counterparty that will be involved in the swap. As for the **Creation Swap Phase**, the SDK will emit events placed at the javascript level in order to track the transaction status.

#### Cancel Swap Phase

This phase is marked as "optional" since it is not mandatory for the Creator to cancel the swap. Only the Creator can cancel a swap and no one else.
Once a user has changed the Taker, the NFT Trader Smart Contract will emit a `counterpartEvent` with the data related to the new counterparty involved in the swap.
As for the **Creation Swap Phase**, the SDK will emit events placed at the javascript level in order to track the transaction status.

## Initialize The NFTTraderSDK Object

In order to interact with the NFT Trader Smart Contract you will need to create a new instance of the `NFTTraderSDK` object.
There two basic ways to initialize this object because basically there are two possible scenarios.

- You are developing a Backend Platform (Node.js).
- You are developing a Single Page Application, a Website or a Plugin.

If you are developing a backend platform you can initialize the `NFTTraderSDK` object in this way.

```js
const sdk = new NFTTraderSDK({
  jsonRpcProvider : 'RPC_URL_PROVIDER', //example: infura
  network : 'NETWORK', //example: 'MAINNET', 'RINKEBY', 'KOVAN', 'POLYGON', 'MUMBAI', 'GOERLI', 'ROPSTEN', 'XDAI'
  signer : {
    privateKey : '<PRIVATE_KEY_OF_A_WALLET_OR_ACCOUNT>'
  },
  avoidPrivateKeySigner : false // this is optional parameter. If the value specified is true, the NFTTraderSDK will be able to read the data from the smart contract, not to send transactions. In this way you can avoid to specify the signer property during the initialization.
})

//start to perform operation with the sdk
sdk.method1(...)
sdk.method2(...)
```

Why do I need to specify a private key? Because in a backend environment you do not have a crypto wallet like Metamask or similar that can provide you a way to interact directly with the blockchain, by sending a transaction to a smart contract. This is why you will need to specify a private key. In order to be able to perform writing operations on the blockchain.
Provide the `privateKey` parameter is not mandatory. If you specify the `avoidPrivateKeySigner` parameter to `false`, you will be able to use the `NFTTraderSDK` object but only for performing read operations on the smart contract.

**IMPORTANT. WE NEVER STORE YOUR PRIVATE KEY. privateKey IS A READ-ONLY PARAMETER.**

If you are developing a Frontend Application (SPA), a Website or a Plugin you can initialize the `NFTTraderSDK` object in this manner.

```js
window.addEventListener('load', async () => {
  const sdk = new NFTTraderSDK({
    web3Provider : window.ethereum,
    network : 'NETWORK', //example: 'MAINNET', 'RINKEBY', 'KOVAN', 'POLYGON', 'MUMBAI', 'GOERLI', 'ROPSTEN', 'XDAI'
  })

  const ethers = sdk.getEthersJSInstance()
  provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])

  //start to perform operation with the sdk
  sdk.method1(...)
  sdk.method2(...)
})
```

Once you have initialized the `NFTTraderSDK` object you will be ready to perform write or read operations on the NFT Trader Smart Contract.

## Instance methods

The SDK will provide you the following list of methods:

###### - **createSwap(config[, gasLimit[, gasPrice]]) : Promise(void)**

###### - **closeSwap(config[, gasLimit[, gasPrice]]) : Promise(void)**

###### - **cancelSwap(swapId[, gasLimit[, gasPrice]]) : Promise(void)**

###### - **editTaker(swapId, addressTaker[, gasLimit[, gasPrice]]) : Promise(void)**

###### - **on(eventName, callbackFn) : void**

###### - **off(eventName[, callbackFn]) : void**

###### - **setBlocksNumberConfirmationRequired(blocksNumberConfirmationRequired) : void**

###### - **getSwapDetails(maker, swapId) : Promise(Object)**

###### - **getSwapAssets(swapId) : Promise(Object)**

###### - **isERC20WhiteListed(erc20Address) : Promise(boolean)**

###### - **isNFTBlacklisted(assetAddress) : Promise(boolean)**

###### - **getPayment() : Promise(Object)**

###### - **getReferenceAddress() : Promise(Object)**

###### - **isBannedAddress(address) : Promise(boolean)**

###### - **getEthersJSInstance() : Ethers**

## Create A Swap

In order to create a swap you can use the following method:

```js
const sdk = new NFTTraderSDK(....) //create the instance

await sdk.createSwap({
    ethMaker : 100000000000, //amount in wei placed by the creator of the swap (mandatory)
    taker : '0x87B96FE67F93bc795B7bb6957A4812DA1ec5e4Cf', //address of the taker (counterparty) of the swap. If you provide the value '0x0000000000000000000000000000000000000000' the swap can be closed by everyone (mandatory)
    ethTaker : 100000000000, //amount in wei placed by the taker of the swap (mandatory)
    swapEnd : 0, //number of days of validity of the swap. If not specified the value will be zero. Zero value means no time limit. (optional)
    assetsMaker : [], //Array of ERC721/1155/20 tokens placed by the creator of the swap. The default value is an empty array. The SDK provides utility methods to build this array. (optional)
    assetsTaker : [], //Array of ERC721/1155/20 tokens placed by the taker (counterparty) of the swap. The default value is an empty array. The SDK provides utility methods to build this array. (optional)
    referralAddress : '0x0000000000000000000000000000000000000000' //Can be an address of an account or a smart contract. Referral address utility will be explained in the next sections (optional)
  },
  gasLimit, //a numeric value expressed in wei that indicates the gas limit of the transaction. The default value is 2000000 (optional)
  gasPrice //a string value expressed in wei that indicates the gas price of the transaction. The default value is null (optional)
)
```

This method can emit 3 different types of events.

- [`createSwapTransactionCreated`](#createswaptransactioncreated)
- [`createSwapTransactionMined`](#createswaptransactionmined)
- [`createSwapTransactionError`](#createswaptransactionerror)

##### createSwapTransactionCreated

This is emitted when the transaction is created and it is waiting to be mined. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("createSwapTransactionCreated", ({ tx }) => {
  //make something
  //tx object is an instance of the class TransactionResponse. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse]
})
```

##### createSwapTransactionMined

This is emitted when the transaction is mined. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("createSwapTransactionMined", ({ receipt }) => {
  //receipt object is an instance of the class TransactionReceipt. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt]
  const events = param.receipt.events
  const event = events[0]
  const { _swapId } = event.args
  //do whatever you want
})
```

Intercepting the `createSwapTransactionMined` event can be very important if you want to extract the `swapId` value. This parameter is the unique identifier of the swap and it is needed by the `closeSwap`, `cancelSwap` or `editTaker` methods.
The alternative for tracking the `swapId` parameter could be listen the `swapEvent` directly on the blockchain.

##### createSwapTransactionError

This is emitted when an error occurs during the creation/mining of transaction process. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("createSwapTransactionError", ({ error, typeError }) => {
  //make something
  //typeError value can be: createSwapIntentError or waitError. The first one means the error is occured during the process creation of the transaction. The second one means the error is occured during the mining process of the transaction.
})
```

## Close A Swap

In order to close a swap you can use the following method:

```js
const sdk = new NFTTraderSDK(....) //create the instance

await sdk.closeSwap({
  maker : 'ADDRESS_OF_THE_MAKER', //address of the maker of the swap (mandatory)
  swapId : 0, //unique identifier of the swap (mandatory)
  referralAddress : '0x0000000000000000000000000000000000000000' //Can be an address of an account or a smart contract. Referral address utility will be explained in the next sections (optional)
  },
  gasLimit, //a numeric value expressed in wei that indicates the gas limit of the transaction. The default value is 2000000 (optional)
  gasPrice //a string value expressed in wei that indicates the gas price of the transaction. The default value is null (optional)
)
```

This method can emit 3 different types of events.

- [`closeSwapTransactionCreated`](#closeswaptransactioncreated)
- [`closeSwapTransactionMined`](#closeswaptransactionmined)
- [`closeSwapTransactionError`](#closeswaptransactionerror)

##### closeSwapTransactionCreated

This is emitted when the transaction is created and it is waiting to be mined. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("closeSwapTransactionCreated", ({ tx }) => {
  //make something
  //tx object is an instance of the class TransactionResponse. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse]
})
```

##### closeSwapTransactionMined

This is emitted when the transaction is mined. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("closeSwapTransactionMined", ({ receipt }) => {
  //make something
  //receipt object is an instance of the class TransactionReceipt. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt]
})
```

##### closeSwapTransactionError

This is emitted when an error occurs during the creation/mining of transaction process. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("closeSwapTransactionError", ({ error, typeError }) => {
  //make something
  //typeError value can be: closeSwapIntentError or waitError. The first one means the error is occured during the process creation of the transaction. The second one means the error is occured during the mining process of the transaction.
})
```

## Cancel A Swap

In order to cancel a swap you can use the following method:

```js
const sdk = new NFTTraderSDK(....) //create the instance

await sdk.cancelSwap(
  swapId, //unique identifier of the swap (mandatory)
  gasLimit, //a numeric value expressed in wei that indicates the gas limit of the transaction. The default value is 2000000 (optional)
  gasPrice //a string value expressed in wei that indicates the gas price of the transaction. The default value is null (optional)
)
```

This method can emit 3 different types of events.

- [`cancelSwapTransactionCreated`](#cancelswaptransactioncreated)
- [`cancelSwapTransactionMined`](#cancelswaptransactionmined)
- [`cancelSwapTransactionError`](#cancelswaptransactionerror)

##### cancelSwapTransactionCreated

This is emitted when the transaction is created and it is waiting to be mined. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("cancelSwapTransactionCreated", ({ tx }) => {
  //make something
  //tx object is an instance of the class TransactionResponse. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse]
})
```

##### cancelSwapTransactionMined

This is emitted when the transaction is mined. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("cancelSwapTransactionMined", ({ receipt }) => {
  //make something
  //receipt object is an instance of the class TransactionReceipt. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt]
})
```

The alternative for tracking this event could be listen the `swapEvent` directly on the blockchain.

##### cancelSwapTransactionError

This is emitted when an error occurs during the creation/mining of transaction process. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("cancelSwapTransactionError", ({ error, typeError }) => {
  //make something
  //typeError value can be: cancelSwapIntentError or waitError. The first one means the error is occured during the process creation of the transaction. The second one means the error is occured during the mining process of the transaction.
})
```

## Edit Taker

In order to edit the taker of a swap you can use the following method:

```js
const sdk = new NFTTraderSDK(....) //create the instance

await sdk.editTaker(
  swapId, //unique identifier of the swap (mandatory)
  addressTaker, //the address of the new taker of the swap (mandatory)
  gasLimit, //a numeric value expressed in wei that indicates the gas limit of the transaction. The default value is 2000000 (optional)
  gasPrice //a string value expressed in wei that indicates the gas price of the transaction. The default value is null (optional)
)
```

This method can emit 3 different types of events.

- [`editTakerTransactionCreated`](#edittakertransactioncreated)
- [`editTakerTransactionMined`](#edittakertransactionmined)
- [`editTakerTransactionError`](#edittakertransactionerror)

##### editTakerTransactionCreated

This is emitted when the transaction is created and it is waiting to be mined. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("editTakerTransactionCreated", ({ tx }) => {
  //make something
  //tx object is an instance of the class TransactionResponse. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse]
})
```

##### editTakerTransactionMined

This is emitted when the transaction is mined. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("editTakerTransactionMined", ({ receipt }) => {
  //make something
  //receipt object is an instance of the class TransactionReceipt. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt]
})
```

The alternative for tracking this event could be listen the `counterpartEvent` directly on the blockchain.

##### editTakerTransactionError

This is emitted when an error occurs during the creation/mining of transaction process. This event can be intercepted by the `on()` method (described in the next sections). Example:

```js
sdk.on("editTakerTransactionError", ({ error, typeError }) => {
  //make something
  //typeError value can be: editCounterpartError or waitError. The first one means the error is occured during the process creation of the transaction. The second one means the error is occured during the mining process of the transaction.
})
```

## SDK events

As we mentioned earlier, the SDK provides several ways to track events by saving the developer to listen directly the `swapEvent` or the `counterpartEvent` from the blockchain.
We have already seen the events which the SDK fires on the previous sections but here is a complete list:

- createSwapTransactionCreated
- createSwapTransactionMined
- createSwapTransactionError
- cancelSwapTransactionCreated
- cancelSwapTransactionMined
- cancelSwapTransactionError
- closeSwapTransactionCreated
- closeSwapTransactionMined
- closeSwapTransactionError
- editTakerTransactionCreated
- editTakerTransactionMined
- editTakerTransactionError

These events can be tracked using the `on()` method. Here is an implementation example of it.

```js
const sdk = new NFTTraderSDK(....)

sdk.on('createSwapTransactionCreated', async ({tx}) => {
  const txHash = tx.hash
  console.log('Transaction hash is ', txHash)
  await myApi.storeOnDB(txHash)
})

await sdk.createSwap(....) //naturally the on() must be called before the initialization of the related method from which we want to catch the event
```

Naturally, you can also remove the listener if you don't want to track the event anymore. It depends on the logic of your code.
Example:

```js
const sdk = new NFTTraderSDK(....)

sdk.on('createSwapTransactionCreated', async ({tx}) => {
  const txHash = tx.hash
  console.log('Transaction hash is ', txHash)
  await myApi.storeOnDB(txHash)
})

await sdk.createSwap(....) //naturally the on() must be called before the initialization of the related method from which we want to catch the event

//my logic
//E.g. creation of other swap etc etc

sdk.off('createSwapTransactionCreated') //remove all the listener
```

`.off()` has two parameters, the `eventName` and the `callbackFn`. The first one is mandatory and it represents the event that we want to remove from the listener. The second parameter is the callback function and it is optional. Specifying the second parameter can be useful if you want to remove just one listener without removing the others. Example:

```js
const sdk = new NFTTraderSDK(....)

sdk.on('createSwapTransactionCreated', async ({tx}) => {
  const txHash = tx.hash
  console.log('Transaction hash is ', txHash)
  await myApi.storeOnDB(txHash)
})

sdk.on('createSwapTransactionCreated', async ({tx}) => {
  console.log('bla bla')
})

await sdk.createSwap(....) //naturally the on() must be called before the initialization of the related method from which we want to catch the event

//my logic
//E.g. creation of other swap etc etc

sdk.off('createSwapTransactionCreated', async ({tx}) => {
  console.log('bla bla')
}) //remove just the listener with the specified callback function
```

## Read Methods

The SDK provides you several methods to get information from the NFT Trader Smart Contract. Here a list of read methods you can use.

##### getSwapDetails(maker, swapId) : Promise(Object)

Returns the major details of the swap. Example:

```js
const {
  id, //the swap unique identifier
  addressMaker, //the address of the maker
  discountMaker, //internal parameter used by the smart contract. For more info contact the team.
  valueMaker, //the amount in wei placed by the creator of the swap
  flatFeeMaker, //internal parameter used by the smart contract. For more info contact the team.
  addressTaker, //the address of the taker (counterparty)
  discountTaker, //internal parameter used by the smart contract. For more info contact the team.
  valueTaker, //the amount in wei placed by the counterpart of the swap
  flatFeeTaker, //internal parameter used by the smart contract. For more info contact the team.
  swapStart, //number indicating the date in which the swap was created
  swapEnd, //number indicating the date in which the swap was closed
  flagFlatFee, //internal parameter used by the smart contract. For more info contact the team.
  flagRoyalties, //internal parameter used by the smart contract. For more info contact the team.
  status, //status of the swap. 0 means opened, 1 means closed, 2 means canceled
  royaltiesMaker, //internal parameter used by the smart contract. For more info contact the team.
  royaltiesTaker, //internal parameter used by the smart contract. For more info contact the team.
} = await sdk.getSwapDetails(maker, swapId)
```

##### getSwapAssets(swapId) : Promise(Object)

Return the swap assets array details. The structure of these arrays will be explained in the next sections. Example:

```js
const swapId = 10 //example
const {
  assetsMaker, //the array of creator assets involved in the swap
  assetsTaker, //the array of taker assets involved in the swap
} = await sdk.getSwapAssets(swapId)
```

##### isERC20WhiteListed(erc20Address) : Promise(boolean)

Return `true` or `false` if the ERC20 token is whitelisted by the NFT Trader Smart Contract. Example:

```js
const isWhitelisted = await sdk.isERC20WhiteListed(
  "0xdac17f958d2ee523a2206206994597c13d831ec7"
) //Tether token
```

##### isNFTBlacklisted(assetAddress) : Promise(boolean)

Return `true` or `false` if the ERC721/1155 token is blacklisted by the NFT Trader Smart Contract. Example:

```js
const isBlacklisted = await sdk.isNFTBlacklisted(
  "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
) //BAYC
```

##### getPayment() : Promise(Object)

Return an object representing the payment configuration of the NFT Trader Smart Contract. Example:

```js
const {
  //these parameters are intended to be used internally by the smart contract. Contact the team if you want more information about it.
  flagFlatFee,
  flagRoyalties,
  flatFee,
  bps,
  scalePercent,
} = await sdk.getPayment()
```

##### getReferenceAddress() : Promise(Object)

Return an object representing the reference address configuration of the NFT Trader Smart Contract. Example:

```js
const {
  //these parameters are intended to be used internally by the smart contract. Contact the team if you want more information about it.
  ROYALTYENGINEADDRESS,
  TRADESQUAD,
  PARTNERSQUAD,
  VAULT,
} = await sdk.getReferenceAddress()
```

##### isBannedAddress(address) : Promise(boolean)

Return `true` or `false` if the msg.sender is banned by the NFT Trader Smart Contract. Example:

```js
const isBanned = await sdk.isNFTBlacklisted(
  "0x87B96FE67F93bc795B7bb6957A4812DA1ec5e4Cf"
) //a random address account
```

## Other methods

The SDK provides you other useful methods.

##### getEthersJSInstance() : Ethers

Return an Ether object instance you can use for interacting with the blockchain. Example:

```js
const ethers = sdk.getEthersJSInstance()
```

##### setBlocksNumberConfirmationRequired(blocksNumberConfirmationRequired) : void

Set the blocks confirmation number used to consider a transaction mined. Example:

```js
sdk.setBlocksNumberConfirmationRequired(10) //the confirmation number cannot be lower than one.

sdk.on("createSwapTransactionMined", ({ tx }) => {
  //this event will be fired after 10 blocks will be mined on the blockchain
})
```

## Utilities

The SDK provides you a utility class object for building the `assetsMaker` or the `assetsTaker` arrays useful for the `createSwap` method.
In order to build these two kinds of arrays there is a utility class called `AssetsArray`.

To create an instance of `AssetsArray` object you can do so in the following way:

```js
const sdk = new NFTTraderSDK(....)

const assetsArray = new sdk.AssetsArray()
```

`AssetsArray` class provide you the following methods:

###### - **addERC20Asset(address, tokenAmount) : void**

###### - **addERC721Asset(address, tokenIds) : void**

###### - **addERC1155Asset(address, tokenIds, tokenAmounts) : void**

###### - **clearAssetsArray() : void**

###### - **getAssetsArray() : void**

Let's see in details what these methods provide.

##### addERC20Asset(address, tokenAmount) : void

Adding an ERC20 token and the relative amount to the AssetsArray object. The token amount **must be formatted** correctly before passing it onto this method. The SDK will not perform any conversion based on the decimals of the token.

Let's see an example of implementation.

```js
const sdk = new NFTTraderSDK(....)
const assetsArray = new sdk.AssetsArray()

assetsArray.addERC20Asset('0x6b175474e89094c44da98b954eedeac495271d0f', 10000000000000000000) //the address of the token is DAI token. An ERC20 with 18 decimals. The amount passed as parameter is 10 DAI
```

##### addERC721Asset(address, tokenIds) : void

Adding an ERC721 token and the relative token ids to the AssetsArray object. `tokenIds` parameter must be an array with at least one element inside it.

Let's see an example of implementation.

```js
const sdk = new NFTTraderSDK(....)
const assetsArray = new sdk.AssetsArray()

assetsArray.addERC721Asset('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', [1,3456]) //the address of the token is BAYC NFT. we're adding to the array of assets the token ids number 1 and 3456.
```

##### addERC1155Asset(address, tokenIds, tokenAmounts) : void

Adding an ERC1155 token, the relative token ids and amounts to the AssetsArray object. `tokenIds` parameter must be an array with at least one element inside it. `tokenAmounts` must be an array with at least one element inside it. The size of `tokenIds` and `tokenAmounts` array must be equal.

Let's see an example of implementation.

```js
const sdk = new NFTTraderSDK(....)
const assetsArray = new sdk.AssetsArray()

assetsArray.addERC1155Asset('0xedb61f74b0d09b2558f1eeb79b247c1f363ae452', [1,3456], [1,1]) //the address of the token is GUTTER CAT GANG NFT. we're adding to the array of assets the token ids number 1 and 3456. The amount related to the token number 1 and 3456 are both 1.
```

##### clearAssetsArray() : void

Clear the assets array object. It erases everything you have inputted before.

Let's see an example of implementation.

```js
const sdk = new NFTTraderSDK(....)
const assetsArray = new sdk.AssetsArray()

assetsArray.addERC20Asset('0x6b175474e89094c44da98b954eedeac495271d0f', 10000000000000000000)
assetsArray.addERC721Asset('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', [1,3456])
assetsArray.addERC1155Asset('0xedb61f74b0d09b2558f1eeb79b247c1f363ae452', [1,3456], [1,1])

assetsArray.clearAssetsArray() //clear everything you've putted before in the AssetsArray instance
```

##### getAssetsArray() : void

Returns the assets array.

Let's see an example of implementation.

```js
const sdk = new NFTTraderSDK(....)
const assetsArrayMaker = new sdk.AssetsArray()
const assetsArrayTaker = new sdk.AssetsArray()

assetsArrayMaker.addERC20Asset('0x6b175474e89094c44da98b954eedeac495271d0f', 10000000000000000000)
assetsArrayMaker.addERC721Asset('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', [1,3456])
assetsArrayMaker.addERC1155Asset('0xedb61f74b0d09b2558f1eeb79b247c1f363ae452', [1,3456], [1,1])

assetsArrayTaker.addERC20Asset('0x6b175474e89094c44da98b954eedeac495271d0f', 10000000000000000000)
assetsArrayTaker.addERC721Asset('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', [230,12])

const assetsMaker = assetsArrayMaker.getAssetsArray() //returns the array of assets for the maker
const assetsTaker = assetsArrayTaker.getAssetsArray() //returns the array of assets for the taker

await sdk.createSwap({
  .
  .
  assetsMaker : assetsMaker,
  assetsTaker : assetsTaker
})
```

## WebSocket provider

The SDK also provides a way to interact directly with the event emitted by the NFT Trader Smart Contract. The interactions are made through the `WebSocketProvider` object.
To create an instance of `WebSocketProvider` object you can do so in the following way:

```js
const sdk = new NFTTraderSDK(....)

const webSocketProvider = new sdk.WebSocketProvider({
  wssUrl : 'URL_OF_WEBSOCKET_PROVIDER',
  network : 'NETWORK'
})
```

`WebSocketProvider` class provides you the following methods:

###### - **onSwapEvent(callbackFn[, config]) : void**

###### - **onCounterpartEvent(callbackFn[, config]) : void**

###### - **onPaymentReceived(callbackFn[, config]) : void**

Let's see in the details what these methods provide.

##### onSwapEvent(callbackFn[, config]) : void

Add a listener through a websocket directly on the smart contract. This method will tracks every `swapEvent` emitted by the NFT Trader Smart Contract. Optionally, you can filter which `swapEvent` track by specifying the `config` object. `config` object it is used internally to filter the events with topics. The `swapEvent` is fired during the creation of the swap, the closing of the swap or when a user cancels a swap.

```js
const sdk = new NFTTraderSDK(....)
const webSocketProvider = new sdk.WebSocketProvider(....)

webSocketProvider.onSwapEvent(function () {
  //callback function fired once the swapEvent it is fired
}, {
  creator : '', //the address of the creator of the swap or the taker
  time : 1234567, //number indicating the UNIX date in which the swap is occured
  status : 1 //the status of the swap you want to track. 0 means Opened, 1 means Closed, 2 means Canceled
})
```

##### onCounterpartEvent(callbackFn[, config]) : void

Add a listener through a websocket directly on the smart contract. This method will tracks every `counterpartEvent` emitted by the NFT Trader Smart Contract. Optionally, you can filter which `counterpartEvent` track by specifying the `config` object. `config` object it is used internally to filter the events with topics. The `counterpartEvent` is fired when a user decides to edit the taker of the swap.

```js
const sdk = new NFTTraderSDK(....)
const webSocketProvider = new sdk.WebSocketProvider(....)

webSocketProvider.onCounterpartEvent(function () {
  //callback function fired once the counterpartEvent it is fired
}, {
  swapId : 100, //swap id to filter
  counterpart : '' //address to filter
})
```

##### onPaymentReceived(callbackFn[, config]) : void

Add a listener through a websocket directly on the smart contract. This method will track every `paymentReceived` emitted by the NFT Trader Smart Contract. Optionally, you can filter which `paymentReceived` track by specifying the `config` object. `config` object it is used internally to filter the events with topics. The `paymentReceived` is fired when a user deposits Ether on the smart contract.

```js
const sdk = new NFTTraderSDK(....)
const webSocketProvider = new sdk.WebSocketProvider(....)

webSocketProvider.onPaymentReceived(function () {
  //callback function fired once the paymentReceived it is fired
}, {
  payer : '' //address of the payer to filter
})
```

## Credits

This SDK is the property of Salad Labs Inc.
Every unauthorized copy or distribution is stricly forbidden without the consent of Salad Labs Inc.
This SDK is protected by Copyright Property and Propietary Laws.
