# Backend

## Overview
This folder contains all the backend code for the Storm project. The backend serves as an interface between the frontend application and the Recall Network, managing decentralized storage operations and providing endpoints for the frontend to interact with.
<br>
The backend manages:
- API endpoints for entity management (buckets, tools, and users)
- Data persistence in MongoDB alongside Recall Network storage

## Setup

1- Install the dependencies

```
cd backend
yarn install
```

2- Create an environment file from the example:

```
mv .env.example .env
```

3- Configure your environment variables in the .env file:

```
MONGODB_URI=<your-mongodb-connection-string>
PORT=<port-for-the-server>
```

## Data Model
The backend manages three primary entities:

### Buckets
Represent storage containers on the Recall Network, associated with a wallet address.

### Tools
Functions stored in buckets that can be executed through the application.
Tools include metadata like description, hashtags, usage statistics, reviews, and votes. Each tool belongs to a specific bucket and is associated with a wallet address

### Users
User profiles identified by wallet addresses.
Users can create buckets, publish tools, write reviews, and vote on tools.

## Prerequisites

- Node.js (version 20.x to 23.x)
- Yarn package manager
- MongoDB instance