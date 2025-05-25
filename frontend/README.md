# SQL LLM Frontend

A modern React frontend for the SQL LLM application built with Vite, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- 🎨 Modern UI with shadcn/ui components
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- ⚡ Vite for fast development
- 🔄 Real-time SQL generation with streaming support
- 🧪 Automated test runner interface
- 📊 Test case management and filtering
- 🌙 Dark mode support (via CSS variables)

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API requests to the backend at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Production

### Docker

Build and run with Docker:

```bash
docker build -t sqlcoder-frontend .
docker run -p 3003:80 sqlcoder-frontend
```

### Manual Build

```bash
npm run build
```

The built files will be in the `dist` directory and can be served by any static file server.

## Architecture

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library
- **Radix UI** - Headless UI primitives

## API Integration

The frontend communicates with the NestJS backend through:

- `/api/test-runner/run` - Run automated tests
- `/api/test-runner/test-cases` - Get test cases
- `/generate-sql` - Generate SQL (non-streaming)
- `/generate-sql-stream` - Generate SQL (streaming)

## Components

### UI Components (`src/components/ui/`)

- `Button` - Customizable button component
- `Card` - Card layout component
- `Select` - Dropdown select component  
- `Textarea` - Text input area component

### Main Application (`src/App.tsx`)

The main application component includes:

1. **Manual Query Section** - Input form for natural language queries
2. **Automated Tests Section** - Test runner interface with results table
3. **Test Cases Section** - Filterable display of all test cases

## Styling

The application uses a design system based on CSS custom properties that support both light and dark themes. Colors and spacing are defined in `src/index.css` and consumed through Tailwind CSS utilities.
