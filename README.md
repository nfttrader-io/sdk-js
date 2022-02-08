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
<script src = "https://unpkg.com/axios/dist/nfttrader-sdk.min.js"></script>
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

- [How the swap works?](#how-the-swap-works?)
- [Initialize the NFTTraderSDK object](#initialize-the-nfttradersdk-object)
- [Create a swap](#create-a-swap)
- [Close a swap](#close-a-swap)
- [Cancel a swap](#cancel-a-swap)
- [Edit taker](#edit-taker)

## How the swap works?

The following scheme describe visually how the swap logic works.

