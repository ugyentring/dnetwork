#!/bin/bash
# Sets the context for native peer commands

function usage {
    echo "Usage:             . ./set_peer_env.sh ORG_NAME"
    echo "           Sets the organization context for native peer execution"
    echo "           ORG_NAME must be one of: bank, buyer, seller"
}

if [ "$1" == "" ]; then
    usage
    return 1
fi

ORG_CONTEXT=$1

case "$ORG_CONTEXT" in
    bank)
        export ORG_NAME=Bank
        export CORE_PEER_LOCALMSPID=BankMSP
        export FABRIC_CFG_PATH=/workspaces/dnetwork/config/bank
        export CORE_PEER_ADDRESS=bank.dmarket.com:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/dnetwork/config/crypto-config/peerOrganizations/bank.dmarket.com/users/Admin@bank.dmarket.com/msp
        ;;
    buyer)
        export ORG_NAME=Buyer
        export CORE_PEER_LOCALMSPID=BuyerMSP
        export FABRIC_CFG_PATH=/workspaces/dnetwork/config/buyer
        export CORE_PEER_ADDRESS=buyer.dmarket.com:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/dnetwork/config/crypto-config/peerOrganizations/buyer.dmarket.com/users/Admin@buyer.dmarket.com/msp
        ;;
    seller)
        export ORG_NAME=Seller
        export CORE_PEER_LOCALMSPID=SellerMSP
        export FABRIC_CFG_PATH=/workspaces/dnetwork/config/seller
        export CORE_PEER_ADDRESS=seller.dmarket.com:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/dnetwork/config/crypto-config/peerOrganizations/seller.dmarket.com/users/Admin@seller.dmarket.com/msp
        ;;
    *)
        echo "Unknown organization: $ORG_CONTEXT"
        usage
        return 1
        ;;
esac

export FABRIC_LOGGING_SPEC=INFO
export ORDERER_ADDRESS=orderer.dmarket.com:7050
export CORE_PEER_TLS_ENABLED=false
