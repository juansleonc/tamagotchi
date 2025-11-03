# Testing Guide

## Overview

This project uses RSpec for Rails backend testing and Jest for React Native frontend testing.

## Backend Testing (RSpec)

### Setup

RSpec is configured via `spec/spec_helper.rb` and `spec/rails_helper.rb`.

### Model Tests

```ruby
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'is invalid without an email' do
      user = build(:user, email: nil)
      expect(user).not_to be_valid
    end
  end

  describe 'associations' do
    it 'has many posts' do
      association = described_class.reflect_on_association(:posts)
      expect(association.macro).to eq :has_many
    end
  end
end
```

### Controller Tests

```ruby
require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  describe 'GET #index' do
    it 'returns http success' do
      get :index
      expect(response).to have_http_status(:success)
    end
  end
end
```

### GraphQL Tests

```ruby
require 'rails_helper'

RSpec.describe Types::QueryType do
  describe '#users' do
    it 'returns all users' do
      user = create(:user)
      query = <<~GRAPHQL
        query {
          users {
            id
            name
          }
        }
      GRAPHQL

      result = TamagochiApiSchema.execute(query)
      users = result['data']['users']

      expect(users.length).to eq(1)
      expect(users.first['id']).to eq(user.id.to_s)
    end
  end
end
```

### Running Tests

```bash
# All tests
bundle exec rspec

# Specific file
bundle exec rspec spec/models/user_spec.rb

# Specific example
bundle exec rspec spec/models/user_spec.rb:10
```

## Frontend Testing (Jest)

### Component Tests

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Click me" onPress={() => {}} />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click" onPress={onPress} />);
    
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useApiData } from '../hooks/useApiData';

describe('useApiData', () => {
  it('fetches data successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useApiData('/api/users'));

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeTruthy();
  });
});
```

### GraphQL Tests

```typescript
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react-native';
import { GET_USERS } from '../graphql/queries/getUsers';
import UsersList from '../UsersList';

const mocks = [
  {
    request: { query: GET_USERS },
    result: {
      data: {
        users: [{ id: '1', name: 'Test User' }],
      },
    },
  },
];

test('renders users list', async () => {
  const { findByText } = render(
    <MockedProvider mocks={mocks}>
      <UsersList />
    </MockedProvider>
  );

  expect(await findByText('Test User')).toBeTruthy();
});
```

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Best Practices

1. **Write tests first (TDD)** when possible
2. **Test behavior, not implementation**
3. **Keep tests isolated** - each test should be independent
4. **Use descriptive test names** - they serve as documentation
5. **Mock external dependencies** - don't hit real APIs/databases
6. **Aim for good coverage** - but quality over quantity
7. **Test edge cases** - empty states, errors, boundaries

## Test Organization

### Backend

```
spec/
├── models/
├── controllers/
├── graphql/
│   ├── types/
│   ├── mutations/
│   └── resolvers/
└── services/
```

### Frontend

```
__tests__/
├── components/
├── hooks/
├── screens/
└── utils/
```

## Continuous Integration

Tests should run automatically on:
- Pull requests
- Commits to main/develop
- Pre-commit hooks (optional)

