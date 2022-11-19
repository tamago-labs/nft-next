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
        uint256 sellAmount;
        uint256 previousSellAmount;
        address currentHolder;
        address previousHolder;
        uint256 traded;
    }

    // ACL
    mapping(address => Role) private permissions;
    // maps to the owner of each token ID
    mapping(uint256 => address) public tokenOwners;
    uint256 public tokenOwnerCount;
    // roots
    mapping(uint256 => bytes32) private roots;
    // deals
    mapping(uint256 => uint64) private deals;
    // trading orders Token ID => Order
    mapping(uint256 => Order) public orders;
    // token to be minted during the creation
    uint8 public constant INITIAL_AMOUNT = 1;
    // fee
    uint256 private constant FEE = 2000;

    constructor(address _marketApiAddress) APIConsumer(_marketApiAddress) {
        permissions[msg.sender] = Role.ADMIN;
    }

    /// @notice create a new token
    function create(
        string memory _contentCID,
        bytes32 _contentMerkleRoot,
        uint256 _intialPrice
    ) public {
        tokenOwnerCount += 1;
        tokenOwners[tokenOwnerCount] = msg.sender;

        // first mint
        _mint(msg.sender, tokenOwnerCount, INITIAL_AMOUNT, "");
        // presume that we have settle the deal here
        uint64 dealID = _settleContent(_contentCID);
        // set token URI
        _setURI(tokenOwnerCount, _contentCID);

        roots[tokenOwnerCount] = _contentMerkleRoot;
        deals[tokenOwnerCount] = dealID;

        // list first order
        _list(tokenOwnerCount, _intialPrice, msg.sender);
    }

    /// @notice check current price
    function getCurrentPrice(uint256 _tokenId) public view returns (uint256) {
        return orders[_tokenId].sellAmount;
    }

    /// @notice set current price if you're the last holder
    function setCurrentPrice(uint256 _tokenId, uint256 _sellAmount) public {
        require(orders[_tokenId].currentHolder == msg.sender, "You're not authorized");

        orders[_tokenId].previousSellAmount = orders[_tokenId].sellAmount;
        orders[_tokenId].sellAmount = _sellAmount;
    }

    /// @notice acquire
    function acquire(uint256 _tokenId) public payable {
        require(orders[_tokenId].currentHolder != msg.sender, "Invalid owner");
        require(orders[_tokenId].sellAmount == msg.value, "Invalid value");

        // taking
        uint256 amount = msg.value;

        // FIXME : Uncomment this
        // if (FEE != 0) {
        //     uint256 fee = (amount * (FEE)) / (10000);
        //     // Locks the fee in the contract for now
        //     // (bool successDev, ) = devAddress.call{value: fee}("");
        //     // require(successDev, "Failed to send Ether to dev");
        //     amount -= fee;
        // }

        (bool sent, ) = orders[_tokenId].currentHolder.call{value: amount}("");

        // giving
        _mint(msg.sender, _tokenId, 1, "");

        orders[_tokenId].traded += 1;

        orders[_tokenId].previousSellAmount = orders[_tokenId].sellAmount;
        orders[_tokenId].previousHolder = orders[_tokenId].currentHolder;

        _list(_tokenId, orders[_tokenId].sellAmount, msg.sender);
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

    /// @notice reveal a word by given proof
    /// @param _proof proof generated off-chain
    /// @param _tokenId token ID
    /// @param _index index of the word
    /// @param _word word to check
    function reveal(
        bytes32[] memory _proof,
        uint256 _tokenId,
        uint256 _index,
        string memory _word
    ) external view returns (bool) {
        bool holded = false;
        if (balanceOf(msg.sender, _tokenId) > 0) {
            holded = true;
        }
        bytes32 leaf = keccak256(abi.encodePacked(holded, _index, _word));
        return MerkleProof.verify(_proof, roots[_tokenId], leaf);
    }

    // give a specific permission to the given address
    function grant(address _address, Role _role) external onlyAdmin {
        require(_address != _msgSender(), "You cannot grant yourself");
        permissions[_address] = _role;
    }

    // remove any permission binded to the given address
    function revoke(address _address) external onlyAdmin {
        require(_address != _msgSender(), "You cannot revoke yourself");
        permissions[_address] = Role.UNAUTHORIZED;
    }

    modifier onlyAdmin() {
        require(permissions[msg.sender] == Role.ADMIN, "Caller is not the admin");
        _;
    }

    // hard-coded deal ID
    function _settleContent(string memory _contentCID) internal view returns (uint64) {
        return 67;
    }

    // list a sell order
    function _list(
        uint256 _tokenId,
        uint256 _sellAmount,
        address _currentHolder
    ) internal {
        if (orders[_tokenId].sellAmount != 0) {
            orders[_tokenId].previousSellAmount = orders[_tokenId].sellAmount;
        }
        orders[_tokenId].sellAmount = _sellAmount;
        if (orders[_tokenId].currentHolder != address(0)) {
            orders[_tokenId].previousHolder = orders[_tokenId].currentHolder;
        }
        orders[_tokenId].currentHolder = _currentHolder;
    }

    /// @notice the user can only transfer the token in/out from the contract
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        for (uint256 i = 0; i < ids.length; i++) {
            if (to != address(this) && from != address(0) && to != address(0)) {
                require(false, "Not allow to be transfered");
            }
        }
    }

    receive() external payable {}

    fallback() external payable {}
}
