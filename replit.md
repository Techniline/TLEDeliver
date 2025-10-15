# DeliveryFlow - Delivery Management System

## Overview

DeliveryFlow is an internal delivery management system built for Techniline/MusicMajlis. It provides a two-dashboard architecture: a User Dashboard for creating and tracking delivery requests, and an Admin Dashboard for approving, rejecting, and managing deliveries with driver assignments and time slot controls.

The application handles the complete delivery request workflow from submission through approval/rejection to driver assignment and final delivery status tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing:**
- React 18 with TypeScript for type safety
- Wouter for client-side routing (lightweight alternative to React Router)
- Vite as the build tool and development server

**UI Component System:**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark/light theme support via localStorage and CSS classes
- Component structure follows atomic design principles with reusable UI primitives

**State Management:**
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks for UI-specific state
- Query invalidation strategy for optimistic updates

**Design System:**
- Material Design principles adapted for admin dashboards
- Custom color palette defined in CSS variables for theme switching
- Semantic color coding for delivery statuses (Pending/Approved/Rejected/Delivered)
- Inter font for UI text, JetBrains Mono for monospace elements

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- RESTful API design pattern
- Session-based architecture (session storage configured but implementation details in routes)

**API Structure:**
- `/api/deliveries` - CRUD operations for delivery requests
- `/api/deliveries/:id/status` - Status updates (approve/reject)
- `/api/deliveries/:id/driver` - Driver assignment
- `/api/drivers` - Driver management
- `/api/blocked-slots` - Time slot blocking

**Data Validation:**
- Zod schemas for runtime type validation
- Drizzle-zod integration for automatic schema generation from database models
- Request validation middleware in route handlers

### Data Storage

**Database:**
- PostgreSQL as the primary database
- Neon serverless PostgreSQL driver with WebSocket support
- Drizzle ORM for type-safe database queries and migrations

**Schema Design:**
- `deliveries` table: Core delivery request data with status tracking
- `drivers` table: Driver information with active status
- `blocked_slots` table: Time slot management for capacity control

**Data Models:**
- UUID primary keys for all tables
- Timestamp tracking (createdAt, updatedAt)
- Soft deletion pattern not implemented (hard deletes or status-based)
- Unique constraints on delivery order numbers (DO/********* format)

### Session Management

**Authentication Approach:**
- Session-based authentication using express-session
- connect-pg-simple for PostgreSQL session storage
- SESSION_SECRET environment variable for session encryption
- Credentials included in API requests for session persistence

### Build & Deployment

**Development:**
- Hot module replacement via Vite
- TypeScript compilation with strict mode enabled
- Path aliases for clean imports (@/, @shared/, @assets/)

**Production Build:**
- Separate builds for client (Vite) and server (esbuild)
- Static file serving from dist/public
- Server bundle with ESM format
- Vercel deployment configuration with routing rules

**Environment Configuration:**
- DATABASE_URL for PostgreSQL connection
- SESSION_SECRET for session encryption
- NODE_ENV for environment-specific behavior
- Vercel environment variables for production deployment

## External Dependencies

### Database Service
- **Supabase PostgreSQL**: Hosted PostgreSQL database
  - Connection via DATABASE_URL environment variable
  - Connection pooling through Neon serverless driver
  - WebSocket support for serverless environments

### UI Component Libraries
- **Radix UI**: Unstyled, accessible component primitives (dialogs, popovers, dropdowns, etc.)
- **shadcn/ui**: Pre-styled components built on Radix UI
- **Lucide React**: Icon library for UI elements

### State & Data Management
- **TanStack Query**: Server state caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for forms and API requests

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **date-fns**: Date formatting and manipulation

### Development Tools
- **Drizzle Kit**: Database migration and schema management
- **tsx**: TypeScript execution for development and scripts
- **Replit plugins**: Development tooling for Replit environment (cartographer, dev banner, error overlay)

### Deployment Platform
- **Vercel**: Serverless deployment platform
  - Configured for Node.js serverless functions
  - Static file serving for frontend assets
  - Environment variable management