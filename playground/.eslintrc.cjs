module.exports = {
  extends: 'next/core-web-vitals',
  settings: {
    next: {
      rootDir: 'playground',
    },
  },
  overrides: [
    {
      files: '*.ts',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.cjs'],
      },
    },
  ],
}
