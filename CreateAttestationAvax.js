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
const schemaEncoder = new SchemaEncoder("uint256 testID2");
const encodedData = schemaEncoder.encodeData([
    { name: 'testID2', value: 1, type: 'uint256' }
]);
console.log("Encoded data:", encodedData);

const schemaUID = "0x43cc2a5223774d93738015693e1c405e9618194d4bae43638e21e1df1c770c5e";

const tx = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: "0x990Eb4Fc85e92B33622552B3Ed267E47eA4D5a51",
    expirationTime: 0,
    revocable: false,
    data: encodedData,
  },
});

const newAttestationUID = await tx.wait();

console.log("New attestation UID:", newAttestationUID);

//UUID 0x5d122b0b0cbae24e4a90b40b28dde4ad997dd47ac30ea0bd6bdac5aefe69c527