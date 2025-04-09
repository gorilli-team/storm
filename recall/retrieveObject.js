import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";
import { http } from "viem";
import CryptoJS from "crypto-js";

config();

///////// SETTING UP THE RECALL CLIENT ////////
const privateKey = process.env.PRIVATE_KEY;
const walletClient = createWalletClient({
  account: privateKeyToAccount(privateKey),
  chain: testnet,
  transport: http(),
});

const client = new RecallClient({ walletClient });

////////// CREATING THE BUCKET MANAGER ////////
const bucketManager = client.bucketManager();

////////// RETRIEVING THE OBJECT FROM THE BUCKET ////////
const bucketAddress = "0xff00000000000000000000000000000000001Edf";
const key = "test/get_crypto_price";

const { result: object } = await bucketManager.get(bucketAddress, key);
const decodedObject = new TextDecoder().decode(object);

const decryptedBytes = CryptoJS.AES.decrypt(decodedObject, process.env.ENCRYPTION_SECRET_KEY);
const decryptedFunctionString = decryptedBytes.toString(CryptoJS.enc.Utf8);

const recoveredFunction = new Function("return " + decryptedFunctionString)();

const result = await recoveredFunction("bitcoin");
console.log(result);