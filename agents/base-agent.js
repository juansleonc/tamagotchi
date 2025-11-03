/**
 * Base MCP Agent Class
 * 
 * Provides common functionality for all AI agents in the system.
 * All agents should extend this class to inherit MCP server capabilities.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

export class BaseAgent {
  constructor(config = {}) {
    this.config = {
      name: config.name || 'base-agent',
      version: config.version || '1.0.0',
      description: config.description || 'Base MCP Agent',
      ...config,
    };

    this.server = new Server(
      {
        name: this.config.name,
        version: this.config.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tools = [];
    this.setupErrorHandling();
  }

  /**
   * Register a tool with the MCP server
   * @param {Object} tool - Tool definition with name, description, and inputSchema
   */
  registerTool(tool) {
    this.tools.push(tool);
    
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.tools.map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    }));
  }

  /**
   * Setup error handling for the server
   */
  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Initialize the agent and start the MCP server
   */
  async initialize() {
    // Setup tool call handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.find(t => t.name === name);
      if (!tool) {
        throw new Error(`Tool ${name} not found`);
      }

      try {
        const result = await tool.handler(args);
        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });

    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error(`${this.config.name} agent initialized`);
  }

  /**
   * Utility method to analyze code
   * @param {string} code - Code to analyze
   * @param {string} language - Programming language (ruby, javascript, etc.)
   */
  analyzeCode(code, language = 'ruby') {
    // Base implementation - can be overridden by subclasses
    return {
      language,
      lines: code.split('\n').length,
      hasErrors: false,
      suggestions: [],
    };
  }

  /**
   * Utility method to format response
   * @param {Object} data - Data to format
   */
  formatResponse(data) {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data, null, 2);
  }

  /**
   * Start the agent server
   */
  async start() {
    await this.initialize();
  }
}

