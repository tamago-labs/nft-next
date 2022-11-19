// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import {MarketAPI} from "./filecoinMockAPIs/MarketAPI.sol";
import {CommonTypes} from "./filecoinMockAPIs/types/CommonTypes.sol";
import {MarketTypes} from "./filecoinMockAPIs/types/MarketTypes.sol";


contract APIConsumer {

    address public marketApiAddress;

     constructor(address _marketApiAddress) { 
        marketApiAddress = _marketApiAddress;
    }

    /// @notice return the client's balance
    /// @param _clientId client ID
    function getBalance(string memory _clientId)
        public
        view
        returns (MarketTypes.GetBalanceReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetBalanceReturn memory response = marketApiInstance
            .get_balance(_clientId);
        return response;
    }

    /// @notice return the deal data commitment
    /// @param _dealId deal ID
    function getDealDataCommitment(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealDataCommitmentReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealDataCommitmentParams memory params = MarketTypes
            .GetDealDataCommitmentParams(_dealId);

        MarketTypes.GetDealDataCommitmentReturn
            memory response = marketApiInstance.get_deal_data_commitment(
                params
            );
        return response;
    }

    /// @notice return the deal's client ID
    /// @param _dealId deal ID
    function getDealClient(uint64 _dealId) public view returns (string memory) {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealClientParams memory params = MarketTypes
            .GetDealClientParams(_dealId);

        MarketTypes.GetDealClientReturn memory response = marketApiInstance
            .get_deal_client(params);
        return response.client;
    }

    /// @notice return the deal's provider
    /// @param _dealId deal ID
    function getDealProvider(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealProviderReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealProviderParams memory params = MarketTypes
            .GetDealProviderParams(_dealId);

        MarketTypes.GetDealProviderReturn memory response = marketApiInstance
            .get_deal_provider(params);
        return response;
    }

    /// @notice return the deal's label
    /// @param _dealId deal ID
    function getDealLabel(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealLabelReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealLabelParams memory params = MarketTypes
            .GetDealLabelParams(_dealId);

        MarketTypes.GetDealLabelReturn memory response = marketApiInstance
            .get_deal_label(params);
        return response;
    }

    /// @notice return the deal's term
    /// @param _dealId deal ID
    function getDealTerm(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealTermReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealTermParams memory params = MarketTypes
            .GetDealTermParams(_dealId);

        MarketTypes.GetDealTermReturn memory response = marketApiInstance
            .get_deal_term(params);
        return response;
    }

    /// @notice return the deal's total price
    /// @param _dealId deal ID
    function getDealTotalPrice(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealEpochPriceReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealEpochPriceParams memory params = MarketTypes
            .GetDealEpochPriceParams(_dealId);

        MarketTypes.GetDealEpochPriceReturn memory response = marketApiInstance
            .get_deal_total_price(params);
        return response;
    }

    /// @notice return the deal client's collateral
    /// @param _dealId deal ID
    function getDealClientCollateral(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealClientCollateralReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealClientCollateralParams memory params = MarketTypes
            .GetDealClientCollateralParams(_dealId);

        MarketTypes.GetDealClientCollateralReturn
            memory response = marketApiInstance.get_deal_client_collateral(
                params
            );
        return response;
    }

    /// @notice return the deal provider's collateral
    /// @param _dealId deal ID
    function getDealProviderCollateral(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealProviderCollateralReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealProviderCollateralParams memory params = MarketTypes
            .GetDealProviderCollateralParams(_dealId);

        MarketTypes.GetDealProviderCollateralReturn
            memory response = marketApiInstance.get_deal_provider_collateral(
                params
            );
        return response;
    }

    /// @notice return the deal's verified status
    /// @param _dealId deal ID
    function getDealVerified(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealVerifiedReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealVerifiedParams memory params = MarketTypes
            .GetDealVerifiedParams(_dealId);

        MarketTypes.GetDealVerifiedReturn memory response = marketApiInstance
            .get_deal_verified(params);
        return response;
    }

    /// @notice return the deal's activation
    /// @param _dealId deal ID
    function getDealActivation(uint64 _dealId)
        public
        view
        returns (MarketTypes.GetDealActivationReturn memory)
    {
        MarketAPI marketApiInstance = MarketAPI(marketApiAddress);

        MarketTypes.GetDealActivationParams memory params = MarketTypes
            .GetDealActivationParams(_dealId);

        MarketTypes.GetDealActivationReturn memory response = marketApiInstance
            .get_deal_activation(params);
        return response;
    }

}