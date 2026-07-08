# Deforestación en Comunidades Nativas

A Next.js web application for monitoring deforestation in native communities in Peru, developed for **Paz y Esperanza**.

## Features

- Interactive map via Google Earth Engine
- Deforestation statistics with charts and tables
- Email alert subscriptions by community *(currently disabled — see below)*

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [Vercel](https://vercel.com/) — hosting

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/dorinahorvath1-blip/deforestacion-.git
cd deforestacion-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

No accounts or environment variables are needed to run the app locally.

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Deploy — no environment variables required for the base app

---

## Optional: Re-enabling Email Subscriptions

The email subscription system (Supabase + Resend + cron job) is fully built but currently commented out. To re-enable it:

### Accounts needed
- [Supabase](https://supabase.com) — free tier works
- [Resend](https://resend.com) — free tier works (requires a verified domain to send to external emails)

### Step 1 — Create environment variables

Create a `.env.local` file in the root:

```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=your-resend-api-key

# Cron secret (any random string you choose)
CRON_SECRET=your-random-secret
```

### Step 2 — Create the Supabase table

In Supabase → SQL Editor, run:

```sql
CREATE TABLE public.suscriptores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  apellido text NOT NULL,
  email text NOT NULL,
  comunidad text NOT NULL,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.suscriptores ENABLE ROW LEVEL SECURITY;
```

### Step 3 — Uncomment the code

Uncomment the following files:
- `src/app/page.tsx` — the Suscribirse tab and form state
- `src/app/api/suscribir/route.ts` — saves emails to Supabase and sends welcome email
- `src/app/api/cron/route.ts` — sends alert emails when deforestation is detected

Also update the `from` email address in both API route files to use your verified Resend domain.

### Step 4 — Add env vars to Vercel

In Vercel → Settings → Environment Variables, add all four variables from `.env.local`, then redeploy.

### Step 5 — Set up the cron job (automated alerts)

Create a `vercel.json` file in the root:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 8 * * *"
    }
  ]
}
```

This runs the deforestation check every day at 8am UTC.

### Testing email alerts manually

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://your-vercel-app.vercel.app/api/cron?test=true"
```
