import { SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const rpc = process.env.RPC_URL_FUJI
const pk = process.env.PK_FUJI

if(!rpc || !pk) {
  throw new Error('RPC_URL and PK must be provided');
}

const schemaRegistryContractAddress = '0xF744647915746Af87B590915d5CCc1B0eb58732e';
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
console.log('SchemaRegistry exists :', !!schemaRegistryContractAddress);
console.log('SchemaRegistry address:', schemaRegistryContractAddress);

const provider = new ethers.JsonRpcProvider(rpc)
const signer = new ethers.Wallet(pk, provider)

schemaRegistry.connect(signer);

const schema = 'uint256 testID2';
const resolverAddress = '0x0000000000000000000000000000000000000000';
const revocable = false;

console.log('Registering schema...');

const transaction = await schemaRegistry.register({
  schema,
  resolverAddress,
  revocable
});

// Optional: Wait for transaction to be validated
const tx = await transaction.wait();

console.log('tx info:', tx);
console.log('Transaction hash:', tx.transactionHash);

//address 0x43cc2a5223774d93738015693e1c405e9618194d4bae43638e21e1df1c770c5e