module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'], // Указываем корень для тестов
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Игнорируем папку dist
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Для обработки TypeScript
    },
};