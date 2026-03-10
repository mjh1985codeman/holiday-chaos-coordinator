# Holiday Chaos Coordinator

A holiday gift shopping organizer built with the MERN stack and GraphQL. Search for products via the eBay Browse API, save them to custom shopping lists, and assign gifts to individual recipients - all in one place.

**Live:** [holiday-chaos-coordinator-production.up.railway.app](https://holiday-chaos-coordinator-production.up.railway.app/)

## Features

- **List management** - Create and organize shopping lists by group (friends, co-workers, family, etc.)
- **Recipient tracking** - Add recipients to lists and assign products directly to them
- **eBay product search** - Search for gifts via the eBay Browse API without needing your own eBay credentials
- **Flexible assignment** - Add a product to a single recipient, all recipients, or all recipients on a specific list
- **Authentication** - Sign up and log in with JWT-based auth

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, React Router 6, Material UI 6, Apollo Client 3 |
| **Backend** | Node.js, Express, Apollo Server 3, GraphQL |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT, bcryptjs |
| **External API** | eBay Browse API (OAuth2) |
| **Deployment** | Railway |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- eBay API credentials (Client ID and Client Secret)

### Setup

1. Clone the repo and install dependencies:

   ```bash
   npm run install
   ```

2. Create `server/.env` from the example file and fill in your values:

   ```
   MONGODB_URI=your_mongodb_connection_string
   EBAY_CLIENT_ID=your_ebay_client_id
   EBAY_CLIENT_SECRET=your_ebay_client_secret
   JWT_SEC=your_jwt_secret
   NODE_ENV=development
   PORT=3001
   ```

3. Start the dev servers:

   ```bash
   npm run develop
   ```

   Client runs on `http://localhost:3000`, API on `http://localhost:3001`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install` | Install server and client dependencies |
| `npm run develop` | Run client and server concurrently |
| `npm start` | Run server only (production) |
| `npm run build` | Build React client for production |

## Project Structure

```
holiday-chaos-coordinator/
├── client/
│   ├── src/
│   │   ├── components/     # Lists, ProductCard, SearchResults, AddToListModal, etc.
│   │   ├── utils/          # GraphQL queries, mutations, auth helpers
│   │   └── App.js          # Routes and Apollo provider
│   └── package.json
├── server/
│   ├── models/             # User, List, Recipient (Mongoose)
│   ├── schemas/            # GraphQL typeDefs and resolvers
│   ├── utils/              # Auth middleware, eBay API client
│   ├── server.js
│   └── .env.example
└── package.json
```

## Data Models

- **User** - firstName, email, password, lists
- **List** - listName, listUser, recipients
- **Recipient** - firstName, lastName, listId, products (embedded)
