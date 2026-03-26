# Quick Start Guide (5 Minutes)

## Prerequisites Ready?
- [x] Node.js 18+ installed
- [x] All npm dependencies installed: `npm install`
- [x] .env.local file with these variables:
  ```
  DATABASE_URL=postgresql://...
  DROPBOX_ACCESS_TOKEN=sl_...
  GEMINI_API_KEY=AIzaSy...
  ```

---

## 🚀 Start the App

```bash
# 1. Navigate to project
cd ref-placerv2

# 2. Create database schema
node run-schema.js

# 3. Start development server
npm run dev
```

Open **http://localhost:3000** in your browser ✅

---

## 📋 First Steps in the App

### Step 1: Add a Tournament (2 min)
1. Click "Let's Get Started" → "Tournaments"
2. Click "Add Tournament Details" button
3. Select Sport: **"Touch Rugby"**
4. Tournament Name: `Finals 2024`
5. Home Team: `Team A`
6. Away Team: `Team B`
7. Time: `14:00`
8. (Optional) Drag-drop a PDF
9. Click "Add"

### Step 2: Add Referees (2 min)
1. Go to "Referees" page
2. Click "Add Referee Details"
3. Fill in referee info:
   - Name: `John Smith`
   - Phone: `0123456789`
   - Sport: **"Touch Rugby"** ← Association dropdown appears!
   - Association: `Gauteng Touch Association (GTA)`
   - Level: `Senior`
4. Click "Add Referee"
5. Repeat 3+ times with different associations (WCTA, KZNT, etc.)

### Step 3: Auto-Allocate Referees (1 min)
1. Go to "Allocations" page
2. Click "Auto Allocate Referees" button
3. Watch AI assign 3 refs per game ✨
4. Verify:
   - Each game has 3 referees
   - Referees from different associations
   - No GTA ref assigned to GTA game

### Step 4: Rate a Referee (30 sec)
1. Go to "Referees" page
2. Click on referee card
3. Click "Rate" button (if available in allocation view)
4. Select stars (1-5)
5. Submit
6. Watch rating update on card

---

## 🎯 Key Features to Try

| Feature | Where | How |
|---------|-------|-----|
| Sport-based Association | Referee Form | Select "Touch Rugby" → Association dropdown appears |
| 120-Min Rest | Allocations | Create overlapping games, see rest enforced |
| 3 Refs Per Game | Allocations | All games show exactly 3 refs |
| Different Associations | Allocations | No 2 refs from same association |
| Rating System | Referee Card | Star rating updates average |
| Dropbox Files | Tournament Form | Drag-drop PDF file |

---

## 🐛 Troubleshooting

### "Database connection error"
```bash
# Check DATABASE_URL
echo $env:DATABASE_URL

# If empty, add to .env.local and restart
```

### "Association dropdown doesn't appear"
- Make sure you selected "Touch Rugby" sport
- Not "Rugby" or "Other"

### "AI allocation fails"
- Check GEMINI_API_KEY is correct
- API might be rate-limited (free tier has limits)
- Check terminal for error details

### "Dropbox upload fails"
- Verify DROPBOX_ACCESS_TOKEN
- Check token has write permissions
- Token might be expired

---

## 📚 Full Documentation

- **SETUP_GUIDE.md** → Detailed setup & troubleshooting
- **IMPLEMENTATION_SUMMARY.md** → All features explained
- **VERIFICATION_CHECKLIST.md** → Requirements confirmation

---

## 🎬 Demo Data Script (Optional)

Create file `seed-demo.js`:

```javascript
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function seedDemo() {
  // Add demo referees
  const associations = [
    'Gauteng Touch Association (GTA)',
    'Western Cape Touch Association (WCTA)',
    'KwaZulu-Natal Touch Association (KZNT)',
  ];

  for (const assoc of associations) {
    await sql`
      INSERT INTO referees (name, phone_number, association, level, rating)
      VALUES 
        (${'Ref ' + assoc.split(' ')[0]}, '0123456789', ${assoc}, 'Senior', 4.5)
    `;
  }
  console.log('✅ Demo data added');
}

seedDemo().catch(console.error);
```

Run: `node seed-demo.js`

---

## 🚀 Next Steps

1. ✅ Explore all pages
2. ✅ Test allocations with multiple games
3. ✅ Verify 120-min rest enforcement
4. ✅ Try file upload
5. ✅ Rate some referees
6. ✅ Check database (use Neon Console)

---

## 💡 Pro Tips

- **Association Lookup:** All Touch Rugby associations listed in dropdown
- **Rating Importance:** Higher-rated refs get priority in allocations
- **Rest Periods:** AI prevents ref fatigue automatically
- **File Access:** Dropbox files accessible via stored paths
- **Timestamps:** All actions auto-timestamped for audit trail

---

## 📞 Support

Before contacting support:
1. Restart dev server: Press `Ctrl+C`, then `npm run dev`
2. Check .env.local has all variables
3. Verify node_modules exist: `npm install`
4. Check terminal for error messages
5. Review SETUP_GUIDE.md troubleshooting

---

**You're all set! Have fun refereeing! ⚽🏉**