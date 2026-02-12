# TheLocal HRM

A Human Resource Management system built with React, TypeScript, and Vite.

## Prerequisites

- Node.js (v20 or higher)
- pnpm (v10 or higher)

### Installing pnpm

If pnpm is not installed on your system, you can install it using one of the following methods:

**Using npm:**

```bash
npm install -g pnpm
```

Verify the installation:

```bash
pnpm --version
```

## Installation

Install dependencies using pnpm:

```bash
pnpm install
```

## Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:8080`.

### Environment Variables

Create a `.env` file in the root directory for development:

```env
VITE_API_URL=http://localhost:3000/api
```

## Production

### Build for Production

Build the application for production:

```bash
pnpm build:prod
```

The production build will be output to the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
pnpm preview
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
