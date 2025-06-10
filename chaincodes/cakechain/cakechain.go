package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Cake represents the asset structure
type Cake struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Oven  bool   `json:"oven"`
	Flour bool   `json:"flour"`
	Shop  bool   `json:"shop"`
}

// CakeContract provides functions for managing the cake
type CakeContract struct {
	contractapi.Contract
}

// InitCake initializes a new cake
func (cc *CakeContract) InitCake(ctx contractapi.TransactionContextInterface, id, name string) error {
	cake := Cake{
		ID:    id,
		Name:  name,
		Oven:  false,
		Flour: false,
		Shop:  false,
	}

	cakeJSON, err := json.Marshal(cake)
	if err != nil {
		return fmt.Errorf("failed to marshal cake: %v", err)
	}

	return ctx.GetStub().PutState(id, cakeJSON)
}

// ApproveOven sets the Oven flag if called by Org3 admin
func (cc *CakeContract) ApproveOven(ctx contractapi.TransactionContextInterface, cakeID string) error {
	isOrg3Admin, err := cc.IsCallerOrg3Admin(ctx)
	if err != nil {
		return fmt.Errorf("authorization check failed: %v", err)
	}
	if !isOrg3Admin {
		return fmt.Errorf("only bakingstuff.com (Org3) admins can approve oven")
	}

	cake, err := cc.getCake(ctx, cakeID)
	if err != nil {
		return err
	}

	cake.Oven = true
	return cc.updateCake(ctx, cake)
}

// ApproveFlour sets the Flour flag if called by Org2 admin
func (cc *CakeContract) ApproveFlour(ctx contractapi.TransactionContextInterface, cakeID string) error {
	isOrg2Admin, err := cc.IsCallerOrg2Admin(ctx)
	if err != nil {
		return fmt.Errorf("authorization check failed: %v", err)
	}
	if !isOrg2Admin {
		return fmt.Errorf("only flourmill.com (Org2) admins can approve flour")
	}

	cake, err := cc.getCake(ctx, cakeID)
	if err != nil {
		return err
	}

	cake.Flour = true
	return cc.updateCake(ctx, cake)
}

// ApproveShop sets the Shop flag if called by Org1 admin (shop1 or shop2)
func (cc *CakeContract) ApproveShop(ctx contractapi.TransactionContextInterface, cakeID string) error {
	isOrg1Admin, err := cc.IsCallerOrg1Admin(ctx)
	if err != nil {
		return fmt.Errorf("authorization check failed: %v", err)
	}
	if !isOrg1Admin {
		return fmt.Errorf("only confectionary.com (Org1) admins can approve shop")
	}

	cake, err := cc.getCake(ctx, cakeID)
	if err != nil {
		return err
	}

	cake.Shop = true
	return cc.updateCake(ctx, cake)
}

// GetCake retrieves a cake
func (cc *CakeContract) GetCake(ctx contractapi.TransactionContextInterface, cakeID string) (*Cake, error) {
	return cc.getCake(ctx, cakeID)
}

// ===== Access Control Functions =====

func (cc *CakeContract) IsCallerOrg1Admin(ctx contractapi.TransactionContextInterface) (bool, error) {
	clientIdentity := ctx.GetClientIdentity()

	mspID, err := clientIdentity.GetMSPID()
	if err != nil {
		return false, fmt.Errorf("error getting MSP ID: %v", err)
	}

	return mspID == "Org1MSP", nil
}

func (cc *CakeContract) IsCallerOrg2Admin(ctx contractapi.TransactionContextInterface) (bool, error) {
	clientIdentity := ctx.GetClientIdentity()

	mspID, err := clientIdentity.GetMSPID()
	if err != nil {
		return false, fmt.Errorf("error getting MSP ID: %v", err)
	}

	return mspID == "Org2MSP", nil
}

func (cc *CakeContract) IsCallerOrg3Admin(ctx contractapi.TransactionContextInterface) (bool, error) {
	clientIdentity := ctx.GetClientIdentity()

	mspID, err := clientIdentity.GetMSPID()
	if err != nil {
		return false, fmt.Errorf("error getting MSP ID: %v", err)
	}

	return mspID == "Org3MSP", nil
}

// ===== Helper Methods =====

func (cc *CakeContract) getCake(ctx contractapi.TransactionContextInterface, cakeID string) (*Cake, error) {
	cakeJSON, err := ctx.GetStub().GetState(cakeID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if cakeJSON == nil {
		return nil, fmt.Errorf("cake %s does not exist", cakeID)
	}

	var cake Cake
	err = json.Unmarshal(cakeJSON, &cake)
	if err != nil {
		return nil, err
	}

	return &cake, nil
}

func (cc *CakeContract) updateCake(ctx contractapi.TransactionContextInterface, cake *Cake) error {
	cakeJSON, err := json.Marshal(cake)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(cake.ID, cakeJSON)
}

// ===== Main Function =====

func main() {
	chaincode, err := contractapi.NewChaincode(&CakeContract{})
	if err != nil {
		fmt.Printf("Error creating CakeContract chaincode: %s", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting CakeContract chaincode: %s", err)
	}
}
