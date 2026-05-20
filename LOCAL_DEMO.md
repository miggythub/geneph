# GenePH — Local Demo Setup

Quick guide for running GenePH locally (for presentation on a client laptop).

## 1. Requirements
- Node.js 18+ and npm (or bun)
- Internet access to https://oawsxaoniadbdwvtxtdm.supabase.co for the live database/auth.
  If the network blocks it, the app automatically falls back to bundled demo data
  for browsing (search, discover, dashboard, detail pages).

## 2. Create `.env` in the project root

```env
VITE_SUPABASE_PROJECT_ID="oawsxaoniadbdwvtxtdm"
VITE_SUPABASE_URL="https://oawsxaoniadbdwvtxtdm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="PASTE_THE_PUBLISHABLE_KEY_HERE"
```

Important:
- Variable names must start with `VITE_`.
- Use `VITE_SUPABASE_PUBLISHABLE_KEY` (NOT `SUPABASE_ANON_KEY`).
- After editing `.env`, fully stop and restart the dev server.

### Where to get the publishable key
In Lovable: open **Cloud → Settings / Secrets**, or copy from the `.env` provided
in your Lovable preview environment. It is a long JWT starting with `eyJ...`.
The publishable/anon key is safe to commit to a local `.env`; it is public.

## 3. Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually http://localhost:5173.

Do NOT open `index.html` directly with `file://` — auth and env loading will not work.

## 4. If data does not load
- The app will automatically show bundled demo data after ~6 seconds if it cannot
  reach the live backend. A normal-looking page with genes/diseases means the
  fallback kicked in.
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac).
- Check the browser console for `[useDatabase] backend unavailable, using demo data`.

## 5. If login does not work
- Login requires the live backend. If the venue's Wi-Fi blocks it, use the
  public preview/published URL on mobile data, or rely on the demo data
  fallback for read-only browsing.
- Published URL: https://geneph.lovable.app

## 6. User roles (summary)
- Public visitor: search, discover, dashboard, detail pages, submit suggestions.
- Manager: + Admin panel (suggestions, genes, diseases, associations, categories,
  edit buttons on detail pages).
- Super Admin: + User Management (whitelist, temp keys, role promotion).
