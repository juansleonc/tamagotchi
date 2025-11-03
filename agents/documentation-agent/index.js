/**
 * Documentation Agent
 * 
 * Auto-generates API documentation, creates README files,
 * and maintains inline code documentation.
 */

import { BaseAgent } from '../base-agent.js';
import { detectLanguage, extractCodeBlocks } from '../utils.js';

class DocumentationAgent extends BaseAgent {
  constructor() {
    super({
      name: 'documentation-agent',
      version: '1.0.0',
      description: 'AI agent for generating and maintaining documentation',
    });

    this.setupTools();
  }

  setupTools() {
    this.registerTool({
      name: 'generate-api-docs',
      description: 'Generates API documentation from code.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Source code' },
          filePath: { type: 'string', description: 'File path' },
          format: { type: 'string', enum: ['markdown', 'html', 'json'] },
        },
        required: ['code'],
      },
      handler: async (args) => this.generateApiDocs(args),
    });

    this.registerTool({
      name: 'generate-readme',
      description: 'Generates README file for a project or module.',
      inputSchema: {
        type: 'object',
        properties: {
          projectName: { type: 'string' },
          description: { type: 'string' },
          techStack: { type: 'array', items: { type: 'string' } },
        },
        required: ['projectName'],
      },
      handler: async (args) => this.generateReadme(args),
    });

    this.registerTool({
      name: 'update-inline-docs',
      description: 'Generates or updates inline code documentation.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Source code' },
          language: { type: 'string' },
        },
        required: ['code'],
      },
      handler: async (args) => this.updateInlineDocs(args),
    });
  }

  async generateApiDocs(args) {
    const { code, filePath, format = 'markdown' } = args;
    const language = filePath ? detectLanguage(filePath) : 'unknown';

    const docs = {
      file: filePath || 'unknown',
      language,
      format,
      sections: [],
    };

    // Extract classes/functions
    if (language === 'ruby') {
      docs.sections = this.extractRubyDocs(code);
    } else if (language === 'javascript' || language === 'typescript') {
      docs.sections = this.extractJSDocs(code);
    }

    return this.formatDocs(docs, format);
  }

  extractRubyDocs(code) {
    const sections = [];
    const classMatch = code.match(/class\s+(\w+)/);
    const methodMatches = code.matchAll(/def\s+(\w+)(?:\([^)]*\))?/g);

    if (classMatch) {
      sections.push({
        type: 'class',
        name: classMatch[1],
        description: this.extractComments(code, classMatch.index),
      });
    }

    for (const match of methodMatches) {
      sections.push({
        type: 'method',
        name: match[1],
        description: this.extractComments(code, match.index),
        parameters: this.extractParameters(match[0]),
      });
    }

    return sections;
  }

  extractJSDocs(code) {
    const sections = [];
    const functionMatches = code.matchAll(/(?:function|const)\s+(\w+)/g);

    for (const match of functionMatches) {
      sections.push({
        type: 'function',
        name: match[1],
        description: this.extractJSDocComments(code, match.index),
      });
    }

    return sections;
  }

  extractComments(code, position) {
    const beforeCode = code.substring(0, position);
    const lines = beforeCode.split('\n');
    const comments = [];

    for (let i = lines.length - 1; i >= 0 && i >= lines.length - 5; i--) {
      const line = lines[i].trim();
      if (line.startsWith('#') || line.startsWith('//')) {
        comments.unshift(line.replace(/^[#\/\/\s]+/, ''));
      } else if (line.length > 0) {
        break;
      }
    }

    return comments.join(' ');
  }

  extractJSDocComments(code, position) {
    const beforeCode = code.substring(0, position);
    const jsDocMatch = beforeCode.match(/\*\*\*\s*\n\s*\*\s*(.+?)\n\s*\*\//s);
    return jsDocMatch ? jsDocMatch[1].trim() : '';
  }

  extractParameters(methodSignature) {
    const paramMatch = methodSignature.match(/\(([^)]*)\)/);
    if (paramMatch) {
      return paramMatch[1].split(',').map(p => p.trim()).filter(p => p);
    }
    return [];
  }

  formatDocs(docs, format) {
    if (format === 'markdown') {
      let md = `# ${docs.file}\n\n`;
      docs.sections.forEach(section => {
        md += `## ${section.name}\n\n${section.description || 'No description'}\n\n`;
        if (section.parameters) {
          md += `**Parameters:**\n`;
          section.parameters.forEach(p => {
            md += `- ${p}\n`;
          });
        }
        md += '\n';
      });
      return md;
    }

    return JSON.stringify(docs, null, 2);
  }

  async generateReadme(args) {
    const { projectName, description, techStack = [] } = args;

    return `# ${projectName}

${description || 'Project description'}

## Tech Stack

${techStack.map(tech => `- ${tech}`).join('\n') || 'Not specified'}

## Installation

\`\`\`bash
# Installation instructions
\`\`\`

## Usage

\`\`\`bash
# Usage examples
\`\`\`

## Development

\`\`\`bash
# Development setup
\`\`\`

## License

MIT
`;
  }

  async updateInlineDocs(args) {
    const { code, language } = args;
    const updatedCode = this.addInlineDocs(code, language);
    return { updatedCode, language };
  }

  addInlineDocs(code, language) {
    if (language === 'ruby') {
      return this.addRubyDocs(code);
    } else if (language === 'javascript' || language === 'typescript') {
      return this.addJSDocs(code);
    }
    return code;
  }

  addRubyDocs(code) {
    // Add YARD-style comments for methods
    return code.replace(/(def\s+(\w+))/g, (match, defLine, methodName) => {
      if (!code.includes(`# ${methodName}`)) {
        return `# ${methodName}: Description\n${defLine}`;
      }
      return match;
    });
  }

  addJSDocs(code) {
    // Add JSDoc comments for functions
    return code.replace(/((?:function|const)\s+(\w+)\s*=)/g, (match, funcLine, funcName) => {
      if (!code.includes(`/**\n * ${funcName}`)) {
        return `/**\n * ${funcName}\n * @description Description\n */\n${funcLine}`;
      }
      return match;
    });
  }
}

const agent = new DocumentationAgent();
agent.start().catch(console.error);

