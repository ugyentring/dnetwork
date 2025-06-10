# #!/bin/bash
# #Sets the context for native peer commands


# function usage {
#     echo "Usage:             . ./set_peer_env.sh  ORG_NAME"
#     echo "           Sets the organization context for native peer execution"
# }


# if [ "$1" == "" ]; then
#     usage
#     exit
# fi
# export ORG_CONTEXT=$1
# MSP_ID="$(tr '[:lower:]' '[:upper:]' <<< ${ORG_CONTEXT:0:1})${ORG_CONTEXT:1}"
# export ORG_NAME=$MSP_ID


# # Added this Oct 22
# export CORE_PEER_LOCALMSPID=$ORG_NAME"MSP"


# # Logging specifications
# export FABRIC_LOGGING_SPEC=INFO


# # Location of the core.yaml
# export FABRIC_CFG_PATH=/workspaces/hfl-network1/config/cit


# # Address of the peer
# export CORE_PEER_ADDRESS=cit.$1.edu:7051


# # Local MSP for the admin - Commands need to be executed as org admin
# export CORE_PEER_MSPCONFIGPATH=/workspaces/hfl-network1/config/crypto-config/peerOrganizations/$1.edu/users/Admin@$1.edu/msp


# # Address of the orderer
# export ORDERER_ADDRESS=orderer.confectionary.com:7050

# export CORE_PEER_TLS_ENABLED=false




# My version of the code for the set_peer_env.sh wrote on 7th June 2025
#!/bin/bash
# Sets the context for native peer commands

function usage {
    echo "Usage:             . ./set_peer_env.sh  ORG_NAME"
    echo "           Sets the organization context for native peer execution"
    echo "           ORG_NAME must be one of: bank, buyer, seller"
}

if [ "$1" == "" ]; then
    usage
    exit 1
fi

ORG_CONTEXT=$1

case "$ORG_CONTEXT" in
    bank)
        export ORG_NAME=Bank
        export CORE_PEER_LOCALMSPID=BankMSP
        export FABRIC_CFG_PATH=/workspaces/dnetwork/config/bank
        export CORE_PEER_ADDRESS=bank.dmarket.com:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/dnetwork/config/crypto-config/peerOrganizations/dmarket.com/peers/bank/msp
        ;;
    buyer)
        export ORG_NAME=Buyer
        export CORE_PEER_LOCALMSPID=BuyerMSP
        export FABRIC_CFG_PATH=/workspaces/dnetwork/config/buyer
        export CORE_PEER_ADDRESS=buyer.dmarket.com:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/dnetwork/config/crypto-config/peerOrganizations/dmarket.com/peers/buyer/msp
        ;;
    seller)
        export ORG_NAME=Seller
        export CORE_PEER_LOCALMSPID=SellerMSP
        export FABRIC_CFG_PATH=/workspaces/dnetwork/config/seller
        export CORE_PEER_ADDRESS=seller.dmarket.com:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/dnetwork/config/crypto-config/peerOrganizations/dmarket.com/peers/seller/msp
        ;;
    *)
        echo "Unknown organization: $ORG_CONTEXT"
        usage
        exit 1
        ;;
esac

export FABRIC_LOGGING_SPEC=INFO
export ORDERER_ADDRESS=orderer.dmarket.com:7050
export CORE_PEER_TLS_ENABLED=false