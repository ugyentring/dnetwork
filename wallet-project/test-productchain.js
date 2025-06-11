/**
 * Test file for Product Chaincode
 * 
 * This test focuses on basic CRUD operations for the productchain chaincode.
 */

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Path to connection profile
const connectionProfilePath = path.resolve(__dirname, 'connection.json');
// Path to wallet directory
const walletPath = path.resolve(__dirname, 'wallet');

// Test parameters
const channelName = 'dmarketchannel';
const chaincodeName = 'productchain';
const productId = 'product2';
const productName = 'Barcelona Jersey';
const productDescription = 'A product for testing';
const productImage = 'https://example.com/image.png';
const productCreatedAt = new Date().toISOString();
const productPrice = 99.99;
const productStock = 10;

async function main() {
    try {
        // Load connection profile
        if (!fs.existsSync(connectionProfilePath)) {
            console.error(`Connection profile not found at ${connectionProfilePath}`);
            return;
        }
        const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

        // Check if wallet directory exists
        if (!fs.existsSync(walletPath)) {
            console.error(`Wallet directory not found at ${walletPath}`);
            return;
        }
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Use the first identity in the wallet
        const identityNames = await wallet.list();
        if (!identityNames.length) {
            console.error('No identities found in wallet.');
            return;
        }
        // For FileSystemWallet, each identity is an object with .label property
        // But for Wallets.newFileSystemWallet, each identity is a string label
        // So, handle both cases
        let identity;
        if (typeof identityNames[0] === 'string') {
            identity = identityNames[0];
        } else if (identityNames[0].label) {
            identity = identityNames[0].label;
        } else {
            console.error('Could not determine identity label from wallet.');
            return;
        }
        console.log(`Using identity: ${identity}`);

        // Connect to gateway
        const gateway = new Gateway();
        await gateway.connect(connectionProfile, {
            wallet,
            identity,
            discovery: { enabled: false, asLocalhost: false }
        });
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        // Set endorsing peer to seller.dmarket.com for all submitTransaction calls
        const transaction = contract.createTransaction('CreateProduct');
        transaction.setEndorsingPeers(['seller.dmarket.com']);

        // 1. Create Product
        console.log('\n--- Creating Product ---');
        await transaction.submit(productId, productName, productDescription, productImage, productCreatedAt, productPrice.toString(), productStock.toString());
        console.log('Product created.');

        // 2. Get Product
        console.log('\n--- Getting Product ---');
        const productBuffer = await contract.evaluateTransaction('GetProduct', productId);
        const product = JSON.parse(productBuffer.toString());
        console.log('Product:', product);

        // 3. Update Product
        console.log('\n--- Updating Product ---');
        const updateTransaction = contract.createTransaction('UpdateProduct');
        updateTransaction.setEndorsingPeers(['seller.dmarket.com']);
        await updateTransaction.submit(productId, 'Updated Name', 'Updated Description', productImage, '199.99', '20');
        const updatedProductBuffer = await contract.evaluateTransaction('GetProduct', productId);
        const updatedProduct = JSON.parse(updatedProductBuffer.toString());
        console.log('Updated Product:', updatedProduct);

        // 4. Get All Products
        console.log('\n--- Getting All Products ---');
        const allProductsBuffer = await contract.evaluateTransaction('GetAllProducts');
        const allProducts = JSON.parse(allProductsBuffer.toString());
        console.log('All Products:', allProducts);

        // 5. Delete Product
        console.log('\n--- Deleting Product ---');
        const deleteTransaction = contract.createTransaction('DeleteProduct');
        deleteTransaction.setEndorsingPeers(['seller.dmarket.com']);
        await deleteTransaction.submit(productId);
        console.log('Product deleted.');

        // 6. Confirm Deletion
        try {
            await contract.evaluateTransaction('GetProduct', productId);
            console.error('Product was not deleted!');
        } catch (err) {
            console.log('Product deletion confirmed.');
        }

        gateway.disconnect();
        console.log('\n=== Product Chaincode CRUD Test Completed Successfully ===');
    } catch (error) {
        console.error(`Test failed: ${error}`);
        process.exit(1);
    }
}

main();
