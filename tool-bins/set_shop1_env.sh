#!/bin/bash
export ORG_CONTEXT=confectionary
export ORG_NAME=Org1
export CORE_PEER_LOCALMSPID=Org1MSP
# Logging specifications
export FABRIC_LOGGING_SPEC=INFO
# Location of the core.yaml
export FABRIC_CFG_PATH=/workspaces/hfl-network1/config/shop1
# Address of the peer
export CORE_PEER_ADDRESS=shop1.confectionary.com:7051
# Local MSP for the admin - Commands need to be executed as org admin
export CORE_PEER_MSPCONFIGPATH=/workspaces/hfl-network1/config/crypto-config/peerOrganizations/confectionary.com/users/Admin@confectionary.com/msp
# Address of the orderer
export ORDERER_ADDRESS=orderer.confectionary.com:7050
export CORE_PEER_TLS_ENABLED=false
#### Chaincode related properties
export CC_NAME="cakechain"
export CC_PATH="./chaincodes/cakechain/"
export CC_CHANNEL_ID="confectionarychannel"
export CC_LANGUAGE="golang"

# Properties of Chaincode
export INTERNAL_DEV_VERSION="1.0"
export CC_VERSION="1.1"
export CC2_PACKAGE_FOLDER="./chaincodes/packages/"
export CC2_SEQUENCE=1
export CC2_INIT_REQUIRED="--init-required"

# Create the package with this name
export CC_PACKAGE_FILE="$CC2_PACKAGE_FOLDER$CC_NAME.$CC_VERSION-$INTERNAL_DEV_VERSION.tar.gz"
# Extracts the package ID for the installed chaincode
export CC_LABEL="$CC_NAME.$CC_VERSION-$INTERNAL_DEV_VERSION"

# peer lifecycle chaincode package  $CC_PACKAGE_FILE -p $CC_PATH --label $CC_LABEL
peer channel list
