import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const rpc = process.env.RPC_URL_MINATO
const pk = process.env.PK_MINATO

if (!rpc || !pk) {
    throw new Error('RPC_URL and PK must be provided');
}

const EASContractAddress = '0x26c4fC4a8dbf3df3f0881C8440FBdD0FB4b41769';
const eas = new EAS(EASContractAddress);
const provider = new ethers.JsonRpcProvider(rpc);
const signer = new ethers.Wallet(pk, provider);
eas.connect(signer);

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("uint256 testID2");
const encodedData = schemaEncoder.encodeData([
    { name: 'testID2', value: 1, type: 'uint256' }
]);
console.log("Encoded data:", encodedData);

const schemaUID = "0x43cc2a5223774d93738015693e1c405e9618194d4bae43638e21e1df1c770c5e";

const tx = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: "0xFc92f9989080B1d5478972896997710920DC83e1",
    expirationTime: 0,
    revocable: false,
    data: encodedData,
  },
});

const newAttestationUID = await tx.wait();

console.log("New attestation UID:", newAttestationUID);

//UUID 0x7bfd60b1fdb2622b7bff6569f70f94337d9e59923831fba365e2ffc20a18ad37