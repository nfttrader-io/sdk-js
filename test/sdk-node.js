require('dotenv').config()

const chai = require('chai')
const NFTTraderSDK = require('../src/index')

const assert = chai.assert
const NETWORK = process.env.NETWORK
const PROVIDER = process.env.PROVIDER
const PK_SIGNER = process.env.PK_SIGNER
const PK_SIGNER_TAKER = process.env.PK_SIGNER_TAKER
const ADDRESS_MAKER = process.env.ADDRESS_MAKER
const ADDRESS_TAKER = process.env.ADDRESS_TAKER
const SWAP_ID = process.env.SWAP_ID

describe('SDK Tests -> tests are running on ' + NETWORK + ' network.', function() {
  let sdk

  before(function() {
    // runs once before the first test in this block
    sdk = new NFTTraderSDK({
      jsonRpcProvider : PROVIDER,
      network : NETWORK,
      signer : {
        privateKey : PK_SIGNER
      }
    })
  })

  describe('[READ FUNCTIONS]', function() {
    it('getReferenceAddress() should be ok', async function() {
      const {ROYALTYENGINEADDRESS, TRADESQUAD, PARTNERSQUAD, VAULT} = await sdk.getReferenceAddress()
      
      assert.typeOf(ROYALTYENGINEADDRESS, 'string')
      assert.typeOf(TRADESQUAD, 'string')
      assert.typeOf(PARTNERSQUAD, 'string')
      assert.typeOf(VAULT, 'string')
      assert.lengthOf(ROYALTYENGINEADDRESS, 42)
      assert.lengthOf(TRADESQUAD, 42)
      assert.lengthOf(PARTNERSQUAD, 42)
      assert.lengthOf(VAULT, 42)
    }).timeout(100000)

    it('getPayment() should be ok', async function() {
      const {flagFlatFee, flagRoyalties, flatFee, bps, scalePercent} = await sdk.getPayment()

      assert.typeOf(flagFlatFee, 'boolean')
      assert.typeOf(flagRoyalties, 'boolean')
      assert.isNotNull(flatFee)
      assert.isNotNull(bps)
      assert.isNotNull(scalePercent)
    }).timeout(100000)

    it('isBannedAddress() should be ok', async function () {
      const bannedAddress = await sdk.isBannedAddress('0xD67df04F318B1675416482F0029c55a9fF259D11')
      assert.typeOf(bannedAddress, 'boolean')
    }).timeout(100000)

    it('isERC20WhiteListed() should be ok', async function () {
      const isWhitelisted = await sdk.isERC20WhiteListed('0xD67df04F318B1675416482F0029c55a9fF259D11')
      assert.typeOf(isWhitelisted, 'boolean')
    }).timeout(100000)

    it('isNFTBlacklisted() should be ok', async function () {
      const isBlacklisted = await sdk.isNFTBlacklisted('0xD67df04F318B1675416482F0029c55a9fF259D11')
      assert.typeOf(isBlacklisted, 'boolean')
    }).timeout(100000)

    it('getSwapDetails() should be ok', async function () {
      const { id, addressMaker, discountMaker, valueMaker, flatFeeMaker, addressTaker, discountTaker, valueTaker, flatFeeTaker, swapStart, swapEnd, flagFlatFee, flagRoyalties, status, royaltiesMaker, royaltiesTaker } = await sdk.getSwapDetails(ADDRESS_MAKER, Number(SWAP_ID))
      
      assert.isNotNull(id)
      assert.isNotNull(addressMaker)
      assert.isNotNull(discountMaker)
      assert.isNotNull(valueMaker)
      assert.isNotNull(flatFeeMaker)
      assert.isNotNull(addressTaker)
      assert.isNotNull(discountTaker)
      assert.isNotNull(valueTaker)
      assert.isNotNull(flatFeeTaker)
      assert.isNotNull(swapStart)
      assert.isNotNull(swapEnd)
      assert.isNotNull(flagFlatFee)
      assert.isNotNull(flagRoyalties)
      assert.isNotNull(status)
      assert.isNotNull(royaltiesMaker)
      assert.isNotNull(royaltiesTaker)
    }).timeout(100000)

    it('getSwapAssets() should be ok', async function () {
      const {assetsMaker, assetsTaker} = await sdk.getSwapAssets(Number(SWAP_ID))
      
      assert.isNotNull(assetsMaker)
      assert.isNotNull(assetsTaker)
    }).timeout(100000)
    
  })

  describe('[WRITE FUNCTIONS]', function() {
    it('createSwap() & editTaker() & cancelSwap() should be ok', async function () {
      sdk.on('createSwapTransactionMined', async (param) => {
        const events = param.receipt.events
        const event = events[0]
        const {_swapId} = event.args

        sdk.on('cancelSwapTransactionMined', function (param) {
          assert.isNotNull(param)
        })
        
        await sdk.editTaker(_swapId.toNumber(), '0xc38C7EfA39e009564342634CC33ddbe766b7aAdE')
        await sdk.cancelSwap(_swapId.toNumber())
      })
      
      await sdk.createSwap({
        ethMaker : 10000000000000000, 
        taker : ADDRESS_TAKER, 
        ethTaker : 10000000000000000, 
        swapEnd : 0
      })
    }).timeout(1000000000)

    it('createSwap() & closeSwap() should be ok', async function () {
      sdk.on('createSwapTransactionMined', async (param) => {
        const maker = param.receipt.from
        const events = param.receipt.events
        const event = events[0]
        const {_swapId} = event.args
        
        const sdkCloser = new NFTTraderSDK({
          jsonRpcProvider : PROVIDER,
          network : NETWORK,
          signer : {
            privateKey : PK_SIGNER_TAKER
          }
        })

        sdkCloser.on('closeSwapTransactionMined', function (param) {
          assert.isNotNull(param)
        })

        await sdkCloser.closeSwap({maker, swapId : _swapId.toNumber()})
      })
      
      await sdk.createSwap({
        ethMaker : 10000000000000000, 
        taker : ADDRESS_TAKER, 
        ethTaker : 10000000000000000, 
        swapEnd : 0
      })
    }).timeout(1000000000)
  })
})