# Deforestación en Comunidades Nativas

A Next.js web application for monitoring deforestation in native communities in Peru, developed for **Paz y Esperanza**.

## Features

- Interactive map via Google Earth Engine
- Deforestation statistics with charts and tables
- Email alert subscriptions by community

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [Supabase](https://supabase.com/) — database for storing subscribers
- [Resend](https://resend.com/) — email sending
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

### 3. Create your environment variables

Create a `.env.local` file in the root of the project with the following:

```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=your-resend-api-key

# Cron secret (any random string you choose)
CRON_SECRET=your-random-secret
```

### 4. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run:

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

4. Copy your **Project URL** and **service_role key** from Supabase → Settings → API into `.env.local`

### 5. Set up Resend

1. Create a free account at [resend.com](https://resend.com)
2. Add and verify a domain for sending emails
3. Copy your API key into `.env.local`
4. Update the `from` address in these two files to use your verified domain:
   - `src/app/api/suscribir/route.ts`
   - `src/app/api/cron/route.ts`

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in Vercel → Settings → Environment Variables
4. Deploy

### Setting up the cron job (automated email alerts)

In `vercel.json` (create if it doesn't exist), add:

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

This runs the deforestation check every day at 8am UTC. Vercel will call the endpoint automatically with the `CRON_SECRET` as a Bearer token.

---

## Testing email alerts manually

Once deployed, run this in your terminal to send a test alert to all active subscribers:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://your-vercel-app.vercel.app/api/cron?test=true"
```
