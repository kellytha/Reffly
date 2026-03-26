# Setup & Configuration Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Neon PostgreSQL account
- Dropbox App (OAuth token)
- Google Gemini API key
- Clerk account (already configured)

---

## Step 1: Environment Variables

Create a `.env.local` file in the project root:

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/dbname

# Dropbox
DROPBOX_ACCESS_TOKEN=sl_xxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini
GEMINI_API_KEY=AIzaSyABC123...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Getting These Tokens:

#### Neon PostgreSQL:
1. Create project at https://console.neon.tech
2. Copy CONNECTION STRING from dashboard
3. Set as `DATABASE_URL`

#### Dropbox OAuth:
1. Go to https://www.dropbox.com/developers/apps
2. Create new app (Scoped, Full Dropbox)
3. Generate access token from Settings
4. Grant permissions: files.content.write, files.content.read

#### Gemini API:
1. Visit https://ai.google.dev
2. Get your API key
3. Enable Generative Language API in Google Cloud Console

---

## Step 2: Database Setup

The database schema is defined in `schema.sql`. There are two ways to run it:

### Option A: Using the Node Script (Recommended)
```bash
npm install
node run-schema.js
```

### Option B: Manual with psql (requires PostgreSQL client)
```bash
psql "$DATABASE_URL" -f schema.sql
```

### Verify Schema Created:
```bash
node -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql\`SELECT table_name FROM information_schema.tables WHERE table_schema='public'\`.then(tables => {
  console.log('Tables:', tables.map(t => t.table_name));
});
"
```

---

## Step 3: Installation & Dependencies

```bash
# Install all dependencies
npm install

# Install Dropbox SDK (if not already)
npm install dropbox

# Verify installations
npm list @neondatabase/serverless dropbox @google/generative-ai
```

---

## Step 4: Run Development Server

```bash
npm run dev
```

Navigate to **http://localhost:3000** in your browser.

---

## Step 5: Initial Testing

### Create Your First Tournament:
1. Click "Let's Get Started" → "Tournaments"
2. Click "Add Tournament Details"
3. Select Sport: "Touch Rugby"
4. Enter Tournament Name: "Test Tournament"
5. Add Game:
   - Home Team: "Team A"
   - Away Team: "Team B"
   - Time: "14:00"
6. Upload test PDF (optional)
7. Click "Add"

### Add Some Referees:
1. Go to "Referees" page
2. Click "Add Referee Details"
3. Fill in:
   - Name: "John Doe"
   - Phone: "0123456789"
   - Sport: "Touch Rugby"
   - Association: "Gauteng Touch Association (GTA)"
   - Level: "Senior"
4. Click "Add Referee"

Repeat for 5+ referees with different associations.

### Allocate Referees:
1. Go to "Allocations" page
2. Click "Auto Allocate Referees"
3. Should see 3 referees allocated per game
4. Check that:
   - No GTA refs are assigned to GTA-affiliated games
   - Refs are from different associations
   - All selected refs have ratings

---

## Step 6: Optional Enhancements

### Enable Email Notifications (Twilio):
```typescript
// Coming soon - Send SMS to referees on allocation
import twilio from 'twilio';
```

### Add Analytics Dashboard:
Create `app/analytics/page.tsx` to show:
- Referee utilization rates
- Rating trends
- Game completion rates

---

## Troubleshooting

### "DATABASE_URL environment variable is not set"
```bash
# Check if .env.local exists and has DATABASE_URL
cat .env.local | grep DATABASE_URL

# If missing, create it:
echo "DATABASE_URL=your_neon_connection_string" >> .env.local
```

### "No database connection string was provided"
- Ensure `process.env.DATABASE_URL` is loaded
- In Vercel, add env vars in Project Settings
- Restart dev server after changing .env.local

### Dropbox Upload Fails
- Check token expiration: https://www.dropbox.com/account/connected_apps
- Verify app has proper scopes
- Check folder path exists: `/tournaments/`

### Gemini API Rate Limit
- Implement retry logic with exponential backoff
- Consider caching allocation results
- Use free tier quota wisely

### Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

---

## Production Deployment

### Vercel:
1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Settings → Environment Variables
4. Deploy: `git push`

### Environment Variables for Production:
```
DATABASE_URL=... (production Neon connection)
DROPBOX_ACCESS_TOKEN=...
GEMINI_API_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### Database Backups:
```bash
# Neon automatically backs up daily
# Manual recovery available in Console
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `schema.sql` | Database schema definition |
| `run-schema.js` | Script to create schema |
| `app/actions/referees.ts` | Referee CRUD + rating |
| `app/actions/allocations.ts` | AI allocation logic |
| `app/actions/dropbox.ts` | Dropbox file operations |
| `components/refereeform.tsx` | Referee creation form |
| `components/tournamentform.tsx` | Tournament + file upload |
| `components/allocationtable.tsx` | Game allocations view |

---

## API Routes to Add (Future)

```
POST /api/referees - Create referee
GET /api/referees - List all referees
PUT /api/referees/[id] - Update referee
DELETE /api/referees/[id] - Delete referee
POST /api/allocations/auto - Trigger auto allocation
GET /api/allocations - Get current allocations
POST /api/ratings - Submit referee rating
```

---

## Support & Resources

- **Neon Docs:** https://neon.tech/docs
- **Gemini API:** https://ai.google.dev/docs
- **Dropbox API:** https://www.dropbox.com/developers/documentation
- **Next.js:** https://nextjs.org/docs
- **React Hook Form:** https://react-hook-form.com

For questions or issues, review the implementation summary in `IMPLEMENTATION_SUMMARY.md`