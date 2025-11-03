/**
 * Testing Agent
 * 
 * Generates and manages tests for Rails (RSpec) and React Native (Jest).
 * Supports unit tests, integration tests, and end-to-end tests.
 */

import { BaseAgent } from '../base-agent.js';
import { detectLanguage, calculateMetrics } from '../utils.js';

class TestingAgent extends BaseAgent {
  constructor() {
    super({
      name: 'testing-agent',
      version: '1.0.0',
      description: 'AI agent for generating and managing tests for Rails and React Native',
    });

    this.setupTools();
  }

  setupTools() {
    // Generate test for a file
    this.registerTool({
      name: 'generate-test',
      description: 'Generates a test file for a given source file. Supports Rails (RSpec) and React Native (Jest).',
      inputSchema: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Path to the source file to test',
          },
          code: {
            type: 'string',
            description: 'Source code content',
          },
          testType: {
            type: 'string',
            enum: ['unit', 'integration', 'e2e', 'component'],
            description: 'Type of test to generate',
          },
          framework: {
            type: 'string',
            enum: ['rspec', 'jest'],
            description: 'Testing framework to use',
          },
        },
        required: ['code', 'framework'],
      },
      handler: async (args) => {
        return this.generateTest(args);
      },
    });

    // Analyze test coverage
    this.registerTool({
      name: 'analyze-coverage',
      description: 'Analyzes test coverage for a codebase and provides recommendations.',
      inputSchema: {
        type: 'object',
        properties: {
          codebasePath: {
            type: 'string',
            description: 'Path to the codebase root',
          },
          framework: {
            type: 'string',
            enum: ['rspec', 'jest'],
            description: 'Testing framework being used',
          },
        },
        required: ['framework'],
      },
      handler: async (args) => {
        return this.analyzeCoverage(args);
      },
    });

    // Generate test examples
    this.registerTool({
      name: 'generate-test-examples',
      description: 'Generates example test cases for a specific component or function.',
      inputSchema: {
        type: 'object',
        properties: {
          componentName: {
            type: 'string',
            description: 'Name of the component or class to test',
          },
          framework: {
            type: 'string',
            enum: ['rspec', 'jest'],
            description: 'Testing framework to use',
          },
          testCases: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of test cases to generate',
          },
        },
        required: ['componentName', 'framework'],
      },
      handler: async (args) => {
        return this.generateTestExamples(args);
      },
    });
  }

  async generateTest(args) {
    const { filePath, code, testType = 'unit', framework } = args;
    const language = filePath ? detectLanguage(filePath) : 'unknown';

    let testCode = '';

    if (framework === 'rspec') {
      testCode = this.generateRSpecTest(code, language, testType);
    } else if (framework === 'jest') {
      testCode = this.generateJestTest(code, language, testType);
    } else {
      throw new Error(`Unsupported framework: ${framework}`);
    }

    return {
      testCode,
      framework,
      testType,
      language,
      suggestions: this.getTestSuggestions(framework, testType),
    };
  }

  generateRSpecTest(code, language, testType) {
    // Extract class/model name from code
    const className = this.extractClassName(code);
    const specName = className ? `${className.downcase()}_spec` : 'model_spec';

    let testTemplate = '';

    if (language === 'ruby' && code.includes('class') && code.includes('ActiveRecord')) {
      // Rails Model test
      testTemplate = `require "rails_helper"

RSpec.describe ${className}, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      ${specName} = ${className}.new
      expect(${specName}).to be_valid
    end
  end

  describe "associations" do
    # Add association tests here
  end

  describe "methods" do
    # Add method tests here
  end
end
`;
    } else if (code.includes('class') && code.includes('Controller')) {
      // Rails Controller test
      testTemplate = `require "rails_helper"

RSpec.describe ${className}, type: :controller do
  describe "GET #index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
    end
  end
end
`;
    } else {
      // Generic RSpec test
      testTemplate = `require "rails_helper"

RSpec.describe ${className || 'TestClass'} do
  describe "#method_name" do
    it "does something" do
      # Test implementation
      expect(true).to be_truthy
    end
  end
end
`;
    }

    return testTemplate;
  }

  generateJestTest(code, language, testType) {
    // Extract component/function name from code
    const componentName = this.extractComponentName(code);
    
    let testTemplate = '';

    if (code.includes('import React') || code.includes('function') || code.includes('const') && code.includes('=')) {
      // React Native component test
      testTemplate = `import React from 'react';
import { render } from '@testing-library/react-native';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    const { getByText } = render(<${componentName} />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<${componentName} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
`;
    } else {
      // Function/utility test
      testTemplate = `import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('given valid input, returns expected output', () => {
    const result = ${componentName}('input');
    expect(result).toBe('expected');
  });
});
`;
    }

    return testTemplate;
  }

  extractClassName(code) {
    const classMatch = code.match(/class\s+([A-Z]\w+)/);
    return classMatch ? classMatch[1] : null;
  }

  extractComponentName(code) {
    const componentMatch = code.match(/(?:function|const)\s+([A-Z]\w+)/);
    return componentMatch ? componentMatch[1] : 'Component';
  }

  async analyzeCoverage(args) {
    const { framework } = args;
    
    const recommendations = {
      rspec: [
        'Ensure model specs cover validations, associations, and scopes',
        'Add controller specs for all actions (index, show, create, update, destroy)',
        'Include integration tests for user flows',
        'Use factories (FactoryBot) instead of fixtures',
        'Keep test setup minimal and focused',
      ],
      jest: [
        'Aim for >80% code coverage',
        'Test component rendering and user interactions',
        'Use React Native Testing Library for component tests',
        'Test utility functions with unit tests',
        'Include snapshot tests for UI components',
      ],
    };

    return {
      framework,
      recommendations: recommendations[framework] || [],
      metrics: {
        targetCoverage: 80,
        currentCoverage: 'Unknown - run coverage tool',
      },
    };
  }

  async generateTestExamples(args) {
    const { componentName, framework, testCases = [] } = args;

    let examples = '';

    if (framework === 'rspec') {
      examples = `# Test examples for ${componentName}

RSpec.describe ${componentName} do
${testCases.length > 0 
  ? testCases.map(tc => `  it "${tc}" do\n    # Implementation\n  end`).join('\n\n')
  : `  it "has a valid test" do
    expect(${componentName}.new).to be_valid
  end`}
end
`;
    } else {
      examples = `// Test examples for ${componentName}

describe('${componentName}', () => {
${testCases.length > 0
  ? testCases.map(tc => `  it('${tc}', () => {\n    // Implementation\n  });`).join('\n\n')
  : `  it('renders correctly', () => {\n    // Implementation\n  });`}
});
`;
    }

    return {
      examples,
      framework,
      componentName,
    };
  }

  getTestSuggestions(framework, testType) {
    const suggestions = {
      rspec: {
        unit: [
          'Use descriptive context blocks',
          'Follow Arrange-Act-Assert pattern',
          'Use FactoryBot for test data',
          'Mock external dependencies',
        ],
        integration: [
          'Test complete user workflows',
          'Use Capybara for feature tests',
          'Test API endpoints',
          'Verify database transactions',
        ],
      },
      jest: {
        unit: [
          'Test pure functions',
          'Mock async operations',
          'Use descriptive test names',
          'Keep tests isolated',
        ],
        component: [
          'Use React Native Testing Library',
          'Test user interactions, not implementation',
          'Avoid testing internal state',
          'Use snapshot tests sparingly',
        ],
      },
    };

    return suggestions[framework]?.[testType] || [];
  }
}

// Start the agent
const agent = new TestingAgent();
agent.start().catch(console.error);

