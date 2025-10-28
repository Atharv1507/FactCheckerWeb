# Fact Checker App

A Next.js application that uses AI to fact-check claims and displays trending fake news debunked by the community.

## Features

- 🔍 AI-powered fact checking using Google Gemini
- 📊 Trending fake news dashboard
- 💾 Supabase database integration
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Google Gemini API key

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd factchecker1
npm install
\`\`\`

### 2. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon/public key

### 3. Set Up Environment Variables

1. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Fill in your environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
   - `GEMINI_API_KEY`: Your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Set Up the Database

Run the SQL script to create the necessary table:

\`\`\`sql
-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS fake_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim TEXT NOT NULL,
  result TEXT NOT NULL,
  confidence INTEGER DEFAULT 0,
  is_fake BOOLEAN DEFAULT false,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_fake_checks_is_fake_created 
ON fake_checks(is_fake, created_at DESC);
\`\`\`

Optionally, seed the database with sample data by running the script in `scripts/seed-trending-fakes.sql`.

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

\`\`\`
factchecker1/
├── app/
│   ├── api/
│   │   ├── fact-check/      # AI fact-checking endpoint
│   │   └── trending-fakes/  # Trending fakes data endpoint
│   ├── page.jsx             # Main page
│   └── layout.jsx           # Root layout
├── components/
│   └── trending-fakes.jsx   # Trending fakes component
├── lib/
│   └── supabase/            # Supabase client utilities
├── scripts/
│   └── seed-trending-fakes.sql  # Database seed script
└── .env.example             # Environment variables template
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel project settings
4. Deploy!

### Environment Variables for Production

Make sure to add these environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## Technologies Used

- **Next.js 15** - React framework
- **Supabase** - Database and backend
- **Google Gemini AI** - Fact-checking AI
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

## License

MIT
