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
    echo "           ORG_NAME must be one of: org1, org2, org3"
}

if [ "$1" == "" ]; then
    usage
    exit 1
fi

ORG_CONTEXT=$1

case "$ORG_CONTEXT" in
    org1)
        export ORG_NAME=Org1
        export CORE_PEER_LOCALMSPID=Org1MSP
        export FABRIC_CFG_PATH=/workspaces/hfl-network1/config/shop1
        export CORE_PEER_ADDRESS=shop1:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/hfl-network1/config/crypto-config/peerOrganizations/confectionary.com/users/Admin@confectionary.com/msp
        ;;
    org2)
        export ORG_NAME=Org2
        export CORE_PEER_LOCALMSPID=Org2MSP
        export FABRIC_CFG_PATH=/workspaces/hfl-network1/config/mills
        export CORE_PEER_ADDRESS=mill:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/hfl-network1/config/crypto-config/peerOrganizations/flourmill.com/users/Admin@flourmill.com/msp
        ;;
    org3)
        export ORG_NAME=Org3
        export CORE_PEER_LOCALMSPID=Org3MSP
        export FABRIC_CFG_PATH=/workspaces/hfl-network1/config/ovens
        export CORE_PEER_ADDRESS=ovens:7051
        export CORE_PEER_MSPCONFIGPATH=/workspaces/hfl-network1/config/crypto-config/peerOrganizations/bakingstuff/users/Admin@bakingstuff/msp
        ;;
    *)
        echo "Unknown organization: $ORG_CONTEXT"
        usage
        exit 1
        ;;
esac

export FABRIC_LOGGING_SPEC=INFO
export ORDERER_ADDRESS=orderer.confectionary.com:7050
export CORE_PEER_TLS_ENABLED=false