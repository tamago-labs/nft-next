// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Soulbound1155} from "./utils/Soulbound1155.sol";
import {Soulbound1155URIStorage} from "./utils/Soulbound1155URIStorage.sol";
import {APIConsumer} from "./APIConsumer.sol";

/**
 * @title NextNFT DAO : A DataDAO for self-sovereign content
 */

contract NextNFTDAO is Soulbound1155, Soulbound1155URIStorage, APIConsumer {
    enum Role {
        UNAUTHORIZED,
        MEMBER,
        ADMIN
    }

    struct Order {
        uint256 tokenId;
        uint256 tokenValue;
        address owner;
        bool active;
        bool ended;
    }

    // ACL
    mapping(address => Role) private permissions;

    constructor(address _marketApiAddress) APIConsumer(_marketApiAddress) {
        permissions[msg.sender] = Role.ADMIN;
    }

    /// @notice return the token URI
    /// @param tokenId token ID
    function uri(uint256 tokenId)
        public
        view
        virtual
        override(Soulbound1155, Soulbound1155URIStorage)
        returns (string memory)
    {
        return Soulbound1155URIStorage.uri(tokenId);
    }
}
