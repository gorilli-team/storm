# Storm × ERC-8004: Repurposing Storm as a Trustless MCP Agent Marketplace

## Executive Summary

Storm is already a decentralized marketplace for MCP tools with wallet-based authentication, quality scoring (votes/reviews), and encrypted tool storage on Recall Network. **ERC-8004 ("Trustless Agents")** introduces on-chain registries for agent Identity, Reputation, and Validation — exactly the trust primitives Storm needs to evolve from a hackathon prototype into a production-grade, cross-organizational AI agent marketplace.

This proposal outlines how Storm can become one of the first ERC-8004-native MCP tool marketplaces, replacing centralized MongoDB-based trust mechanisms with composable, on-chain trust infrastructure.

---

## Why ERC-8004 Fits Storm

| Storm Today | Gap | ERC-8004 Solution |
|---|---|---|
| Wallet-based user profiles in MongoDB | No portable, verifiable agent identity | **Identity Registry**: ERC-721 NFTs as agent identifiers with off-chain JSON agent cards |
| Reviews/votes stored in MongoDB | Reputation is siloed to Storm, no cross-platform trust | **Reputation Registry**: On-chain feedback signals composable across all ERC-8004 platforms |
| No execution verification | Consumers trust tools blindly | **Validation Registry**: Independent verification of tool execution results |
| Centralized tool discovery via API | Only works within Storm's ecosystem | **On-chain discovery**: Any ERC-8004 client can discover Storm tools |
| AES encryption on Recall | Secure but no trust provenance | **Cryptographic attestations**: TEE/ZK proofs for tool integrity |

---

## Architecture: Storm + ERC-8004

```
┌─────────────────────────────────────────────────────────────────┐
│                     Storm Frontend (Next.js)                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Tool Mgr  │  │  Marketplace │  │ Agent    │  │ Reputation │  │
│  │ (create)  │  │  (discover)  │  │ Profile  │  │ Dashboard  │  │
│  └─────┬─────┘  └──────┬───────┘  └────┬─────┘  └─────┬──────┘  │
└────────┼───────────────┼────────────────┼──────────────┼─────────┘
         │               │                │              │
         ▼               ▼                ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ERC-8004 Contract Layer                       │
│  ┌──────────────┐ ┌───────────────────┐ ┌────────────────────┐  │
│  │  Identity     │ │   Reputation      │ │   Validation       │  │
│  │  Registry     │ │   Registry        │ │   Registry         │  │
│  │  (ERC-721)    │ │   (feedback sigs) │ │   (exec proofs)    │  │
│  │              │ │                   │ │                    │  │
│  │  0x8004A1... │ │   0x8004BA...     │ │   (deploy custom)  │  │
│  └──────┬───────┘ └────────┬──────────┘ └─────────┬──────────┘  │
└─────────┼──────────────────┼──────────────────────┼──────────────┘
          │                  │                      │
          ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Storm Backend + Recall                        │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────────┐  │
│  │ Express API   │  │  Recall Network │  │  MCP Server         │  │
│  │ (tool CRUD,   │  │  (encrypted     │  │  (tool execution,   │  │
│  │  indexing)    │  │   tool storage) │  │   agent runtime)    │  │
│  └──────────────┘  └────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Implementation Plan

### Phase 1: Agent Identity (Identity Registry)

**Goal**: Every Storm tool developer and every published MCP tool gets an on-chain ERC-721 identity.

#### 1.1 Agent Registration for Tool Developers

Replace Storm's MongoDB `UserModel` with ERC-8004 Identity Registry integration:

```solidity
// Storm calls the deployed IdentityRegistry at 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
identityRegistry.registerAgent(developerWallet, agentURI);
```

The `agentURI` points to a JSON **Agent Card** stored on Recall:

```json
{
  "name": "WeatherToolDev",
  "description": "High-accuracy weather data tools for MCP agents",
  "url": "https://storm.gorilli.ai/agent/0x1234...",
  "provider": {
    "organization": "IndependentDev",
    "url": "https://github.com/weathertooldev"
  },
  "capabilities": {
    "protocols": ["MCP/1.0"],
    "toolCategories": ["weather", "geolocation"],
    "supportedInputFormats": ["json"],
    "encryptionScheme": "AES-256-CBC"
  },
  "trust": {
    "models": ["reputation"],
    "minFeedbackScore": 80,
    "identityRegistry": "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
    "chainId": 8453
  },
  "endpoints": {
    "mcpServer": "https://storm.gorilli.ai/mcp/0x1234...",
    "toolBucket": "recall://bucket/0xABCD..."
  }
}
```

#### 1.2 Tool-Level Identity

Each published MCP tool also gets its own agent NFT, enabling:
- Per-tool reputation tracking (not just per-developer)
- Tool composition where one agent-tool can call another by on-chain ID
- Marketplace discovery across any ERC-8004-compatible platform

#### 1.3 Frontend Changes

- **User Profile page** → becomes **Agent Profile** with NFT minting flow
- **Tool Manager** → adds "Register on-chain" step after publishing to Recall
- **Marketplace** → displays on-chain agent ID and links to identity registry

#### 1.4 Backend Changes

- Add `ethers.js` / `viem` contract interaction layer for IdentityRegistry
- Keep MongoDB as a cache/index but treat on-chain as source of truth
- New endpoint: `POST /api/agents/register` → mints agent NFT
- New endpoint: `GET /api/agents/:tokenId` → resolves agent card from on-chain URI

---

### Phase 2: On-Chain Reputation (Reputation Registry)

**Goal**: Replace Storm's siloed review/vote system with ERC-8004's composable on-chain reputation.

#### 2.1 Migrate Reviews to On-Chain Feedback

Storm currently stores reviews in MongoDB with `walletAddress`, `rating` (1-5), and `comment`. Map this to ERC-8004:

```solidity
reputationRegistry.giveFeedback(
    agentId,          // tool's ERC-721 tokenId
    score,            // uint8: 1-100 (map 1-5 stars → 20-100)
    tag1,             // bytes32: keccak256("mcp-tool")
    tag2,             // bytes32: keccak256("weather") — tool category
    feedbackURI,      // string: Recall URI to full review JSON
    feedbackHash,     // bytes32: hash of the review content
    feedbackAuth      // bytes: signed authorization from the tool agent
);
```

#### 2.2 Feedback Data Structure

On-chain (compact):
- `score`: Tool accuracy/reliability (0-100 scale with 2 decimals using ERC-8004's int128 + uint8 format)
- `tag1`: Domain tag (e.g., `mcp-tool`, `api-wrapper`, `data-feed`)
- `tag2`: Category tag (e.g., `weather`, `finance`, `translation`)

Off-chain (Recall URI):
```json
{
  "reviewer": "0x5678...",
  "toolId": 42,
  "score": 8750,
  "scoreDecimals": 2,
  "comment": "Accurate weather data, fast response times",
  "executionMetrics": {
    "avgLatencyMs": 230,
    "successRate": 0.98,
    "samplesCount": 150
  },
  "proofOfUsage": "0xSIGNATURE..."
}
```

#### 2.3 Sybil Resistance

ERC-8004 requires `feedbackAuth` — a cryptographic signature from the tool agent authorizing feedback. This prevents fake reviews:

1. User calls a Storm MCP tool
2. After execution, the tool agent signs a `FeedbackAuth` struct authorizing the user's wallet
3. User submits feedback to ReputationRegistry with this authorization
4. Contract verifies the signature (EIP-191 or ERC-1271)

This directly solves the trust problem Storm's current review system has — anyone can currently post reviews without proving they used the tool.

#### 2.4 Reputation-Weighted Tool Selection

Upgrade Storm's planned quality-based selection (currently pseudocode in README) to use on-chain reputation:

```javascript
async function selectTool(category, parameters) {
  const eligibleTools = await getToolsByCategory(category);

  // Fetch on-chain reputation for each tool
  const toolsWithReputation = await Promise.all(
    eligibleTools.map(async (tool) => {
      const feedbackCount = await reputationRegistry.getFeedbackCount(tool.agentId);
      const avgScore = await reputationRegistry.getAverageScore(tool.agentId);
      return { tool, feedbackCount, avgScore };
    })
  );

  // Weight by on-chain reputation score
  const totalWeight = toolsWithReputation.reduce(
    (sum, t) => sum + (t.avgScore * Math.log(t.feedbackCount + 1)), 0
  );

  // Probabilistic selection weighted by reputation
  const rand = Math.random() * totalWeight;
  let cumulative = 0;
  for (const t of toolsWithReputation) {
    cumulative += t.avgScore * Math.log(t.feedbackCount + 1);
    if (rand <= cumulative) return t.tool;
  }
}
```

---

### Phase 3: Execution Validation (Validation Registry)

**Goal**: Add independent verification of MCP tool execution for high-stakes use cases.

#### 3.1 Validation Flow for Storm Tools

```
User Request → Storm MCP Server → Tool Execution → Result
                                                      │
                                                      ▼
                                              Validation Request
                                              (requestURI + hash)
                                                      │
                                                      ▼
                                              Validator Node(s)
                                              (re-execute or verify)
                                                      │
                                                      ▼
                                              Validation Response
                                              (on-chain proof)
```

#### 3.2 Validator Types for MCP Tools

| Validator Type | Use Case | Example |
|---|---|---|
| **Re-execution** | Deterministic tools (unit conversion, math) | Validator re-runs the function with same inputs, compares outputs |
| **Cross-reference** | Data feeds (weather, financial) | Validator checks result against independent data source |
| **TEE attestation** | Privacy-sensitive tools | Tool runs in a TEE, produces attestation proof |
| **Stake-secured** | High-value operations | Validators stake tokens, lose stake if they approve bad results |

#### 3.3 Implementation

```solidity
// Storm's validator contract submits results
validationRegistry.validationRequest(
    validatorAddress,    // Storm's validator contract
    agentId,             // tool's agent NFT ID
    requestUri,          // Recall URI with execution inputs/outputs
    requestHash          // hash of the execution data
);

// After validation completes
validationRegistry.validationResponse(
    requestHash,         // matching the request
    response,            // uint8: 1=valid, 0=invalid
    responseUri,         // Recall URI with validation details
    responseHash,        // hash of validation data
    tag                  // bytes32: validation method tag
);
```

#### 3.4 Trust Tiers

Map tool categories to appropriate trust levels:

| Tier | Trust Model | Storm Tool Categories | Cost |
|---|---|---|---|
| **Tier 1: Casual** | Reputation only | Jokes, trivia, simple lookups | Free |
| **Tier 2: Standard** | Reputation + basic validation | Weather, translation, news | Low gas |
| **Tier 3: Premium** | Full validation + stake | Financial data, medical info, legal | Higher gas, validator rewards |

---

### Phase 4: Cross-Platform Agent Discovery

**Goal**: Make Storm tools discoverable by any ERC-8004-compatible agent or platform.

#### 4.1 MCP Server as ERC-8004 Agent Runtime

Upgrade `recall/mcpServer.js` to be an ERC-8004-aware agent runtime:

```javascript
// mcpServer.js — enhanced with ERC-8004
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const identityRegistry = getContract({
  address: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
  abi: IDENTITY_REGISTRY_ABI,
  client: publicClient
});

// Discover tools from on-chain registry
async function discoverAgents(category) {
  // Query on-chain events for registered agents with matching capabilities
  const agents = await identityRegistry.queryFilter('AgentRegistered');

  // Fetch and parse agent cards
  const agentCards = await Promise.all(
    agents.map(async (event) => {
      const uri = await identityRegistry.tokenURI(event.tokenId);
      const card = await fetchFromRecall(uri);
      return { tokenId: event.tokenId, ...card };
    })
  );

  // Filter by MCP capability and category
  return agentCards.filter(card =>
    card.capabilities?.protocols?.includes('MCP/1.0') &&
    card.capabilities?.toolCategories?.includes(category)
  );
}
```

#### 4.2 Agent-to-Agent Tool Composition

ERC-8004 enables Storm tools to discover and call other Storm tools (or tools on other platforms) by on-chain identity:

```javascript
// A Storm tool that composes other trusted tools
async function compositeWeatherAnalysis(location) {
  // Discover weather data tools with on-chain reputation > 80
  const weatherTools = await discoverAgents('weather');
  const trustedTools = weatherTools.filter(t => t.reputationScore > 80);

  // Call the highest-reputation tool
  const weatherData = await callAgent(trustedTools[0].tokenId, { location });

  // Discover translation tools if user needs localized output
  const translationTools = await discoverAgents('translation');
  const localizedResult = await callAgent(translationTools[0].tokenId, {
    text: weatherData.summary,
    targetLang: 'it'
  });

  return localizedResult;
}
```

---

### Phase 5: Tokenomics Integration

**Goal**: Connect Storm's planned micropayment system with ERC-8004's trust infrastructure.

#### 5.1 Reputation-Weighted Pricing

Tools with higher on-chain reputation can charge more:

```javascript
function calculateToolPrice(tool) {
  const basePrice = tool.basePrice;
  const reputationMultiplier = 1 + (tool.onChainReputationScore / 100);
  const validationPremium = tool.requiresValidation ? 1.2 : 1.0;
  return basePrice * reputationMultiplier * validationPremium;
}
```

#### 5.2 x402 Payment Integration

ERC-8004 complements the **x402** HTTP payment protocol (by Coinbase/Cloudflare). Storm's MCP server can require x402 payments:

```
HTTP/1.1 402 Payment Required
X-Payment: x402
X-Price: 0.001 USDC
X-Agent-Id: storm:8453:0x8004A1...:42
X-Reputation-Score: 92.5
```

This creates a flow where:
1. Client agent discovers a Storm tool via Identity Registry
2. Checks reputation via Reputation Registry
3. Pays via x402 to access the tool
4. Tool executes, result optionally validated via Validation Registry
5. Client submits on-chain feedback to Reputation Registry

---

## Migration Strategy

### What Changes

| Component | Current | After ERC-8004 |
|---|---|---|
| **User identity** | MongoDB `UserModel` | ERC-721 agent NFTs (MongoDB as cache) |
| **Tool identity** | MongoDB `ToolModel.toolId` | ERC-721 tokenId per tool |
| **Reviews** | MongoDB reviews collection | On-chain `ReputationRegistry.giveFeedback()` |
| **Votes** | MongoDB upvote/downvote counts | On-chain feedback scores (int128 + uint8) |
| **Tool discovery** | `GET /api/tools` from MongoDB | On-chain IdentityRegistry + off-chain agent cards |
| **Tool storage** | Recall Network (unchanged) | Recall Network (unchanged) |
| **Tool execution** | MCP server (enhanced) | MCP server + optional validation |
| **Payments** | Planned Recall tokens | x402 + Recall tokens |

### What Stays the Same

- Recall Network for encrypted tool storage
- AES encryption for tool parameters and functions
- MCP protocol for tool execution
- Next.js frontend / Express backend architecture
- Privy wallet authentication (used to sign ERC-8004 transactions)

### Migration Path

1. **Phase 1** (Identity): Add on-chain agent registration alongside existing MongoDB. Dual-write during transition.
2. **Phase 2** (Reputation): New reviews go on-chain. Migrate historical reviews as initial feedback batch.
3. **Phase 3** (Validation): Optional feature for premium tools. No breaking changes.
4. **Phase 4** (Discovery): Add on-chain discovery as additional source. MongoDB remains for fast queries.
5. **Phase 5** (Payments): Layer x402 on top of existing payment plans.

---

## Technical Requirements

### New Dependencies

```json
{
  "viem": "^2.x",
  "ethers": "^6.x",
  "@erc-8004/contracts": "latest",
  "@openzeppelin/contracts": "^5.x"
}
```

### Target Networks

| Network | Purpose | Why |
|---|---|---|
| **Base** | Primary deployment | Low gas, Coinbase ecosystem (x402 native), ERC-8004 already deployed |
| **Ethereum Mainnet** | High-value agent identities | Maximum security and legitimacy |
| **Arbitrum** | Alternative L2 | Developer ecosystem, low gas |

### Contract Addresses (Already Deployed by ERC-8004 Team)

- **IdentityRegistry**: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- **ReputationRegistry**: `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`
- Available on 20+ EVM networks

---

## Competitive Advantage

By adopting ERC-8004, Storm gains:

1. **Network effects**: Any ERC-8004-compatible platform can discover and use Storm tools — not just Storm users
2. **Portable reputation**: Tool developers build reputation that follows them across platforms
3. **Sybil resistance**: Cryptographic proof-of-usage for reviews eliminates fake feedback
4. **Composability**: Tools can discover and call other tools trustlessly across organizational boundaries
5. **Standards compliance**: Position Storm as a reference implementation for the emerging agent economy
6. **Ecosystem support**: ERC-8004 is backed by MetaMask, Coinbase, Google, and the Ethereum Foundation

---

## Relationship to ERC-8004 v2

The ERC-8004 v2 specification explicitly targets **deeper MCP support**. Storm, as an MCP-native marketplace, is uniquely positioned to:

- Contribute to v2 spec development with real-world MCP integration patterns
- Serve as a reference implementation for MCP + ERC-8004
- Define the standard agent card schema for MCP tool providers
- Pioneer the `MCP → ERC-8004 → x402` payment flow

---

## Summary

Storm already solves the "MCP tool marketplace" problem. ERC-8004 transforms it from a siloed platform into a node in a global, trustless agent economy. The integration is natural: Storm's reviews become on-chain reputation, Storm's users become on-chain agents, and Storm's tools become discoverable by any AI agent anywhere.

The result: **Storm becomes the first ERC-8004-native MCP tool marketplace** — a reference implementation at the intersection of the two most important standards for the machine economy.
