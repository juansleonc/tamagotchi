# React Native Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- iOS: Xcode and CocoaPods
- Android: Android Studio

## Initial Setup

### 1. Create React Native Project

```bash
npx react-native init TamagochiApp --template react-native-template-typescript
cd TamagochiApp
```

Or using Expo:

```bash
npx create-expo-app TamagochiApp
cd TamagochiApp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install GraphQL Client

```bash
npm install @apollo/client graphql
```

### 4. Install Navigation

```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

For iOS:

```bash
cd ios && pod install && cd ..
```

### 5. Install Testing Libraries

```bash
npm install --save-dev @testing-library/react-native jest
```

## Project Structure

```
TamagochiApp/
├── src/
│   ├── components/         # Reusable components
│   ├── screens/            # Screen components
│   ├── hooks/               # Custom hooks
│   ├── navigation/          # Navigation setup
│   ├── graphql/             # GraphQL queries/mutations
│   └── utils/               # Utility functions
├── __tests__/               # Test files
└── App.tsx                  # Root component
```

## GraphQL Client Setup

Create `src/graphql/client.ts`:

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

## Running the App

### iOS

```bash
npm run ios
# or
yarn ios
```

### Android

```bash
npm run android
# or
yarn android
```

## Testing

```bash
npm test
# or
yarn test
```

## Development Setup

### ESLint Configuration

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Create `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
};
```

### Prettier Configuration

```bash
npm install --save-dev prettier
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

## Next Steps

- [GraphQL Setup Guide](../setup/graphql-setup.md)
- [Development Workflow](../guides/development-workflow.md)

