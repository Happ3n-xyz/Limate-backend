import { SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const rpc = process.env.RPC_URL_FUJI
const pk = process.env.PK_FUJI

if(!rpc || !pk) {
  throw new Error('RPC_URL and PK must be provided');
}

const schemaRegistryContractAddress = '0x4200000000000000000000000000000000000020';
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
console.log('SchemaRegistry exists :', !!schemaRegistryContractAddress);
console.log('SchemaRegistry address:', schemaRegistryContractAddress);

const provider = new ethers.JsonRpcProvider(rpc)
const signer = new ethers.Wallet(pk, provider)

schemaRegistry.connect(signer);

const schema = 'string username, string event, string address, string id, string badge, bytes data';
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

//scheme 0x8abaa80ab2acc6983c434322cabbe66c3d0f7477c7e6ee001972beda33d03a25