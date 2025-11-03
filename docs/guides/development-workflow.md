# Development Workflow

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

### Commit Messages

Follow conventional commits:

```
feat: add user authentication
fix: resolve login error
docs: update API documentation
test: add user model specs
refactor: extract service object
```

## Development Process

### 1. Create Feature Branch

```bash
git checkout -b feature/user-authentication
```

### 2. Develop Feature

- Write code
- Add tests
- Run linters
- Update documentation

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add user authentication"
```

### 4. Push and Create PR

```bash
git push origin feature/user-authentication
```

Create pull request on GitHub.

### 5. Code Review

- Address review comments
- Ensure CI passes
- Update documentation if needed

### 6. Merge to Develop

After approval, merge to `develop` branch.

## Running Tests

### Backend

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/user_spec.rb

# Run with coverage
COVERAGE=true bundle exec rspec
```

### Frontend

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

## Code Quality

### Linting

#### Backend (RuboCop)

```bash
# Check for offenses
bundle exec rubocop

# Auto-fix offenses
bundle exec rubocop -a
```

#### Frontend (ESLint)

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Formatting

#### Frontend (Prettier)

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

## Using AI Agents

This project includes AI agents for assistance:

- **Testing Agent**: Generate tests
- **Code Review Agent**: Review code before commit
- **Best Practices Agent**: Check code quality
- **Documentation Agent**: Generate documentation

## Pre-commit Checklist

- [ ] All tests pass
- [ ] Linters pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Environment variables documented

