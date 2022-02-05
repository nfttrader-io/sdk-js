const swap = {
    MAINNET: '',
    RINKEBY: '0xa562d875A22425FE6685dB46d6D39c8d458D3805',
    ROPSTEN: '',
    GOERLI: '',
    KOVAN: '',
    IMMUTABLE: '',
    POLYGON: '',
    XDAI: ''
}

const contractAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_swapId","type":"uint256"},{"indexed":true,"internalType":"address","name":"_counterpart","type":"address"}],"name":"counterpartEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_payer","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"paymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_creator","type":"address"},{"indexed":true,"internalType":"uint256","name":"_time","type":"uint256"},{"indexed":true,"internalType":"enumNFTTraderSwapRoyalties.swapStatus","name":"_status","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"_swapId","type":"uint256"},{"indexed":false,"internalType":"address","name":"_counterpart","type":"address"},{"indexed":false,"internalType":"address","name":"_referral","type":"address"}],"name":"swapEvent","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"bannedAddress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"payment","outputs":[{"internalType":"bool","name":"flagFlatFee","type":"bool"},{"internalType":"bool","name":"flagRoyalties","type":"bool"},{"internalType":"uint256","name":"flatFee","type":"uint256"},{"internalType":"uint256","name":"bps","type":"uint256"},{"internalType":"uint256","name":"scalePercent","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"referenceAddress","outputs":[{"internalType":"address","name":"ROYALTYENGINEADDRESS","type":"address"},{"internalType":"address","name":"TRADESQUAD","type":"address"},{"internalType":"address","name":"PARTNERSQUAD","type":"address"},{"internalType":"addresspayable","name":"VAULT","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive","payable":true},{"inputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"addresspayable","name":"addressMaker","type":"address"},{"internalType":"bool","name":"discountMaker","type":"bool"},{"internalType":"uint256","name":"valueMaker","type":"uint256"},{"internalType":"uint256","name":"flatFeeMaker","type":"uint256"},{"internalType":"addresspayable","name":"addressTaker","type":"address"},{"internalType":"bool","name":"discountTaker","type":"bool"},{"internalType":"uint256","name":"valueTaker","type":"uint256"},{"internalType":"uint256","name":"flatFeeTaker","type":"uint256"},{"internalType":"uint256","name":"swapStart","type":"uint256"},{"internalType":"uint256","name":"swapEnd","type":"uint256"},{"internalType":"bool","name":"flagFlatFee","type":"bool"},{"internalType":"bool","name":"flagRoyalties","type":"bool"},{"internalType":"enumNFTTraderSwapRoyalties.swapStatus","name":"status","type":"uint8"},{"internalType":"uint256","name":"royaltiesMaker","type":"uint256"},{"internalType":"uint256","name":"royaltiesTaker","type":"uint256"}],"internalType":"structNFTTraderSwapRoyalties.swapIntent","name":"_swapIntent","type":"tuple"},{"components":[{"internalType":"address","name":"dapp","type":"address"},{"internalType":"enumNFTTraderSwapRoyalties.typeStd","name":"typeStd","type":"uint8"},{"internalType":"uint256[]","name":"tokenId","type":"uint256[]"},{"internalType":"uint256[]","name":"blc","type":"uint256[]"},{"internalType":"uint256[]","name":"roy","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"structNFTTraderSwapRoyalties.swapStruct[]","name":"_nftsMaker","type":"tuple[]"},{"components":[{"internalType":"address","name":"dapp","type":"address"},{"internalType":"enumNFTTraderSwapRoyalties.typeStd","name":"typeStd","type":"uint8"},{"internalType":"uint256[]","name":"tokenId","type":"uint256[]"},{"internalType":"uint256[]","name":"blc","type":"uint256[]"},{"internalType":"uint256[]","name":"roy","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"structNFTTraderSwapRoyalties.swapStruct[]","name":"_nftsTaker","type":"tuple[]"},{"internalType":"address","name":"_referral","type":"address"}],"name":"createSwapIntent","outputs":[],"stateMutability":"payable","type":"function","payable":true},{"inputs":[{"internalType":"address","name":"_swapCreator","type":"address"},{"internalType":"uint256","name":"_swapId","type":"uint256"},{"internalType":"address","name":"_referral","type":"address"}],"name":"closeSwapIntent","outputs":[],"stateMutability":"payable","type":"function","payable":true},{"inputs":[{"internalType":"uint256","name":"_swapId","type":"uint256"}],"name":"cancelSwapIntent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_engineAddress","type":"address"},{"internalType":"address","name":"_tradeSquad","type":"address"},{"internalType":"address","name":"_partnerSquad","type":"address"},{"internalType":"addresspayable","name":"_vault","type":"address"}],"name":"setReferenceAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_flagFlatFee","type":"bool"},{"internalType":"uint256","name":"_flatFee","type":"uint256"},{"internalType":"bool","name":"_flagRoyalties","type":"bool"},{"internalType":"uint256","name":"_bps","type":"uint256"},{"internalType":"uint256","name":"_scalePercent","type":"uint256"}],"name":"setPaymentStruct","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_dapp","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"setERC20Whitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_dapp","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"setNFTBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_swapId","type":"uint256"},{"internalType":"addresspayable","name":"_counterPart","type":"address"}],"name":"editCounterPart","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipRoyaltiesState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"flipBannedAddressState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_paused","type":"bool"}],"name":"pauseContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getERC20WhiteList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"getNFTBlacklist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_creator","type":"address"},{"internalType":"uint256","name":"_swapId","type":"uint256"}],"name":"getSwapIntentByAddress","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"addresspayable","name":"addressMaker","type":"address"},{"internalType":"bool","name":"discountMaker","type":"bool"},{"internalType":"uint256","name":"valueMaker","type":"uint256"},{"internalType":"uint256","name":"flatFeeMaker","type":"uint256"},{"internalType":"addresspayable","name":"addressTaker","type":"address"},{"internalType":"bool","name":"discountTaker","type":"bool"},{"internalType":"uint256","name":"valueTaker","type":"uint256"},{"internalType":"uint256","name":"flatFeeTaker","type":"uint256"},{"internalType":"uint256","name":"swapStart","type":"uint256"},{"internalType":"uint256","name":"swapEnd","type":"uint256"},{"internalType":"bool","name":"flagFlatFee","type":"bool"},{"internalType":"bool","name":"flagRoyalties","type":"bool"},{"internalType":"enumNFTTraderSwapRoyalties.swapStatus","name":"status","type":"uint8"},{"internalType":"uint256","name":"royaltiesMaker","type":"uint256"},{"internalType":"uint256","name":"royaltiesTaker","type":"uint256"}],"internalType":"structNFTTraderSwapRoyalties.swapIntent","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_swapId","type":"uint256"},{"internalType":"bool","name":"_nfts","type":"bool"}],"name":"getSwapStructSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_swapId","type":"uint256"},{"internalType":"bool","name":"_nfts","type":"bool"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getSwapStruct","outputs":[{"components":[{"internalType":"address","name":"dapp","type":"address"},{"internalType":"enumNFTTraderSwapRoyalties.typeStd","name":"typeStd","type":"uint8"},{"internalType":"uint256[]","name":"tokenId","type":"uint256[]"},{"internalType":"uint256[]","name":"blc","type":"uint256[]"},{"internalType":"uint256[]","name":"roy","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"structNFTTraderSwapRoyalties.swapStruct","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true}]
const erc721Abi = [{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]
const erc20Abi = [{"inputs":[{"internalType":"uint256","name":"chainId_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]

module.exports = {
    swap,
    contractAbi,
    erc721Abi,
    erc20Abi
}