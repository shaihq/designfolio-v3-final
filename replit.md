# Designfolio - Portfolio Builder Platform

## Overview

Designfolio is a modern SaaS landing page application for a portfolio builder platform targeted at designers and creative professionals. The application showcases a warm, inviting design aesthetic with serif typography, gradient accents, and clean product mockups. The landing page demonstrates various features through animated sections including hero content, portfolio showcases, email mockups, and feature highlights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React with TypeScript, utilizing Vite as the build tool and development server. The application follows a component-based architecture with modern React patterns including hooks and functional components.

**UI Framework**: Implements shadcn/ui component library (New York style variant) built on top of Radix UI primitives. This provides accessible, customizable components with consistent styling through Tailwind CSS and CSS variables. The design system uses a neutral base color with custom CSS variable-based theming for light/dark mode support.

**Styling Approach**: Tailwind CSS with custom configuration supporting responsive breakpoints, custom border radius values, and an extensive color system based on HSL values with alpha channel support. The design implements custom spacing primitives (4, 6, 8, 12, 16, 20, 24px units) and elevation layers using opacity-based overlays for hover/active states.

**Routing**: Uses Wouter for lightweight client-side routing, currently implementing a simple route structure with a home page and 404 fallback.

**State Management**: React Query (TanStack Query) for server state management with custom query client configuration. Local component state managed through React hooks.

**Animation**: Framer Motion for scroll-based animations and transitions, particularly used in hero and portfolio sections for parallax effects and scroll-triggered reveals.

### Backend Architecture

**Server Framework**: Express.js with TypeScript, configured for ESM modules. The server implements a modular route registration pattern through a centralized routing function.

**Development Environment**: Custom Vite integration for HMR (Hot Module Replacement) in development mode, with middleware-based SSR support. The server includes request logging middleware that captures response times and JSON payloads for API routes.

**Session Management**: Configured for session support with connect-pg-simple for PostgreSQL-backed session storage, though currently using in-memory storage implementation.

**Storage Layer**: Implements an interface-based storage pattern (`IStorage`) with a current in-memory implementation (`MemStorage`) for user data. This abstraction allows for easy migration to database-backed storage without changing business logic.

### Data Storage Solutions

**Database ORM**: Drizzle ORM configured for PostgreSQL with the Neon serverless driver. Schema definitions use Drizzle's type-safe schema builder with Zod integration for runtime validation.

**Schema Design**: Currently implements a minimal user schema with UUID primary keys (using PostgreSQL's `gen_random_uuid()`), username, and password fields. The schema uses Drizzle-Zod for creating insert schemas with type inference.

**Migration Strategy**: Drizzle Kit configured for schema migrations with output to a `migrations` directory, using push-based deployment for schema changes.

**Storage Abstraction**: The application separates storage interface from implementation, allowing the in-memory storage to be swapped for database-backed storage (via Drizzle ORM) without refactoring route handlers.

### Design System Architecture

**Typography System**: Dual-font approach using serif fonts (Playfair Display) for headlines and sans-serif (Inter) for body text. Loaded via Google Fonts with multiple weights (400, 500, 600, 700) for both families.

**Color Palette**: Warm, inviting scheme with cream/beige backgrounds (#FAF8F5, #FFF9F3), deep black text (#0A0A0A, #1A1A1A), bright blue accents (#2563EB), and orange-to-pink gradients for CTAs and highlights. Label system includes semantic colors (blue, green, purple, red, yellow, gray).

**Component Patterns**: Atomic design methodology with reusable UI primitives (buttons, cards, badges) composed into feature components (Navbar, HeroSection, PortfolioSection). All components support responsive breakpoints with mobile-first approach.

**Accessibility**: Built on Radix UI primitives ensuring ARIA compliance, keyboard navigation, and focus management across all interactive components.

### Build and Deployment

**Build Process**: Vite bundles the client-side React application to `dist/public`, while esbuild compiles the server to `dist/index.js` as an ESM bundle with external package resolution.

**Development Mode**: Concurrent development with Vite's dev server providing HMR for frontend and tsx watching server files with automatic restart.

**Path Aliases**: Configured TypeScript path aliases (`@/`, `@shared/`, `@assets/`) for clean imports across client, server, and shared code.

## External Dependencies

### Third-Party UI Libraries

- **Radix UI**: Complete suite of unstyled, accessible component primitives (accordion, dialog, dropdown, popover, select, toast, tooltip, etc.)
- **shadcn/ui**: Pre-styled components built on Radix UI with Tailwind CSS
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel/slider functionality
- **cmdk**: Command palette component
- **Framer Motion**: Animation library for scroll effects and transitions

### Backend Services

- **Neon Database**: Serverless PostgreSQL database (via `@neondatabase/serverless` driver)
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect support
- **Connect PG Simple**: PostgreSQL session store for Express sessions

### Development Tools

- **Vite**: Build tool and dev server with React plugin
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with Autoprefixer
- **Replit Plugins**: Development banner, cartographer, and runtime error overlay for Replit environment

### Form and Validation

- **React Hook Form**: Form state management
- **Zod**: Schema validation library
- **@hookform/resolvers**: Integration between React Hook Form and Zod
- **Drizzle Zod**: Automatic Zod schema generation from Drizzle schemas

### Utilities

- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Variant-based component styling
- **clsx** / **tailwind-merge**: Conditional className utilities
- **nanoid**: Unique ID generation