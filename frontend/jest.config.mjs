export default {
    preset: 'ts-jest', // Use ts-jest for TypeScript support
    testEnvironment: 'jsdom', // Simulate a browser-like environment
    roots: ['src/tests'], // Directory where test files are located
    moduleFileExtensions: ['ts', 'js'], // Recognize TypeScript and JavaScript files
    transform: {
      '^.+\\.ts$': 'ts-jest', // Use ts-jest to process .ts files
    },
    collectCoverage: true, // Optional: Collect test coverage
    collectCoverageFrom: ['src/**/*.ts'], // Files to include in coverage
    coverageDirectory: 'coverage', // Directory to output coverage reports
};
