/**
 * Clean Code Agent
 * 
 * Detects code smells, suggests refactoring opportunities,
 * and enforces SOLID principles.
 */

import { BaseAgent } from '../base-agent.js';
import { detectLanguage, calculateMetrics } from '../utils.js';

class CleanCodeAgent extends BaseAgent {
  constructor() {
    super({
      name: 'clean-code-agent',
      version: '1.0.0',
      description: 'AI agent for detecting code smells and suggesting refactorings',
    });

    this.setupTools();
  }

  setupTools() {
    this.registerTool({
      name: 'detect-code-smells',
      description: 'Detects code smells and quality issues in code.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Source code to analyze' },
          filePath: { type: 'string', description: 'Path to the file' },
        },
        required: ['code'],
      },
      handler: async (args) => this.detectCodeSmells(args),
    });

    this.registerTool({
      name: 'suggest-refactoring',
      description: 'Suggests refactoring opportunities to improve code quality.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Source code' },
          smellType: { type: 'string', enum: ['long-method', 'large-class', 'duplication', 'complexity'] },
        },
        required: ['code'],
      },
      handler: async (args) => this.suggestRefactoring(args),
    });

    this.registerTool({
      name: 'check-solid-principles',
      description: 'Checks code adherence to SOLID principles.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Source code' },
        },
        required: ['code'],
      },
      handler: async (args) => this.checkSOLID(args),
    });
  }

  async detectCodeSmells(args) {
    const { code, filePath } = args;
    const language = filePath ? detectLanguage(filePath) : 'unknown';
    const metrics = calculateMetrics(code);
    const smells = [];

    // Long method detection
    if (metrics.complexity > 10) {
      smells.push({
        type: 'long-method',
        severity: 'medium',
        message: `Method complexity is ${metrics.complexity}. Consider extracting smaller methods.`,
        line: this.findMethodLine(code),
      });
    }

    // Large class detection
    if (metrics.codeLines > 300) {
      smells.push({
        type: 'large-class',
        severity: 'medium',
        message: `Class has ${metrics.codeLines} lines. Consider splitting into smaller classes.`,
      });
    }

    // Code duplication
    const duplication = this.detectDuplication(code);
    if (duplication.length > 0) {
      smells.push({
        type: 'duplication',
        severity: 'high',
        message: `Found ${duplication.length} potential code duplications`,
        details: duplication,
      });
    }

    // Magic numbers
    const magicNumbers = this.findMagicNumbers(code);
    if (magicNumbers.length > 0) {
      smells.push({
        type: 'magic-numbers',
        severity: 'low',
        message: `Found ${magicNumbers.length} magic numbers. Use named constants.`,
        details: magicNumbers,
      });
    }

    // Dead code
    const deadCode = this.findDeadCode(code, language);
    if (deadCode.length > 0) {
      smells.push({
        type: 'dead-code',
        severity: 'low',
        message: `Found ${deadCode.length} potential dead code sections`,
        details: deadCode,
      });
    }

    return {
      filePath: filePath || 'unknown',
      language,
      metrics,
      smells,
      qualityScore: this.calculateQualityScore(metrics, smells),
    };
  }

  async suggestRefactoring(args) {
    const { code, smellType } = args;
    const suggestions = [];

    if (smellType === 'long-method' || !smellType) {
      suggestions.push(...this.suggestMethodExtraction(code));
    }

    if (smellType === 'large-class' || !smellType) {
      suggestions.push(...this.suggestClassExtraction(code));
    }

    if (smellType === 'duplication' || !smellType) {
      suggestions.push(...this.suggestDRY(code));
    }

    return { suggestions };
  }

  async checkSOLID(args) {
    const { code } = args;
    const principles = {
      singleResponsibility: this.checkSingleResponsibility(code),
      openClosed: this.checkOpenClosed(code),
      liskovSubstitution: this.checkLiskovSubstitution(code),
      interfaceSegregation: this.checkInterfaceSegregation(code),
      dependencyInversion: this.checkDependencyInversion(code),
    };

    return {
      principles,
      score: this.calculateSOLIDScore(principles),
    };
  }

  detectDuplication(code) {
    const lines = code.split('\n').filter(l => l.trim().length > 10);
    const duplicates = [];

    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const similarity = this.calculateSimilarity(lines[i], lines[j]);
        if (similarity > 0.8) {
          duplicates.push({
            line1: i + 1,
            line2: j + 1,
            similarity: Math.round(similarity * 100),
          });
        }
      }
    }

    return duplicates.slice(0, 5); // Return top 5
  }

  findMagicNumbers(code) {
    const magicNumberPattern = /(?<![\w.])\d{2,}(?![\w.])/g;
    const matches = code.matchAll(magicNumberPattern);
    const numbers = [];

    for (const match of matches) {
      const num = parseInt(match[0]);
      if (num > 1 && num < 1000) {
        numbers.push({
          value: num,
          position: match.index,
        });
      }
    }

    return numbers.slice(0, 10);
  }

  findDeadCode(code, language) {
    const deadCode = [];

    // Unused variables (simple heuristic)
    if (language === 'javascript' || language === 'typescript') {
      const constPattern = /const\s+(\w+)\s*=/g;
      const vars = [];
      let match;

      while ((match = constPattern.exec(code)) !== null) {
        vars.push(match[1]);
      }

      vars.forEach(varName => {
        const usageCount = (code.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
        if (usageCount === 1) {
          deadCode.push({
            type: 'unused-variable',
            name: varName,
          });
        }
      });
    }

    return deadCode;
  }

  findMethodLine(code) {
    const methodMatch = code.match(/def\s+\w+/);
    if (methodMatch) {
      const lines = code.substring(0, methodMatch.index).split('\n');
      return lines.length;
    }
    return null;
  }

  suggestMethodExtraction(code) {
    const suggestions = [];
    const metrics = calculateMetrics(code);

    if (metrics.complexity > 5) {
      suggestions.push({
        type: 'extract-method',
        priority: 'high',
        message: 'Extract complex logic into smaller, focused methods',
        example: 'Create helper methods for each logical block',
      });
    }

    return suggestions;
  }

  suggestClassExtraction(code) {
    const suggestions = [];
    const metrics = calculateMetrics(code);

    if (metrics.codeLines > 200) {
      suggestions.push({
        type: 'extract-class',
        priority: 'medium',
        message: 'Consider extracting related functionality into separate classes',
        example: 'Use service objects or value objects for complex logic',
      });
    }

    return suggestions;
  }

  suggestDRY(code) {
    const duplication = this.detectDuplication(code);
    const suggestions = [];

    if (duplication.length > 0) {
      suggestions.push({
        type: 'eliminate-duplication',
        priority: 'high',
        message: 'Extract duplicated code into reusable functions or classes',
        example: 'Create helper methods or utility classes',
      });
    }

    return suggestions;
  }

  checkSingleResponsibility(code) {
    const issues = [];
    
    if (code.includes('class') || code.includes('function')) {
      const metrics = calculateMetrics(code);
      if (metrics.complexity > 10) {
        issues.push('Class/function may have multiple responsibilities');
      }
    }

    return {
      adhered: issues.length === 0,
      issues,
    };
  }

  checkOpenClosed(code) {
    // Simplified check - in practice would need more context
    return {
      adhered: true,
      issues: [],
      note: 'Requires analysis of inheritance and extension patterns',
    };
  }

  checkLiskovSubstitution(code) {
    return {
      adhered: true,
      issues: [],
      note: 'Requires analysis of inheritance hierarchies',
    };
  }

  checkInterfaceSegregation(code) {
    return {
      adhered: true,
      issues: [],
      note: 'Requires analysis of interfaces and dependencies',
    };
  }

  checkDependencyInversion(code) {
    const issues = [];

    // Check for direct instantiation (simplified)
    if (code.match(/new\s+\w+\(/) && !code.includes('interface') && !code.includes('abstract')) {
      issues.push('Consider using dependency injection instead of direct instantiation');
    }

    return {
      adhered: issues.length === 0,
      issues,
    };
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const editDistance = this.levenshteinDistance(str1, str2);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  calculateQualityScore(metrics, smells) {
    let score = 100;

    // Penalize based on complexity
    score -= Math.min(metrics.complexity * 2, 30);

    // Penalize based on smells
    smells.forEach(smell => {
      switch (smell.severity) {
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  calculateSOLIDScore(principles) {
    let score = 0;
    let total = 0;

    Object.values(principles).forEach(principle => {
      total += 1;
      if (principle.adhered) {
        score += 20;
      }
    });

    return score;
  }
}

const agent = new CleanCodeAgent();
agent.start().catch(console.error);

