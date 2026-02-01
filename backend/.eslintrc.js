/**
 * ESLint Configuration
 * Professional code quality and style enforcement
 */

export default {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier',
  ],
  
  plugins: [
    'node',
  ],
  
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  
  rules: {
    // Error prevention
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    'no-undef': 'error',
    'no-unreachable': 'error',
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-return-assign': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    
    // Node.js specific
    'node/no-unsupported-features/es-syntax': 'off', // We use ES modules
    'node/no-missing-import': 'off', // Handled by module resolution
    'node/no-unpublished-import': 'off', // Allow dev dependencies in tests
    
    // Code style (handled by Prettier, but some logical rules)
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    
    // Import/Export
    'no-duplicate-imports': 'error',
    
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
  },
  
  overrides: [
    {
      // Test files can use console and have different rules
      files: ['**/*.test.js', '**/*.spec.js', '**/tests/**/*.js'],
      rules: {
        'no-console': 'off',
        'node/no-unpublished-require': 'off',
        'node/no-unpublished-import': 'off',
      },
    },
    {
      // Config files can use console
      files: ['*.config.js', 'scripts/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}