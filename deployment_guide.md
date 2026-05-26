# Cloud Deployment Guide: "Yog with Dhaarna"

This guide outlines how to configure, deploy, migrate, and seed your yoga booking application **completely in the cloud**, requiring **zero local machine execution**.

---

## 🛠️ Step 1: Spin Up Your Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Create a new project called `yog-with-dhaarna`.
3. Set a secure database password and choose your region (e.g., **South Asia (Mumbai)** is recommended for Indian audiences).
4. Wait a couple of minutes for your database to provision.
5. Once ready, navigate to **Project Settings** (gear icon) -> **Database**.
6. Scroll down to **Connection string** and select the **Prisma** tab.
7. Copy the connection string. It will look like this:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   ```
8. To run migrations cleanly, also copy the **Direct connection** URI from the **URI** tab (changing the port to `5432` instead of `6543`). This will be your `DIRECT_URL`.

---

## 🚀 Step 2: Set Up Your Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign up/log in (using your GitHub account is recommended).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository containing the `yog with dhaarna` project.
4. In the **Environment Variables** section, paste the following keys (copy them from your `.env` or `.env.example` file):
   * `DATABASE_URL` (Supabase connection string with `pgbouncer=true` and `connection_limit=1`)
   * `DIRECT_URL` (Supabase direct connection string on port `5432`)
   * `RAZORPAY_KEY_ID` (Your Razorpay Test Key ID)
   * `RAZORPAY_KEY_SECRET` (Your Razorpay Test Key Secret)
   * `RAZORPAY_WEBHOOK_SECRET` (Define a secret like `yogdhaarna123`)
   * `RESEND_API_KEY` (Your Resend.com API Key)
   * `SENDER_EMAIL` (Your Resend verified sender address or `onboarding@resend.dev`)
   * `ADMIN_PASSWORD` (A secure password for Dhaarna's admin dashboard)
   * `JWT_SECRET` (Any long, random 32-character string to encrypt sessions)
   * `NEXT_PUBLIC_APP_URL` (Leave empty or set to `https://[your-app-name].vercel.app`)
5. Click **Deploy**. Vercel will build the frontend and API routes in the cloud automatically.

---

## 🗄️ Step 3: Trigger Cloud DB Migrations & Seeding (No Local Terminal Needed!)

Since you do not want to run code or tools locally, you can trigger your initial database setup and populate the 6 yoga classes directly through Vercel's deployment flow or GitHub Actions.

### Option A: Automatic Deployment Script (Recommended)
We have already configured your build script in `package.json`. Every time Vercel builds your project, it runs:
`prisma generate`

If you want Vercel to automatically run database migrations and seed the database on every deployment, you can simply change the build script in `package.json` to:
`prisma migrate deploy && prisma db seed && prisma generate && next build`

This guarantees that:
1. The PostgreSQL database in the cloud is automatically migrated.
2. The 6 yoga classes are seeded automatically.
3. You never have to type a command in a local terminal!

### Option B: One-Click Seed using a Cloud API Route
We can build a temporary secure cloud endpoint (e.g., `/api/admin/seed?secret=YOUR_ADMIN_PASSWORD`) that you can visit in your browser.
Visiting that URL in your browser will instantly trigger the database migrations and seed your classes in Supabase with one click! 

---

## 💳 Step 4: Hook Up Razorpay Webhooks in the Cloud

1. Go to your **Razorpay Dashboard** -> **Settings** -> **Webhooks**.
2. Click **Add New Webhook**.
3. Set the **Webhook URL** to:
   `https://your-vercel-domain.vercel.app/api/webhooks/razorpay`
4. Set the **Secret** to match your `RAZORPAY_WEBHOOK_SECRET` environment variable.
5. In **Active Events**, select:
   * `payment.captured`
   * `payment.failed`
6. Click **Create Webhook**.

Your application is now fully connected in the cloud!
