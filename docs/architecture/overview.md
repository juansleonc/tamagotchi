# System Architecture Overview

## Architecture Pattern

The Tamagochi MVP follows a **mobile-first, API-driven architecture** with a Rails GraphQL backend and React Native mobile frontend.

## High-Level Architecture

```
┌─────────────────┐
│  React Native   │
│  Mobile App     │
└────────┬────────┘
         │ GraphQL
         │ Queries/Mutations
         ▼
┌─────────────────┐
│  Rails API      │
│  GraphQL Server │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

## Component Layers

### Backend (Rails)

- **GraphQL API**: Single endpoint for all data operations
- **Models**: ActiveRecord models for data persistence
- **Resolvers**: GraphQL resolvers for query/mutation logic
- **Services**: Business logic extraction layer
- **Policies**: Authorization logic

### Frontend (React Native)

- **Components**: Reusable UI components
- **Screens**: Screen-level components
- **Hooks**: Custom hooks for data fetching and state
- **Navigation**: React Navigation for routing
- **State Management**: Context API or Redux (TBD)

## Data Flow

1. User interacts with React Native app
2. App sends GraphQL query/mutation
3. Rails GraphQL server processes request
4. Resolvers execute business logic
5. ActiveRecord queries database
6. Response returned via GraphQL
7. React Native updates UI

## Design Decisions

- **GraphQL over REST**: Flexible queries, reduced over-fetching
- **Rails for API**: Rapid development, strong conventions
- **React Native**: Cross-platform mobile with single codebase
- **PostgreSQL**: Robust relational database

## Security Architecture

- Authentication via JWT tokens
- Authorization via GraphQL field resolvers
- CSRF protection (Rails)
- Input validation and sanitization
- Secure secret management via environment variables

