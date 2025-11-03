# AI Agents System

A comprehensive system of MCP (Model Context Protocol) servers that assist with development tasks including testing, code review, best practices enforcement, and documentation generation.

## Overview

This agents system provides automated assistance for:
- **Testing**: Generate and manage tests for Rails and React Native
- **Code Review**: Automated code review with security and style checks
- **Best Practices**: Enforce technology-specific best practices
- **Clean Code**: Detect code smells and suggest refactorings
- **Documentation**: Auto-generate and maintain documentation
- **Security**: Scan for vulnerabilities and security issues

## Architecture

All agents are built as MCP servers that can be integrated into Cursor or other MCP-compatible tools. Each agent extends the `BaseAgent` class which provides:

- MCP server infrastructure
- Tool registration and handling
- Error handling and logging
- Common utilities for code analysis

## Agent Structure

Each agent follows this structure:

```
agent-name/
├── index.js          # MCP server implementation
├── package.json      # Agent-specific dependencies
├── README.md         # Agent documentation
└── config.json       # Agent configuration
```

## Available Agents

### Testing Agent
Generates and manages tests for Rails (RSpec) and React Native (Jest).

### Code Review Agent
Automated code review with linting and security checks.

### Best Practices Agent
Enforces Rails, React Native, and GraphQL best practices.

### Clean Code Agent
Detects code smells and suggests refactoring opportunities.

### Documentation Agent
Auto-generates API documentation and maintains inline docs.

### Security Agent
Scans for vulnerabilities and provides security recommendations.

## Usage

Each agent can be started independently:

```bash
cd agents/agent-name
node index.js
```

Or integrated into Cursor's MCP configuration:

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

## Development

### Adding a New Agent

1. Create a new directory under `agents/`
2. Extend `BaseAgent` class
3. Register tools using `registerTool()`
4. Implement agent-specific logic
5. Create `package.json` and `README.md`

Example:

```javascript
import { BaseAgent } from '../base-agent.js';

class MyAgent extends BaseAgent {
  constructor() {
    super({
      name: 'my-agent',
      version: '1.0.0',
      description: 'My custom agent',
    });
    
    this.registerTool({
      name: 'my-tool',
      description: 'Does something useful',
      inputSchema: {
        type: 'object',
        properties: {
          input: { type: 'string' },
        },
      },
      handler: async (args) => {
        return `Processed: ${args.input}`;
      },
    });
  }
}

const agent = new MyAgent();
agent.start();
```

## Configuration

Global agent configuration can be managed via `agents-config.json` at the project root.

## Dependencies

- `@modelcontextprotocol/sdk`: MCP SDK for server implementation
- Node.js v18+ required

## License

MIT

