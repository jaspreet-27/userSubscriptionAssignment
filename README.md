# tsnode

## Description

A TypeScript project utilizing Node.js, Express, MongoDB, and various libraries for authentication, validation, and task scheduling.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)
- [License](#license)

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

To start the application, run:

```bash
npm start
```

### Development

To run the application in development mode, use:

```bash
npm dev
```

## Scripts

- **test**: Run tests (currently not specified)
- **start**: Start the application
- **build**: Compile TypeScript files
- **dev**: Compile TypeScript and run with nodemon
- **lint**: Run ESLint to check for code quality
- **prettier**: Format code with Prettier
- **prettier:check**: Check code formatting

## Dependencies

- `bcrypt`: Library to help hash passwords
- `continuation-local-storage`: Library for managing context across asynchronous calls
- `dotenv`: Loads environment variables from a .env file
- `express`: Web framework for Node.js
- `jsonwebtoken`: Library to work with JSON Web Tokens
- `moment`: Library for date manipulation
- `mongoose`: ODM for MongoDB
- `nanoid`: For generating unique IDs
- `yup`: Schema builder for value parsing and validation

## Dev Dependencies

- `@types/bcrypt`, `@types/continuation-local-storage`, `@types/express`, `@types/jsonwebtoken`, `@types/node`, `@types/node-cron`, `@types/winston`: TypeScript type definitions for respective libraries
- `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`: ESLint support for TypeScript
- `eslint`: Linter for JavaScript and TypeScript
- `eslint-config-prettier`: Config to disable ESLint rules that conflict with Prettier
- `husky`: Git hooks management
- `nodemon`: Automatically restart node application on file changes
- `prettier`: Code formatter for consistent code style
- `typescript`: TypeScript language support

## License

ISC
