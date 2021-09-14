import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  "roots": [
    "<rootDir>/"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupFilesAfterEnv": ["<rootDir>/spec/setup-enzyme.ts"],
}

export default config
