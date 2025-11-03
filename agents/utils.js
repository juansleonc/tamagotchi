/**
 * Shared utilities for all agents
 */

/**
 * Parse code file and extract language
 * @param {string} filename - File path
 * @returns {string} Language identifier
 */
export function detectLanguage(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const languageMap = {
    'rb': 'ruby',
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'graphql': 'graphql',
    'gql': 'graphql',
  };
  return languageMap[ext] || 'unknown';
}

/**
 * Extract code blocks from text
 * @param {string} text - Text containing code blocks
 * @returns {Array} Array of code blocks with language
 */
export function extractCodeBlocks(text) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'unknown',
      code: match[2],
    });
  }

  return blocks;
}

/**
 * Calculate code metrics
 * @param {string} code - Source code
 * @returns {Object} Code metrics
 */
export function calculateMetrics(code) {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);
  const commentLines = lines.filter(line => 
    line.trim().startsWith('#') || 
    line.trim().startsWith('//') || 
    line.trim().startsWith('/*')
  );

  return {
    totalLines: lines.length,
    codeLines: nonEmptyLines.length - commentLines.length,
    commentLines: commentLines.length,
    emptyLines: lines.length - nonEmptyLines.length,
    complexity: estimateComplexity(code),
  };
}

/**
 * Estimate code complexity (simple heuristic)
 * @param {string} code - Source code
 * @returns {number} Estimated complexity score
 */
function estimateComplexity(code) {
  let score = 1; // Base complexity
  
  // Count control structures
  const controlKeywords = [
    /\bif\b/g,
    /\belse\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bcase\b/g,
    /\bswitch\b/g,
    /\btry\b/g,
    /\bcatch\b/g,
    /\b&&\b/g,
    /\b\|\|\b/g,
  ];

  controlKeywords.forEach(regex => {
    const matches = code.match(regex);
    if (matches) {
      score += matches.length;
    }
  });

  return score;
}

/**
 * Check if code follows basic best practices
 * @param {string} code - Source code
 * @param {string} language - Programming language
 * @returns {Array} Array of suggestions
 */
export function checkBasicPractices(code, language) {
  const suggestions = [];

  // Check for long lines
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    if (line.length > 120) {
      suggestions.push({
        type: 'style',
        severity: 'info',
        line: index + 1,
        message: 'Line exceeds 120 characters',
      });
    }
  });

  // Check for trailing whitespace
  lines.forEach((line, index) => {
    if (line !== line.trimEnd()) {
      suggestions.push({
        type: 'style',
        severity: 'info',
        line: index + 1,
        message: 'Trailing whitespace detected',
      });
    }
  });

  // Language-specific checks
  if (language === 'ruby') {
    if (!code.includes('require')) {
      // Check for proper require statements (basic heuristic)
    }
  }

  return suggestions;
}

/**
 * Format agent response
 * @param {Object} data - Response data
 * @param {string} format - Output format (text, json, markdown)
 * @returns {string} Formatted response
 */
export function formatResponse(data, format = 'text') {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'markdown':
      return formatAsMarkdown(data);
    default:
      return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  }
}

/**
 * Format data as markdown
 * @param {Object} data - Data to format
 * @returns {string} Markdown formatted string
 */
function formatAsMarkdown(data) {
  if (typeof data === 'string') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => `- ${formatAsMarkdown(item)}`).join('\n');
  }

  if (typeof data === 'object') {
    return Object.entries(data)
      .map(([key, value]) => `**${key}**: ${formatAsMarkdown(value)}`)
      .join('\n');
  }

  return String(data);
}

/**
 * Validate tool arguments against schema
 * @param {Object} args - Arguments to validate
 * @param {Object} schema - JSON schema
 * @returns {Object} Validation result
 */
export function validateArguments(args, schema) {
  const errors = [];

  if (schema.required) {
    schema.required.forEach(field => {
      if (!(field in args)) {
        errors.push(`Missing required field: ${field}`);
      }
    });
  }

  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, prop]) => {
      if (key in args) {
        const value = args[key];
        if (prop.type && typeof value !== prop.type) {
          errors.push(`Invalid type for ${key}: expected ${prop.type}, got ${typeof value}`);
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

