# VocAI - Frontend (Student Panel)

This repository contains a Vite + React + TailwindCSS frontend scaffold for the VocAI student panel. It is ready to connect to a Node/Express + MongoDB backend.

Quick start:

1. Install dependencies:

```powershell
npm ci
```

2. Run dev server:

```powershell
npm run dev
```

Notes:
- The app uses a mock dataset located at `src/mocks/careers.js`. Replace with API calls to fetch real data.
- API base is controlled via `VITE_API_BASE` environment variable.
- Auth expects endpoints under `/api/auth/*` for `login`, `register`, and `forgot` returning `{ token }` on login.

If you want, I can:
- Implement full API mocks for local development, or
- Wire the frontend to your existing backend endpoints if you provide them.
