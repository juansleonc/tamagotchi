# Tamagochi Project

A comprehensive MVP project using Rails, React Native, and GraphQL, enhanced with AI agents for code quality, testing, and documentation.

This project uses [Context7 MCP](https://github.com/upstash/context7) to provide up-to-date code documentation for LLMs and AI assistants, and includes a full suite of AI agents for development assistance.

## 🚀 Context7 Setup

### 1. Get Your API Key

1. Go to [context7.com/dashboard](https://context7.com/dashboard)
2. Create an account or sign in
3. Get your API key

### 2. Configure the API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```
CONTEXT7_API_KEY=your_api_key_here
```

### 3. Configure Context7 in Cursor

Context7 is configured in Cursor's MCP configuration file. You have two options:

#### Option A: Global Configuration (Recommended)

Edit `~/.cursor/mcp.json` and add the configuration:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY_HERE"],
      "env": {}
    }
  }
}
```

Or if you prefer using environment variables:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

#### Option B: Use the project example file

You can use `mcp-config.json` as a reference and copy the configuration to your `~/.cursor/mcp.json` file.

### 4. Restart Cursor

After configuring, restart Cursor for the changes to take effect.

## 📚 Using Context7

Once configured, Context7 is automatically available thanks to the rules in `.cursorrules`. You can:

### Use directly in prompts:

```
Implement basic authentication with Supabase. use library /supabase/supabase for API and docs.
```

### Available tools:

- **`resolve-library-id`**: Resolves a library name to a Context7-compatible ID
  - Parameter: `libraryName` (required)

- **`get-library-docs`**: Fetches documentation for a library using a compatible ID
  - Parameters:
    - `context7CompatibleLibraryID` (required): Exact ID (e.g., `/mongodb/docs`, `/vercel/next.js`)
    - `topic` (optional): Focus documentation on a specific topic (e.g., "routing", "hooks")
    - `tokens` (optional, default 5000): Maximum number of tokens to return

## 🔧 Troubleshooting

### Error: Module Not Found

If you encounter module not found errors, try using `bunx` instead of `npx`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

### Error: ESM Resolution Issues

For ESM resolution errors, add the experimental flag:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "--node-options=--experimental-vm-modules", "@upstash/context7-mcp@latest", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

### Error: TLS/Certificate Issues

For TLS issues, use the experimental flag:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "--node-options=--experimental-fetch", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

### HTTP Proxy

If you are behind an HTTP proxy, Context7 uses the standard `https_proxy` or `HTTPS_PROXY` environment variables.

## 📖 Resources

- [Context7 Website](https://context7.com)
- [Context7 GitHub](https://github.com/upstash/context7)
- [MCP Documentation](https://modelcontextprotocol.io)

## 🤖 AI Agents

This project includes a comprehensive system of AI agents:

- **Testing Agent**: Generate RSpec and Jest tests
- **Code Review Agent**: Automated code review with security checks
- **Best Practices Agent**: Enforce Rails, React Native, and GraphQL best practices
- **Clean Code Agent**: Detect code smells and suggest refactorings
- **Documentation Agent**: Auto-generate API and inline documentation
- **Security Agent**: Scan for vulnerabilities and security issues

See [agents/README.md](./agents/README.md) for details and [agents/INTEGRATION.md](./agents/INTEGRATION.md) for integration instructions.

## 📚 Documentation

Complete MVP documentation is available in the [docs/](./docs/) directory:

- [Architecture Overview](./docs/architecture/overview.md)
- [Setup Guides](./docs/setup/)
- [API Documentation](./docs/api/)
- [Development Guides](./docs/guides/)

## 🚀 Tech Stack

- **Backend**: Ruby on Rails with GraphQL
- **Frontend**: React Native
- **Database**: PostgreSQL
- **Testing**: RSpec (Rails), Jest (React Native)
- **Code Quality**: RuboCop, ESLint, Prettier

## ⚠️ Important Note

Context7 requires Node.js v18 or higher for native fetch support.
