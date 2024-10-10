import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const rpc = process.env.RPC_URL
const pk = process.env.WALLET_PK

if (!rpc || !pk) {
    throw new Error('RPC_URL and PK must be provided');
}

