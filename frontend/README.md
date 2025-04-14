# Frontend

## Overview
This folder contains all the frontend code for the Storm project. The frontend provides a user interface to interact with the Storm platform. It connects directly to the Recall Network through the Recall SDK to create buckets and add tools, while simultaneously saving this information to our MongoDB database through the backend API. This dual storage approach allows us to filter and display only the buckets and tools created specifically through Storm, as buckets and tools can also be created directly on Recall Network.

The frontend enables users to:
- Create buckets and tools on Recall Network 
- Browse and discover tools created through Storm from developers
- View tools details, vote, and write reviews
- Connect wallet for authentication

## Setup

1- Install the dependencies

```
cd frontend
yarn install
```

2- Create an environment file from the example:

```
mv .env.example .env
```

3- Configure your environment variables in the .env file:

```
NEXT_PUBLIC_PRIVY_APP_ID=<your-privy-app-id>
NEXT_PUBLIC_ENCRYPTION_SECRET_KEY=<your-encryption-key>
NEXT_PUBLIC_API_URL=<your-backend-api-url>
```

4- Start the development server:

```
yarn dev
```

## Environment Variables

### NEXT_PUBLIC_PRIVY_APP_ID
App ID for Privy wallet integration, which serves as the authentication provider.

### NEXT_PUBLIC_ENCRYPTION_SECRET_KEY
Secret key used to encrypt function code and parameters created by developers. This key is used to encrypt content before saving to Recall Network, and the same key must be used in the backend to decrypt content.

### NEXT_PUBLIC_API_URL
URL pointing to the backend API server.

## Features

### Tool Manager
- Create and publish tools to the Recall Network
- Create new storage buckets on the Recall Network
- View your created tools
- Add functions with a Monaco code editor
- Add parameters using Zod schemas

### Marketplace
- Browse and discover tools created on Storm
- View detailed information about tools
- Vote for tools and write reviews
- Copy tool code for reference

### Wallet Integration
Users can connect their wallets via Privy integration for authentication and to perform actions like creating tools and buckets.

### Code Editor
Monaco Editor integration for creating and editing tool functions with syntax highlighting and code completion.

## Prerequisites
- Yarn package manager
- Access to a running Storm backend instance