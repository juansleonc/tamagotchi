# Coding Standards

## General Principles

- Write clear, self-documenting code
- Follow framework conventions
- Keep functions/classes small and focused
- Write tests for new features
- Document complex logic

## Ruby/Rails Standards

### Style

- Use 2 spaces for indentation
- Use trailing commas in multiline method calls
- Prefer single quotes for strings (unless interpolation needed)
- Use `%r{}` for regex literals (RuboCop Style/RegexpLiteral)

### Naming

- Classes: `PascalCase`
- Methods: `snake_case`
- Constants: `SCREAMING_SNAKE_CASE`
- Variables: `snake_case`

### Example

```ruby
class UserService
  def self.create_user(params)
    user = User.new(params)
    user.save!
    user
  end
end
```

### Testing

- Use RSpec with descriptive examples
- Follow Arrange-Act-Assert pattern
- Use FactoryBot for test data
- Mock external dependencies

## JavaScript/TypeScript Standards

### Style

- Use 2 spaces for indentation
- Semicolons are optional but be consistent
- Use single quotes for strings
- Use trailing commas in multiline

### Naming

- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Variables: `camelCase`

### TypeScript

- Use TypeScript for type safety
- Define interfaces for props
- Avoid `any` type

### Example

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

## GraphQL Standards

### Schema

- Use PascalCase for types
- Use camelCase for fields
- Add descriptions to all types and fields
- Use input types for mutations

### Example

```graphql
"""
A user in the system
"""
type User {
  """Unique identifier"""
  id: ID!
  
  """User's full name"""
  name: String!
}

input CreateUserInput {
  name: String!
  email: String!
}
```

## File Organization

### Rails

```
app/
├── models/
├── controllers/
├── graphql/
│   ├── types/
│   ├── mutations/
│   └── resolvers/
├── services/
└── policies/
```

### React Native

```
src/
├── components/
│   ├── common/
│   └── specific/
├── screens/
├── hooks/
├── navigation/
├── graphql/
│   ├── queries/
│   └── mutations/
└── utils/
```

## Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests are written and passing
- [ ] No hardcoded values
- [ ] Error handling is proper
- [ ] Performance considerations addressed
- [ ] Security concerns addressed
- [ ] Documentation is updated

