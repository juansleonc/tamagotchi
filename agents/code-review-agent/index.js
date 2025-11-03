/**
 * Code Review Agent
 * 
 * Automated code review with linting, security checks, and style validation.
 * Reviews code changes and suggests improvements.
 */

import { BaseAgent } from '../base-agent.js';
import { detectLanguage, checkBasicPractices, calculateMetrics, validateArguments } from '../utils.js';

class CodeReviewAgent extends BaseAgent {
  constructor() {
    super({
      name: 'code-review-agent',
      version: '1.0.0',
      description: 'AI agent for automated code review with security and style checks',
    });

    this.setupTools();
  }

  setupTools() {
    // Review code
    this.registerTool({
      name: 'review-code',
      description: 'Reviews code and provides feedback on style, security, and best practices.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Source code to review',
          },
          filePath: {
            type: 'string',
            description: 'Path to the file being reviewed',
          },
          framework: {
            type: 'string',
            enum: ['rails', 'react-native', 'graphql'],
            description: 'Framework or technology context',
          },
        },
        required: ['code'],
      },
      handler: async (args) => {
        return this.reviewCode(args);
      },
    });

    // Check security issues
    this.registerTool({
      name: 'check-security',
      description: 'Scans code for security vulnerabilities and issues.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Source code to analyze',
          },
          filePath: {
            type: 'string',
            description: 'Path to the file',
          },
        },
        required: ['code'],
      },
      handler: async (args) => {
        return this.checkSecurity(args);
      },
    });

    // Validate code style
    this.registerTool({
      name: 'validate-style',
      description: 'Validates code style against framework conventions.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Source code to validate',
          },
          framework: {
            type: 'string',
            enum: ['rails', 'react-native', 'graphql'],
            description: 'Framework context',
          },
        },
        required: ['code', 'framework'],
      },
      handler: async (args) => {
        return this.validateStyle(args);
      },
    });

    // Review pull request
    this.registerTool({
      name: 'review-pr',
      description: 'Reviews a pull request with multiple file changes.',
      inputSchema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                code: { type: 'string' },
                diff: { type: 'string' },
              },
            },
            description: 'List of changed files',
          },
        },
        required: ['files'],
      },
      handler: async (args) => {
        return this.reviewPullRequest(args);
      },
    });
  }

  async reviewCode(args) {
    const { code, filePath, framework = 'rails' } = args;
    const language = filePath ? detectLanguage(filePath) : 'unknown';
    
    const review = {
      filePath: filePath || 'unknown',
      language,
      framework,
      issues: [],
      suggestions: [],
      score: 100,
      metrics: calculateMetrics(code),
    };

    // Basic practices check
    const basicIssues = checkBasicPractices(code, language);
    review.issues.push(...basicIssues);

    // Framework-specific checks
    if (framework === 'rails') {
      review.issues.push(...this.checkRailsConventions(code));
    } else if (framework === 'react-native') {
      review.issues.push(...this.checkReactNativeConventions(code));
    } else if (framework === 'graphql') {
      review.issues.push(...this.checkGraphQLConventions(code));
    }

    // Security checks
    const securityIssues = await this.checkSecurity({ code, filePath });
    review.issues.push(...securityIssues.issues.filter(i => i.severity === 'critical' || i.severity === 'high'));

    // Calculate score
    review.score = this.calculateScore(review.issues);

    // Generate suggestions
    review.suggestions = this.generateSuggestions(review.issues, framework);

    return review;
  }

  async checkSecurity(args) {
    const { code, filePath } = args;
    const issues = [];

    // SQL Injection checks
    if (code.includes('where(') && code.match(/where\(.*\+.*\)/)) {
      issues.push({
        type: 'security',
        severity: 'high',
        message: 'Potential SQL injection vulnerability. Use parameterized queries.',
        line: this.findLineNumber(code, 'where'),
        recommendation: 'Use ActiveRecord query methods with parameters',
      });
    }

    // XSS checks (Rails)
    if (code.includes('.html_safe') || code.includes('raw(')) {
      issues.push({
        type: 'security',
        severity: 'medium',
        message: 'Potential XSS vulnerability. Ensure content is sanitized.',
        recommendation: 'Use Rails helpers like content_tag or sanitize',
      });
    }

    // Hardcoded secrets
    const secretPatterns = [
      /password\s*=\s*['"][^'"]+['"]/i,
      /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
      /secret\s*=\s*['"][^'"]+['"]/i,
      /token\s*=\s*['"][^'"]+['"]/i,
    ];

    secretPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        issues.push({
          type: 'security',
          severity: 'critical',
          message: 'Hardcoded secret detected. Move to environment variables.',
          recommendation: 'Use ENV variables or Rails credentials',
        });
      }
    });

    // Mass assignment (Rails)
    if (code.includes('params[:') && code.includes('update(') && !code.includes('permit')) {
      issues.push({
        type: 'security',
        severity: 'high',
        message: 'Potential mass assignment vulnerability. Use strong parameters.',
        recommendation: 'Use params.require().permit()',
      });
    }

    return {
      issues,
      summary: {
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
      },
    };
  }

  async validateStyle(args) {
    const { code, framework } = args;
    const violations = [];

    if (framework === 'rails') {
      violations.push(...this.checkRailsStyle(code));
    } else if (framework === 'react-native') {
      violations.push(...this.checkReactNativeStyle(code));
    }

    return {
      framework,
      violations,
      score: violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 5),
    };
  }

  checkRailsConventions(code) {
    const issues = [];

    // Check for proper model structure
    if (code.includes('class') && code.includes('< ApplicationRecord')) {
      if (!code.includes('validates')) {
        issues.push({
          type: 'convention',
          severity: 'low',
          message: 'Consider adding validations for data integrity',
        });
      }
    }

    // Check controller conventions
    if (code.includes('class') && code.includes('Controller')) {
      if (!code.includes('before_action') && code.includes('def create') || code.includes('def update')) {
        issues.push({
          type: 'convention',
          severity: 'info',
          message: 'Consider using before_action for authentication',
        });
      }
    }

    return issues;
  }

  checkReactNativeConventions(code) {
    const issues = [];

    // Check for proper component structure
    if (code.includes('function') || code.includes('const') && code.includes('=>')) {
      if (!code.includes('React')) {
        issues.push({
          type: 'convention',
          severity: 'low',
          message: 'Import React for JSX',
        });
      }
    }

    // Check for PropTypes or TypeScript
    if (code.includes('function') && !code.includes('PropTypes') && !code.includes('interface') && !code.includes('type')) {
      issues.push({
        type: 'convention',
        severity: 'info',
        message: 'Consider adding PropTypes or TypeScript for type safety',
      });
    }

    return issues;
  }

  checkGraphQLConventions(code) {
    const issues = [];

    // Check for proper schema structure
    if (code.includes('type') && code.includes('Query') || code.includes('Mutation')) {
      if (!code.includes('description:')) {
        issues.push({
          type: 'convention',
          severity: 'info',
          message: 'Add descriptions to GraphQL types and fields',
        });
      }
    }

    return issues;
  }

  checkRailsStyle(code) {
    const violations = [];

    // Check for trailing commas in multiline
    const multilineMethodCall = /\.\w+\([\s\S]*?\n[\s\S]*?\)/;
    if (multilineMethodCall.test(code) && !code.includes(',\n  \)\)')) {
      violations.push({
        rule: 'Style/TrailingCommaInArguments',
        message: 'Add trailing comma in multiline method calls',
      });
    }

    return violations;
  }

  checkReactNativeStyle(code) {
    const violations = [];

    // Check for consistent quote style
    const singleQuotes = (code.match(/'/g) || []).length;
    const doubleQuotes = (code.match(/"/g) || []).length;
    if (singleQuotes > 0 && doubleQuotes > 0) {
      violations.push({
        rule: 'quotes',
        message: 'Use consistent quote style (single or double)',
      });
    }

    return violations;
  }

  findLineNumber(code, searchText) {
    const lines = code.split('\n');
    const index = lines.findIndex(line => line.includes(searchText));
    return index >= 0 ? index + 1 : null;
  }

  calculateScore(issues) {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
        case 'info':
          score -= 1;
          break;
      }
    });

    return Math.max(0, score);
  }

  generateSuggestions(issues, framework) {
    const suggestions = [];

    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      suggestions.push({
        priority: 'high',
        message: `Fix ${criticalIssues.length} critical security issue(s) before merging`,
      });
    }

    const styleIssues = issues.filter(i => i.type === 'style');
    if (styleIssues.length > 5) {
      suggestions.push({
        priority: 'medium',
        message: `Run linter (RuboCop/ESLint) to fix ${styleIssues.length} style violations`,
      });
    }

    if (framework === 'rails') {
      suggestions.push({
        priority: 'low',
        message: 'Consider running `rubocop -a` to auto-fix style issues',
      });
    }

    return suggestions;
  }

  async reviewPullRequest(args) {
    const { files } = args;
    
    const review = {
      files: [],
      overallScore: 100,
      summary: {
        totalFiles: files.length,
        issues: 0,
        suggestions: 0,
      },
    };

    for (const file of files) {
      const fileReview = await this.reviewCode({
        code: file.code || file.diff,
        filePath: file.path,
        framework: this.detectFramework(file.path),
      });

      review.files.push({
        path: file.path,
        ...fileReview,
      });

      review.summary.issues += fileReview.issues.length;
      review.summary.suggestions += fileReview.suggestions.length;
    }

    review.overallScore = Math.round(
      review.files.reduce((sum, f) => sum + f.score, 0) / review.files.length
    );

    return review;
  }

  detectFramework(filePath) {
    if (filePath.includes('app/models') || filePath.includes('app/controllers')) {
      return 'rails';
    } else if (filePath.includes('.tsx') || filePath.includes('.jsx')) {
      return 'react-native';
    } else if (filePath.includes('.graphql') || filePath.includes('graphql')) {
      return 'graphql';
    }
    return 'rails';
  }
}

// Start the agent
const agent = new CodeReviewAgent();
agent.start().catch(console.error);

