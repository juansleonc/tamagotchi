/**
 * Security Agent
 * 
 * Scans for vulnerabilities, validates authentication/authorization,
 * and provides security recommendations.
 */

import { BaseAgent } from '../base-agent.js';

class SecurityAgent extends BaseAgent {
  constructor() {
    super({
      name: 'security-agent',
      version: '1.0.0',
      description: 'AI agent for security vulnerability scanning',
    });

    this.setupTools();
  }

  setupTools() {
    this.registerTool({
      name: 'scan-vulnerabilities',
      description: 'Scans code for security vulnerabilities.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Source code' },
          filePath: { type: 'string' },
        },
        required: ['code'],
      },
      handler: async (args) => this.scanVulnerabilities(args),
    });

    this.registerTool({
      name: 'check-authentication',
      description: 'Validates authentication and authorization implementation.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          framework: { type: 'string', enum: ['rails', 'react-native'] },
        },
        required: ['code', 'framework'],
      },
      handler: async (args) => this.checkAuthentication(args),
    });
  }

  async scanVulnerabilities(args) {
    const { code, filePath } = args;
    const vulnerabilities = [];

    // SQL Injection
    if (this.detectSQLInjection(code)) {
      vulnerabilities.push({
        type: 'sql-injection',
        severity: 'critical',
        message: 'Potential SQL injection vulnerability detected',
        recommendation: 'Use parameterized queries or ORM methods',
      });
    }

    // XSS
    if (this.detectXSS(code)) {
      vulnerabilities.push({
        type: 'xss',
        severity: 'high',
        message: 'Potential XSS vulnerability detected',
        recommendation: 'Sanitize user input and use proper escaping',
      });
    }

    // Hardcoded secrets
    const secrets = this.detectSecrets(code);
    if (secrets.length > 0) {
      vulnerabilities.push({
        type: 'hardcoded-secrets',
        severity: 'critical',
        message: `Found ${secrets.length} potential hardcoded secrets`,
        details: secrets,
        recommendation: 'Move secrets to environment variables or secure storage',
      });
    }

    // CSRF
    if (this.detectCSRF(code)) {
      vulnerabilities.push({
        type: 'csrf',
        severity: 'medium',
        message: 'Missing CSRF protection',
        recommendation: 'Implement CSRF tokens for state-changing operations',
      });
    }

    return {
      filePath: filePath || 'unknown',
      vulnerabilities,
      riskScore: this.calculateRiskScore(vulnerabilities),
    };
  }

  detectSQLInjection(code) {
    const patterns = [
      /where\([^)]*\+/,
      /execute\([^)]*\+/,
      /\$\{[^}]*sql/i,
    ];

    return patterns.some(pattern => pattern.test(code));
  }

  detectXSS(code) {
    return code.includes('.html_safe') || 
           code.includes('raw(') ||
           (code.includes('innerHTML') && !code.includes('sanitize'));
  }

  detectSecrets(code) {
    const secretPatterns = [
      { pattern: /password\s*[=:]\s*['"]([^'"]+)['"]/i, type: 'password' },
      { pattern: /api[_-]?key\s*[=:]\s*['"]([^'"]+)['"]/i, type: 'api-key' },
      { pattern: /secret\s*[=:]\s*['"]([^'"]+)['"]/i, type: 'secret' },
      { pattern: /token\s*[=:]\s*['"]([^'"]+)['"]/i, type: 'token' },
    ];

    const secrets = [];
    secretPatterns.forEach(({ pattern, type }) => {
      const matches = code.matchAll(pattern);
      for (const match of matches) {
        secrets.push({
          type,
          position: match.index,
        });
      }
    });

    return secrets;
  }

  detectCSRF(code) {
    // Rails: should have protect_from_forgery
    if (code.includes('class') && code.includes('Controller') && !code.includes('protect_from_forgery')) {
      return true;
    }

    return false;
  }

  async checkAuthentication(args) {
    const { code, framework } = args;
    const issues = [];

    if (framework === 'rails') {
      if (code.includes('class') && code.includes('Controller')) {
        if (!code.includes('before_action') || !code.includes('authenticate')) {
          issues.push({
            type: 'missing-authentication',
            severity: 'high',
            message: 'Controller missing authentication',
            recommendation: 'Add before_action :authenticate_user! or similar',
          });
        }
      }
    } else if (framework === 'react-native') {
      if (code.includes('fetch') || code.includes('axios')) {
        if (!code.includes('Authorization') && !code.includes('Bearer')) {
          issues.push({
            type: 'missing-auth-header',
            severity: 'medium',
            message: 'API calls missing authorization header',
            recommendation: 'Include Authorization header with Bearer token',
          });
        }
      }
    }

    return {
      framework,
      issues,
      secure: issues.length === 0,
    };
  }

  calculateRiskScore(vulnerabilities) {
    let score = 0;

    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          score += 10;
          break;
        case 'high':
          score += 7;
          break;
        case 'medium':
          score += 4;
          break;
        case 'low':
          score += 1;
          break;
      }
    });

    return Math.min(100, score);
  }
}

const agent = new SecurityAgent();
agent.start().catch(console.error);

