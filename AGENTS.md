# slides

React + Vite + Tailwind CSS project for codifying technical blog illustrations.

## Development Server

A Vite development server is already running on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: use the running app preview.
- Hot reload: changes to source files are reflected immediately.

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx`.
- `src/App.tsx` - Primary application component and figure harness.
- `src/diagram/` - Shared SVG drawing primitives and palette.
- `src/figures/` - Figure collections. Each collection owns its own `catalog.tsx`.
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import.
- `index.html` - Vite HTML shell.
- `package.json` - Project dependencies and scripts.
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and the `@` alias for `src`.

## Styling

This project uses Tailwind CSS v4 through `@tailwindcss/vite`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`.

## Code Quality

- Use double quotes for strings containing apostrophes, or escape apostrophes in single-quoted strings.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports when a file defines a single primary component.
