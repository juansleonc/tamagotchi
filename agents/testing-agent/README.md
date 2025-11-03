# Testing Agent

AI agent for generating and managing tests for Rails (RSpec) and React Native (Jest).

## Features

- Generate unit, integration, and component tests
- Support for RSpec (Rails) and Jest (React Native)
- Analyze test coverage and provide recommendations
- Generate test examples and templates

## Tools

### generate-test

Generates a test file for a given source file.

**Parameters:**
- `filePath` (string, optional): Path to the source file
- `code` (string, required): Source code content
- `testType` (string, optional): Type of test - 'unit', 'integration', 'e2e', or 'component'
- `framework` (string, required): Testing framework - 'rspec' or 'jest'

**Example:**
```javascript
{
  "code": "class User < ApplicationRecord\n  validates :email, presence: true\nend",
  "framework": "rspec",
  "testType": "unit"
}
```

### analyze-coverage

Analyzes test coverage and provides recommendations.

**Parameters:**
- `codebasePath` (string, optional): Path to codebase root
- `framework` (string, required): Testing framework being used

### generate-test-examples

Generates example test cases for a component or class.

**Parameters:**
- `componentName` (string, required): Name of component/class to test
- `framework` (string, required): Testing framework
- `testCases` (array, optional): List of specific test cases to generate

## Usage

Start the agent:

```bash
node index.js
```

Integrate into Cursor MCP:

```json
{
  "mcpServers": {
    "testing-agent": {
      "command": "node",
      "args": ["/path/to/agents/testing-agent/index.js"]
    }
  }
}
```

## Test Generation Examples

### Rails Model Test (RSpec)

```ruby
require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      user = User.new(email: "test@example.com")
      expect(user).to be_valid
    end
  end
end
```

### React Native Component Test (Jest)

```javascript
import React from 'react';
import { render } from '@testing-library/react-native';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });
});
```

