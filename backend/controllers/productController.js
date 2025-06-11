import Product from "../models/Product.js";
import { submitTransaction, evaluateTransaction } from "../app.js";

// Create Product (on blockchain)
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, image } = req.body;
    // Generate a unique product ID (could use uuid or timestamp)
    const id = `prod_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const result = await submitTransaction(
      "seller",
      "CreateProduct",
      id,
      name,
      description,
      image,
      createdAt,
      parseFloat(price).toString(),
      parseInt(stock).toString()
    );
    res
      .status(201)
      .json({ id, ...req.body, createdAt, blockchain: JSON.parse(result) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ===================================================================================//

// Get All Products (from blockchain)
export const getProducts = async (req, res) => {
  try {
    const result = await evaluateTransaction("any", "GetAllProducts");
    let products = [];
    try {
      products = JSON.parse(result);
      if (!Array.isArray(products)) {
        products = products ? [products] : [];
      }
    } catch (e) {
      // If parsing fails, return empty array
      products = [];
    }
    console.log("Fetched products from blockchain:", products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Product (from blockchain)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await evaluateTransaction("any", "GetProduct", id);
    const product = JSON.parse(result);
    if (!product || Object.keys(product).length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product (on blockchain)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, price, stock } = req.body;
    const result = await submitTransaction(
      "seller",
      "UpdateProduct",
      id,
      name,
      description,
      image,
      parseFloat(price).toString(),
      parseInt(stock).toString()
    );
    res.json(JSON.parse(result));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Product (on blockchain)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await submitTransaction("seller", "DeleteProduct", id);
    res.json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
