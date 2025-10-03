# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A NestJS-based chat application using MongoDB with TypeORM. The project uses a monorepo structure with a shared common library for database configuration and entities.

## Development Commands

```bash
# Install dependencies
npm install

# Development with hot reload
npm run start:dev

# Debug mode
npm run start:debug

# Production build and run
npm run build
npm run start:prod

# Linting and formatting
npm run lint           # ESLint with auto-fix
npm run format         # Prettier formatting

# Testing
npm run test           # Run all unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
npm run test:debug     # Debug tests with inspector
```

## Architecture

### Monorepo Structure

The project uses NestJS CLI's monorepo architecture with a shared library:

- **`src/`**: Main application code with feature modules
- **`libs/common/`**: Shared library (import alias: `@app/common`)
  - Contains `DatabaseModule` with TypeORM configuration
  - Exports database entities (currently `UserEntity`)
  - Provides centralized config management via `@nestjs/config`

### Database Setup

- **Database**: MongoDB with TypeORM (not Mongoose despite mongoose being installed)
- **Connection**: Configured via environment variables in `DatabaseModule`
- **Required environment variables**:
  - `DATABASE_URL`: MongoDB connection string
  - `DATABASE_SYNCHRONIZE`: Auto-sync schema (defaults to true)
  - `DATABASE_SSL`: Enable SSL (defaults to true)
  - `PORT`: Server port (defaults to 3001)

### Module Architecture

The `DatabaseModule` from `@app/common` must be imported in feature modules that need database access. Feature modules also need to import `TypeOrmModule.forFeature([EntityName])` to inject repositories.

**Example pattern (see `src/user/user.module.ts`)**:
```typescript
@Module({
  imports: [
    DatabaseModule,                           // Provides DB connection
    TypeOrmModule.forFeature([UserEntity])   // Registers repositories
  ],
  // ...
})
```

### Entity Pattern

Entities use TypeORM decorators for MongoDB:
- `@ObjectIdColumn()` for MongoDB's `_id` field (type: `ObjectId`)
- `@Column()` for regular fields
- `@UpdateDateColumn()` for auto-updated timestamps
- Entity files are located in `libs/common/src/database/entities/`

### Path Aliases

TypeScript path alias `@app/common` is configured in:
- `tsconfig.json` (for TypeScript compilation)
- `package.json` jest config (for testing)

When adding new entities to the common library, they must be:
1. Created in `libs/common/src/database/entities/`
2. Added to the `entities` array in `libs/common/src/database/config/database.config.ts`
3. Exported from `libs/common/src/index.ts` if needed elsewhere

## Project Status

Current implementation includes:
- User module with basic CRUD operations (findAll, findOne by ID, create)
- MongoDB integration via TypeORM
- Global configuration module

The project appears to be in early development with WebSocket/Socket.IO dependencies installed but not yet implemented (chat functionality planned).
