import { useState, useCallback, useReducer, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { ethers } from "ethers";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs"
import NEXTDAO_ABI from "../abi/NextDAO.json"
import { CONTRACT_ADDRESS, TOKEN_IDS } from "../constants";


const useNextDAO = () => {

    if (typeof window !== "undefined") {
        window.Buffer = window.Buffer || require("buffer").Buffer;
    }

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            tokens: [],
            token: undefined,
            dealInfo: undefined
        }
    )

    const { tokens, token, dealInfo } = values

    const context = useWeb3React()

    const { chainId, account, library } = context

    useEffect(() => {
        account && fetchTokens()
        account && fetchDeal(67) // default deal ID
    }, [account, chainId])

    async function callRpc(method, params) {
        var options = {
            method: "POST",
            url: "https://wallaby.node.glif.io/rpc/v0",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: method,
                params: params,
                id: 1,
            }),
        };
        const res = await fetch("https://wallaby.node.glif.io/rpc/v0", options);
        const output = (await res.json()).result
        return output
    }

    const buy = useCallback(async (token) => {

        if (!account) {
            return
        }

        const { tokenId, currentPrice } = token

        const contractAddress = CONTRACT_ADDRESS

        const contract = new ethers.Contract(
            contractAddress,
            NEXTDAO_ABI,
            library.getSigner()
        );

        const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

        const gasLimit = 30000000
        const BASE_GAS = 100

        return await contract.acquire(
            tokenId,
            {
                value: currentPrice,
                maxPriorityFeePerGas: priorityFee,
                maxFeePerGas: priorityFee,
                // gasPrice: ethers.utils.parseUnits(`${BASE_GAS}`, 'gwei'),
                gasLimit: gasLimit
            }
        );

    }, [account, library])

    const setPrice = useCallback(async (token, newPrice) => {

        if (!account) {
            return
        }

        const { tokenId, currentPrice } = token

        const contractAddress = CONTRACT_ADDRESS

        const contract = new ethers.Contract(
            contractAddress,
            NEXTDAO_ABI,
            library.getSigner()
        );

        const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

        const gasLimit = 30000000
        const BASE_GAS = 100

        return await contract.setCurrentPrice(
            tokenId,
            ethers.utils.parseEther(`${newPrice}`),
            {
                maxPriorityFeePerGas: priorityFee,
                maxFeePerGas: priorityFee,
                // gasPrice: ethers.utils.parseUnits(`${BASE_GAS}`, 'gwei'),
                gasLimit: gasLimit
            }
        );

    }, [account, library])

    const fetchBalance = useCallback(async (token) => {
        if (!account) {
            return
        }

        const { tokenId } = token

        const contractAddress = CONTRACT_ADDRESS

        const contract = new ethers.Contract(
            contractAddress,
            NEXTDAO_ABI,
            library.getSigner()
        );

        const balance = await contract.balanceOf(account, tokenId)
        
        return (Number(balance))
 
    }, [account, library])

    const fetchDeal = useCallback(async (dealId) => {
        if (!account) {
            return
        }

        const contractAddress = CONTRACT_ADDRESS

        const contract = new ethers.Contract(
            contractAddress,
            NEXTDAO_ABI,
            library.getSigner()
        );

        const dataCommitment = await contract.getDealDataCommitment(dealId)
        const client = await contract.getDealClient(dealId)
        const provider = await contract.getDealProvider(dealId)
        const label = await contract.getDealLabel(dealId)
        const term = await contract.getDealTerm(dealId)
        const totalPrice = await contract.getDealTotalPrice(dealId)
        const clientCollateral = await contract.getDealClientCollateral(dealId)
        const providerCollateral = await contract.getDealProviderCollateral(dealId)

        dispatch({
            dealInfo: {
                dataCommitment: `${dataCommitment}`,
                client: `${client}`,
                provider: `${provider}`,
                label: `${label}`,
                term: `${term}`,
                totalPrice: `${totalPrice}`,
                clientCollateral: `${clientCollateral}`,
                providerCollateral: `${providerCollateral}`
            }
        })
    }, [account, library])

    const fetchTokens = useCallback(async () => {

        if (!account) {
            return
        }

        const contractAddress = CONTRACT_ADDRESS

        const contract = new ethers.Contract(
            contractAddress,
            NEXTDAO_ABI,
            library.getSigner()
        );

        let tokens = []

        for (let tokenId of TOKEN_IDS) {
            const uri = await contract.uri(tokenId)

            const { data } = await axios.get(uri)

            const orderInfo = await contract.orders(tokenId)

            tokens.push({
                ...data,
                uri,
                tokenId,
                traded: `${orderInfo['traded']}`,
                currentPrice: `${orderInfo['sellAmount']}`,
                currentHolder: orderInfo['currentHolder'],
                previousHolder: orderInfo['previousHolder']
            })
        }

        dispatch({ tokens })

    }, [account, library])

    const select = (item) => {
        dispatch({ token: item })
    }

    const deselect = () => {
        dispatch({ token: undefined })
    }

    const reveal = useCallback(async ({
        wordIndex,
        words,
        pageIndex,
        leaves,
        tokenId
    }) => {

        if (!account) {
            return
        }

        const contractAddress = CONTRACT_ADDRESS

        const contract = new ethers.Contract(
            contractAddress,
            NEXTDAO_ABI,
            library.getSigner()
        );

        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

        for (let y = 0; y < words.length; y++) {
            const proof = tree.getHexProof(ethers.utils.keccak256(ethers.utils.solidityPack(["bool", "uint256", "string"], [true, wordIndex, words[y]])))
            const output = await contract.reveal(proof, tokenId, pageIndex, wordIndex, words[y])
            if (output === true) {
                return words[y]
            }
        }

        return
    }, [account, library])

    return {
        tokens,
        token,
        select,
        reveal,
        deselect,
        dealInfo,
        buy, 
        setPrice,
        fetchBalance
    }
}

export default useNextDAO