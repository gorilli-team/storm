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

///////////// START OBJECT TO ADD //////////////
const params = {
  coinName: z
    .string()
    .describe("The name of the token, all in lower case letters."),
};

async function getCryptoPrice({coinName}) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "crypto-price-app/1.0",
        Accept: "application/json",
      },
    });
    const data = await response.json();
    if (!data[coinName] || !data[coinName].usd) {
      return `Price data not found for ${coinName}`;
    }
    const price = data[coinName].usd;
    return {
      content: [
        {
          type: "text",
          text: `Current price of ${coinName}: ${price.toLocaleString()} USD`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error fetching price...`,
        },
      ],
    };
  }
}


const paramsString = JSON.stringify(params);
const encryptedParamsString = CryptoJS.AES.encrypt(
  paramsString,
  process.env.ENCRYPTION_SECRET_KEY
).toString();

const functionString = getCryptoPrice.toString();
const encryptedFunctionString = CryptoJS.AES.encrypt(
  functionString,
  process.env.ENCRYPTION_SECRET_KEY
).toString();

const encryptedData = JSON.stringify({
    params: encryptedParamsString,
    function: encryptedFunctionString,
  });
// /////////////// END OBJECT TO ADD //////////////

// ////////// ADDING THE OBJECT TO THE BUCKET /////////
const bucketAddress = "0xFf0000000000000000000000000000000000951f";

const key = "tool/get_crypto_price";
const file = new File([encryptedData], "get_crypto_price.txt", {
  type: "text/plain",
});

const { meta: addMeta } = await bucketManager.add(bucketAddress, key, file);
console.log("Object added at:", addMeta?.tx?.transactionHash);