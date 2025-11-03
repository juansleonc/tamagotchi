# GraphQL Setup Guide

## Backend (Rails)

### Schema Definition

GraphQL schema is defined in `app/graphql/tamagochi_api_schema.rb`:

```ruby
class TamagochiApiSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)
  max_complexity 400
  max_depth 15
end
```

### Creating Types

Create types in `app/graphql/types/`:

```ruby
# app/graphql/types/user_type.rb
module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :email, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
```

### Creating Queries

```ruby
# app/graphql/types/query_type.rb
module Types
  class QueryType < Types::BaseObject
    field :users, [Types::UserType], null: false
    
    def users
      User.all
    end
  end
end
```

### Creating Mutations

```ruby
# app/graphql/types/mutation_type.rb
module Types
  class MutationType < Types::BaseObject
    field :create_user, mutation: Mutations::CreateUser
  end
end
```

```ruby
# app/graphql/mutations/create_user.rb
module Mutations
  class CreateUser < BaseMutation
    argument :name, String, required: true
    argument :email, String, required: true
    
    field :user, Types::UserType, null: true
    field :errors, [String], null: false
    
    def resolve(name:, email:)
      user = User.new(name: name, email: email)
      
      if user.save
        { user: user, errors: [] }
      else
        { user: nil, errors: user.errors.full_messages }
      end
    end
  end
end
```

## Frontend (React Native)

### Apollo Client Setup

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

### Writing Queries

```typescript
// src/graphql/queries/getUsers.ts
import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;
```

### Using Queries in Components

```typescript
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/queries/getUsers';

function UsersList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data.users}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### Writing Mutations

```typescript
// src/graphql/mutations/createUser.ts
import { gql } from '@apollo/client';

export const CREATE_USER = gql`
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
`;
```

### Using Mutations

```typescript
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../graphql/mutations/createUser';

function CreateUserForm() {
  const [createUser, { loading }] = useMutation(CREATE_USER);

  const handleSubmit = async (name: string, email: string) => {
    try {
      const { data } = await createUser({
        variables: { name, email },
      });
      
      if (data.createUser.errors.length === 0) {
        // Success
      }
    } catch (error) {
      // Handle error
    }
  };

  // Form implementation...
}
```

## Best Practices

- Use descriptions for all types and fields
- Implement pagination for list queries
- Use input types for mutations
- Handle errors gracefully
- Implement batch loading for associations
- Set query complexity limits

## Testing GraphQL

### Backend (RSpec)

```ruby
RSpec.describe Types::QueryType do
  describe '#users' do
    it 'returns all users' do
      user = User.create!(name: 'Test', email: 'test@example.com')
      query = <<~GRAPHQL
        query {
          users {
            id
            name
          }
        }
      GRAPHQL
      
      result = TamagochiApiSchema.execute(query)
      expect(result['data']['users'].length).to eq(1)
    end
  end
end
```

### Frontend (Jest)

```typescript
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react-native';

test('renders users list', async () => {
  const mocks = [
    {
      request: { query: GET_USERS },
      result: { data: { users: [{ id: '1', name: 'Test' }] } },
    },
  ];

  const { findByText } = render(
    <MockedProvider mocks={mocks}>
      <UsersList />
    </MockedProvider>
  );

  expect(await findByText('Test')).toBeTruthy();
});
```

## Resources

- [GraphQL Ruby Documentation](https://graphql-ruby.org/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)

