import { z } from "zod";
import CryptoJS from "crypto-js";

// Helper function to retry operations
export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      // console.log(`Operation failed (attempt ${attempt}/${maxRetries}): ${error.message}`);

      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1);
        // console.log(`Retrying in ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  // console.log(`Operation failed after ${maxRetries} attempts. Giving up.`);
  return null;
}

// Helper function to validate a function string
export function isValidFunctionString(functionString) {
  if (!functionString || typeof functionString !== "string") {
    return false;
  }

  // Check if it contains function definition patterns
  const hasFunctionKeyword = functionString.includes("function");
  const hasArrowFunction = functionString.includes("=>");
  const hasReturnStatement = functionString.includes("return");

  // It should have at least one of these patterns
  return (hasFunctionKeyword || hasArrowFunction) && hasReturnStatement;
}

// Helper function to safely evaluate a function string
export function safeEvaluateFunction(functionString) {
  try {
    // Check if it's a valid function string
    if (!isValidFunctionString(functionString)) {
      // console.log("Invalid function string format");
      return null;
    }

    // Try to evaluate it
    const evaluatedFunction = new Function("return " + functionString)();

    // Verify it's actually a function
    if (typeof evaluatedFunction !== "function") {
      // console.log("Evaluated result is not a function");
      return null;
    }

    return evaluatedFunction;
  } catch (error) {
    // console.log("Error evaluating function:", error.message);
    return null;
  }
}

// Helper function to validate schema
export function isValidSchema(schema) {
  try {
    // Check if schema is an object
    if (!schema || typeof schema !== "object") {
      return false;
    }

    // Check if it has at least one property
    const keys = Object.keys(schema);
    if (keys.length === 0) {
      return false;
    }

    // Check if all properties are Zod schemas
    for (const key of keys) {
      if (!schema[key] || typeof schema[key] !== "object") {
        return false;
      }

      // Check for basic Zod schema properties
      if (!schema[key]._def || !schema[key].parse) {
        return false;
      }
    }

    return true;
  } catch (error) {
    // console.log("Error validating schema:", error.message);
    return false;
  }
}

// Function to reconstruct the ZOD schema from args string
export function reconstructZodSchema(serializedSchema) {
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

// Helper function to process a tool object
export async function processToolObject(
  address,
  object,
  bucketManager,
  registeredToolNames
) {
  if (!object || !object.key) {
    // console.log(`Invalid object in bucket ${address}`);
    return null;
  }

  const key = object.key;
  // console.log(`Processing object: ${key}`);

  // Retry getting the object
  const getResult = await retryOperation(async () => {
    const result = await bucketManager.get(address, key);
    if (!result || !result.result) return null;
    return result;
  });

  if (!getResult) {
    // console.log(`No valid result for object ${key} from bucket ${address}`);
    return null;
  }

  const retrievedObject = getResult.result;
  if (!retrievedObject) {
    // console.log(`Empty object retrieved for ${key}`);
    return null;
  }

  let decodedObject;
  try {
    decodedObject = new TextDecoder().decode(retrievedObject);
  } catch (error) {
    // console.log(`Error decoding object ${key}:`, error.message);
    return null;
  }

  if (!decodedObject) {
    // console.log(`Failed to decode object ${key}`);
    return null;
  }

  let parsedObject;
  try {
    parsedObject = JSON.parse(decodedObject);
  } catch (error) {
    // console.log(`Error parsing object ${key}:`, error.message);
    return null;
  }

  if (!parsedObject || typeof parsedObject !== "object") {
    // console.log(`Invalid parsed object for ${key}`);
    return null;
  }

  if (!parsedObject.params || !parsedObject.function) {
    // console.log(`Object ${key} is missing params or function`);
    return null;
  }

  const encryptedParams = parsedObject.params;
  const encryptedFunction = parsedObject.function;

  // Get the encryption key
  const secretKey = process.env.ENCRYPTION_SECRET_KEY;
  if (!secretKey) {
    // console.log(`Encryption key is missing`);
    return null;
  }

  try {
    // Decrypt the parameters
    const decryptedArgsBytes = CryptoJS.AES.decrypt(encryptedParams, secretKey);
    const decryptedArgsString = decryptedArgsBytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedArgsString) {
      // console.log(`Decrypted params string is empty`);
      return null;
    }

    // Decrypt the function
    const decryptedFunctionBytes = CryptoJS.AES.decrypt(
      encryptedFunction,
      secretKey
    );
    const decryptedFunctionString = decryptedFunctionBytes.toString(
      CryptoJS.enc.Utf8
    );

    if (!decryptedFunctionString) {
      // console.log(`Decrypted function string is empty`);
      return null;
    }

    // Parse the decrypted args
    let recoveredArgs;
    try {
      recoveredArgs = JSON.parse(decryptedArgsString);
    } catch (error) {
      // console.log(`Error parsing decrypted args for ${key}:`, error.message);
      return null;
    }

    if (!recoveredArgs || typeof recoveredArgs !== "object") {
      // console.log(`Invalid recovered args for ${key}`);
      return null;
    }

    // Evaluate the function safely
    const recoveredFunction = safeEvaluateFunction(decryptedFunctionString);
    if (!recoveredFunction) {
      // console.log(`Failed to evaluate function for ${key}`);
      return null;
    }

    // Reconstruct and validate the schema
    let reconstructedSchema;
    try {
      reconstructedSchema = reconstructZodSchema(recoveredArgs);
      if (!isValidSchema(reconstructedSchema)) {
        // console.log(`Invalid schema for ${key}`);
        return null;
      }
    } catch (error) {
      // console.log(`Error reconstructing schema for ${key}:`, error.message);
      return null;
    }

    // Get and validate the tool name
    const toolName = `${object.key.split("/")[1]}`;
    if (!toolName) {
      // console.log(`Could not extract tool name from key ${key}`);
      return null;
    }

    // Check for duplicate tools
    if (registeredToolNames.has(toolName)) {
      // console.log(`Tool name "${toolName}" is already registered`);
      return null;
    }

    // Return the validated tool data
    return {
      name: toolName,
      schema: reconstructedSchema,
      function: recoveredFunction,
    };
  } catch (error) {
    // console.log(`Error processing object ${key}:`, error.message);
    return null;
  }
}
