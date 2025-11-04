# Environment Variables Guide

## Overview

This document lists all environment variables used in the Cultural AR Pilot project and their current status.

## Currently Available (Auto-provided by Vercel)

These are automatically set by Vercel and require no configuration:

- `VERCEL_GIT_COMMIT_SHA` - Git commit SHA for the deployment
- `VERCEL_GIT_COMMIT_REF` - Git branch/ref for the deployment
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` - Vercel Analytics ID (production only)

## Feature Flags (Can Be Set Now)

Control which features are enabled in the application:

\`\`\`bash
# Photo Booth Feature
NEXT_PUBLIC_ENABLE_PHOTO_BOOTH=true

# Cocktail Menu Feature
NEXT_PUBLIC_ENABLE_COCKTAIL_MENU=true

# Polls Feature
NEXT_PUBLIC_ENABLE_POLLS=true

# Q&A Feature
NEXT_PUBLIC_ENABLE_QA=true
\`\`\`

**Default:** All features are enabled by default if not specified.

## Event Configuration (Can Be Set Now)

Configure event-specific settings:

\`\`\`bash
# Event date in YYYY-MM-DD format
NEXT_PUBLIC_EVENT_DATE=2025-11-04

# Event name for tracking and analytics
NEXT_PUBLIC_EVENT_NAME=nov4_event

# Campaign tracking for QR codes
NEXT_PUBLIC_UTM_CAMPAIGN=nov4_event
\`\`\`

## Customer.io Integration (Webhook-based)

For user journey tracking and engagement campaigns:

\`\`\`bash
# Site ID (safe to expose on client)
NEXT_PUBLIC_CUSTOMERIO_SITE_ID=your_site_id_here

# API Key (server-side only, NEVER expose to client)
CUSTOMERIO_API_KEY=your_api_key_here
\`\`\`

**How to get these:**
1. Sign up at [Customer.io](https://customer.io)
2. Go to Settings → API Credentials
3. Copy Site ID and API Key
4. Add to Vercel environment variables

**Features enabled:**
- User identification and tracking
- Event tracking (photo captures, menu views, etc.)
- Transactional emails
- Segment management
- Automated follow-up campaigns

**Implementation:** Uses webhook pattern via `/api/track` endpoint for security.

## Optional Integrations

### Database (Choose One)

#### Supabase
\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

**Use for:** User data, photo storage, real-time features

#### Neon
\`\`\`bash
DATABASE_URL=postgresql://user:pass@host/db
\`\`\`

**Use for:** PostgreSQL database with serverless scaling

### Caching & Real-time

#### Upstash Redis
\`\`\`bash
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
\`\`\`

**Use for:** Session management, real-time features, caching

### Payments (If Needed)

#### Stripe
\`\`\`bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
\`\`\`

**Use for:** Ticketing, merchandise sales, premium features

### AI Features (If Needed)

#### Groq
\`\`\`bash
GROQ_API_KEY=your_groq_key
\`\`\`

#### xAI (Grok)
\`\`\`bash
XAI_API_KEY=your_xai_key
\`\`\`

**Use for:** AI-powered features, chatbots, content generation

## Setting Environment Variables

### Local Development

Create a `.env.local` file in the project root:

\`\`\`bash
# Copy from .env.example
cp .env.example .env.local

# Edit with your values
nano .env.local
\`\`\`

### Vercel Deployment

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate scope:
   - **Production** - Live environment
   - **Preview** - Pull request previews
   - **Development** - Local development

### Via Vercel CLI

\`\`\`bash
# Set a single variable
vercel env add NEXT_PUBLIC_EVENT_DATE

# Pull environment variables to local
vercel env pull .env.local
\`\`\`

## Security Best Practices

### Public Variables (NEXT_PUBLIC_*)
- Safe to expose to client
- Visible in browser
- Use for: Feature flags, public IDs, event config

### Private Variables (No prefix)
- Server-side only
- Never exposed to client
- Use for: API keys, secrets, database credentials

### Never Commit
- `.env.local` - Local development
- `.env` - Any environment file with real values
- Always use `.env.example` for templates

## Validation

The application validates required environment variables at runtime:

- Missing optional variables log warnings
- Missing required variables prevent deployment
- Invalid values are caught early with clear error messages

## Current Status Summary

| Variable | Status | Required | Notes |
|----------|--------|----------|-------|
| Feature Flags | ✅ Can set now | No | Defaults to true |
| Event Config | ✅ Can set now | No | Has defaults |
| Customer.io | ⏳ Needs setup | Optional | For tracking |
| Database | ⏳ Not configured | Optional | For persistence |
| Redis | ⏳ Not configured | Optional | For caching |
| Stripe | ⏳ Not configured | Optional | For payments |
| AI Keys | ⏳ Not configured | Optional | For AI features |

## Recommended Setup for Nov 4 Event

**Minimum (No setup required):**
- Use default feature flags
- Use default event config
- Vercel Analytics (auto-enabled)

**Recommended (15 min setup):**
- Customer.io for user tracking
- Feature flags for A/B testing

**Optional (30+ min setup):**
- Supabase for photo storage
- Upstash for real-time features
- Stripe for ticketing

## Troubleshooting

### Variable not working?
1. Check spelling (case-sensitive)
2. Verify `NEXT_PUBLIC_` prefix for client-side
3. Restart dev server after changes
4. Redeploy on Vercel after changes

### Still having issues?
1. Check Vercel deployment logs
2. Verify variable scope (Production/Preview/Development)
3. Check for typos in variable names
4. Ensure no trailing spaces in values
