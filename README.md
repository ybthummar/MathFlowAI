# MathFlow AI - Event Registration System by MATH for AI

A production-ready event registration web application built with Next.js 14, Prisma, and shadcn/ui.

![Math AI Challenge](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

## 🚀 Features

### For Participants
- **Landing Page** - Event details, timeline, prizes, and countdown timer
- **Multi-step Registration** - Intuitive team registration with validation
- **Success Page** - Registration confirmation with downloadable receipt
- **Email Confirmation** - Auto-sent to all team members

### For Administrators
- **Secure Admin Dashboard** - JWT-based authentication
- **Team Management** - Approve, reject, or waitlist teams
- **Advanced Filtering** - Search by name, department, or status
- **CSV Export** - Download all registrations
- **QR Code Badges** - Generate team badges with QR codes

### Technical Features
- Server-side validation with Zod
- Rate limiting for API protection
- Dark/Light mode support
- Fully responsive design
- PostgreSQL database with Prisma ORM

## 📁 Project Structure

```
mathflow-ai-registration/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── route.ts          # Admin CRUD operations
│   │   │   └── export/route.ts   # CSV export
│   │   ├── auth/route.ts         # Authentication
│   │   └── register/route.ts     # Team registration
│   ├── admin/page.tsx            # Admin dashboard
│   ├── register/page.tsx         # Registration form
│   ├── success/page.tsx          # Success page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── admin/
│   │   ├── admin-dashboard.tsx
│   │   └── admin-login.tsx
│   ├── forms/
│   │   └── registration-form.tsx
│   ├── layout/
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── ui/                       # shadcn/ui components
│   ├── countdown-timer.tsx
│   └── success-content.tsx
├── lib/
│   ├── auth.ts                   # JWT authentication
│   ├── mailer.ts                 # Email sending
│   ├── prisma.ts                 # Database client
│   ├── rate-limit.ts             # Rate limiting
│   ├── utils.ts                  # Utilities
│   └── validators.ts             # Zod schemas
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Admin seeder
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Auth | JWT (jose) |
| Email | Resend |
| Validation | Zod + React Hook Form |
| Deployment | Vercel |

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- Resend account for emails
- Vercel account for deployment

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd mathflow-ai-registration

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (use your PostgreSQL connection string)
DATABASE_URL="postgresql://user:password@localhost:5432/mathflowai?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-admin-password"

# Email (Resend)
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="Math AI Challenge <noreply@yourdomain.com>"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_EVENT_DATE="2026-03-15T09:00:00"
NEXT_PUBLIC_REGISTRATION_DEADLINE="2026-03-10T23:59:59"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed admin user
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Vercel Deployment

### Step 1: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing
3. Go to **Storage** tab → **Create Database** → **Postgres**
4. Copy the connection strings

### Step 2: Configure Environment Variables

In Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Vercel Postgres URL |
| `JWT_SECRET` | Strong random string (32+ chars) |
| `ADMIN_EMAIL` | Admin email address |
| `ADMIN_PASSWORD` | Secure admin password |
| `RESEND_API_KEY` | Your Resend API key |
| `EMAIL_FROM` | Sender email address |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL |
| `NEXT_PUBLIC_EVENT_DATE` | Event date (ISO format) |
| `NEXT_PUBLIC_REGISTRATION_DEADLINE` | Deadline (ISO format) |

### Step 3: Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Step 4: Initialize Database

After deployment, run Prisma migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma db push
npx prisma db seed
```

## 📧 Email Setup (Resend)

1. Create account at [resend.com](https://resend.com)
2. Verify your domain or use the test domain
3. Create an API key
4. Add to environment variables

For development, Resend provides a free tier with test sending.

## 🔐 Admin Access

Default admin credentials (change in production!):

- **Email**: Set via `ADMIN_EMAIL` env variable
- **Password**: Set via `ADMIN_PASSWORD` env variable

Access admin panel at `/admin`

## 📊 Database Schema

```prisma
model Team {
  id             String     @id @default(cuid())
  registrationId String     @unique
  teamName       String     @unique
  department     String
  leaderEmail    String
  leaderPhone    String
  status         TeamStatus @default(PENDING)
  agreedToRules  Boolean
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  members        Member[]
}

model Member {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String
  rollNo    String
  year      String
  isLeader  Boolean
  teamId    String
  team      Team     @relation(...)
}
```

## 🎨 Customization

### Changing Event Details

Edit values in:
- `app/page.tsx` - Landing page content
- `.env` - Event dates and deadlines
- `lib/validators.ts` - Departments list

### Theming

Colors are defined in `app/globals.css`:

```css
:root {
  --primary: 262.1 83.3% 57.8%; /* Violet */
  /* ... other CSS variables */
}
```

### Email Templates

Customize in `lib/mailer.ts`

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new team |
| GET | `/api/register?id=` | Get team by registration ID |
| POST | `/api/auth` | Admin login |
| DELETE | `/api/auth` | Admin logout |
| GET | `/api/auth` | Check session |
| GET | `/api/admin` | List teams (admin) |
| PATCH | `/api/admin` | Update team status |
| POST | `/api/admin` | Generate QR code |
| GET | `/api/admin/export` | Export CSV |

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check database connection
npx prisma db pull
```

### Prisma Client Issues
```bash
# Regenerate client
npx prisma generate
```

### Build Errors on Vercel
- Ensure all env variables are set
- Check `vercel.json` configuration
- View deployment logs in Vercel dashboard

## 📝 License

MIT License - feel free to use for your events!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ for college technical events
