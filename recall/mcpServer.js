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

////////// FUNCTION TO RECONSTRUCT THE ZOD SCHEMA FROM ARGS STRING ////////
function reconstructZodSchema(serializedSchema) {
  const schema = {};

  for (const [key, value] of Object.entries(serializedSchema)) {
    if (value._def) {
      switch (value._def.typeName) {
        case "ZodString":
          schema[key] = z.string();

          if (value._def.description) {
            schema[key] = schema[key].describe(value._def.description);
          }

          if (value._def.checks && value._def.checks.length > 0) {
            for (const check of value._def.checks) {
              switch (check.kind) {
                case "min":
                  schema[key] = schema[key].min(check.value, check.message);
                  break;
                case "max":
                  schema[key] = schema[key].max(check.value, check.message);
                  break;
                case "regex":
                  schema[key] = schema[key].regex(check.regex, check.message);
                  break;
              }
            }
          }
          break;
      }
    }
  }

  return schema;
}

const bucketAddress = [
  "0xFf0000000000000000000000000000000000951f",
  "0xff0000000000000000000000000000000000D114",
];

const server = new McpServer({
  name: "test",
  version: "0.0.1",
});

/////////////////////////////////////////////////////////////////////////////////////
///////// LOOPING THROUGH THE TOOL IN THE BUCKET AND ADDING THEM TO THE MCP SERVER
/////////////////////////////////////////////////////////////////////////////////////
const prefix = "tool/";

// Loop through each bucket address
for (const address of bucketAddress) {
  const {
    result: { objects },
  } = await bucketManager.query(address, { prefix });

  for (const object of objects) {
    const key = object.key;

    const { result: retrievedObject } = await bucketManager.get(address, key);
    const decodedObject = new TextDecoder().decode(retrievedObject);

    const encryptedParams = JSON.parse(decodedObject).params;
    const encryptedFunction = JSON.parse(decodedObject).function;

    const decryptedArgsBytes = CryptoJS.AES.decrypt(
      encryptedParams,
      process.env.ENCRYPTION_SECRET_KEY
    );
    const decryptedArgsString = decryptedArgsBytes.toString(CryptoJS.enc.Utf8);

    const decryptedFunctionBytes = CryptoJS.AES.decrypt(
      encryptedFunction,
      process.env.ENCRYPTION_SECRET_KEY
    );
    const decryptedFunctionString = decryptedFunctionBytes.toString(
      CryptoJS.enc.Utf8
    );

    const recoveredArgs = JSON.parse(decryptedArgsString);
    const recoveredFunction = new Function(
      "return " + decryptedFunctionString
    )();

    const reconstructedSchema = reconstructZodSchema(recoveredArgs);

    server.tool(
      `${object.key.split("/")[1]}`,
      reconstructedSchema,
      recoveredFunction
    );
  }
}

const transport = new StdioServerTransport();
await server.connect(transport);
