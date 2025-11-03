# Best Practices Agent

AI agent for enforcing best practices in Rails, React Native, and GraphQL development.

## Features

- Framework-specific best practices checking
- Performance optimization suggestions
- Component-specific guides (models, controllers, components, resolvers)
- Convention enforcement

## Tools

### check-best-practices

Checks code against framework best practices.

**Parameters:**
- `code` (string, required): Source code to check
- `filePath` (string, optional): Path to the file
- `framework` (string, required): Framework - 'rails', 'react-native', or 'graphql'

**Returns:**
- Practices followed
- Violations with severity
- Quality score
- Recommendations

### get-best-practices-guide

Returns best practices guide for specific component types.

**Parameters:**
- `framework` (string, required): Framework
- `componentType` (string, required): Component type

**Supported component types:**
- Rails: `model`, `controller`, `service`
- React Native: `component`, `hook`
- GraphQL: `schema`, `resolver`

### suggest-optimizations

Suggests performance optimizations.

**Parameters:**
- `code` (string, required): Source code
- `framework` (string, required): Framework context

**Returns:**
- List of optimization suggestions with priority
- Examples for implementation

## Rails Best Practices

### Models
- Validations for data integrity
- Clear associations
- Scopes for common queries
- Business logic extraction

### Controllers
- Thin controllers
- Strong parameters
- Before actions for auth
- Service object extraction

### Services
- Single responsibility
- Clear interfaces
- Error handling

## React Native Best Practices

### Components
- Functional components with hooks
- Memoization for performance
- Proper TypeScript/PropTypes
- Small, focused components

### Performance
- FlatList for long lists
- Image optimization
- Bundle size management

## GraphQL Best Practices

### Schema
- Descriptive names (PascalCase)
- Type descriptions
- Input types for mutations
- Pagination for lists

### Resolvers
- Batch loading
- Error handling
- Caching
- Input validation

## Usage

```bash
node index.js
```

## Example Output

```json
{
  "framework": "rails",
  "score": 85,
  "practices": ["Model inherits from ApplicationRecord"],
  "violations": [
    {
      "rule": "Rails/Validation",
      "severity": "medium",
      "message": "Models should have validations"
    }
  ],
  "recommendations": [
    {
      "priority": "medium",
      "message": "Add validations for data integrity"
    }
  ]
}
```

