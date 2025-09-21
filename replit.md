# Football Live Data Website

## Overview

Football Live is a modern web application that provides real-time football match data, scores, and league information. Built with a focus on sports data visualization, the platform offers a clean, ESPN-inspired interface for tracking live matches across multiple football leagues worldwide. The application features a dark-mode design optimized for extended viewing sessions and provides quick access to match schedules, live scores, and league standings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Pattern**: RESTful endpoints with proxy architecture for external football data
- **Data Flow**: Server acts as a proxy to external football APIs, adding proper headers and handling CORS
- **Storage**: In-memory storage implementation with interface for future database integration
- **Development**: Hot reload with Vite integration for seamless full-stack development

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL support configured
- **Schema**: Simple user table with UUID primary keys, username/password fields
- **Migration**: Drizzle-kit for schema management and database migrations
- **Current State**: Memory storage active, database schema prepared for future use

### Design System
- **Theme**: Dark-first design inspired by ESPN, BBC Sport, and The Athletic
- **Color Palette**: Football green (#142 76% 36%) for primary actions, neutral grays for backgrounds
- **Typography**: Inter font family with JetBrains Mono for match data/scores
- **Components**: Card-based layouts for matches, sidebar navigation, status indicators with color coding
- **Responsive**: Mobile-first approach with collapsible sidebar and touch-friendly interactions

### Authentication & Authorization
- **Current Implementation**: Basic user schema prepared with password storage
- **Storage**: Session-based approach ready for implementation
- **Security**: Password hashing and validation schemas using Zod
- **Future**: Ready for session management and protected routes

## External Dependencies

### Third-Party APIs
- **Football Data Source**: `api.livekicked.info` for live match data and league information
- **API Endpoints**: 
  - `/api/leagues` - Fetches available football leagues
  - `/api/matches/:date` - Retrieves matches for specific dates (YYYYMMDD format)
- **Headers**: Custom user agent and referer headers for API compatibility

### Database Services
- **Primary**: Configured for PostgreSQL via DATABASE_URL environment variable
- **Connection**: @neondatabase/serverless for edge-compatible database connections
- **Session Storage**: connect-pg-simple for PostgreSQL session storage (prepared)
- **Current State**: Application works with external APIs without database dependency

### UI & Component Libraries
- **Core UI**: Radix UI primitives for accessible components (dialogs, dropdowns, tooltips, etc.)
- **Icons**: Lucide React for consistent iconography
- **Carousel**: Embla Carousel for smooth touch interactions
- **Form Handling**: React Hook Form with Zod resolvers for validation
- **Date Handling**: date-fns for date formatting and manipulation

### Development Tools
- **TypeScript**: Full type coverage across client and server
- **ESLint/Prettier**: Code quality and formatting (configured via package.json)
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Integration**: Development banner and error modal for Replit environment

## Replit Environment Setup

### Recent Changes (2025-09-21)
- **Fresh Import Setup**: Successfully imported GitHub project and configured for Replit environment
- **Dependencies**: Installed all npm packages (481 packages) with no breaking issues
- **Host Configuration**: Server properly configured to bind to 0.0.0.0:5000 for Replit proxy compatibility
- **Vite Configuration**: Pre-configured with host: "0.0.0.0" and port: 5000 to support Replit's iframe proxy
- **Workflow Setup**: Configured "Development Server" workflow running `npm run dev` on port 5000
- **API Integration**: All external football API endpoints functioning correctly
- **Deployment**: Configured autoscale deployment with build and run commands
- **No Database Required**: Application runs successfully with in-memory storage

### Current Status
- ✅ Fresh GitHub import successfully configured for Replit environment
- ✅ Dependencies installed and working (481 packages)
- ✅ No database required - using in-memory storage
- ✅ Development workflow running successfully on port 5000
- ✅ TypeScript compilation working, LSP diagnostics resolved by runtime
- ✅ Frontend server accessible via Replit proxy
- ✅ Backend API endpoints functioning properly (/api/news, /api/leagues, /api/matches)
- ✅ External football API integration working
- ✅ Vite HMR connected and functioning
- ✅ Deployment configuration ready for production
- ✅ Ready for use and further development