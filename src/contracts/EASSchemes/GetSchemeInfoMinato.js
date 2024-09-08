import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const rpc = process.env.RPC_URL_MINATO
const pk = process.env.PK_MINATO

if(!rpc || !pk) {
  throw new Error('RPC_URL and PK must be provided');
}

const schemaRegistryContractAddress = "0xcea3db944B2c3949FE2DA780D68f4ba1E41A0b4A"; // Sepolia 0.26
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
const provider = new ethers.JsonRpcProvider(rpc)

schemaRegistry.connect(provider);

const schemaUID = "0x43cc2a5223774d93738015693e1c405e9618194d4bae43638e21e1df1c770c5e";

const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

console.log(schemaRecord);