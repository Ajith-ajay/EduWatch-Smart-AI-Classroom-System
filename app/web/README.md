# EduWatch Web Module (Next.js)

This module provides the browser dashboard/frontend for EduWatch and integrates with the backend API.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Axios for API calls

## Prerequisites

- Node.js 20+
- npm 10+
- EduWatch API module running on `http://localhost:5000`

## Folder Structure

```text
web/
├── app/                  # App Router pages/layouts
├── lib/                  # Shared utilities and API client
├── public/               # Static assets
├── package.json
└── next.config.ts
```

## Environment Variables

Create `.env.local` in `app/web`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:5000
```

## Install and Run

From repository root:

```bash
cd app/web
npm install
npm run dev
```

Open: `http://localhost:3000`

## Build and Start (Production)

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Integration Notes

- API requests are configured from `NEXT_PUBLIC_API_URL`.
- Relative image/file URLs may use `NEXT_PUBLIC_BASE_URL`.
- Ensure backend CORS allows `http://localhost:3000`.

## Troubleshooting

- If API requests fail in browser, verify `.env.local` values and API availability.
- If port 3000 is occupied, run `next dev -p <port>` and update CORS accordingly.
