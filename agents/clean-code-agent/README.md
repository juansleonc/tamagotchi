# Clean Code Agent

AI agent for detecting code smells, suggesting refactoring opportunities, and enforcing SOLID principles.

## Features

- Code smell detection (long methods, large classes, duplication)
- Refactoring suggestions
- SOLID principles checking
- Code quality metrics

## Tools

### detect-code-smells

Detects various code smells and quality issues.

**Returns:**
- Code smells with severity
- Code metrics
- Quality score

### suggest-refactoring

Suggests refactoring opportunities.

**Parameters:**
- `code` (required)
- `smellType` (optional): 'long-method', 'large-class', 'duplication', 'complexity'

### check-solid-principles

Checks adherence to SOLID principles.

## Detected Smells

- Long methods (high complexity)
- Large classes
- Code duplication
- Magic numbers
- Dead code

## Usage

```bash
node index.js
```

