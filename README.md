# SalamWealth Connect - Refactored

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5+-green)](https://www.prisma.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-1.10+-orange)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/salamwealth/ci.yml)](https://github.com/yourusername/salamwealth/actions)

>SalamWealth Connect is a modern Islamic financial platform built with a cutting-edge tech stack, offering Shariah-compliant financial solutions for Malaysian families and businesses.


## 🚀 Refactor Overview

This project has been refactored to use a modern monorepo architecture with the latest technologies for better scalability, performance, and developer experience.

## Features

### 🏦 Islamic Financing
Shariah-compliant personal and business financing solutions with competitive rates and flexible terms.

### 📈 Halal Investments
Including ASB, sukuk, and Islamic unit trusts. Grow your wealth through our curated halal investment platform.

### 🕌 Zakat Management
Automated zakat calculation and distribution system with verified recipients.

### 🎯 New Features
- Real-time portfolio updates with WebSockets
- AI-powered financial insights
- Advanced market data integration
- Enhanced security with JWT and Redis sessions

---

## Tech Stack

- **Runtime**: Node.js@latest (LTS)
- **Frontend**: Next.js@latest (App Router, React 18+)
- **Backend**: Nest.js@latest (Modular architecture)
- **Database**: Neon PostgreSQL (Serverless)
- **Caching**: Redis (Upstash)
- **ORM**: Prisma (Type-safe database client)
- **Storage**: Vercel Blob (File storage)
- **Animations**: Framer Motion
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)
- **Monorepo**: Turborepo
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Authentication**: JWT with Redis sessions
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Notifications**: Sonner

## 🏗️ Architecture & Project Structure

```mermaid
graph TB
    %% Root level
    ROOT[SalamWealth Monorepo] --> APPS[apps/]
    ROOT --> PACKAGES[packages/]
    ROOT --> CONFIG[Configuration Files]

    %% Apps section
    APPS --> WEB[web/ - Next.js Frontend]
    APPS --> API[api/ - Nest.js Backend]
    APPS --> SHARED[shared/ - Shared Types & Utils]

    %% Web app structure
    WEB --> WEB_APP[app/ - App Router]
    WEB --> WEB_COMPONENTS[components/]
    WEB --> WEB_LIB[lib/]

    WEB_APP --> AUTH_ROUTES[(auth)/ - Auth Routes]
    WEB_APP --> DASHBOARD[dashboard/ - Protected Routes]
    WEB_APP --> API_ROUTES[api/ - Edge API Routes]

    WEB_COMPONENTS --> UI_COMPONENTS[ui/ - Shadcn/ui]
    WEB_COMPONENTS --> ANIMATIONS[animations/ - Framer Motion]
    WEB_COMPONENTS --> DOMAIN_COMPONENTS[financing/ & investment/]

    %% API app structure
    API --> API_SRC[src/]
    API --> API_TEST[test/]

    API_SRC --> MODULES[modules/]
    API_SRC --> COMMON[common/]

    MODULES --> AUTH_MODULE[auth/]
    MODULES --> USERS_MODULE[users/]
    MODULES --> FINANCING_MODULE[financing/]
    MODULES --> INVESTMENT_MODULE[investment/]
    MODULES --> ZAKAT_MODULE[zakat/]

    COMMON --> DECORATORS[decorators/]
    COMMON --> GUARDS[guards/]
    COMMON --> INTERCEPTORS[interceptors/]

    %% Packages section
    PACKAGES --> DATABASE[database/ - Prisma Package]
    DATABASE --> PRISMA[prisma/]
    DATABASE --> SEED[seed.ts]

    PRISMA --> SCHEMA[schema.prisma]
    PRISMA --> MIGRATIONS[migrations/]

    %% Configuration
    CONFIG --> TURBOREPO[package.json - Turborepo]
    CONFIG --> DOCKER[docker-compose.yml]
    CONFIG --> ESLINT[.eslintrc.json]
    CONFIG --> TYPESCRIPT[tsconfig.json]

    %% Styling connections
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef shared fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef config fill:#fff3e0,stroke:#e65100,stroke-width:2px

    class WEB,WEB_APP,WEB_COMPONENTS,WEB_LIB,UI_COMPONENTS,ANIMATIONS,DOMAIN_COMPONENTS,AUTH_ROUTES,DASHBOARD,API_ROUTES frontend
    class API,API_SRC,API_TEST,MODULES,COMMON,AUTH_MODULE,USERS_MODULE,FINANCING_MODULE,INVESTMENT_MODULE,ZAKAT_MODULE,DECORATORS,GUARDS,INTERCEPTORS backend
    class SHARED,DATABASE,PRISMA,SCHEMA,MIGRATIONS,SEED shared
    class TURBOREPO,DOCKER,ESLINT,TYPESCRIPT config
```

## 🔧 Development Setup

### Prerequisites

- Node.js 22+
- npm or pnpm
- Docker (for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/salamwealth.git
cd salamwealth
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start local development environment:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
npm run db:push
```

6. Seed the database:
```bash
npm run db:seed
```

7. Run the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```bash
# Neon PostgreSQL
NEON_POSTGRES_URL="postgresql://user:pass@ep-cool-base-123.us-east-2.aws.neon.tech/salamwealth"

# Redis
REDIS_URL="redis://default:pass@upstash-redis-url.com:6379"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"

# Authentication
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "db:push": "turbo run db:push",
    "db:studio": "turbo run db:studio",
    "db:seed": "turbo run db:seed"
  }
}
```

### Docker Compose for Local Development

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: salamwealth
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: localdev
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## 🚀 Deployment Strategy

### Frontend (Vercel)
- Next.js app with edge runtime for API routes
- Automatic preview deployments
- Vercel Blob for file storage

### Backend (Railway/Render)
- Nest.js API with proper health checks
- Redis caching layer
- Neon PostgreSQL connection pooling

## 📊 Migration Checklist

See [TODO.md](TODO.md) for the complete migration checklist.

## Features in Detail

### Islamic Financing
- Personal financing
- Business financing
- Home financing
- Vehicle financing
- Education financing

### Halal Investments
- ASB investment tracking
- Sukuk investments
- Islamic unit trusts
- Gold investments
- Investment calculators

### Zakat Management
- Automated calculations
- Multiple asset types support
- Distribution tracking
- Annual reminders

### Real-time Features
- Live portfolio updates
- Market data streaming
- Instant notifications

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on:

- Development setup
- Code style guidelines
- Testing requirements
- Pull request process
- Security considerations

### Quick Start
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
