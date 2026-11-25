# Barbara Jorge Portfolio

Static multi-page portfolio built with HTML, modular SCSS, Alpine.js, and TypeScript Netlify Functions.

## Local development

```sh
npm install
npm run dev
```

The public pages work without credentials and use replaceable sample photography in the gallery. The admin editor requires Supabase configuration. Use `npm run dev:netlify` to run the Netlify Functions locally as well; it downloads the Netlify CLI on first use.

## Supabase and Netlify

1. Create a Supabase project and an Auth user for Barbara.
2. Run `drizzle/0000_portfolio_items.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env` for local work and fill in the project values. Set the same values in Netlify site environment variables.
4. Use the Supabase transaction pooler connection string on port `6543` for `DATABASE_URL`.
5. Keep `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `ADMIN_EMAILS` server-side in Netlify. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are exposed to the browser.
6. Add Barbara's exact Supabase Auth email to `ADMIN_EMAILS`; the API checks both a valid Supabase access token and this allowlist before writes.

The admin currently adds and removes published portfolio records by HTTPS image URL. The public gallery reads those records from `/api/portfolio` and falls back to local curated placeholders when the API is not configured.
