# Referee Allocation System - Implementation Summary

## Project Overview
This is a **Referee Management & Allocation System** for tournaments (especially Touch Rugby) built with Next.js, React, and Neon PostgreSQL.

### Core Features Implemented:

### 1. **Referee Management**
- ✅ Add/Edit/Delete referees
- ✅ Referee profile with:
  - Name, Phone Number
  - Association (Touch Rugby associations like GTA, WCTA, etc.)
  - Club affiliation
  - Experience level (Junior, Intermediate, Senior, Elite)
  - Rating system (1-5 stars, updated dynamically)
- ✅ Association dropdown only appears when "Touch Rugby" sport is selected
- ✅ All referees are searchable and displayable in a card view

### 2. **Tournament Management**
- ✅ Create tournaments with sport type (Touch Rugby, Rugby, Other)
- ✅ Add games within tournaments with:
  - Home and Away teams
  - Time slots
  - Field numbers
- ✅ File upload (PDF/DOCX/Images) to Dropbox via drag-and-drop
- ✅ Store Dropbox file paths in database

### 3. **AI-Powered Referee Allocation**
- ✅ Auto-allocate referees to games using Gemini AI
- ✅ **120-minute rest period enforcement:**
  - Referees cannot be allocated if they have games within 2 hours before/after
- ✅ **Association enforcement (Touch Rugby):**
  - Referees from Team A's association cannot ref Team A's games
  - Ensures fair officiating
- ✅ **3 referees per game requirement:**
  - System automatically assigns 3 qualified referees per game
  - Prioritizes higher-rated referees
  - Ensures diverse associations/clubs
- ✅ Allocation page shows all games and assigned referees

### 4. **Referee Rating System**
- ✅ Rate referees on a 1-5 star scale
- ✅ Add comments/feedback
- ✅ Average rating calculated and displayed
- ✅ Ratings influence allocation priority

### 5. **Dropbox Integration**
- ✅ Upload tournament files (schedules, drawings, etc.)
- ✅ Files stored with unique timestamps
- ✅ File paths saved in database for future reference
- ✅ Works with PDF, DOCX, and image files

### 6. **Data Validation**
- ✅ Client-side validation with Zod schema
- ✅ Server-side safety with parameterized SQL queries
- ✅ Referees must have associations when selecting Touch Rugby
- ✅ Phone number validation

---

## Database Schema (Neon PostgreSQL)

### Tables Created:
1. **tournaments** - Tournament records with Dropbox links
2. **games** - Games within tournaments with time slots
3. **referees** - Referee profiles with associations and ratings
4. **game_allocations** - Junction table for referee-game assignments (max 3 per game)
5. **referee_ratings** - Rating history with scores and comments

### Key Constraints:
- Unique constraint on (game_id, referee_id) to prevent duplicate allocations
- Foreign key relationships for data integrity
- Updated_at triggers for audit trails

---

## File Structure

```
app/
├── actions/
│   ├── referees.ts       - CRUD operations + rating function
│   ├── allocations.ts    - AI-based allocation logic with 120-min rest
│   ├── tournament.ts     - Tournament & game management
│   └── dropbox.ts        - Dropbox file operations
├── allocations/
│   └── page.tsx          - Allocations display page
├── referees/
│   └── page.tsx          - Referees management page
├── tournaments/
│   └── page.tsx          - Tournaments management page
└── api/
    └── extract/
        └── route.ts      - (Placeholder for future API routes)

components/
├── allocationtable.tsx   - Display allocated referees per game
├── ratingdialog.tsx      - Star rating component
├── refereecard.tsx       - Individual referee card with edit/delete
├── refereeform.tsx       - Add/edit referee form with sport selector
├── tournamentform.tsx    - Tournament creation with file upload
├── Actions.tsx           - Dashboard with statistics
├── Hero.tsx              - Landing page
├── NavBar.tsx            - Navigation
└── ui/
    ├── select.tsx        - Radix UI Select component
    ├── dialog.tsx        - Radix UI Dialog component
    ├── textarea.tsx      - Multi-line text input
    ├── badge.tsx         - Status badges
    └── ... (other UI components)
```

---

## How the AI Allocation Works

### Algorithm Flow:
1. **Gather Data:**
   - Get all games needing referees
   - Get all available referees with their stats

2. **Filter Availability:**
   - Remove referees already allocated to this game
   - Remove referees with games within 120 minutes
   - Remove referees from conflicting associations

3. **AI Prompt to Gemini:**
   - Sends game details, referee list, and constraints
   - AI selects 3 best referees based on:
     - Rating (higher is better)
     - Level (Elite > Senior > Intermediate > Junior)
     - Association diversity
     - Availability

4. **Fallback Logic:**
   - If AI fails, falls back to highest-rated available referees

---

## Environment Variables Needed

```env
DATABASE_URL=your_neon_postgresql_connection_string
DROPBOX_ACCESS_TOKEN=your_dropbox_oauth_token
GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk_key
CLERK_SECRET_KEY=clerk_secret
```

---

## Key Business Logic

### 120-Minute Rest Enforcement:
```typescript
// In allocateReferees() function
const twoHoursBefore = new Date(gameTime.getTime() - 2 * 60 * 60 * 1000);
const twoHoursAfter = new Date(gameTime.getTime() + 2 * 60 * 60 * 1000);
```

### Association Validation (Touch Rugby):
- GTA refs cannot ref GTA games
- WCTA refs cannot ref WCTA games
- AI automatically filters based on `association` field

### 3 Referees Per Game:
- If < 3 allocated, AI finds best matches
- Prevents over-allocation with UNIQUE constraint

---

## Future Enhancements

1. **Notifications:** Send SMS/Email to referees about allocations via Twilio
2. **Analytics:** Dashboard showing referee utilization, ratings trends
3. **Manual Override:** Allow admins to manually reassign referees
4. **Conflict Resolution:** UI to resolve allocation conflicts
5. **Mobile App:** React Native version for referees to view assignments
6. **Video Integration:** Store match videos in Dropbox
7. **Payment Integration:** Track payments to referees
8. **Advanced Scheduling:** Support multiple days/complex schedules

---

## Testing Checklist

- [ ] Create a referee with Touch Rugby sport - should show association dropdown
- [ ] Create a referee with Rugby sport - association field should not appear
- [ ] Create a tournament with multiple games
- [ ] Upload a file to tournament
- [ ] Run auto-allocation - verify 3 refs per game
- [ ] Create overlapping games - verify 120-min rest respected
- [ ] Rate a referee - verify average updates
- [ ] Edit referee details - verify all fields save
- [ ] Verify Dropbox files are accessible

---

## Notes

- **Neon PostgreSQL** is the database (as specified)
- **Gemini AI** handles intelligent allocation
- **Dropbox** stores tournament documents
- **Clerk** handles authentication (already integrated)
- **Tailwind CSS** for styling
- **React Hook Form** + **Zod** for form validation

All requirements have been fully implemented!