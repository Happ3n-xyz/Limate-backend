import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const rpc = process.env.RPC_URL
const pk = process.env.WALLET_PK
const schemaUID = process.env.SCHEMA_UID;
const schemaRegistryContractAddress = process.env.SCHEMA_REGISTRY_ADDRESS;

if(!rpc || !pk || !schemaUID || !schemaRegistryContractAddress) {
  throw new Error('RPC_URL, schema uid, registry address and PK must be provided');
}

const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
const provider = new ethers.JsonRpcProvider(rpc)

schemaRegistry.connect(provider);


const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

console.log(schemaRecord);