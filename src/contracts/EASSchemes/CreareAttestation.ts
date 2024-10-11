import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const rpc = process.env.RPC_URL
const pk = process.env.WALLET_PK
const EASContractAddress = process.env.EAS_CONTRACT_ADDRESS;
const schemaUID = process.env.SCHEMA_UID;

if (!rpc || !pk || !EASContractAddress || !schemaUID) {
    throw new Error('RPC_URL and PK must be provided');
}

const eas = new EAS(EASContractAddress);
const provider = new ethers.JsonRpcProvider(rpc);
const signer = new ethers.Wallet(pk, provider);
eas.connect(signer);

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("string username, string location, string user_address, string id, string badge, bytes data");

const createAttestation = async (data: any, recipient: string) => {
  console.log("Data:", data);
  const encodedData = schemaEncoder.encodeData([
    { name: 'username', value: data.username, type: 'string' },
    { name: 'location', value: data.event, type: 'string' },
    { name: 'user_address', value: data.address, type: 'string' },
    { name: 'id', value: data.id, type: 'string' },
    { name: 'badge', value: data.badge, type: 'string' },
    { name: 'data', value: '0x12345678', type: 'bytes' }
  ]);
  console.log("Encoded data:", encodedData);

const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: recipient,
      expirationTime: BigInt(0),
      revocable: false,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);

  return newAttestationUID;
}

export default createAttestation;