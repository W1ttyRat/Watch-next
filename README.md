# Watch Next

A small movie watchlist app. Add films, browse or filter by genre, and remove films when you're done.

## Requirements

- Node.js 22 or newer
- A Supabase project

## Supabase setup

The app signs users in anonymously. In your Supabase project, enable **Anonymous Sign-Ins** in the Auth settings. The `public.items` table must have the columns used by the app: `id`, `owner_id`, `title`, `genre`, and `created_at`. Enable Row Level Security and add policies that let authenticated users select and delete only their own rows, and insert rows only when `owner_id` matches `auth.uid()`. The backend uses the Supabase publishable key and the guest user's access token; do not put a secret/service-role key in the client.

## Configure environment variables

Create local environment files from the examples:

```powershell
Copy-Item backend/.env.example backend/.env.local
Copy-Item client/.env.example client/.env.local
```

Set the following values in both files using the Supabase project URL and publishable key from your Supabase project settings:

- `backend/.env.local`: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `PORT` (default `3000`).
- `client/.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_API_URL` (default `http://localhost:3000`).

The Vite variables must be prefixed with `VITE_`. Keep the local `.env.local` files private; they should not be committed.

## Install and start

Open two terminals from the project root.

**Terminal 1 — backend:**

```powershell
cd backend
npm install
npm start
```

The API should report that it is running on port `3000`.

**Terminal 2 — frontend:**

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Keep both terminals running while using the app.

## Troubleshooting

- If sign-in fails, confirm Anonymous Sign-Ins are enabled and the client Supabase URL/key are correct.
- If the watchlist cannot reach the API, confirm the backend is running and `VITE_API_URL` matches its address and port. Restart Vite after changing client environment variables.
- If Supabase reports a permission error, check that the `items` table grants and Row Level Security policies allow the `authenticated` role to access rows where `owner_id = auth.uid()`.