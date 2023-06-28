const config = {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '\\.ts$': 'ts-jest'
  },
  rootDir: '.',
  testEnvironment: 'jsdom'
};

export default config;
