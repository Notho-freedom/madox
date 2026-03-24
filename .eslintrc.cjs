module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'dist-electron', 'dist-server', 'release', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  overrides: [
    {
      files: ['postcss.config.js', 'tailwind.config.js'],
      env: { node: true, es2020: true },
    },
    {
      files: ['electron/**/*.ts'],
      env: { node: true, es2020: true },
    },
    {
      files: ['server/**/*.ts'],
      env: { node: true, es2020: true },
    },
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
