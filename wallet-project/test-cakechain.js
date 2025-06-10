/**
 * Test file for Cake Chaincode
 * 
 * This test focuses on access control aspects of the cake chaincode,
 * verifying that certain organizations have access to only specific functions.
 */

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Path to connection profile
const connectionProfilePath = path.resolve(__dirname, 'connection.json');
// Path to wallet directory
const walletPath = path.resolve(__dirname, 'wallet');

// Test parameters
const channelName = 'confectionarychannel';
const chaincodeName = 'cakechain';
const cakeId = 'cake1';
const cakeName = 'Chocolate Cake';

/**
 * Main test function
 */
async function main() {
    try {
        // Load connection profile
        if (!fs.existsSync(connectionProfilePath)) {
            console.error(`Connection profile not found at ${connectionProfilePath}`);
            console.log('Please ensure connection.json is in the same directory as this test file.');
            return;
        }
        
        const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
        
        // Check if wallet directory exists
        if (!fs.existsSync(walletPath)) {
            console.error(`Wallet directory not found at ${walletPath}`);
            console.log('Creating wallet directory...');
            fs.mkdirSync(walletPath, { recursive: true });
            console.log(`Wallet directory created at ${walletPath}`);
            console.log('\nBefore running this test, you need to set up wallet identities:');
            console.log('1. Create identity files for each organization admin in the wallet directory');
            console.log('2. Ensure the following identity files exist:');
            console.log('   - Admin@confectionary.com.id (for Org1)');
            console.log('   - Admin@flourmill.com.id (for Org2)');
            console.log('   - Admin@bakingstuff.id (for Org3)');
            console.log('\nFor development testing, you can create mock identities using the following steps:');
            console.log('1. Run "node create-test-identities.js" (see below for this helper script)');
            console.log('2. Then run this test file again');
            
            // Create a helper script for generating test identities
            createIdentityHelperScript();
            return;
        }
        
        // Create a new wallet for identity management
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(wallet)
        // Check if required identities exist in wallet
        const identities = {
            org1: 'Admin@confectionary.com',
            org2: 'Admin@flourmill.com',
            org3: 'Admin@bakingstuff'
        };
        
        let missingIdentities = [];
        for (const [org, id] of Object.entries(identities)) {
            const identity = await wallet.get(id);
            if (!identity) {
                missingIdentities.push(id);
            }
        }
        
        if (missingIdentities.length > 0) {
            console.error('The following identities are missing from the wallet:');
            missingIdentities.forEach(id => console.log(`- ${id}`));
            console.log('\nBefore running this test, you need to set up these wallet identities.');
            console.log('For development testing, you can create mock identities using the following steps:');
            console.log('1. Run "node create-test-identities.js" (see below for this helper script)');
            console.log('2. Then run this test file again');
            
            // Create a helper script for generating test identities
            createIdentityHelperScript();
            return;
        }
        
        console.log('=== Starting Cake Chaincode Access Control Tests ===');
        
        // Initialize a cake for testing
        await initCake(connectionProfile, wallet, identities.org1);
        
        // Test Org1 access control (confectionary.com - shop approval)
        await testOrg1AccessControl(connectionProfile, wallet, identities);
        
        // Test Org2 access control (flourmill.com - flour approval)
        await testOrg2AccessControl(connectionProfile, wallet, identities);
        
        // Test Org3 access control (bakingstuff.id - oven approval)
        await testOrg3AccessControl(connectionProfile, wallet, identities);
        
        // Verify final cake state with all approvals
        await verifyCakeState(connectionProfile, wallet, identities.org1);
        
        console.log('=== All tests completed successfully ===');
        
    } catch (error) {
        console.error(`Failed to run tests: ${error}`);
        process.exit(1);
    }
}

/**
 * Initialize a cake for testing
 */
async function initCake(connectionProfile, wallet, identity) {
    console.log('\n--- Initializing cake for testing ---');
    
    try {
        // Create a new gateway for connecting to the peer node
        const gateway = new Gateway();
        await gateway.connect(connectionProfile, {
            wallet,
            identity,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        // Get the network and contract
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        
        // Initialize a new cake
        await contract.submitTransaction('InitCake', cakeId, cakeName);
        console.log(`Cake initialized with ID: ${cakeId}, Name: ${cakeName}`);
        
        // Disconnect from the gateway
        gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to initialize cake: ${error}`);
        throw error;
    }
}

/**
 * Test Org1 access control (confectionary.com - shop approval)
 */
async function testOrg1AccessControl(connectionProfile, wallet, identities) {
    console.log('\n--- Testing Org1 (confectionary.com) Access Control ---');
    
    try {
        // Test 1: Org1 should be able to approve shop
        console.log('Test 1: Org1 should be able to approve shop');
        const gateway1 = new Gateway();
        await gateway1.connect(connectionProfile, {
            wallet,
            identity: identities.org1,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network1 = await gateway1.getNetwork(channelName);
        const contract1 = network1.getContract(chaincodeName);
        
        await contract1.submitTransaction('ApproveShop', cakeId);
        console.log('✓ Org1 successfully approved shop');
        
        gateway1.disconnect();
        
        // Test 2: Org2 should NOT be able to approve shop
        console.log('Test 2: Org2 should NOT be able to approve shop');
        const gateway2 = new Gateway();
        await gateway2.connect(connectionProfile, {
            wallet,
            identity: identities.org2,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network2 = await gateway2.getNetwork(channelName);
        const contract2 = network2.getContract(chaincodeName);
        
        try {
            await contract2.submitTransaction('ApproveShop', cakeId);
            console.error('✗ Org2 was able to approve shop - THIS IS AN ERROR');
        } catch (error) {
            console.log('✓ Org2 correctly denied access to approve shop');
        }
        
        gateway2.disconnect();
        
        // Test 3: Org3 should NOT be able to approve shop
        console.log('Test 3: Org3 should NOT be able to approve shop');
        const gateway3 = new Gateway();
        await gateway3.connect(connectionProfile, {
            wallet,
            identity: identities.org3,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network3 = await gateway3.getNetwork(channelName);
        const contract3 = network3.getContract(chaincodeName);
        
        try {
            await contract3.submitTransaction('ApproveShop', cakeId);
            console.error('✗ Org3 was able to approve shop - THIS IS AN ERROR');
        } catch (error) {
            console.log('✓ Org3 correctly denied access to approve shop');
        }
        
        gateway3.disconnect();
        
    } catch (error) {
        console.error(`Failed to test Org1 access control: ${error}`);
        throw error;
    }
}

/**
 * Test Org2 access control (flourmill.com - flour approval)
 */
async function testOrg2AccessControl(connectionProfile, wallet, identities) {
    console.log('\n--- Testing Org2 (flourmill.com) Access Control ---');
    
    try {
        // Test 1: Org2 should be able to approve flour
        console.log('Test 1: Org2 should be able to approve flour');
        const gateway1 = new Gateway();
        await gateway1.connect(connectionProfile, {
            wallet,
            identity: identities.org2,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network1 = await gateway1.getNetwork(channelName);
        const contract1 = network1.getContract(chaincodeName);
        
        await contract1.submitTransaction('ApproveFlour', cakeId);
        console.log('✓ Org2 successfully approved flour');
        
        gateway1.disconnect();
        
        // Test 2: Org1 should NOT be able to approve flour
        console.log('Test 2: Org1 should NOT be able to approve flour');
        const gateway2 = new Gateway();
        await gateway2.connect(connectionProfile, {
            wallet,
            identity: identities.org1,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network2 = await gateway2.getNetwork(channelName);
        const contract2 = network2.getContract(chaincodeName);
        
        try {
            await contract2.submitTransaction('ApproveFlour', cakeId);
            console.error('✗ Org1 was able to approve flour - THIS IS AN ERROR');
        } catch (error) {
            console.log('✓ Org1 correctly denied access to approve flour');
        }
        
        gateway2.disconnect();
        
        // Test 3: Org3 should NOT be able to approve flour
        console.log('Test 3: Org3 should NOT be able to approve flour');
        const gateway3 = new Gateway();
        await gateway3.connect(connectionProfile, {
            wallet,
            identity: identities.org3,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network3 = await gateway3.getNetwork(channelName);
        const contract3 = network3.getContract(chaincodeName);
        
        try {
            await contract3.submitTransaction('ApproveFlour', cakeId);
            console.error('✗ Org3 was able to approve flour - THIS IS AN ERROR');
        } catch (error) {
            console.log('✓ Org3 correctly denied access to approve flour');
        }
        
        gateway3.disconnect();
        
    } catch (error) {
        console.error(`Failed to test Org2 access control: ${error}`);
        throw error;
    }
}

/**
 * Test Org3 access control (bakingstuff.id - oven approval)
 */
async function testOrg3AccessControl(connectionProfile, wallet, identities) {
    console.log('\n--- Testing Org3 (bakingstuff.id) Access Control ---');
    
    try {
        // Test 1: Org3 should be able to approve oven
        console.log('Test 1: Org3 should be able to approve oven');
        const gateway1 = new Gateway();
        await gateway1.connect(connectionProfile, {
            wallet,
            identity: identities.org3,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network1 = await gateway1.getNetwork(channelName);
        const contract1 = network1.getContract(chaincodeName);
        
        await contract1.submitTransaction('ApproveOven', cakeId);
        console.log('✓ Org3 successfully approved oven');
        
        gateway1.disconnect();
        
        // Test 2: Org1 should NOT be able to approve oven
        console.log('Test 2: Org1 should NOT be able to approve oven');
        const gateway2 = new Gateway();
        await gateway2.connect(connectionProfile, {
            wallet,
            identity: identities.org1,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network2 = await gateway2.getNetwork(channelName);
        const contract2 = network2.getContract(chaincodeName);
        
        try {
            await contract2.submitTransaction('ApproveOven', cakeId);
            console.error('✗ Org1 was able to approve oven - THIS IS AN ERROR');
        } catch (error) {
            console.log('✓ Org1 correctly denied access to approve oven');
        }
        
        gateway2.disconnect();
        
        // Test 3: Org2 should NOT be able to approve oven
        console.log('Test 3: Org2 should NOT be able to approve oven');
        const gateway3 = new Gateway();
        await gateway3.connect(connectionProfile, {
            wallet,
            identity: identities.org2,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        const network3 = await gateway3.getNetwork(channelName);
        const contract3 = network3.getContract(chaincodeName);
        
        try {
            await contract3.submitTransaction('ApproveOven', cakeId);
            console.error('✗ Org2 was able to approve oven - THIS IS AN ERROR');
        } catch (error) {
            console.log('✓ Org2 correctly denied access to approve oven');
        }
        
        gateway3.disconnect();
        
    } catch (error) {
        console.error(`Failed to test Org3 access control: ${error}`);
        throw error;
    }
}

/**
 * Verify final cake state with all approvals
 */
async function verifyCakeState(connectionProfile, wallet, identity) {
    console.log('\n--- Verifying final cake state ---');
    
    try {
        // Create a new gateway for connecting to the peer node
        const gateway = new Gateway();
        await gateway.connect(connectionProfile, {
            wallet,
            identity,
            discovery: { enabled: false, asLocalhost: true }
        });
        
        // Get the network and contract
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        
        // Get the cake state
        const cakeBuffer = await contract.evaluateTransaction('GetCake', cakeId);
        const cake = JSON.parse(cakeBuffer.toString());
        
        console.log('Final cake state:');
        console.log(JSON.stringify(cake, null, 2));
        
        // Verify all approvals are set
        if (cake.shop && cake.flour && cake.oven) {
            console.log('✓ All approvals successfully set');
        } else {
            console.error('✗ Not all approvals were set correctly');
        }
        
        // Disconnect from the gateway
        gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to verify cake state: ${error}`);
        throw error;
    }
}

/**
 * Create a helper script for generating test identities
 */
function createIdentityHelperScript() {
    const scriptPath = path.resolve(__dirname, 'create-test-identities.js');
    const scriptContent = `/**
 * Helper script to create test identities for cake chaincode testing
 * 
 * This script creates mock identities for testing purposes only.
 * In a real environment, these would be created through the proper enrollment process.
 */

const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Path to wallet directory
        const walletPath = path.resolve(__dirname, 'wallet');
        
        // Create wallet directory if it doesn't exist
        if (!fs.existsSync(walletPath)) {
            fs.mkdirSync(walletPath, { recursive: true });
        }
        
        // Create a new wallet
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        // Define the identities to create
        const identities = [
            {
                name: 'Admin@confectionary.com.id',
                mspId: 'Org1MSP',
                organization: 'confectionary.com'
            },
            {
                name: 'Admin@flourmill.com.id',
                mspId: 'Org2MSP',
                organization: 'flourmill.com'
            },
            {
                name: 'Admin@bakingstuff.id',
                mspId: 'Org3MSP',
                organization: 'bakingstuff.id'
            }
        ];
        
        // Create each identity
        for (const identity of identities) {
            // Check if identity already exists
            const exists = await wallet.get(identity.name);
            if (exists) {
                console.log(\`Identity \${identity.name} already exists in wallet\`);
                continue;
            }
            
            // Create a mock X.509 identity
            const x509Identity = {
                credentials: {
                    certificate: \`-----BEGIN CERTIFICATE-----
MIICKTCCAc+gAwIBAgIUJQMFN1XsWBUDNtYAscZu9NTFFQowCgYIKoZIzj0EAwIw
czELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh
biBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT
E2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMjAwNDI0MjAxMTAwWhcNMjEwNDI0MjAx
NjAwWjBCMTAwDQYDVQQLEwZjbGllbnQwCwYDVQQLEwRvcmcxMBIGA1UECxMLZGVw
YXJ0bWVudDExDjAMBgNVBAMTBXVzZXIxMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD
QgAEV9UzJzpKFQp8yVbvUu5tGThuZT9UqVLgQIIrnnNRKssVLH7qx7QWNUxnXSBz
U3SnpqQMz2+9xKiagIgPcB0gBKNgMF4wDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB
/wQCMAAwHQYDVR0OBBYEFPgGMhKYvXOvXTZCMt5BSgYHQAP9MB8GA1UdIwQYMBaA
FBUZa7sJFIYuQMKzHBBJM/hhYDGpMAoGCCqGSM49BAMCA0gAMEUCIQDRXoZwmnsF
+DcZMxw3YgJdFmZEKCpgvDJgxGpHNgZARAIgYUxPBYQMZPPC7CjN7jGXt/tBnwJk
iOdP/HXk9ggQ5wQ=
-----END CERTIFICATE-----\`,
                    privateKey: \`-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgXa3mln4anewXtqrM
hMw6mfZhslkRa/j9P790ToKjlsihRANCAARX1TMnOkoVCnzJVu9S7m0ZOG5lP1Sp
UuBAgiuec1EqyxUsfurHtBY1TGddIHNTdKempAzPb73EqJqAiA9wHSAE
-----END PRIVATE KEY-----\`
                },
                mspId: identity.mspId,
                type: 'X.509'
            };
            
            // Import the identity into the wallet
            await wallet.put(identity.name, x509Identity);
            console.log(\`Identity \${identity.name} imported to wallet\`);
        }
        
        console.log('\\nAll test identities have been created successfully.');
        console.log('You can now run the test-cakechain.js file to test the chaincode.');
        
    } catch (error) {
        console.error(\`Failed to create test identities: \${error}\`);
        process.exit(1);
    }
}

main();
`;
    
    fs.writeFileSync(scriptPath, scriptContent);
    console.log(`\nHelper script created at ${scriptPath}`);
    console.log('Run this script to create test identities before running the tests.');
}

// Run the main test function
main();
