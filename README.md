# NFT Next


## Description

There are a various type of content like as Graphic Novels, Comics and Articles that DAO and NFT can together play a pivotal role in protecting copyright and distributing into much wider audience. NFT Next is a DataDAO that allows creators publish articles, comics and graphic novels in ERC-1155 Soulbound NFTs that the DAO facilitates as a decentralized networks of creators and readers who have voting power measured by the number of staking tokens, the system aims to remove barrier of entry to became content creators that being valued by other DAO members. The content's NFT comprises of text and images, the images is public while the text is private and will be shown to the token holders via Merkle-Tree data protection scheme we implemented and later on the DAO member who bought the most recent can help set the price according to value.

![4](https://user-images.githubusercontent.com/18402217/202912352-34397f15-1578-456d-89c3-67db6998e4da.png)

## Live Demo

[https://nft-next.tamagonft.xyz](https://next-nft.tamagonft.xyz/)


## NFT Structure

The NFT in the project represents graphic novels, comics that may contain multiple pages, each must have hashes and randomized words that sufficiently re-construct the original content back when the user holds at least 1 token. The structure must be aligned with following 

```
{
    "image": "https://bafkreie4a32nxkrd2lnwrqjhrmcw77xpc3tm2rhfcjmeunyg27x2i3af4u.ipfs.nftstorage.link",
    "name": "Mr.Montoya Journey",
    "description": "An illustrated book in NFT",
    "pages": [
        {
            "page": 1,
            "image": "https://bafybeictbssdzcryxtllhxn7digimrogzp5o4gsigczwcn5sc5xgnacuaq.ipfs.nftstorage.link/",
            "length": 29,
            "words": [
                " ",
                "forecast",
                "bakery",
                "never",
                "he's",
                "even",
                "been",
                "the",
                "way",
                "follow",
                "though",
                "there.",
                "Mr.",
                "to",
                "Montoya",
                "guitar",
                "suntan",
                "",
                "knows"
            ],
            "root": "0x45399181f5bb6afd3a1ba277d37a84442663e885bdbd24fce4b453492764fb35",
            "leaves": [
                "0x4ef23c2c53271ace210175e22927439d7a0a7722b5e6dca04f46323f30e52934",
                "0x47b282b3ae6e1724c7aae8b1762b731f99344f55fb60506d035d59561b1750af",
                "0xa3ff70ac4fe0c057fe7d26ea554449674e1e20d347393d3cb0de1404cf6fa114",
                "0xfd5c48f70603373d1866bb97fe0f2df6e9d31e0843534608d6fa4ce6e43479a3",
                "0xc0aa2e4344331fd012988f6555b57f2a5cee7ee8f19a51161b98b68c89c64c20",
                "0x9f76ee1650c0adfa2196ef4a1fc5a7d5779781f87a54c5e68fa6f7fa616dd340",
                "0x0a16516ef9cecd527efa7843d0a8168c185fcb4b59da4028c1014a225f90feb9",
                "0x6ffc4493a6aa3b64d07085af4920d2af2177e8dc405d8893a7f18df9fbd76759",
                "0xbb2dcc8618a4386cf0abea05b135637a713905eab5695e3d667aea32c4040a82",
                "0xdf7c84620759557fed74d7e07b94f49c40eb68074004b281bd0d71204d41ee5e",
                "0x177d06b7430eb2160b79921d7f71a998a99c1934d88d9adfbfee4b4adbfe45a5",
                "0xc35553ab364f23d201bdbcfa4854ee5f9bf57abd6acd12917270239f3cfe504b",
                "0x6293bf577b103cf8edd049e2c082bf8f2c47166565a656909c24386c755f6eb7",
                "0xe9d773d8080dea05e6d212416db195455c4de868295a90626b953750c9ec38ec",
                "0x43d80cd61929ec7e6eb934cda99711f1cd4f049fda77ca0dfe463a85c2d5aed1",
                "0xf3286433842cdae6ab59fecd8d39c45540acc323a7274338ce68e213ac9fdc39",
                "0x369abeaa3400c91cdf5059c976770571de4550d018cfcd79df08a51029eb6a08",
                "0x60aa16ac910435f54c03d20ba96b1b4b6e550561d5a6e05f50e424c0d3438d5b",
                "0x917f4fda8bdca36653700a15f9c97d832e73424105e9fa24b314511e19122d44",
                "0xf8fc142c54377ac8a096aa49f47f6ec9c9005edcad1fa90d836800d12e636d42",
                "0xc0747186e221cf928a875c32285a7d5c60898830b6f64e28a3a3d70cebfb8edd",
                "0x194c46f8a7c864f6d3fe578f4a6367c4e55a3c87e63171e722d697ee385ecbcf",
                "0x95293dd4e982542f6089f5f0536c18e1660574edc28d4994832a35be68f45ba6",
                "0xed98fbe04f4ad256a2c528225b6839ff667dca41a685d5f50a069586f4fd2277",
                "0x6739d44c22e747b283ae7655727670fca392e7a9cc5f587ad4b0e47e6f17fa4e",
                "0xc61b79aabc5543ac38e514182354fde329a15f2bdde03de5a90548d4eabb12ad",
                "0x8557e06206093181e71678483a155ffca9bd0e410e45cb88c7fd81daf1509786",
                "0x17ce633fd9043072253e0d16fe335663fe50f33ada78ebe5633b4c6309e3988e",
                "0x1772dc2953a5cce906da0b021384fa31a0295a0e82eb78c353d724fcecddd6d6"
            ]
        },
```

Those hashes can be generated from following command at `FEVM-Hardhat-Kit` folder.

```
yarn hardhat generate-leaves --sentence "MY SENTENCE TO BE SNAPSHOTED"
```

The root will be put into the smart contract while the leaves on the IPFS, on the long-term, either one must keep privately to ensure no one else by the NFT holder can recover the data back.  

## Deployment

### Wallaby Testnet

Contract Name | Contract Address 
--- | --- 
NextDAO | 0x32df438De10D1Bc406a005bf7534750CE0bEEa7E
