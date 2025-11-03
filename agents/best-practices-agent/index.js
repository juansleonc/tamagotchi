/**
 * Best Practices Agent
 * 
 * Enforces Rails conventions, React Native best practices, and GraphQL schema design patterns.
 * Provides performance optimization suggestions.
 */

import { BaseAgent } from '../base-agent.js';
import { detectLanguage } from '../utils.js';

class BestPracticesAgent extends BaseAgent {
  constructor() {
    super({
      name: 'best-practices-agent',
      version: '1.0.0',
      description: 'AI agent for enforcing best practices in Rails, React Native, and GraphQL',
    });

    this.railsPractices = this.initializeRailsPractices();
    this.reactNativePractices = this.initializeReactNativePractices();
    this.graphqlPractices = this.initializeGraphQLPractices();

    this.setupTools();
  }

  setupTools() {
    // Check best practices
    this.registerTool({
      name: 'check-best-practices',
      description: 'Checks code against framework best practices and conventions.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Source code to check',
          },
          filePath: {
            type: 'string',
            description: 'Path to the file',
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
        return this.checkBestPractices(args);
      },
    });

    // Get best practices guide
    this.registerTool({
      name: 'get-best-practices-guide',
      description: 'Returns best practices guide for a specific framework and component type.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: {
            type: 'string',
            enum: ['rails', 'react-native', 'graphql'],
            description: 'Framework',
          },
          componentType: {
            type: 'string',
            enum: ['model', 'controller', 'service', 'component', 'hook', 'schema', 'resolver'],
            description: 'Type of component',
          },
        },
        required: ['framework', 'componentType'],
      },
      handler: async (args) => {
        return this.getBestPracticesGuide(args);
      },
    });

    // Suggest optimizations
    this.registerTool({
      name: 'suggest-optimizations',
      description: 'Suggests performance optimizations for code.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Source code to analyze',
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
        return this.suggestOptimizations(args);
      },
    });
  }

  async checkBestPractices(args) {
    const { code, filePath, framework } = args;
    const language = filePath ? detectLanguage(filePath) : 'unknown';

    let practices = [];
    let violations = [];
    let score = 100;

    if (framework === 'rails') {
      const result = this.checkRailsPractices(code, language, filePath);
      practices = result.practices;
      violations = result.violations;
      score = result.score;
    } else if (framework === 'react-native') {
      const result = this.checkReactNativePractices(code, language);
      practices = result.practices;
      violations = result.violations;
      score = result.score;
    } else if (framework === 'graphql') {
      const result = this.checkGraphQLPractices(code);
      practices = result.practices;
      violations = result.violations;
      score = result.score;
    }

    return {
      framework,
      filePath: filePath || 'unknown',
      score,
      practices,
      violations,
      recommendations: this.generateRecommendations(violations, framework),
    };
  }

  checkRailsPractices(code, language, filePath) {
    const violations = [];
    const practices = [];

    // Model practices
    if (code.includes('class') && code.includes('< ApplicationRecord')) {
      practices.push('Model inherits from ApplicationRecord');
      
      if (!code.includes('validates')) {
        violations.push({
          rule: 'Rails/Validation',
          severity: 'medium',
          message: 'Models should have validations',
          recommendation: 'Add validations for data integrity',
        });
      }

      if (code.includes('scope') && code.match(/scope.*lambda/)) {
        violations.push({
          rule: 'Rails/ScopeLambda',
          severity: 'low',
          message: 'Prefer -> syntax over lambda for scopes',
          recommendation: 'Use scope :name, -> { condition } syntax',
        });
      }
    }

    // Controller practices
    if (code.includes('class') && code.includes('Controller')) {
      practices.push('Controller follows RESTful conventions');

      if (!code.includes('before_action') && (code.includes('def create') || code.includes('def update'))) {
        violations.push({
          rule: 'Rails/BeforeAction',
          severity: 'medium',
          message: 'Use before_action for authentication/authorization',
          recommendation: 'Add before_action :authenticate_user! or similar',
        });
      }

      if (code.includes('params[:') && !code.includes('permit')) {
        violations.push({
          rule: 'Rails/StrongParameters',
          severity: 'high',
          message: 'Always use strong parameters',
          recommendation: 'Use params.require(:model).permit(:attr1, :attr2)',
        });
      }
    }

    // Service object practices
    if (code.includes('class') && code.match(/class\s+\w+Service/)) {
      practices.push('Service object pattern detected');
      
      if (!code.includes('def self.call') && !code.includes('def initialize')) {
        violations.push({
          rule: 'Rails/ServicePattern',
          severity: 'low',
          message: 'Service objects should have a clear interface',
          recommendation: 'Use ServiceClass.call(args) pattern or initialize + call',
        });
      }
    }

    // N+1 query detection
    if (code.includes('.each') && code.includes('.')) {
      const eachPattern = /\.each\s*\{[^}]*\.[a-z_]+/;
      if (eachPattern.test(code)) {
        violations.push({
          rule: 'Rails/NPlusOneQueries',
          severity: 'high',
          message: 'Potential N+1 query detected',
          recommendation: 'Use includes() or joins() to eager load associations',
        });
      }
    }

    // Use of find_by vs find
    if (code.includes('.find(') && !code.includes('.find_by')) {
      violations.push({
        rule: 'Rails/FindById',
        severity: 'low',
        message: 'Consider using find_by for optional lookups',
        recommendation: 'Use find_by instead of find when record might not exist',
      });
    }

    const score = Math.max(0, 100 - violations.length * 10);

    return { practices, violations, score };
  }

  checkReactNativePractices(code, language) {
    const violations = [];
    const practices = [];

    // Component structure
    if (code.includes('function') || code.includes('const') && code.includes('=>')) {
      practices.push('Functional component detected');

      // Check for proper hooks usage
      if (code.includes('useState') && code.includes('useEffect')) {
        practices.push('Using React hooks');
      }

      // Check for memoization
      if (code.includes('useMemo') || code.includes('useCallback') || code.includes('React.memo')) {
        practices.push('Using memoization for performance');
      } else if (code.includes('function') && code.split('\n').length > 50) {
        violations.push({
          rule: 'React/Performance',
          severity: 'low',
          message: 'Large component - consider memoization',
          recommendation: 'Use React.memo, useMemo, or useCallback for optimization',
        });
      }
    }

    // FlatList best practices
    if (code.includes('FlatList') || code.includes('SectionList')) {
      practices.push('Using FlatList for lists');

      if (!code.includes('keyExtractor')) {
        violations.push({
          rule: 'ReactNative/FlatList',
          severity: 'medium',
          message: 'FlatList should have keyExtractor prop',
          recommendation: 'Add keyExtractor={(item, index) => item.id || index}',
        });
      }

      if (!code.includes('getItemLayout')) {
        violations.push({
          rule: 'ReactNative/FlatListPerformance',
          severity: 'low',
          message: 'Consider adding getItemLayout for better performance',
          recommendation: 'Add getItemLayout for fixed-height items',
        });
      }
    }

    // Navigation practices
    if (code.includes('navigation') || code.includes('NavigationContainer')) {
      practices.push('Using React Navigation');

      if (code.includes('navigation.navigate') && !code.includes('navigation.goBack')) {
        violations.push({
          rule: 'ReactNative/Navigation',
          severity: 'low',
          message: 'Consider navigation state management',
          recommendation: 'Use navigation state properly and handle back navigation',
        });
      }
    }

    // Async operations
    if (code.includes('fetch') || code.includes('axios')) {
      practices.push('Using HTTP client');

      if (!code.includes('try') && !code.includes('catch')) {
        violations.push({
          rule: 'ReactNative/ErrorHandling',
          severity: 'medium',
          message: 'Async operations should have error handling',
          recommendation: 'Wrap async calls in try/catch blocks',
        });
      }
    }

    // State management
    if (!code.includes('useState') && !code.includes('useReducer') && !code.includes('Context') && !code.includes('Redux')) {
      if (code.includes('function') || code.includes('const') && code.includes('=>')) {
        violations.push({
          rule: 'ReactNative/StateManagement',
          severity: 'low',
          message: 'Component might need state management',
          recommendation: 'Consider using useState, useReducer, Context, or Redux',
        });
      }
    }

    const score = Math.max(0, 100 - violations.length * 10);

    return { practices, violations, score };
  }

  checkGraphQLPractices(code) {
    const violations = [];
    const practices = [];

    // Schema descriptions
    if (code.includes('type') || code.includes('input')) {
      if (!code.includes('description') && !code.includes('"""')) {
        violations.push({
          rule: 'GraphQL/SchemaDocumentation',
          severity: 'medium',
          message: 'GraphQL types should have descriptions',
          recommendation: 'Add descriptions to types and fields for better API docs',
        });
      } else {
        practices.push('Schema includes descriptions');
      }
    }

    // Naming conventions
    if (code.includes('type') && code.match(/type\s+[a-z]/)) {
      violations.push({
        rule: 'GraphQL/Naming',
        severity: 'high',
        message: 'GraphQL types should be PascalCase',
        recommendation: 'Use PascalCase for type names: type UserProfile, not type userProfile',
      });
    }

    // Query complexity
    if (code.includes('query') || code.includes('Query')) {
      practices.push('Query type defined');

      // Check for potential deep nesting
      const nestingLevel = (code.match(/\{[^}]*\{[^}]*\{/g) || []).length;
      if (nestingLevel > 3) {
        violations.push({
          rule: 'GraphQL/QueryDepth',
          severity: 'low',
          message: 'Deeply nested queries may impact performance',
          recommendation: 'Consider query depth limiting and complexity analysis',
        });
      }
    }

    // Field arguments
    if (code.includes('field') && code.match(/field\s+\w+\s*\{/)) {
      if (!code.includes('argument')) {
        violations.push({
          rule: 'GraphQL/FieldArguments',
          severity: 'low',
          message: 'Fields with complex logic should accept arguments',
          recommendation: 'Add arguments to fields that need filtering or pagination',
        });
      }
    }

    // Resolver practices (for graphql-ruby)
    if (code.includes('resolve') || code.includes('Resolver')) {
      practices.push('Using resolvers');

      if (code.includes('resolve') && code.includes('->')) {
        practices.push('Using lambda resolvers');
      }
    }

    // N+1 prevention
    if (code.includes('field') && code.includes('object')) {
      violations.push({
        rule: 'GraphQL/NPlusOne',
        severity: 'medium',
        message: 'Consider batch loading for associations',
        recommendation: 'Use GraphQL batch loaders or DataLoader pattern',
      });
    }

    const score = Math.max(0, 100 - violations.length * 10);

    return { practices, violations, score };
  }

  async getBestPracticesGuide(args) {
    const { framework, componentType } = args;

    let guide = {};

    if (framework === 'rails') {
      guide = this.getRailsGuide(componentType);
    } else if (framework === 'react-native') {
      guide = this.getReactNativeGuide(componentType);
    } else if (framework === 'graphql') {
      guide = this.getGraphQLGuide(componentType);
    }

    return {
      framework,
      componentType,
      guide,
    };
  }

  getRailsGuide(componentType) {
    const guides = {
      model: {
        practices: [
          'Inherit from ApplicationRecord',
          'Add validations for data integrity',
          'Define associations clearly',
          'Use scopes for common queries',
          'Keep business logic in models, but extract complex operations to services',
        ],
        example: `class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  
  validates :email, presence: true, uniqueness: true
  
  scope :active, -> { where(active: true) }
end`,
      },
      controller: {
        practices: [
          'Keep controllers thin',
          'Use before_action for authentication/authorization',
          'Always use strong parameters',
          'Use respond_to for multiple formats',
          'Extract complex logic to service objects',
        ],
        example: `class PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def create
    @post = Post.new(post_params)
    if @post.save
      redirect_to @post
    else
      render :new
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :content)
  end
end`,
      },
      service: {
        practices: [
          'Use clear, single-responsibility classes',
          'Use class method .call for simple services',
          'Return result objects for complex operations',
          'Handle errors gracefully',
        ],
        example: `class CreatePostService
  def self.call(user, params)
    new(user, params).call
  end

  def initialize(user, params)
    @user = user
    @params = params
  end

  def call
    Post.create(@params.merge(user: @user))
  end
end`,
      },
    };

    return guides[componentType] || { practices: [], example: '' };
  }

  getReactNativeGuide(componentType) {
    const guides = {
      component: {
        practices: [
          'Use functional components with hooks',
          'Keep components small and focused',
          'Use React.memo for expensive renders',
          'Extract complex logic to custom hooks',
          'Use proper TypeScript/PropTypes',
        ],
        example: `import React, { memo } from 'react';
import { View, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = memo(({ title, onPress }) => {
  return (
    <View>
      <Text onPress={onPress}>{title}</Text>
    </View>
  );
});

export default Button;`,
      },
      hook: {
        practices: [
          'Start hook names with "use"',
          'Return consistent data structure',
          'Handle loading and error states',
          'Clean up subscriptions/effects',
        ],
        example: `import { useState, useEffect } from 'react';

export function useApiData(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}`,
      },
    };

    return guides[componentType] || { practices: [], example: '' };
  }

  getGraphQLGuide(componentType) {
    const guides = {
      schema: {
        practices: [
          'Use descriptive type and field names',
          'Add descriptions to all types and fields',
          'Use input types for mutations',
          'Implement pagination for lists',
          'Use enums for fixed sets of values',
        ],
        example: `type User {
  """Unique identifier for the user"""
  id: ID!
  
  """User's full name"""
  name: String!
  
  """User's email address"""
  email: String!
  
  """Posts created by the user"""
  posts(first: Int, after: String): PostConnection!
}`,
      },
      resolver: {
        practices: [
          'Keep resolvers thin',
          'Use batch loading for associations',
          'Handle errors appropriately',
          'Cache expensive computations',
          'Validate input arguments',
        ],
        example: `class Types::UserType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :posts, Types::PostType.connection_type, null: false

  def posts
    object.posts.limit(20)
  end
end`,
      },
    };

    return guides[componentType] || { practices: [], example: '' };
  }

  async suggestOptimizations(args) {
    const { code, framework } = args;
    const optimizations = [];

    if (framework === 'rails') {
      // Database query optimizations
      if (code.includes('.each') && code.includes('.')) {
        optimizations.push({
          type: 'database',
          priority: 'high',
          suggestion: 'Use includes() or joins() to prevent N+1 queries',
          example: 'User.includes(:posts).each { |user| user.posts.each { |post| ... } }',
        });
      }

      // Caching suggestions
      if (code.includes('def') && !code.includes('Rails.cache')) {
        optimizations.push({
          type: 'caching',
          priority: 'medium',
          suggestion: 'Consider caching expensive computations',
          example: 'Rails.cache.fetch("key", expires_in: 1.hour) { expensive_operation }',
        });
      }
    } else if (framework === 'react-native') {
      // List optimizations
      if (code.includes('map') && code.includes('render')) {
        optimizations.push({
          type: 'rendering',
          priority: 'high',
          suggestion: 'Use FlatList instead of map for long lists',
          example: '<FlatList data={items} renderItem={...} keyExtractor={...} />',
        });
      }

      // Memoization
      if (code.includes('function') && code.split('\n').length > 30) {
        optimizations.push({
          type: 'performance',
          priority: 'medium',
          suggestion: 'Consider using React.memo or useMemo',
          example: 'const MemoizedComponent = React.memo(Component);',
        });
      }
    } else if (framework === 'graphql') {
      // Batch loading
      if (code.includes('field') && code.includes('object')) {
        optimizations.push({
          type: 'queries',
          priority: 'high',
          suggestion: 'Use batch loading to prevent N+1 queries',
          example: 'Use GraphQL::Batch or DataLoader pattern',
        });
      }

      // Field complexity
      optimizations.push({
        type: 'performance',
        priority: 'medium',
        suggestion: 'Implement query complexity analysis',
        example: 'Use graphql-ruby complexity analyzer',
      });
    }

    return {
      framework,
      optimizations,
      totalSuggestions: optimizations.length,
    };
  }

  generateRecommendations(violations, framework) {
    const recommendations = [];

    violations.forEach(violation => {
      recommendations.push({
        priority: violation.severity === 'high' ? 'high' : 'medium',
        rule: violation.rule,
        message: violation.recommendation || violation.message,
      });
    });

    if (framework === 'rails' && violations.length > 5) {
      recommendations.push({
        priority: 'low',
        message: 'Run RuboCop to fix style issues automatically',
      });
    }

    return recommendations;
  }

  initializeRailsPractices() {
    return {
      models: ['validations', 'associations', 'scopes', 'callbacks'],
      controllers: ['strong_parameters', 'before_actions', 'thin_controllers'],
      services: ['single_responsibility', 'clear_interfaces'],
    };
  }

  initializeReactNativePractices() {
    return {
      components: ['functional_components', 'hooks', 'memoization'],
      performance: ['flatlist', 'image_optimization', 'bundle_size'],
      state: ['local_state', 'global_state', 'context'],
    };
  }

  initializeGraphQLPractices() {
    return {
      schema: ['descriptions', 'naming', 'types'],
      queries: ['pagination', 'filtering', 'complexity'],
      resolvers: ['batch_loading', 'caching', 'error_handling'],
    };
  }
}

// Start the agent
const agent = new BestPracticesAgent();
agent.start().catch(console.error);

