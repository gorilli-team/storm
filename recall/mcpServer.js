import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";
import { http } from "viem";
import { processToolObject, retryOperation } from "./utils.js";

config();

// Set to track registered tool names to avoid duplicates
const registeredToolNames = new Set();

///////// SETTING UP THE RECALL CLIENT ////////
const privateKey = process.env.PRIVATE_KEY;

const formattedPrivateKey = privateKey.startsWith("0x")
  ? privateKey
  : `0x${privateKey}`;

const walletClient = createWalletClient({
  account: privateKeyToAccount(formattedPrivateKey),
  chain: testnet,
  transport: http(),
});

const client = new RecallClient({ walletClient });

////////// CREATING THE BUCKET MANAGER ////////
const bucketManager = client.bucketManager();

const results = await fetch(
  "https://storm-backend-75cc8a347510.herokuapp.com/api/buckets"
).then((res) => res.json());

let bucketAddress = results.data.map((bucket) => bucket.bucketId);

// console.log(bucketAddress);

// Add additional bucket addresses
bucketAddress = [
  ...bucketAddress,
  "0xFf0000000000000000000000000000000000951f",
  "0xff0000000000000000000000000000000000D114",
  "0xfF0000000000000000000000000000000000D4e9",
  "0xFf0000000000000000000000000000000000D494",
  "0xFF0000000000000000000000000000000000d388",
];

// const bucketAddress = ["0xFf0000000000000000000000000000000000951f"];

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
  try {
    // console.log(`Processing bucket: ${address}`);

    // Retry querying the bucket
    const queryResult = await retryOperation(async () => {
      return await bucketManager.query(address, { prefix });
    });

    if (!queryResult || !queryResult.result || !queryResult.result.objects) {
      // console.log(`No valid query result for bucket ${address}`);
      continue;
    }

    const { objects } = queryResult.result;
    if (!Array.isArray(objects) || objects.length === 0) {
      // console.log(`No objects found in bucket ${address}`);
      continue;
    }

    for (const object of objects) {
      // Process each tool object
      const toolData = await processToolObject(
        address,
        object,
        bucketManager,
        registeredToolNames
      );

      // Only register valid tools
      if (toolData) {
        try {
          server.tool(toolData.name, toolData.schema, toolData.function);

          registeredToolNames.add(toolData.name);
          // console.log(
          //   `Successfully registered tool: ${toolData.name} ${JSON.stringify(
          //     toolData.schema
          //   )} ${toolData.function}`
          // );
        } catch (error) {
          // console.log(
          //   `Error registering tool ${toolData.name}:`,
          //   error.message
          // );
        }
      }
    }
  } catch (error) {
    // console.log(`Error processing bucket ${address}:`, error.message);
  }
}

const transport = new StdioServerTransport();
await server.connect(transport);
