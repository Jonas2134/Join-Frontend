# Join Frontend

This is the frontend for [Join](https://github.com/Jonas2134/Join-Backend) — a Kanban board application for task management, similar to Trello or Jira.
Built with [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/), and [TailwindCSS](https://tailwindcss.com/). No external UI libraries — just vanilla TypeScript with direct DOM manipulation.

The backend is a separate [Django REST Framework](https://github.com/Jonas2134/Join-Backend) project using JWT HTTP-only cookie authentication.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite |
| Unit Tests | Vitest |
| E2E Tests | Playwright |

---

## Project Setup

```bash
# Clone the repository
git clone https://github.com/Jonas2134/Join-Frontend.git
cd Join-Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Compile TypeScript and build for production |
| `npm run preview` | Preview the production build |
| `npm run test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Generate test coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright E2E tests with UI |

### Environment Variables

Copy the `.env.example` file to create your `.env`:

```bash
cp .env.example .env
```

> Make sure the [backend](https://github.com/Jonas2134/Join-Backend) is running before starting the frontend.

---

## Features

- Register, login, and guest login with JWT authentication
- Create and manage multiple boards
- Organize tasks across customizable columns
- Drag and drop tasks between columns
- Set task priorities and assign team members
- Archive and restore boards
- Manage contacts and user profiles
- Responsive design for mobile and desktop
- Dark mode support

---

## Project Structure

```
join-frontend/
├── public/                     # Static assets
├── src/
│   ├── assets/
│   │   ├── icons/              # SVG icons
│   │   └── img/                # Images (PNG, JPG)
│   ├── components/
│   │   ├── bases/              # Abstract base classes (BasePage, BaseDialog, ...)
│   │   └── common/             # Reusable components (Button, InputField, Toast, ...)
│   ├── core/
│   │   ├── api/                # HTTP client & API route configuration
│   │   ├── constants/          # App-wide constants and button configs
│   │   ├── store/              # State management (AuthStore, BoardStore, ...)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Utility functions
│   │   ├── router.ts           # Client-side router
│   │   ├── DialogManager.ts    # Dialog management
│   │   ├── EventManager.ts     # Custom event system
│   │   └── ToastManager.ts     # Toast notifications
│   ├── css/                    # Tailwind stylesheets & theme
│   ├── layouts/                # Page layout components
│   ├── pages/                  # Page components (MVC-like pattern)
│   │   ├── BoardPage/          # Kanban board view
│   │   ├── boards/             # Dashboard & archived boards
│   │   ├── ContactsPage/       # Contact management
│   │   ├── ProfilePage/        # User profile
│   │   └── static/             # Privacy & legal pages
│   └── main.ts                 # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---
