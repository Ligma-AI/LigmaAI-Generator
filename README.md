# LigmaAI Generator

LigmaAI is an AI-powered image generation platform built using Next.js and the Flux.1 AI model. The platform allows users to create high-quality images from text prompts quickly and easily. It also features a prompt generator to help optimize image creation prompts.

visit it ☞: https://ligma-ai.net


## Features

- AI Image Generation: Generate high-quality images based on text prompts using the Flux.1 AI model.
- Prompt Generator: Improve and refine your prompts to get the best results from the AI.
- i18n Support: Full internationalization support for multilingual audiences.
- Responsive Design: Built with TailwindCSS to ensure a responsive and clean user interface on all devices.
- High Performance: Hosted on Vercel with Cloudflare CDN for fast, secure, and reliable performance.

## Tech Stack

Framework: Next.js
Hosting: Vercel
Domain: Dynadot
CDN: Cloudflare
Styling: TailwindCSS
Template: Radix UI & Preline UI


#### 1. Clone project

```
git clone https://github.com/Ligma-ai/LigmaAI-Generator
```

#### 2. Install dependencies

```
cd imagetoprompt-ai
pnpm i
```

#### 3. Init database

create your database use [local postgres](https://wiki.postgresql.org/wiki/Homebrew) or [supabase](https://supabase.com/)

create tables and migrate:

```
npx prisma generate
prisma migrate dev
```

#### 4. copy .env.example and rename it to .env

```
GOOGLE_ID=
GOOGLE_SECRET=
NODE_ENV=development

GITHUB_ID=
GITHUB_SECRET=

EMAIL_SERVER=
EMAIL_FROM=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

REPLICATE_API_URL=https://api.replicate.com/v1/predictions
REPLICATE_API_TOKEN=
REPLICATE_API_VERSION=


R2_ACCOUNT_ID=
R2_BUCKET=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_DOMAIN_URL=


POSTGRES_DATABASE="postgres"
POSTGRES_HOST="localhost"
POSTGRES_PASSWORD="xxxxx"
POSTGRES_PRISMA_URL="postgres://postgres:xxxxx@localhost:5432/localdb"
POSTGRES_URL="postgres://postgres:xxxxx@localhost:5432/localdb"
POSTGRES_URL_NON_POOLING="postgres://postgres:xxxxx@localhost:5432/localdb"
POSTGRES_URL_NO_SSL="postgres://postgres:xxxxx@localhost:5432/localdb"
POSTGRES_USER="postgres"
```

