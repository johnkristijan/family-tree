# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a family tree web application with a Vue 3 frontend and Node.js/Express backend using SQLite. The application manages family members (persons) and their relationships.

## Architecture

- **Frontend**: Vue 3 + TypeScript + Vite + PrimeVue UI library + Pinia for state management
- **Backend**: Node.js + Express + TypeScript + SQLite3 database
- **Database**: SQLite file (`familytree.sqlite`) with `persons` and `relationships` tables
- **Authentication**: Simple password-based login (password: "starcraft")

## Development Commands

### Backend (`/backend`)
```bash
# Install dependencies
yarn install

# Start development server (localhost:3000)
yarn start

# Build TypeScript
yarn build

# Run production build
yarn serve

# Seed database with test data
yarn db:seed

# Clear all data from database
yarn db:unseed
```

### Frontend (`/frontend`)
```bash
# Install dependencies
yarn install

# Start development server (localhost:5173)
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Key API Endpoints

- `POST /api/login` - Authentication (password: "starcraft")
- `GET /api/persons` - List all persons
- `POST /api/persons` - Create person
- `GET /api/persons/:id` - Get person by ID
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person
- `POST /api/persons/:personId/relationships` - Add relationship
- `GET /api/persons/:personId/relationships` - Get person's relationships
- `DELETE /api/relationships/:relationshipId` - Delete relationship

## Database Schema

### persons table
- `id` (INTEGER PRIMARY KEY)
- `first_name` (TEXT NOT NULL)
- `last_name` (TEXT)
- `middle_name` (TEXT)
- `birth_date` (DATE)
- `death_date` (DATE)
- `gender` (TEXT)
- `bio` (TEXT)
- `profile_picture_url` (TEXT)

### relationships table
- `id` (INTEGER PRIMARY KEY)
- `person1_id` (INTEGER FOREIGN KEY)
- `person2_id` (INTEGER FOREIGN KEY)
- `relationship_type` (TEXT) - e.g., "parent_of", "married_to"
- `start_date` (DATE)
- `end_date` (DATE)

## Frontend Structure

- `src/views/` - Page components (LoginView, DashboardView, PersonsListView, PersonFormView)
- `src/components/` - Reusable components
- `src/stores/` - Pinia stores (auth.ts for authentication state)
- `src/router/` - Vue Router configuration
- Uses PrimeVue CSS-in-JS theming with CSS custom properties

## Docker Support

The project includes Docker configuration:
- `docker-compose.yml` for full stack deployment
- Backend runs on port 3000, frontend on port 8080
- SQLite database persisted via volume mount

## Development Notes

- Backend uses `ts-node` for development, no build step required for `yarn start`
- Frontend uses Vite for fast development and building
- No test framework currently configured
- Database is automatically created on first backend startup
- Simple password authentication - production would need proper auth system