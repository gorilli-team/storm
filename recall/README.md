# Storm MCP server

## Overview
This folder contains all the scripts for interacting with Recall Network, as well as the MCP server that fetches all the tools stored in the decentralized bucket.

## Setup

1- Install the dependencies

```
cd storm
npm install
```

2- Clone the .env.example and add all the variables listed

```
mv .env.example .env
```

## Scripts
### Create bucket
`createBucket.js` creates a simple bucket on Recall.<br>
**REMEMBER:** before creating a bucket, make sure to have enough RECALL tokens and credits. You can purchase it on the [Recall portal](https://portal.recall.network/).<br><br>
Run the script with:
```
cd recall
node createBucket.js
```

### Add object
`addObject.js` allows you to upload a new object on Recall. The script has been modified to accept the `params` and `function` body of the tool to upload. Inside the commented section
```
///////////// START OBJECT TO ADD //////////////
...
here
...
/////////////// END OBJECT TO ADD //////////////
```
you will need to add the params of the tool and the function body. **REMEMBER:** both the `params` and `function` body HAVE TO be in the same format as the example below, otherwise Claude Desktop will not detect them.
- Example params:
  ```
  const params = {
  coinName: z
    .string()
    .describe("The name of the token, all in lower case letters."),
    };

- Example function:
    ```
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
    ```
**REMEMBER:** when declaring the function, make sure to specify the params as an object (e.g. `getCryptoPrice({coinName})`). In addition, make sure also to change the function name when converting it to string:
```
>>> const functionString = getCryptoPrice.toString();
```

At the end of the file, it is possible to change the name of the tools to upload, and also the name of the corresponding .txt file.
```
const bucketAddress = "0xFf0000000000000000000000000000000000951f";

>>> const key = "tool/get_crypto_price";
>>> const file = new File([encryptedData], "get_crypto_price.txt", {
  type: "text/plain",
});

const { meta: addMeta } = await bucketManager.add(bucketAddress, key, file);
console.log("Object added at:", addMeta?.tx?.transactionHash);
```
Specify the name of your tool here: `"tool/NAME_OF_YOUR_TOOL"`.<br><br>

Once everything is set up, upload your tool by running the following command:
```
cd recall
node addObject.js
```

### Retrieve object
`retrieveObject.js` allows you to test the retrieval of a particular tool from the Recall bucket. All you need is the **bucket address** and the **tool name** (`"tool\NAME_OF_YOUR_TOOL"`).<br>

Make sure to specify them here:
```
const bucketAddress = "0xFf0000000000000000000000000000000000951f";
const key = "tool/get_crypto_price";
```

Once set up, run the following command to retrieve the `params` and the `function` body of the tool:
```
cd recall
node retrieveObject.js
```

### Query bucket
`queryBucket.js` lets you query one bucket to see the list of tools stored inside. Make sure to set the right bucket address.<br>

Query your bucket by running the following command:
```
cd recall
node queryBucket.js
```

### MCP server
`mcpServer.js` is the actual MCP server to be connected on the client (e.g. Claude Desktop). To do that, follow these steps:<br>
<ol>
<li>Open Claude Desktop.</li>
<li>Go to Claude/Settings...</li>
<li>Click on "Developers", and then "Change Configuration".</li>
<li>Open the file "claude_desktop_config.json" in your code editor, and add the following:</li>
</ol>
<pre><code>{
    "mcpServers": {
        "demo": {
            "command": "node",
            "args": [
                "/PATH/storm/recall/mcpServer.js"
            ],
            "env": {
                "PRIVATE_KEY": "RECALL_WALLET_PRIVATE_KEY",
                "ENCRYPTION_SECRET_KEY": "AES_ENCRYPTION_SECRET_KEY"
            }
        }
    }
}
</code></pre>
<ol start="5">
<li>Restart Claude Dekstop.</li>
</ol>