/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@common/(.*)$": "<rootDir>/../common/$1"
  },
  setupFilesAfterEnv: [ "./test/setup.ts" ],
};
