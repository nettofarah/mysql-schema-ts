module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRunner: '@undefinedlabs/scope-agent/jest/testRunner',
  setupFilesAfterEnv: ['@undefinedlabs/scope-agent/jest/setupTests'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  globalSetup: '<rootDir>/jest-setup.ts',
  clearMocks: true,
  resetMocks: true,
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
}
