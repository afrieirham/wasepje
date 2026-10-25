<div align="center">

<a href="https://github.com/afrieirham/wasepje">
  <img src="./public/og.png" alt="poster">
</a>
<br/>
<br/>
<img src="./public/logo.png" alt="logo" width="80px"/>
<h3 align="center">WasepJe.com</h3>

Open-source WhatsApp Link Rotator, a wasap.my alternative.

</div>

## Tech Stack

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

For more information on the frameworks used for this project, checkout the following links:

- [Next.js](https://nextjs.org)
- [Clerk](https://clerk.com)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)

## Before running the project

**1. You need these environment variables, see `.env.example` for more information on the required format.**

- `APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- `NEXT_PUBLIC_BILLING_PORTAL_URL`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `CRON_SECRET`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `STRIPE_PRO_ANNUALLY_PRICE_ID`

**2. Create a PostgreSQL database and get the database URL (this project uses Supabase).**

Create a New Database

```bash
createdb <YOUR_DATABASE>
```

Get the Database URL

Locally, you can grab the URL like this (replace username & password with your db credentials)

```bash
postgres://username:password@localhost:5432/<YOUR_DATABASE>
```

You can install PostgreSQL using [Supabase](https://supabase.com)

For Supabase, you can copy the connection URL from the project dashboard.

This URL should be used for the `DATABASE_URL` environment variable.

**3. Create a Clerk account, setup a project to get these value.**

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET` (signing secret of the Clerk webhook endpoint pointing at `/api/clerk/webhook`)

**4. Create a Stripe account to get these value.**

- `NEXT_PUBLIC_BILLING_PORTAL_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `STRIPE_PRO_ANNUALLY_PRICE_ID`

**5. Create a `.env` file and add all the required variables.**

## Starting the app

**1. Fork and clone the repo locally.**

Fork the Repo initially, then clone it to your machine.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/wasepje
cd wasepje
```

**2. Make sure all the required environment variables are added in `.env` file.**

**3. Install dependencies with [pnpm](https://pnpm.io).**

If you haven't installed pnpm yet, run the following command:

```bash
npm install -g pnpm@12.15.0
```

Next, install the required dependencies:

```bash
pnpm install
```

**4. Run `pnpm db:push` to setup the database.**

**5. Run `pnpm dev` to start the app on `localhost:3000`**

## Scheduled jobs

**Purge deleted users** runs daily. It removes users whose Clerk account was deleted more than 14 days ago. Schedule it as a `POST` with the `CRON_SECRET` bearer token:

```bash
curl -X POST https://<APP_URL>/api/purge-deleted-users \
  -H "Authorization: Bearer <CRON_SECRET>"
```

The response is `{"purged": <count>}`. A `401` means the secret does not match.
