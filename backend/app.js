const express = require('express'); 
const { Gateway, Wallets } = require('fabric-network'); 
const fs = require('fs'); 
const path = require('path'); 
 
const app = express(); 
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const getIdentityForOrg = (org) => {
  switch (org) {
    case 'shop1':
    case 'shop2':
    case 'any':
      return 'Admin@confectionary.com';
    case 'mill':
    case 'any':
      return 'Admin@flourmill.com';
    case 'oven':
    case 'any':
      return 'Admin@bakingstuff';
    default:
      throw new Error(`Unknown organization: ${org}`);
  }
};

// Get contract for the specified organization
async function getContract(org) {
  try {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get(getIdentityForOrg(org));
    console.log("Iden" + identity)

    if (!identity) {
      throw new Error(`Identity for ${org} not found in wallet`);
    }

    const gateway = new Gateway();
    const connectionProfile = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "connection.json"), "utf8")
    );

    const connectionOptions = {
      wallet,
      identity: identity,
      discovery: { enabled: false, asLocalhost: true },
    };

    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork("confectionarychannel");
    const contract = network.getContract("cakechain");

    // Store gateway in the contract object for later disconnection
    contract.gateway = gateway;
    console.log(contract);
    return contract;
  } catch (error) {
    console.error(`Failed to get contract: ${error}`);
    throw error;
  }
}

// Submit transaction to the chaincode
async function submitTransaction(org, functionName, ...args) {
  let contract;
  try {
    contract = await getContract(org);
    const result = await contract.submitTransaction(functionName, ...args);

    // For Go chaincode, we need to parse the result if it's a JSON string
    if (result && result.length > 0) {
      try {
        // Try to parse as JSON first
        return JSON.stringify(JSON.parse(result.toString()));
      } catch (e) {
        // If not valid JSON, return as string
        return result.toString();
      }
    }
    console.log("Nothing")
    return "{}"; // Return empty object if no result
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    throw error;
  } finally {
    if (contract && contract.gateway) {
      await contract.gateway.disconnect();
    }
  }
}

// Evaluate transaction from the chaincode
async function evaluateTransaction(org, functionName, ...args) {
  let contract;
  try {
    contract = await getContract(org);
    const result = await contract.evaluateTransaction(functionName, ...args);
    console.log("evaluate Transcation: " + result.toString());
    // For Go chaincode, we need to parse the result if it's a JSON string
    if (result && result.length > 0) {
      try {
        // Try to parse as JSON first
        return JSON.stringify(JSON.parse(result.toString()));
      } catch (e) {
        // If not valid JSON, return as string
        return result.toString();
      }
    }
    console.log("Nothing")
    return "{}"; // Return empty object if no result
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    throw error;
  } finally {
    if (contract && contract.gateway) {
      await contract.gateway.disconnect();
    }
  }
}


app.post('/api/createCake', async (req, res) => {
    try{
        const{
            id,
            name
        } = req.body;

        const result = await submitTransaction('shop1', 'InitCake', id, name);
        res.status(201).json(JSON.parse(result));
} catch (error) {
        console.error(`Error creating cake: ${error}`);
        res.status(500).json({ error: `Failed to create cake: ${error.message}` }); 
    }
});

app.get('/api/getCake/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const result = await evaluateTransaction('any', 'GetCake', id);
        res.status(200).json(JSON.parse(result));
    } catch(error){
        console.error(`Error getting cake: ${error}`);
        res.status(500).json({ error: `Failed to get cake: ${error.message}` });
    }
})

app.put('/api/approveFlour/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const result = await submitTransaction('mill', 'ApproveFlour', id);
        res.status(200).json(JSON.parse(result));
    } catch(error){
        console.error(`Error approving flour: ${error}`);
        res.status(500).json({ error: `Failed to approve flour: ${error.message}` });
    }
})

app.put('/api/approveOven/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const result = await submitTransaction('oven', 'ApproveOven', id);
        res.status(200).json(JSON.parse(result));
    } catch(error){
        console.error(`Error approving oven: ${error}`);
        res.status(500).json({ error: `Failed to approve oven: ${error.message}` });
    }
})

app.put('/api/approveShop/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const result = await submitTransaction('shop1', 'ApproveShop', id);
        res.status(200).json(JSON.parse(result));
    } catch(error){
        console.error(`Error approving shop: ${error}`);
        res.status(500).json({ error: `Failed to approve shop: ${error.message}` });
    }
})
module.exports = app;