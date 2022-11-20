
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
    
    struct Order {
        uint256 sellAmount;
        uint256 previousSellAmount;
        address currentHolder;
        address previousHolder;
        uint256 traded;
    }
 
    // maps to the owner of each token ID
    mapping(uint256 => address) public tokenOwners;
    uint256 public tokenOwnerCount;
    // roots
    mapping(uint256 => mapping(uint256 => bytes32)) private roots;
    // deals
    mapping(uint256 => uint64) private deals;
    // trading orders Token ID => Order
    mapping(uint256 => Order) public orders;
    // token to be minted during the creation
    uint8 public constant INITIAL_AMOUNT = 1;

    /// @notice create a new token
    function create(
        string memory _contentCID,
        bytes32[] memory _roots,
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

        // roots[tokenOwnerCount] = _contentMerkleRoot;
        for (uint256 i = 0; i < _roots.length; i++) {
             roots[tokenOwnerCount][i] = _roots[i];
        }

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
        require(
            orders[_tokenId].currentHolder == msg.sender,
            "You're not authorized"
        );

        orders[_tokenId].previousSellAmount = orders[_tokenId].sellAmount;
        orders[_tokenId].sellAmount = _sellAmount;
    }

    /// @notice acquire
    function acquire(uint256 _tokenId) public payable {
        require(orders[_tokenId].currentHolder != msg.sender, "Invalid owner");
        require(orders[_tokenId].sellAmount == msg.value, "Invalid value");

        // taking
        uint256 amount = msg.value; 

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
        uint256 _pageId,
        uint256 _index,
        string memory _word
    ) external view returns (bool) {
        bool holded = false;
        if (balanceOf(msg.sender, _tokenId) > 0) {
            holded = true;
        }
        bytes32 leaf = keccak256(abi.encodePacked(holded, _index, _word));
        return MerkleProof.verify(_proof, roots[_tokenId][_pageId], leaf);
    }

    // hard-coded deal ID
    function _settleContent(string memory _contentCID)
        internal
        view
        returns (uint64)
    {
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
 
}