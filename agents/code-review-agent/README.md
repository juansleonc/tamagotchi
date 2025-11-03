# Code Review Agent

Automated code review agent with linting, security checks, and style validation.

## Features

- Review code for style, security, and best practices
- Framework-specific convention checks (Rails, React Native, GraphQL)
- Security vulnerability scanning
- Pull request review capabilities
- Style validation against framework conventions

## Tools

### review-code

Reviews code and provides comprehensive feedback.

**Parameters:**
- `code` (string, required): Source code to review
- `filePath` (string, optional): Path to the file
- `framework` (string, optional): Framework context - 'rails', 'react-native', or 'graphql'

**Returns:**
- Issues with severity levels
- Code quality score
- Suggestions for improvement
- Code metrics

### check-security

Scans code for security vulnerabilities.

**Parameters:**
- `code` (string, required): Source code to analyze
- `filePath` (string, optional): Path to the file

**Returns:**
- Security issues with severity classification
- Summary of vulnerabilities by severity

### validate-style

Validates code style against framework conventions.

**Parameters:**
- `code` (string, required): Source code to validate
- `framework` (string, required): Framework context

**Returns:**
- Style violations
- Style score

### review-pr

Reviews a pull request with multiple file changes.

**Parameters:**
- `files` (array, required): Array of file objects with path, code, and/or diff

**Returns:**
- Review for each file
- Overall PR score
- Summary statistics

## Security Checks

The agent checks for:

- SQL injection vulnerabilities
- XSS vulnerabilities
- Hardcoded secrets and credentials
- Mass assignment issues (Rails)
- Authentication/authorization issues

## Framework-Specific Checks

### Rails
- Model validations
- Controller conventions
- Strong parameters usage
- Trailing commas in multiline calls

### React Native
- Component structure
- Type safety (PropTypes/TypeScript)
- Quote consistency

### GraphQL
- Schema descriptions
- Type definitions
- Query/mutation structure

## Usage

Start the agent:

```bash
node index.js
```

## Example Review Output

```json
{
  "filePath": "app/models/user.rb",
  "score": 85,
  "issues": [
    {
      "type": "security",
      "severity": "high",
      "message": "Potential mass assignment vulnerability",
      "recommendation": "Use params.require().permit()"
    }
  ],
  "suggestions": [
    {
      "priority": "high",
      "message": "Fix 1 critical security issue before merging"
    }
  ]
}
```

