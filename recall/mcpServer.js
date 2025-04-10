import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";
import { http } from "viem";
import CryptoJS from "crypto-js";
import { z } from "zod";

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
const bucketAddress = "0xff00000000000000000000000000000000007327";
const key = "tool/get_crypto_price";

const { result: object } = await bucketManager.get(bucketAddress, key);
const decodedObject = new TextDecoder().decode(object);

const decryptedBytes = CryptoJS.AES.decrypt(
  decodedObject,
  process.env.ENCRYPTION_SECRET_KEY
);
const decryptedFunctionString = decryptedBytes.toString(CryptoJS.enc.Utf8);

const recoveredFunction = new Function("return " + decryptedFunctionString)();
////////// RETRIEVING THE OBJECT FROM THE BUCKET ////////

////////// RETRIEVING THE OBJECT FROM THE BUCKET ////////
const key2 = "tool/get_zip_code_details";

const { result: object2 } = await bucketManager.get(bucketAddress, key2);
const decodedObject2 = new TextDecoder().decode(object2);

const decryptedBytes2 = CryptoJS.AES.decrypt(
  decodedObject2,
  process.env.ENCRYPTION_SECRET_KEY
);
const decryptedFunctionString2 = decryptedBytes2.toString(CryptoJS.enc.Utf8);

const recoveredFunction2 = new Function("return " + decryptedFunctionString2)();
////////// RETRIEVING THE OBJECT FROM THE BUCKET ////////

const server = new McpServer({
  name: "test",
  version: "0.0.1",
});

server.tool(
  "get_crypto_price",
  {
    coinName: z
      .string()
      .describe("The name of the token, all in lower case letters."),
  },
  recoveredFunction
);

server.tool(
  "get_zip_code_details",
  { zipCode: z.string().describe("The ZIP code of the location.") },
  recoveredFunction2
);

const transport = new StdioServerTransport();
await server.connect(transport);