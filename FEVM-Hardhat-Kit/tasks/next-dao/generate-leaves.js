const fa = require("@glif/filecoin-address");
const util = require("util");
const request = util.promisify(require("request"));
const { MerkleTree } = require('merkletreejs')
const keccak256 = require("keccak256")
const { ethers } = require("ethers")

task("generate-leaves", "A script to generate Merkle tree leaves from the text")
    .addParam("sentence", "The sentence to be processed")
    .setAction(async (taskArgs) => {

        const sentence = taskArgs.sentence

        if (!sentence) {
            console.log("No given sentence! use --sentence YOUR_SENTENCE")
            return
        }

        const shuffle = (array) => {
            let currentIndex = array.length, randomIndex;

            // While there remain elements to shuffle.
            while (currentIndex != 0) {

                // Pick a remaining element.
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
            }

            return [...new Set(array)];
        }

        const randomWords = [
            "suntan",
            "follow",
            "guitar",
            "forecast"
        ]

        console.log("Converting sentence", sentence, " into merkle leaves ")

        const words = sentence.split(/(\s+)/);
        const orignalLength = words.length

        const shuffled = shuffle(words.concat(randomWords))

        console.log("\nSentence length : ", orignalLength)

        console.log("Words to be attached on the NFT : ", shuffled)

        const leaves = words.map((item, index) => ethers.utils.keccak256(ethers.utils.solidityPack(["bool", "uint256", "string"], [true, index, item]))) // always true, index, word
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
        const hexLeaves = tree.getHexLeaves()
        const root = tree.getHexRoot()

        console.log("\nRoot : ", root)
        console.log("Leaves : ", hexLeaves)

        
    })


module.exports = {}