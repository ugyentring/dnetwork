package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Product defines the product structure
type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Stock       int     `json:"stock"`
	CreatedAt   string  `json:"createdAt"`
}

// ProductChaincode provides functions for managing products
type ProductChaincode struct {
	contractapi.Contract
}

// CreateProduct adds a new product to the ledger
func (pc *ProductChaincode) CreateProduct(ctx contractapi.TransactionContextInterface, id, name, description, image, createdAt string, price float64, stock int) error {
	exists, err := pc.ProductExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("product %s already exists", id)
	}

	product := Product{
		ID:          id,
		Name:        name,
		Price:       price,
		Description: description,
		Image:       image,
		Stock:       stock,
		CreatedAt:   createdAt,
	}

	data, err := json.Marshal(product)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, data)
}

// GetProduct returns the product by ID
func (pc *ProductChaincode) GetProduct(ctx contractapi.TransactionContextInterface, id string) (*Product, error) {
	data, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, err
	}
	if data == nil {
		return nil, fmt.Errorf("product %s not found", id)
	}

	var product Product
	if err := json.Unmarshal(data, &product); err != nil {
		return nil, err
	}

	return &product, nil
}

// GetAllProducts returns all products on the ledger
func (pc *ProductChaincode) GetAllProducts(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var products []*Product
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var product Product
		if err := json.Unmarshal(queryResponse.Value, &product); err != nil {
			continue
		}
		products = append(products, &product)
	}

	return products, nil
}

// UpdateProduct modifies an existing product
func (pc *ProductChaincode) UpdateProduct(ctx contractapi.TransactionContextInterface, id, name, description, image string, price float64, stock int) error {
	product, err := pc.GetProduct(ctx, id)
	if err != nil {
		return err
	}

	product.Name = name
	product.Price = price
	product.Description = description
	product.Image = image
	product.Stock = stock

	data, err := json.Marshal(product)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, data)
}

// DeleteProduct removes a product from the ledger
func (pc *ProductChaincode) DeleteProduct(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := pc.ProductExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("product %s not found", id)
	}
	return ctx.GetStub().DelState(id)
}

// ProductExists checks if a product exists
func (pc *ProductChaincode) ProductExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	data, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&ProductChaincode{})
	if err != nil {
		panic(fmt.Sprintf("Error creating productchain: %v", err))
	}

	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("Error starting productchain: %v", err))
	}
}
