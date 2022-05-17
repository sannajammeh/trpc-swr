module.exports = {
  extends: 'next/core-web-vitals',
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
