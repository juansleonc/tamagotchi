# GraphQL Schema Documentation

## Overview

This document describes the GraphQL API schema for the Tamagochi MVP.

## Query Types

### Users Query

```graphql
query GetUsers {
  users {
    id
    name
    email
    createdAt
  }
}
```

### User Query

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

## Mutation Types

### Create User

```graphql
mutation CreateUser($name: String!, $email: String!) {
  createUser(name: $name, email: $email) {
    user {
      id
      name
      email
    }
    errors
  }
}
```

### Update User

```graphql
mutation UpdateUser($id: ID!, $name: String, $email: String) {
  updateUser(id: $id, name: $name, email: $email) {
    user {
      id
      name
      email
    }
    errors
  }
}
```

## Type Definitions

### User Type

```graphql
type User {
  """Unique identifier"""
  id: ID!
  
  """User's full name"""
  name: String!
  
  """User's email address"""
  email: String!
  
  """Account creation timestamp"""
  createdAt: ISO8601DateTime!
}
```

## Input Types

### CreateUserInput

```graphql
input CreateUserInput {
  name: String!
  email: String!
}
```

## Error Handling

All mutations return a response object with:
- `user`: The created/updated user (if successful)
- `errors`: Array of error messages

Example:

```graphql
mutation {
  createUser(name: "", email: "invalid") {
    user {
      id
    }
    errors
  }
}
```

Response:

```json
{
  "data": {
    "createUser": {
      "user": null,
      "errors": ["Name can't be blank", "Email is invalid"]
    }
  }
}
```

## Authentication

Queries and mutations requiring authentication should include JWT token in headers:

```
Authorization: Bearer <token>
```

## Pagination

List queries support pagination via connections:

```graphql
query GetUsers($first: Int, $after: String) {
  users(first: $first, after: $after) {
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

