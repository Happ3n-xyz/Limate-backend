import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const rpc = process.env.RPC_URL_FUJI
const pk = process.env.PK_FUJI

if (!rpc || !pk) {
    throw new Error('RPC_URL and PK must be provided');
}

const EASContractAddress = '0xA8cb9a36e42ae9805166c4422A64AAcEaC8Cbb33';
const eas = new EAS(EASContractAddress);
const provider = new ethers.JsonRpcProvider(rpc);
const signer = new ethers.Wallet(pk, provider);
eas.connect(signer);

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder('string username, string event, string address, string id, string badge, bytes data');

const createAttestationAvax = async (data, recipient) => {
  const encodedData = schemaEncoder.encodeData([
    { name: 'username', value: data.username, type: 'string' },
    { name: 'event', value: data.event, type: 'string' },
    { name: 'address', value: data.address, type: 'string' },
    { name: 'id', value: data.id, type: 'string' },
    { name: 'badge', value: data.badge, type: 'string' },
    { name: 'data', value: data.data, type: 'bytes' }
  ]);
  console.log("Encoded data:", encodedData);

  const schemaUID = "0x43cc2a5223774d93738015693e1c405e9618194d4bae43638e21e1df1c770c5e";

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: recipient,
      expirationTime: 0,
      revocable: false,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);

  return newAttestationUID;
}

export default createAttestationAvax;