# reciprocity-sync
maintainer facing readme

## Local Dev

### Installation

1. Copy `.env.example` as `.env` - this file is intentionally ignored by git
   - `cp .env.example .env`
2. Update the variables in `.env` with your x-api-token
3. `npm i`
4. `npm build-watch`
   - With the above command running the background, run `npm run once` each time you want to run the program

### Code Quality Checks

- Linting - `npm run lint`
- Tests - `npm run test` | `npm run test-once`
      - The single run test command will also generate a code coverage report.
