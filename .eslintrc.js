module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/self-closing-comp': 'off',
    'no-param-reassign': 'off',
    semi: 'warn',
    quotes: ['warn', 'single'],
  },
  parserOptions: {
    project: ['./tsconfig.json','./packages/*/tsconfig.json'],
  }
};
