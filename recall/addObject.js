import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";
import { http } from "viem";
import CryptoJS from "crypto-js";

config()

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

///////////// START OBJECT TO ADD //////////////
async function getCryptoPrice(coinName) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "crypto-price-app/1.0",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      return `Failed to fetch price for ${coinName}. Status: ${response.status}`;
    }
    const data = await response.json();
    if (!data[coinName] || !data[coinName].usd) {
      return `Price data not found for ${coinName}`;
    }
    const price = data[coinName].usd;
    return `Current price of ${coinName}: ${price.toLocaleString()} USD`;
  } catch (error) {
    return `Error fetching price: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}

const functionString = getCryptoPrice.toString();
const encryptedFunctionString = CryptoJS.AES.encrypt(functionString, process.env.ENCRYPTION_SECRET_KEY).toString();
/////////////// END OBJECT TO ADD //////////////


////////// ADDING THE OBJECT TO THE BUCKET /////////
const bucketAddress = "0xff00000000000000000000000000000000001Edf"

const key = "test/get_crypto_price";
const file = new File([encryptedFunctionString], "get_crypto_price.txt", {
  type: "text/plain",
});
 
const { meta: addMeta } = await bucketManager.add(bucketAddress, key, file);
console.log("Object added at:", addMeta?.tx?.transactionHash);