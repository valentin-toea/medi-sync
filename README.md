# NestJS Backend & React Native (Expo) Client

A repository containing two standalone applications:

- **Backend**: NestJS REST API using TypeORM (SQLite for dev, PostgreSQL for prod).
- **Client**: React Native app powered by Expo, consuming the backend API.

\*Uses https://wix.github.io/react-native-ui-lib/ for UI reusables

## Structure

```
/ (root)
├── backend/    # NestJS API
├── client/     # Expo React Native app
└── README.md
```

## Prerequisites

- Node.js >=16 & npm >=8
- SQLite3 (optional, for dev DB)
- PostgreSQL (for production)
- Expo CLI (`npm install -g expo-cli`)

## Setup & Run

1. **Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # edit .env as needed
   npm run start:dev   # SQLite dev
   npm run start:prod  # Postgres prod
   ```

2. **Client (Expo)**

   ```bash
   cd client
   npm install
   cp .env.example .env
   # edit .env (e.g. API_BASE_URL)
   npx expo start    # launch Expo dev tools
   # then press 'a' (Android) or 'i' (iOS) in Expo
   ```

## Environment Variables

- **backend/.env**

  ```env
  NODE_ENV=development
  DB_TYPE=sqlite        # or 'postgres'
  DB_DATABASE=./dev.sqlite
  DB_SYNCHRONIZE=true
  # PostgreSQL only:
  DB_HOST=... DB_PORT=... DB_USERNAME=... DB_PASSWORD=...
  ```

- **client/.env**

  ```env
  API_BASE_URL=http://localhost:3000
  ```

## Testing

- **Backend E2E** (`:memory:` SQLite)

  ```bash
  cd backend
  ```

env-cmd -f .env.test npm run test\:e2e

````

- **Client**
```bash
cd client
npm run test
````

## Lint

```bash
cd backend && npm run lint
cd client  && npm run lint
```

## Build & Deploy

- **Backend**: `cd backend && npm run build`
- **Client**: `cd client && expo build:android` / `expo build:ios`

## License

MIT
