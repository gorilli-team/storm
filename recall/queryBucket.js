import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";
import { http } from "viem";

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
const bucketAddress = "0xFf0000000000000000000000000000000000626B";

////////// QUERYING THE TOOL FOLDER IN THE BUCKET ////////
const prefix = "tool/";
const {
  result: { objects },
} = await bucketManager.query(bucketAddress, { prefix });
console.log("Available tools: ")
objects.map((object) => {
  console.log(object.key.split("/")[1]);
})