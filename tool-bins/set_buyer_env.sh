#!/bin/bash

export ORG_CONTEXT=buyer
export ORG_NAME=Buyer
export CORE_PEER_LOCALMSPID=BuyerMSP

# Logging
export FABRIC_LOGGING_SPEC=INFO

# Core config
export FABRIC_CFG_PATH=/workspaces/dnetwork/config/buyer
export CORE_PEER_ADDRESS=buyer.dmarket.com:7051

# Admin MSP path (must point to Admin user MSP, not peer MSP)
export CORE_PEER_MSPCONFIGPATH=/workspaces/dnetwork/config/crypto-config/peerOrganizations/buyer.dmarket.com/users/Admin@buyer.dmarket.com/msp

# Orderer
export ORDERER_ADDRESS=orderer.dmarket.com:7050
export CORE_PEER_TLS_ENABLED=false

# Chaincode
export CC_NAME="cakechain"
export CC_PATH="./chaincodes/cakechain/"
export CC_CHANNEL_ID="dmarketchannel"
export CC_LANGUAGE="golang"

# Chaincode versioning
export INTERNAL_DEV_VERSION="1.0"
export CC_VERSION="1.1"
export CC2_PACKAGE_FOLDER="./chaincodes/packages/"
export CC2_SEQUENCE=1
export CC2_INIT_REQUIRED="--init-required"

# Chaincode package
export CC_PACKAGE_FILE="${CC2_PACKAGE_FOLDER}${CC_NAME}.${CC_VERSION}-${INTERNAL_DEV_VERSION}.tar.gz"
export CC_LABEL="${CC_NAME}.${CC_VERSION}-${INTERNAL_DEV_VERSION}"

# Test command
peer channel list
