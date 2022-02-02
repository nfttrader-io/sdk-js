const swap = {
    MAINNET: '',
    RINKEBY: '0x95E07f6357EFCfcf1e9098208Af7183Ba9909AFa',
    ROPSTEN: '',
    GOERLI: '',
    KOVAN: '',
    IMMUTABLE: '',
    POLYGON: '',
    XDAI: ''
}

const contractAbi = [
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "Paused",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
    }
    ],
    "name": "Unpaused",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "_swapId",
        "type": "uint256"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "_counterpart",
        "type": "address"
    }
    ],
    "name": "counterpartEvent",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "_payer",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
    }
    ],
    "name": "paymentReceived",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "_creator",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "uint256",
        "name": "_time",
        "type": "uint256"
    },
    {
        "indexed": true,
        "internalType": "enum NFTTraderSwapRoyalties.swapStatus",
        "name": "_status",
        "type": "uint8"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "_swapId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "internalType": "address",
        "name": "_counterpart",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "address",
        "name": "_referral",
        "type": "address"
    }
    ],
    "name": "swapEvent",
    "type": "event"
},
{
    "inputs": [],
    "name": "owner",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [],
    "name": "paused",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
    }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "stateMutability": "payable",
    "type": "receive",
    "payable": true
},
{
    "inputs": [
    {
        "components": [
        {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        },
        {
            "internalType": "address payable",
            "name": "addressMaker",
            "type": "address"
        },
        {
            "internalType": "bool",
            "name": "discountMaker",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "valueMaker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "flatFeeMaker",
            "type": "uint256"
        },
        {
            "internalType": "address payable",
            "name": "addressTaker",
            "type": "address"
        },
        {
            "internalType": "bool",
            "name": "discountTaker",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "valueTaker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "flatFeeTaker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "swapStart",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "swapEnd",
            "type": "uint256"
        },
        {
            "internalType": "bool",
            "name": "flagFlatFee",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "flagRoyalties",
            "type": "bool"
        },
        {
            "internalType": "enum NFTTraderSwapRoyalties.swapStatus",
            "name": "status",
            "type": "uint8"
        },
        {
            "internalType": "uint256",
            "name": "royaltiesMaker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "royaltiesTaker",
            "type": "uint256"
        }
        ],
        "internalType": "struct NFTTraderSwapRoyalties.swapIntent",
        "name": "_swapIntent",
        "type": "tuple"
    },
    {
        "components": [
        {
            "internalType": "address",
            "name": "dapp",
            "type": "address"
        },
        {
            "internalType": "enum NFTTraderSwapRoyalties.typeStd",
            "name": "typeStd",
            "type": "uint8"
        },
        {
            "internalType": "uint256[]",
            "name": "tokenId",
            "type": "uint256[]"
        },
        {
            "internalType": "uint256[]",
            "name": "blc",
            "type": "uint256[]"
        },
        {
            "internalType": "uint256[]",
            "name": "roy",
            "type": "uint256[]"
        },
        {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
        }
        ],
        "internalType": "struct NFTTraderSwapRoyalties.swapStruct[]",
        "name": "_nftsMaker",
        "type": "tuple[]"
    },
    {
        "components": [
        {
            "internalType": "address",
            "name": "dapp",
            "type": "address"
        },
        {
            "internalType": "enum NFTTraderSwapRoyalties.typeStd",
            "name": "typeStd",
            "type": "uint8"
        },
        {
            "internalType": "uint256[]",
            "name": "tokenId",
            "type": "uint256[]"
        },
        {
            "internalType": "uint256[]",
            "name": "blc",
            "type": "uint256[]"
        },
        {
            "internalType": "uint256[]",
            "name": "roy",
            "type": "uint256[]"
        },
        {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
        }
        ],
        "internalType": "struct NFTTraderSwapRoyalties.swapStruct[]",
        "name": "_nftsTaker",
        "type": "tuple[]"
    },
    {
        "internalType": "address",
        "name": "_referral",
        "type": "address"
    }
    ],
    "name": "createSwapIntent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_swapCreator",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_swapId",
        "type": "uint256"
    },
    {
        "internalType": "address",
        "name": "_referral",
        "type": "address"
    }
    ],
    "name": "closeSwapIntent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_swapId",
        "type": "uint256"
    }
    ],
    "name": "cancelSwapIntent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_engineAddress",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_tradeSquad",
        "type": "address"
    },
    {
        "internalType": "address",
        "name": "_partnerSquad",
        "type": "address"
    },
    {
        "internalType": "address payable",
        "name": "_vault",
        "type": "address"
    }
    ],
    "name": "setReferenceAddresses",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bool",
        "name": "_flagFlatFee",
        "type": "bool"
    },
    {
        "internalType": "uint256",
        "name": "_flatFee",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "_flagRoyalties",
        "type": "bool"
    },
    {
        "internalType": "uint256",
        "name": "_bps",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "_scalePercent",
        "type": "uint256"
    }
    ],
    "name": "setPaymentStruct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_dapp",
        "type": "address"
    },
    {
        "internalType": "bool",
        "name": "_status",
        "type": "bool"
    }
    ],
    "name": "setERC20Whitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_dapp",
        "type": "address"
    },
    {
        "internalType": "bool",
        "name": "_status",
        "type": "bool"
    }
    ],
    "name": "setNFTBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_swapId",
        "type": "uint256"
    },
    {
        "internalType": "address payable",
        "name": "_counterPart",
        "type": "address"
    }
    ],
    "name": "editCounterPart",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "flipRoyaltiesState",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_address",
        "type": "address"
    }
    ],
    "name": "flipBannedAddressState",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "bool",
        "name": "_paused",
        "type": "bool"
    }
    ],
    "name": "pauseContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_address",
        "type": "address"
    }
    ],
    "name": "getERC20WhiteList",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_address",
        "type": "address"
    }
    ],
    "name": "getNFTBlacklist",
    "outputs": [
    {
        "internalType": "bool",
        "name": "",
        "type": "bool"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "_swapId",
        "type": "uint256"
    }
    ],
    "name": "getSwapIntentByAddress",
    "outputs": [
    {
        "components": [
        {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        },
        {
            "internalType": "address payable",
            "name": "addressMaker",
            "type": "address"
        },
        {
            "internalType": "bool",
            "name": "discountMaker",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "valueMaker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "flatFeeMaker",
            "type": "uint256"
        },
        {
            "internalType": "address payable",
            "name": "addressTaker",
            "type": "address"
        },
        {
            "internalType": "bool",
            "name": "discountTaker",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "valueTaker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "flatFeeTaker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "swapStart",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "swapEnd",
            "type": "uint256"
        },
        {
            "internalType": "bool",
            "name": "flagFlatFee",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "flagRoyalties",
            "type": "bool"
        },
        {
            "internalType": "enum NFTTraderSwapRoyalties.swapStatus",
            "name": "status",
            "type": "uint8"
        },
        {
            "internalType": "uint256",
            "name": "royaltiesMaker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "royaltiesTaker",
            "type": "uint256"
        }
        ],
        "internalType": "struct NFTTraderSwapRoyalties.swapIntent",
        "name": "",
        "type": "tuple"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_swapId",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "_nfts",
        "type": "bool"
    }
    ],
    "name": "getSwapStructSize",
    "outputs": [
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_swapId",
        "type": "uint256"
    },
    {
        "internalType": "bool",
        "name": "_nfts",
        "type": "bool"
    },
    {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
    }
    ],
    "name": "getSwapStruct",
    "outputs": [
    {
        "components": [
        {
            "internalType": "address",
            "name": "dapp",
            "type": "address"
        },
        {
            "internalType": "enum NFTTraderSwapRoyalties.typeStd",
            "name": "typeStd",
            "type": "uint8"
        },
        {
            "internalType": "uint256[]",
            "name": "tokenId",
            "type": "uint256[]"
        },
        {
            "internalType": "uint256[]",
            "name": "blc",
            "type": "uint256[]"
        },
        {
            "internalType": "uint256[]",
            "name": "roy",
            "type": "uint256[]"
        },
        {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
        }
        ],
        "internalType": "struct NFTTraderSwapRoyalties.swapStruct",
        "name": "",
        "type": "tuple"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
},
{
    "inputs": [],
    "name": "getPaymentStruct",
    "outputs": [
    {
        "components": [
        {
            "internalType": "bool",
            "name": "flagFlatFee",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "flagRoyalties",
            "type": "bool"
        },
        {
            "internalType": "uint256",
            "name": "flatFee",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "bps",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "scalePercent",
            "type": "uint256"
        }
        ],
        "internalType": "struct NFTTraderSwapRoyalties.paymentStruct",
        "name": "",
        "type": "tuple"
    }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
}
]

module.exports = {
    swap,
    contractAbi
}