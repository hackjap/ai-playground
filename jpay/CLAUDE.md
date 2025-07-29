# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<vooster-docs>
- @vooster-docs/prd.md
- @vooster-docs/architecture.md
- @vooster-docs/step-by-step.md
- @vooster-docs/clean-code.md
</vooster-docs>

## Project Overview

PairPay is a PWA (Progressive Web App) for couples, friends, and roommates to manage shared expenses efficiently. The app focuses on simplifying the process of recording, tracking, and settling shared expenses between two people without requiring traditional login/signup flows.

**Core Value Proposition**: Transform shared expense management from a tedious manual process into an intuitive, real-time, transparent financial management tool.

## Development Commands

```bash
# Development
npm run dev          # Start development server with Vite
npm run build        # TypeScript compile + Vite production build
npm run preview      # Preview production build locally
npm run lint         # ESLint check with TypeScript extensions

# No test commands available - testing is currently manual
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 19 + TypeScript, Vite build tool
- **Styling**: Tailwind CSS + shadcn/ui component library  
- **State Management**: Zustand with persistence
- **Backend**: Supabase (PostgreSQL + Realtime + Storage)
- **Authentication**: Anonymous user sessions via localStorage
- **Charts**: Recharts for data visualization

### Database Architecture
The app uses Supabase with the following core tables:
- `pairs`: Two-person relationships with invite codes
- `expenses`: Shared expense records with split ratios  
- `budgets`: Monthly budget settings per pair
- `goals`: Shared savings goals (Post-MVP feature)
- `savings_logs`: Progress tracking for goals

**Key Design Decision**: Uses anonymous users with localStorage-based IDs instead of traditional authentication to reduce onboarding friction.

### State Management Pattern
Zustand store (`useAppStore`) manages:
- Current pair room and user context
- Expense/budget data with optimistic updates
- UI state (modals, filters, loading states)
- Data persistence through browser storage

### Data Flow Architecture
1. **Anonymous User Creation**: Auto-generated IDs stored in localStorage
2. **Pair Connection**: Invite code system for connecting two users
3. **Real-time Sync**: Supabase Realtime for instant data synchronization
4. **Optimistic Updates**: UI updates immediately, syncs to backend asynchronously

## Key Code Patterns

### Component Organization
```
src/
├── components/
│   ├── ui/           # shadcn/ui primitives (button, card, etc.)
│   ├── forms/        # Form components (ExpenseForm, BudgetForm)
│   ├── charts/       # Data visualization components
│   ├── modals/       # Modal components
│   └── layout/       # Layout components
├── pages/            # Route-level page components
├── hooks/            # Custom React hooks for data fetching
├── stores/           # Zustand global state management
├── lib/              # Utilities and Supabase client
└── types/            # TypeScript type definitions
```

### Naming Conventions
- **Page Components**: PascalCase (`Dashboard.tsx`)
- **UI Components**: kebab-case (`button.tsx`)  
- **Hooks**: `use-` prefix (`useExpenses.ts`)
- **Types**: Descriptive interfaces (`DatabaseExpense`, `ExpenseCategory`)

### Supabase Integration Patterns
- **CRUD Functions**: Each table has corresponding `get`, `create`, `update`, `delete` functions
- **Type Safety**: Supabase client typed with custom `Database` interface
- **Realtime**: Subscription functions for real-time data updates
- **Error Handling**: Consistent error throwing with Korean messages

### Component Styling Approach
- **Primary**: Tailwind utility classes
- **Component Variants**: `class-variance-authority` for complex component variations
- **Consistency**: `cn()` utility function for conditional className merging
- **Responsive**: Mobile-first design with PWA optimization

## Important Implementation Details

### Anonymous User System
The app generates anonymous user IDs using crypto.randomUUID() with a 36-character limit, stored as `jpay_anonymous_user_id` in localStorage. This enables immediate app usage without signup friction.

### Real-time Data Synchronization
Supabase Realtime subscriptions automatically sync data changes between paired users. The subscription functions handle filtering to ensure users only receive updates relevant to their pair.

### PWA Configuration
- Service Worker for offline caching
- Web App Manifest for installability
- Mobile-optimized touch interactions
- Responsive design for all screen sizes

### Split Calculation Logic
Expenses support flexible splitting:
- 50/50 default split
- Custom ratios (stored as decimal 0-1)
- Full payment by one person (100/0 splits)
- Settlement calculation aggregates all unsettled expenses

## Development Guidelines

### When Adding New Features
1. **Types First**: Define TypeScript interfaces in `src/types/index.ts`
2. **Database Schema**: Update `database-schema.sql` for new tables/columns
3. **Supabase Functions**: Add CRUD operations in `src/lib/supabase.ts`
4. **State Management**: Update Zustand store if global state needed
5. **Components**: Build UI components using existing shadcn/ui patterns

### Code Quality Standards
- **Clean Code Principles**: Follow DRY, KISS, YAGNI principles rigorously
- **Function Size**: Maximum 20 lines per function (prefer under 10)
- **Naming**: Intention-revealing names, avoid abbreviations
- **Error Handling**: Fail fast with clear error messages
- **Single Responsibility**: Each function/component has one clear purpose

### Testing Strategy
Currently manual testing only. When adding tests:
- Focus on business logic functions
- Test user workflows end-to-end
- Verify Supabase integration with test data
- Test PWA functionality across devices

## Important Constraints

### Browser Compatibility
- Chrome 80+, Safari 14+, Firefox 75+, Edge 80+
- PWA features require modern browser support
- Mobile Safari has specific PWA installation requirements

### Performance Considerations
- Bundle size warnings for chunks >500KB
- Realtime subscriptions should be cleaned up properly
- localStorage used for persistence has size limits
- Images/receipts stored in Supabase Storage

### Security Notes
- RLS (Row Level Security) policies protect pair data
- Anonymous users still have data isolation
- Environment variables required for Supabase connection
- No sensitive data should be committed to repository

## Development Practices

### Commit Message Guidelines
- Commit messages should be written in Korean for clear communication
- Use descriptive and concise language
- Explain the purpose and context of the changes