import express from 'express';
import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const getIdentityForOrg = (org) => {
  switch (org) {
    case 'buyer':
      return 'Admin@buyer.dmarket.com';
    case 'seller':
      return 'Admin@seller.dmarket.com';
    case 'bank':
      return 'Admin@bank.dmarket.com';
    case 'any':
      // Default to seller for read-only queries
      return 'Admin@seller.dmarket.com';
    default:
      throw new Error(`Unknown organization: ${org}`);
  }
};

// Get contract for the specified organization
async function getContract(org) {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identityLabel = getIdentityForOrg(org);
    const identity = await wallet.get(identityLabel);
    if (!identity) {
      throw new Error(`Identity for ${org} not found in wallet`);
    }
    const gateway = new Gateway();
    const connectionProfile = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'connection.json'), 'utf8')
    );
    const connectionOptions = {
      wallet,
      identity: identityLabel,
      discovery: { enabled: false, asLocalhost: true },
    };
    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork('dmarketchannel');
    const contract = network.getContract('productchain');
    contract.gateway = gateway;
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
    if (result && result.length > 0) {
      try {
        return JSON.stringify(JSON.parse(result.toString()));
      } catch (e) {
        return result.toString();
      }
    }
    return '{}';
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
    if (result && result.length > 0) {
      try {
        return JSON.stringify(JSON.parse(result.toString()));
      } catch (e) {
        return result.toString();
      }
    }
    return '{}';
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    throw error;
  } finally {
    if (contract && contract.gateway) {
      await contract.gateway.disconnect();
    }
  }
}

// Example productchain endpoints
app.post('/api/createProduct', async (req, res) => {
  try {
    const { id, name, description, image, price, stock } = req.body;
    const createdAt = new Date().toISOString();
    // productchain.go expects: id, name, description, image, createdAt (all string), price (float64), stock (int)
    // All args to submitTransaction must be strings, so convert price and stock
    const result = await submitTransaction(
      'seller',
      'CreateProduct',
      id,
      name,
      description,
      image,
      createdAt,
      parseFloat(price).toString(),
      parseInt(stock).toString()
    );
    res.status(201).json(JSON.parse(result));
  } catch (error) {
    console.error(`Error creating product: ${error}`);
    res.status(500).json({ error: `Failed to create product: ${error.message}` });
  }
});

app.get('/api/getProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await evaluateTransaction('any', 'GetProduct', id);
    res.status(200).json(JSON.parse(result));
  } catch (error) {
    console.error(`Error getting product: ${error}`);
    res.status(500).json({ error: `Failed to get product: ${error.message}` });
  }
});

app.put('/api/updateProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, price, stock } = req.body;
    // productchain.go expects: id, name, description, image, price (float64), stock (int)
    const result = await submitTransaction(
      'seller',
      'UpdateProduct',
      id,
      name,
      description,
      image,
      parseFloat(price).toString(),
      parseInt(stock).toString()
    );
    res.status(200).json(JSON.parse(result));
  } catch (error) {
    console.error(`Error updating product: ${error}`);
    res.status(500).json({ error: `Failed to update product: ${error.message}` });
  }
});

app.delete('/api/deleteProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await submitTransaction('seller', 'DeleteProduct', id);
    res.status(200).json(JSON.parse(result));
  } catch (error) {
    console.error(`Error deleting product: ${error}`);
    res.status(500).json({ error: `Failed to delete product: ${error.message}` });
  }
});

app.get('/api/getAllProducts', async (req, res) => {
  try {
    const result = await evaluateTransaction('any', 'GetAllProducts');
    res.status(200).json(JSON.parse(result));
  } catch (error) {
    console.error(`Error getting all products: ${error}`);
    res.status(500).json({ error: `Failed to get all products: ${error.message}` });
  }
});

export { submitTransaction, evaluateTransaction };
export default app;