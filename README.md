# NFT Trader Javascript SDK

Welcome to the official repository of NFT Trader platform.
This package's target is to give developers the possibility to include the NFT Trader technology inside external DApps (Decentralized Applications) unlocking the possibility to swap NFTs and ERC20 tokens directly in their platform.

The package is available for Node.js and for browser platforms.

## Installation

Using npm:
```sh
npm install @nfttrader/sdk-js
```

Using unpkg CDN:
```html
<script src = "https://unpkg.com/nfttrader/dist/nfttrader-sdk.min.js"></script>
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

The ```NFTTraderSDK``` class object is the way in which you can interact with the NFT Trader Smart Contract in a easier way. It contains a set of methods that allow you to simplify the interaction process with the blockchain.
The SDK is compatible on the following blockchains:
- Ethereum Mainnet
- Ethereum Rinkeby
- Ethereum Ropsten
- Ethereum Kovan
- Ethereum Goerli
- Polygon
- Polygon Mumbai
- xDai chain (Gnosis chain)

### What can i do with this SDK?

With the NFT Trader Javascript SDK you can create a swap order, finalize a swap order, edit the taker of the order or cancel a swap order. Furthermore it provides you some utilities methods to read details of the order book, listen specific events of the smart contract or helpers function in order to help you to provide to NFT Trader Smart Contract the parameters formatted in the right way.
We'll describe better everything in the next sections, so don't worry if you can't understand all from the beginning 🤓

But the final target is very simple, once you will learn how to master the SDK, you will be able to include these sets of functionalities directly in your platform and enable the swap feature of NFTs and ERC20 tokens. This is very interesting, specially if you are planning to build a game based on the swap feature or a marketplace in which you want to integrate a way to swap assets between your users.

## Table of contents

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

## How the swap works

The following scheme describe visually how the swap logic works.

![how-swap-works-nfttrader](https://user-images.githubusercontent.com/98824505/153170940-22bbb678-beff-4f6f-ac27-b221a608a927.png)

Let's try to explain better the image above.
The swap "cycle" is composed by the following phases:

- Create swap phase (mandatory)
- Close swap phase (optional)
- Edit Taker phase (optional)
- Cancel swap phase (optional)

#### Create swap phase

The creation of the swap is marked as "mandatory" because it is the first operation you need to do in order to start to interact with the system. When you are in this phase you can define the assets that will be involved in the trades (so the creator assets and the taker assets), the taker (counterparty) of the swap, a duration and other parameters that will be described in the next sections.
Once a user has created the swap, the NFT Trader Smart Contract will emit a ```swapEvent``` with some useful data you can track for satisfying your needs.
Furthermore, the SDK will emit other events placed on the javascript level in order to give you the possibility to avoid to listen directly the event on the blockchain. These types of events will be described in the next sections.

#### Close swap phase

This phase is marked as "optional" since is not mandatory for the taker (counterparty) of the swap to close it. The taker could be a specific address or everyone (it depends how the swap was configured in the **Creation Swap phase**). 
If the swap will be closed by the taker the NFT Trader Smart Contract will emit a ```swapEvent``` with some useful data you can track for satisfying your needs.
As for the **Creation Swap phase**, the SDK will emit events placed on the javascript level in order to track the transaction status.

#### Edit Taker phase

This phase is marked as "optional" since is not mandatory for the creator to edit the taker address. It could be useful for the creator to edit the taker if he wants to change the counterparty because he has found a new person interested on the deal. This phase can be performed only by the creator of the swap and no one else.
Once a user has changed the taker the NFT Trader Smart Contract will emit a ```counterpartEvent``` with the data related to the new counterparty involved in the swap.
As for the **Creation Swap phase**, the SDK will emit events placed on the javascript level in order to track the transaction status.

#### Cancel swap phase

This phase is marked as "optional" since it is not mandatory for the creator cancel the swap. Only the creator can cancel a swap and no one else.
Once a user has changed the taker the NFT Trader Smart Contract will emit a ```counterpartEvent``` with the data related to the new counterparty involved in the swap.
As for the **Creation Swap phase**, the SDK will emit events placed on the javascript level in order to track the transaction status.

## Initialize the NFTTraderSDK object

To interact with the NFT Trader Smart Contract you need to create a new instance of the ```NFTTraderSDK``` object. 
There two basic way to initialize this object because there are two possible scenario basically.

- You are developing a backend platform (Node.js).
- You are developing a Single Page Application or a website or a plugin.

If you are developing a backend platform you can initialize the ```NFTTraderSDK``` object in this way.

```js
const sdk = new NFTTraderSDK({
  jsonRpcProvider : 'RPC_URL_PROVIDER', //example: infura 
  network : 'NETWORK', //example: 'RINKEBY', 'MAINNET', 'KOVAN', 'POLYGON', etc. 
  signer : {
    privateKey : '<PRIVATE_KEY_OF_A_WALLET_OR_ACCOUNT>'
  }, 
  avoidPrivateKeySigner : false // this is optional parameter. If the value specified is true, the NFTTraderSDK will be able to read the data from the smart contract, not to send transactions. In this way you can avoid to specify the signer property during the initialization.
})

//start to perform operation with the sdk
sdk.method1(...)
sdk.method2(...)
```

Why i need to specify a private key? Because in a backend environment you haven't a wallet like Metamask or similar that can provide you a way to interact directly with the blockchain by sending a transaction to a smart contract. This is why you need to specify a private key, in order to be able to perform writing operation on the blockchain.
Provide the ```privateKey``` parameter is not mandatory. If you specify the ```avoidPrivateKeySigner``` parameter to ```false```, you will be able to use the ```NFTTraderSDK``` object but only for performing reading operation on the smart contract.

**IMPORTANT. WE NEVER STORE YOUR PRIVATE KEY. privateKey IS A READ-ONLY PARAMETER.**

If you are developing a frontend application (SPA), a website or a plugin you can initialize the ```NFTTraderSDK``` object in this way.

```js
window.addEventListener('load', async () => {
  const sdk = new NFTTraderSDK({
    web3Provider : window.ethereum,
    network : 'NETWORK', //example: 'RINKEBY', 'MAINNET', 'KOVAN', 'POLYGON', etc. 
  })
  
  const ethers = sdk.getEthersJSInstance()
  provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  
  //start to perform operation with the sdk
  sdk.method1(...)
  sdk.method2(...)
})
```

Once you have initialized the ```NFTTraderSDK``` object you will be ready to perform write or read operations on the NFT Trader Smart Contract.

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

## Create a swap

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

This method can emits 3 different types of event.

- [```createSwapTransactionCreated```](#createswaptransactioncreated)
- [```createSwapTransactionMined```](#createswaptransactionmined)
- [```createSwapTransactionError```](#createswaptransactionerror)

##### createSwapTransactionCreated

It's emitted when the transaction is created and it is waiting to be mined. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('createSwapTransactionCreated', ({tx}) => {
  //make something
  //tx object is an instance of the class TransactionResponse. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse]
})
```

##### createSwapTransactionMined

It's emitted when the transaction is mined. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('createSwapTransactionMined', ({receipt}) => {
  //receipt object is an instance of the class TransactionReceipt. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt]
  const events = param.receipt.events
  const event = events[0]
  const {_swapId} = event.args
  //do whatever you want
})
```

Intercepting the ```createSwapTransactionMined``` event can be very important if you want to extract the ```swapId``` value. This parameter it's the unique identifier of the swap and it's needed by the ```closeSwap```, ```cancelSwap``` or ```editTaker``` methods.
The alternative for tracking the ```swapId``` parameter could be listen the ```swapEvent``` directly on the blockchain.

##### createSwapTransactionError

It's emitted when an error occurs during the creation/mining of transaction process. This event can be intercepted by the ```on()``` method (described in the next sections). Example:


```js
sdk.on('createSwapTransactionError', ({error, typeError}) => {
  //make something
  //typeError value can be: createSwapIntentError or waitError. The first one means the error is occured during the process creation of the transaction. The second one means the error is occured during the mining process of the transaction.
})
```

## Close a swap

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

This method can emits 3 different types of event.

- [```closeSwapTransactionCreated```](#closeswaptransactioncreated)
- [```closeSwapTransactionMined```](#closeswaptransactionmined)
- [```closeSwapTransactionError```](#closeswaptransactionerror)

##### closeSwapTransactionCreated

It's emitted when the transaction is created and it is waiting to be mined. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('closeSwapTransactionCreated', ({tx}) => {
  //make something
  //tx object is an instance of the class TransactionResponse. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse]
})
```

##### closeSwapTransactionMined

It's emitted when the transaction is mined. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('closeSwapTransactionMined', ({receipt}) => {
  //make something
  //receipt object is an instance of the class TransactionReceipt. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt]
})
```

##### closeSwapTransactionError

It's emitted when an error occurs during the creation/mining of transaction process. This event can be intercepted by the ```on()``` method (described in the next sections). Example:


```js
sdk.on('closeSwapTransactionError', ({error, typeError}) => {
  //make something
  //typeError value can be: closeSwapIntentError or waitError. The first one means the error is occured during the process creation of the transaction. The second one means the error is occured during the mining process of the transaction.
})
```

## Cancel a swap

In order to cancel a swap you can use the following method:

```js
const sdk = new NFTTraderSDK(....) //create the instance

await sdk.cancelSwap(
  swapId, //unique identifier of the swap (mandatory) 
  gasLimit, //a numeric value expressed in wei that indicates the gas limit of the transaction. The default value is 2000000 (optional)
  gasPrice //a string value expressed in wei that indicates the gas price of the transaction. The default value is null (optional)
)
```

This method can emits 3 different types of event.

- [```cancelSwapTransactionCreated```](#cancelswaptransactioncreated)
- [```cancelSwapTransactionMined```](#cancelswaptransactionmined)
- [```cancelSwapTransactionError```](#cancelswaptransactionerror)

##### cancelSwapTransactionCreated

It's emitted when the transaction is created and it is waiting to be mined. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('cancelSwapTransactionCreated', ({tx}) => {
  //make something
  //tx object is an instance of the class TransactionResponse. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse]
})
```

##### cancelSwapTransactionMined

It's emitted when the transaction is mined. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('cancelSwapTransactionMined', ({receipt}) => {
  //make something
  //receipt object is an instance of the class TransactionReceipt. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt]
})
```

The alternative for tracking this event could be listen the ```swapEvent``` directly on the blockchain.

##### cancelSwapTransactionError

It's emitted when an error occurs during the creation/mining of transaction process. This event can be intercepted by the ```on()``` method (described in the next sections). Example:


```js
sdk.on('cancelSwapTransactionError', ({error, typeError}) => {
  //make something
  //typeError value can be: cancelSwapIntentError or waitError. The first one means the error is occured during the process creation of the transaction. The second one means the error is occured during the mining process of the transaction.
})
```

## Edit taker

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

This method can emits 3 different types of event.

- [```editTakerTransactionCreated```](#edittakertransactioncreated)
- [```editTakerTransactionMined```](#edittakertransactionmined)
- [```editTakerTransactionError```](#edittakertransactionerror)

##### editTakerTransactionCreated

It's emitted when the transaction is created and it is waiting to be mined. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('editTakerTransactionCreated', ({tx}) => {
  //make something
  //tx object is an instance of the class TransactionResponse. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse]
})
```

##### editTakerTransactionMined

It's emitted when the transaction is mined. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('editTakerTransactionMined', ({receipt}) => {
  //make something
  //receipt object is an instance of the class TransactionReceipt. For more info visit the ethers js docs [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt]
})
```

The alternative for tracking this event could be listen the ```counterpartEvent``` directly on the blockchain.

##### editTakerTransactionError

It's emitted when an error occurs during the creation/mining of transaction process. This event can be intercepted by the ```on()``` method (described in the next sections). Example:

```js
sdk.on('editTakerTransactionError', ({error, typeError}) => {
  //make something
  //typeError value can be: editCounterpartError or waitError. The first one means the error is occured during the process creation of the transaction. The second one means the error is occured during the mining process of the transaction.
})
```

## SDK events

As we mentioned before, the SDK provides several way to track events by saving the developer to listen directly the ```swapEvent``` or the ```counterpartEvent``` from the blockchain.
We already seen the events the SDK fires on the previous sections but here it is a complete list:

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

These events can be tracked using the ```on()``` method. Here an example of implementation of it.

```js
const sdk = new NFTTraderSDK(....)

sdk.on('createSwapTransactionCreated', async ({tx}) => {
  const txHash = tx.hash
  console.log('Transaction hash is ', txHash)
  await myApi.storeOnDB(txHash)
})

await sdk.createSwap(....) //naturally the on() must be called before the initialization of the related method from which we want to catch the event
```

Naturally you can also remove the listener if you don't want to track the event anymore. It depends by the logic of your code.
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

```.off()``` has two parameters, the ```eventName``` and the ```callbackFn```. The first one is mandatory and it represents the event we want to remove from the listener. The second parameter is the callback function and it is optional. Specifying the second parameter can be useful if we want to remove just one listener without removing the others. Example:

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

