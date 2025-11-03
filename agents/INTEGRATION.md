# Agent Integration Guide

## MCP Configuration

To integrate agents into Cursor, add them to your `~/.cursor/mcp.json` file.

### Example Configuration

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "your-api-key"
      }
    },
    "testing-agent": {
      "command": "node",
      "args": ["/absolute/path/to/tamagochi/agents/testing-agent/index.js"]
    },
    "code-review-agent": {
      "command": "node",
      "args": ["/absolute/path/to/tamagochi/agents/code-review-agent/index.js"]
    },
    "best-practices-agent": {
      "command": "node",
      "args": ["/absolute/path/to/tamagochi/agents/best-practices-agent/index.js"]
    },
    "clean-code-agent": {
      "command": "node",
      "args": ["/absolute/path/to/tamagochi/agents/clean-code-agent/index.js"]
    },
    "documentation-agent": {
      "command": "node",
      "args": ["/absolute/path/to/tamagochi/agents/documentation-agent/index.js"]
    },
    "security-agent": {
      "command": "node",
      "args": ["/absolute/path/to/tamagochi/agents/security-agent/index.js"]
    }
  }
}
```

### Using Relative Paths

You can use environment variables or configure paths relative to your project:

```json
{
  "mcpServers": {
    "testing-agent": {
      "command": "node",
      "args": ["${PROJECT_ROOT}/agents/testing-agent/index.js"],
      "cwd": "/path/to/tamagochi"
    }
  }
}
```

## Installation

1. Navigate to each agent directory
2. Install dependencies:

```bash
cd agents/testing-agent
npm install
```

3. Repeat for each agent

## Starting Agents

Each agent can be started independently:

```bash
node agents/testing-agent/index.js
```

## Development Mode

For development, you can test agents directly:

```bash
# Testing Agent
cd agents/testing-agent
npm start

# Code Review Agent
cd agents/code-review-agent
npm start
```

## Troubleshooting

### Agent Not Found

Ensure Node.js is in your PATH and the agent paths are correct (use absolute paths).

### MCP Connection Issues

Check that:
- Node.js version is 18+
- All agent dependencies are installed
- File permissions are correct

### Agent Errors

Check agent logs in the Cursor MCP console or run agents directly to see errors.

