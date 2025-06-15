# Fusion Starter

The Fusion Starter is a modern, production-ready template for building full-stack React applications using react-router-dom in SPA mode.

## Core Framework & Technologies

- **React 18**
- **React Router 6**: Powers the client-side routing
- **TypeScript**: Type safety is built-in by default
- **Vite**: Bundling and development server
- **Vitest**: For testing
- **TailwindCSS 3**: For styling

## Routing System

The routing system is powered by React Router 7:

- `src/pages/Index.tsx` represents the home page.
- Routes are defined in `src/App.tsx` using the `react-router-dom` import
- Route files are located in the `src/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

## Styling System

The styling system combines several technologies:

- **TailwindCSS 3**: Used as the primary styling method with utility classes
- **tailwind.config.ts**: Used to describe the design system tokens, update this file to change the whole look and feel
- **CSS Imports**: Base styles are imported in `src/index.css`
- **UI Component Library**: A comprehensive set of pre-styled UI components in `src/components/ui/` built with:
  - Radix UI: For accessible UI primitives
  - Class Variance Authority: For component variants
  - TailwindCSS: For styling
  - Lucide React: For icons
  - Lots of utility components, like carousels, calendar, alerts...
- **Class Name Utility**: The codebase includes a `cn` utility function from `@/lib/utils` that combines the functionality of `clsx` and `tailwind-merge`. Here's how it's typically used:

  ```typescript
  // A complex example showing the power of the cn utility
  function CustomComponent(props) {
    return (
      <div
        className={cn(
          // Base styles always applied
          "flex items-center rounded-md transition-all duration-200",

          // Object syntax for conditional classes - keys are class names, values are boolean expressions
          {
            // Size-based classes
            "text-xs p-1.5 gap-1": props.size === "sm",
            "text-base p-3.5 gap-3": props.size === "lg",

            // Width control
            "w-full": isFullWidth,
            "w-auto": !isFullWidth,
          },

          // Error state overrides other states
          props.hasError && "border-red-500 text-red-700 bg-red-50",

          // User-provided className comes last for highest precedence
          props.className
        )}
      />
    );
  }
  ```

The styling system supports dark mode through CSS variables and media queries.

## Testing

- **Unit Testing Utilities**: Utility functions such as `cn` in `src/lib/utils.ts` are covered by dedicated unit tests in `src/lib/utils.spec.ts`.
- **Testing Framework**: Tests are written using [Vitest](https://vitest.dev/), which provides a Jest-like API and fast performance for Vite projects.
- **Adding More Tests**: Place new utility tests in the same directory as the utility, using the `.spec.ts` suffix.

## Development Workflow

- **Development**: `npm run dev` - Starts the development server with HMR
- **Backend**: `npm run backend` - Starts the backend API server
- **Production Build**: `npm run build` - Creates optimized production build
- **Type Checking**: `npm run typecheck` - Validates TypeScript types
- **Run tests**: `npm test` - Run all .spec tests

## 🚀 Quick Start with Backend API

### Option 1: Automatic Setup (Recommended)

```bash
# Start the backend server with automatic setup
npm run backend
```

This will:

- Install backend dependencies
- Create environment files
- Seed database with sample products
- Start the API server on port 5000

### Option 2: Manual Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Seed database
npm run seed

# Start backend
npm run dev
```

### Enable Backend Mode

1. Start the backend server (using either option above)
2. In your browser, click "Check Again" in the demo notification
3. The app will automatically switch to backend mode
4. You now have full eCommerce functionality!

### Default Admin Credentials

- **Email**: admin@davami.com
- **Password**: admin123

## 🌐 Production Deployment

For complete production deployment instructions, see:

- **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Comprehensive deployment guide
- **[deployment-configs/](./deployment-configs/)** - Ready-to-use configuration files

## Architecture Overview

The architecture follows a modern React application structure:

```
package.json
app/
├── components/     # Reusable UI components
│   └── ui/         # Core UI component library
├── routes/         # Route components and logic
├── app.css         # Global styles
├── root.tsx        # Root layout and error boundary
└── routes.ts       # Route configuration
```

This structure provides a clean separation of concerns between UI components, routes, and application logic.
