/**
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
                console.log(`Identity ${identity.name} already exists in wallet`);
                continue;
            }
            
            // Create a mock X.509 identity
            const x509Identity = {
                credentials: {
                    certificate: `-----BEGIN CERTIFICATE-----
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
-----END CERTIFICATE-----`,
                    privateKey: `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgXa3mln4anewXtqrM
hMw6mfZhslkRa/j9P790ToKjlsihRANCAARX1TMnOkoVCnzJVu9S7m0ZOG5lP1Sp
UuBAgiuec1EqyxUsfurHtBY1TGddIHNTdKempAzPb73EqJqAiA9wHSAE
-----END PRIVATE KEY-----`
                },
                mspId: identity.mspId,
                type: 'X.509'
            };
            
            // Import the identity into the wallet
            await wallet.put(identity.name, x509Identity);
            console.log(`Identity ${identity.name} imported to wallet`);
        }
        
        console.log('\nAll test identities have been created successfully.');
        console.log('You can now run the test-cakechain.js file to test the chaincode.');
        
    } catch (error) {
        console.error(`Failed to create test identities: ${error}`);
        process.exit(1);
    }
}

main();
