# Development Commands

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run check` - Run Svelte type checking
- `pnpm run check:watch` - Run type checking in watch mode
- `pnpm run lint` - Run linting (prettier + eslint)
- `pnpm run format` - Format code with prettier
- `pnpm run preview` - Preview production build

# Code Style Guidelines

- Use tabs for indentation, single quotes, no trailing commas
- Import order: external libraries → internal lib → relative imports
- TypeScript strict mode enabled - always type functions and variables
- Use `cn()` utility for Tailwind class merging
- Component props should be typed with `ComponentProps<typeof Component>`
- Error handling: use try/catch with proper typing, avoid `any`
- Naming: kebab-case for files, PascalCase for components, camelCase for functions
- Use Svelte 5 syntax with `$bindable()` and `$state()` where appropriate
- Chart components follow LayerChart patterns with proper typing
