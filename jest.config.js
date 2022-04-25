module.exports = {
    testEnvironment: 'node',
    testTimeout: 10000,
    collectCoverageFrom: ['./src/**/*.ts', '!./src/jest/*.ts', '!./src/specs/*.ts'],
    testRegex: '(.*|(\\.|/))(?<!integration|consumer|e2e).test.[jt]s$',
    coverageThreshold: {
        global: {
            branches: 83,
            functions: 83,
            lines: 83,
            statements: 83,
        },
    },
    modulePathIgnorePatterns: ['dist'],
    preset: 'ts-jest',
    clearMocks: true,
    globalSetup: './jest.setup.js',
};
