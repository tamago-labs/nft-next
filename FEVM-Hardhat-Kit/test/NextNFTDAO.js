const { expect } = require("chai")
const { ethers } = require("hardhat")
const { MerkleTree } = require('merkletreejs')
const keccak256 = require("keccak256")
const Hash = require('pure-ipfs-only-hash')
const { toEther, fromEther, shuffle, randomWords } = require("./Helpers")

let deployer
let contract

let alice
let bob
let charlie

// Won't working with FEVM-Hardhat Kit

describe("NextNFTDAO", () => {

    beforeEach(async () => {

        [deployer, alice, bob, charlie] = await ethers.getSigners();

        const MarketAPI = await ethers.getContractFactory("MarketAPI")
        const NextNFTDAO = await ethers.getContractFactory("NextNFTDAO");

        const marketAPI = await MarketAPI.deploy()
        contract = await NextNFTDAO.deploy(marketAPI.address)

    })

    it("Soulbound", async function () {

        const randomHash = Hash.of("Hello")

        await contract.connect(alice).create(randomHash, ethers.utils.formatBytes32String(""), toEther(1))

        // should be blocked
        try {
            await contract.connect(alice).safeTransferFrom(
                alice.address,
                bob.address,
                1,
                1,
                "0x00"
            );
        } catch (e) {
            expect((e.message).indexOf("Not allow to be transfered") !== -1).to.true
        }
    })

    it("Trade Alice -> Bob", async function () {

        const randomHash = Hash.of("Hello")

        await contract.connect(alice).create(randomHash, ethers.utils.formatBytes32String(""), toEther(1))

        expect(await contract.balanceOf(alice.address, 1)).to.equal(1)

        await contract.connect(bob).acquire(1, {
            value: toEther(1)
        })

        expect(await contract.balanceOf(bob.address, 1)).to.equal(1)

        const entry = await contract.orders(1)

        expect(entry['sellAmount']).to.equal(toEther(1))
        expect(entry['previousSellAmount']).to.equal(toEther(1))
        expect(entry['currentHolder']).to.equal(bob.address)
        expect(entry['previousHolder']).to.equal(alice.address)

    })

    it("Trade Alice -> Bob -> Charlie", async function () {

        const randomHash = Hash.of("Hello")

        await contract.connect(alice).create(randomHash, ethers.utils.formatBytes32String(""), toEther(1))

        expect(await contract.balanceOf(alice.address, 1)).to.equal(1)

        await contract.connect(bob).acquire(1, {
            value: toEther(1)
        })

        // bob change the price to 2 ETH
        await contract.connect(bob).setCurrentPrice(1, toEther(2))

        expect(await contract.getCurrentPrice(1)).to.equal(toEther(2))

        await contract.connect(charlie).acquire(1, {
            value: toEther(2)
        })

    })

    it("Reveal content", async function () {

        const originalText = "this is a content"

        const words = originalText.split(/(\s+)/);
        const orignalLength = words.length

        const shuffled = shuffle(words.concat(randomWords))

        const leaves = words.map((item, index) => ethers.utils.keccak256(ethers.utils.solidityPack(["bool", "uint256", "string"], [true, index, item]))) // always true, index, word
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
        const root = tree.getHexRoot()

        const randomHash = Hash.of("Hello")

        await contract.connect(alice).create(randomHash, root, toEther(1))

        const owner = await contract.tokenOwners(1)
        expect(owner).to.equal(alice.address)

        let recovered = ""

        for (let x = 0; x < orignalLength; x++) {
            for (let y = 0; y < shuffled.length; y++) {
                const proof = tree.getHexProof(ethers.utils.keccak256(ethers.utils.solidityPack(["bool", "uint256", "string"], [true, x, shuffled[y]])))
                const output = await contract.connect(alice).reveal(proof, 1, x, shuffled[y])
                if (output === true) {
                    recovered += shuffled[y]
                    break
                }
            }
        }

        expect(recovered).to.equal("this is a content")
    })



})