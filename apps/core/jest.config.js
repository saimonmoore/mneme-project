const jestConfig = {
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^@/(.*)\\.js$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@mneme)',
  ],
};

export default jestConfig;
