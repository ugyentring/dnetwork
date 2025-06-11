#!/bin/bash

# Basic org context
export ORG_CONTEXT=bank
export ORG_NAME=Bank
export CORE_PEER_LOCALMSPID=BankMSP

# Logging
export FABRIC_LOGGING_SPEC=INFO

# Core config
export FABRIC_CFG_PATH=/workspaces/dnetwork/config/bank
export CORE_PEER_ADDRESS=bank.dmarket.com:7051

# Admin MSP path (pointing to Admin user MSP)
export CORE_PEER_MSPCONFIGPATH=/workspaces/dnetwork/config/crypto-config/peerOrganizations/bank.dmarket.com/users/Admin@bank.dmarket.com/msp

# Orderer
export ORDERER_ADDRESS=orderer.dmarket.com:7050
export CORE_PEER_TLS_ENABLED=false

# Chaincode
export CC_NAME="productchain"
export CC_PATH="./chaincodes/productchain/"
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

# Test command (optional)
peer channel list
