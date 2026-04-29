# LinkPro - Link-in-Bio SaaS for Indian Creators

A modern link-in-bio platform built specifically for Indian content creators, featuring support for multiple languages, UPI payments, and comprehensive analytics.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js (NextAuth)
- **Image Upload**: Cloudinary
- **Drag & Drop**: @dnd-kit/core
- **Analytics Visualization**: Recharts
- **QR Code**: qrcode package
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Database Host**: Supabase

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── auth/register/
│   │   ├── profile/
│   │   ├── links/
│   │   ├── upload/
│   │   └── track/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   └── [username]/
├── components/
│   ├── builder/
│   ├── public-profile/
│   ├── analytics/
│   └── ui/
├── lib/
│   ├── prisma.ts
│   ├── cloudinary.ts
│   ├── upi.ts
│   ├── analytics.ts
│   └── detectDevice.ts
└── middleware.ts
```

## Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/linkpro"

# Auth
NEXTAUTH_SECRET="generate-this-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Edit `.env.local` with your configuration (see above)

### 3. Generate Prisma Client
```bash
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Using Supabase (Recommended)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy the PostgreSQL connection string
3. Paste into `DATABASE_URL` in `.env.local`
4. Run: `npm run db:push`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Links
- `GET /api/links` - Get all links
- `POST /api/links` - Create new link
- `PUT /api/links/[id]` - Update link
- `DELETE /api/links/[id]` - Delete link
- `PUT /api/links/reorder` - Reorder links

### Upload
- `POST /api/upload` - Upload avatar to Cloudinary

### Analytics
- `POST /api/track` - Track analytics event

## Key Features

### 1. Multi-Language Support
- Supports: English, Hindi, Tamil, Telugu, Bengali
- Store in bioLanguage field
- No translation API needed — just store and display

### 2. UPI Integration
- Generate UPI deep links
- Mobile: Direct link opening
- Desktop: QR code modal display

### 3. Analytics
- Page views, link clicks, UPI clicks
- Device detection (mobile/desktop)
- Country tracking
- Daily click chart
- Per-link stats

### 4. Subdomain Routing
- `username.linkpro.com` → `/username` route
- Works in production only
- Middleware handles rewriting

## Database Schema

See `prisma/schema.prisma` for complete schema with:
- **User**: Core user data
- **Profile**: User profile info + language settings
- **Link**: Links with drag-drop positions
- **AnalyticsEvent**: Complete event tracking

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push schema changes to DB
npm run db:push

# Run Prisma Studio (UI for database)
npm run db:studio

# Create a new migration
npm run db:migrate
```

## Notes

- Username must be lowercase, 3-20 characters, alphanumeric only
- Password minimum 8 characters
- All API routes return JSON with shape: `{ data, error }`
- Analytics tracking always succeeds (returns 200) — never blocks UX
- Avatar images auto-cropped to 256x256 square
- Theme color stored as hex string (e.g., `#000000`)

## License

MIT
