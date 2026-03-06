# System Architecture & Data Flow

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Next.js/React)           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Referees    Tournaments    Allocations    Ratings          │
│  Pages       Pages          Pages          Components        │
│                                                               │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼───┐  ┌────▼───┐  ┌──▼────────┐
    │ Server │  │   AI   │  │  Dropbox  │
    │Actions │  │ Gemini │  │    SDK    │
    │(RSC)   │  │  API   │  │           │
    └────┬───┘  └────┬───┘  └──┬────────┘
         │           │          │
         └───────────┼──────────┘
                     │
         ┌───────────▼───────────┐
         │   Neon PostgreSQL     │
         │   (5 Tables)          │
         └───────────────────────┘
```

---

## 📊 Database Schema

```sql
┌─────────────────────────────────────────────────────────────┐
│                       TOURNAMENTS                            │
├──────────┬──────────────────────┬─────────┬────────────────┤
│    id    │ name_of_tournament   │  sport  │ dropbox_file   │
│ (PK)     │ (VARCHAR)            │ (VARCHAR)│  path (VARCHAR)│
└──────────┴──────────────────────┴─────────┴────────────────┘
           │
           │ (1:M)
           │
┌──────────▼────────────────────────────────────────────────┐
│                        GAMES                               │
├─────────┬────────────┬──────────┬──────────┬──────────────┤
│   id    │tournament_id│home_team │away_team │  time_slot   │
│ (PK)    │ (FK)       │(VARCHAR) │(VARCHAR) │ (TIME)       │
└─────────┴────────────┴──────────┴──────────┴──────────────┘
           │
           │ (M:M via junction table)
           │
┌──────────▼───────────────────────────────────────┐
│          GAME_ALLOCATIONS                        │
│     (Max 3 refs per game - UNIQUE constraint)   │
├─────────┬────────────┬──────────┤
│   id    │ game_id    │referee_id│
│ (PK)    │  (FK)      │  (FK)    │
└─────────┴────────────┴──────────┘
                       │
         ┌─────────────┘
         │
         │ (M:1)
         │
┌────────▼──────────────────────────────────────────────┐
│                    REFEREES                            │
├──────┬───────┬──────────┬───────────┬──────┬────────┤
│ id   │ name  │ phone    │association│level │rating  │
│(PK)  │(TEXT) │(VARCHAR) │(VARCHAR)  │(TEXT)│(NUMERIC)│
└──────┴───────┴──────────┴───────────┴──────┴────────┘
  │
  │ (1:M)
  │
┌─▼────────────────────────────────────────────┐
│          REFEREE_RATINGS                     │
├──────┬────────────┬─────────┬─────────┤
│ id   │referee_id  │game_id  │ rating  │
│(PK)  │  (FK)      │  (FK)   │ (INT)   │
└──────┴────────────┴─────────┴─────────┘
```

---

## 🔄 Data Flow Diagrams

### Flow 1: Adding a Referee (Touch Rugby)

```
┌─────────────────────┐
│  Referee Form       │
│  (Client)           │
└──────────┬──────────┘
           │
           │ User selects Sport = "Touch Rugby"
           │
           ▼
┌─────────────────────┐
│ Association         │
│ Dropdown Appears    │
│ (Radix UI Select)   │
└──────────┬──────────┘
           │
           │ User fills form + association
           │
           ▼
┌─────────────────────┐
│ Form Validation     │
│ (Zod Schema)        │
└──────────┬──────────┘
           │
           │ Valid ✓
           │
           ▼
┌─────────────────────┐
│ Server Action       │
│ addReferee()        │
└──────────┬──────────┘
           │
           │ SQL INSERT
           │
           ▼
┌─────────────────────┐
│ Neon PostgreSQL     │
│ REFEREES table      │
└─────────────────────┘
```

### Flow 2: Auto-Allocation (AI)

```
┌──────────────────────────┐
│ Allocations Page         │
│ Click "Auto Allocate"    │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Server Action            │
│ allocateReferees()       │
└────────────┬─────────────┘
             │
    ┌────────┴─────────┬─────────────────┐
    │                  │                 │
    ▼                  ▼                 ▼
┌─────────┐      ┌──────────┐    ┌────────────┐
│ Fetch   │      │ Fetch    │    │Filter by   │
│ Games   │      │Referees  │    │120-min     │
└────┬────┘      └────┬─────┘    │rest period │
     │                │          └────────┬───┘
     │                │                   │
     └────────┬───────┴───────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│ Build AI Prompt                  │
│ (Game details + constraints)     │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Gemini API Call                  │
│ (Intelligent Selection)          │
└────────────┬─────────────────────┘
             │
             ▼ (Returns ref IDs)
┌──────────────────────────────────┐
│ Validate Selections              │
│ (Check availability)             │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Insert into                      │
│ GAME_ALLOCATIONS table           │
│ (game_id, referee_id)            │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ Update Allocations Page          │
│ Show 3 refs per game             │
└──────────────────────────────────┘
```

### Flow 3: Association Enforcement (Touch Rugby)

```
Game: GTA vs City
      │
      ▼
┌─────────────────────────────┐
│ AI Allocation Process       │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Fetch All Available Referees    │
│ - John (GTA association) ✓      │
│ - Lisa (WCTA association) ✓     │
│ - Thabo (KZNT association) ✓    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Check Game Teams for Conflicts  │
│ - Home Team: GTA ← Important!   │
│ - Away Team: City               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Filter Conflicts                │
│ ❌ John (GTA) → Home team is GTA│
│    EXCLUDED!                    │
│ ✓ Lisa (WCTA) → Different       │
│ ✓ Thabo (KZNT) → Different      │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ AI Proposes: Lisa + Thabo + 1   │
│ From remaining available        │
└─────────────────────────────────┘
```

### Flow 4: 120-Minute Rest Enforcement

```
Create Game:
  Time: 14:00
  │
  ▼
┌────────────────────────────────┐
│ Allocate Refs to this Game     │
└────────┬───────────────────────┘
         │
         ▼
For each candidate referee:
         │
         ├─→ Check: Does ref have game 12:00-16:00?
         │          (2 hours before/after)
         │
         │   If YES → ❌ Exclude from allocation
         │   If NO  → ✓ Include in pool
         │
         └─→ Query:
             ┌────────────────────────────────┐
             │ SELECT COUNT(*) FROM           │
             │   game_allocations ga          │
             │   JOIN games g ON ga.game_id   │
             │ WHERE g.game_date = TODAY      │
             │   AND g.time_slot >= 12:00     │
             │   AND g.time_slot <= 16:00     │
             │   AND ga.referee_id = ?        │
             └────────────────────────────────┘
             │
             ▼
         If count > 0: Ref is busy
         If count = 0: Ref is free
```

---

## 🧠 AI Allocation Algorithm (Detailed)

```
INPUT: Game details + All referees + Constraints

┌──────────────────────────────────────────────┐
│ STEP 1: Gather Data                          │
│ - Get game time, teams, sport                │
│ - Get all active referees with ratings       │
│ - Already allocated refs for this game       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ STEP 2: First Filter                         │
│ Remove: Already allocated to this game       │
│ Remaining: ~30-40 refs                       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ STEP 3: Availability Filter                  │
│ Remove: Refs with games ±120 minutes         │
│ Remaining: ~15-20 refs                       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ STEP 4: Association Validation               │
│ (Touch Rugby only)                           │
│ Remove: Refs from conflicting associations   │
│ Remaining: ~10-15 refs                       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ STEP 5: AI Selection                         │
│ Send to Gemini with criteria:                │
│ 1. Highest rating first                      │
│ 2. Elite > Senior > Intermediate > Junior    │
│ 3. Maximize association diversity            │
│ Output: Select top 3 refs                    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ OUTPUT: 3 selected referee IDs               │
│ For insertion into GAME_ALLOCATIONS table    │
└──────────────────────────────────────────────┘
```

---

## 🔐 Constraint Enforcement Layers

```
Application Layer:
    │
    ├─→ Zod schema validation (client-side)
    │
    ├─→ Server-side checks in allocateReferees()
    │   ├─→ Check 120-min rest
    │   ├─→ Check association conflict
    │   └─→ Check already allocated
    │
    └─→ Parameterized SQL (prevent injection)
         │
         ▼
Database Layer:
    │
    ├─→ UNIQUE(game_id, referee_id)
    │   └─→ Prevents duplicate allocations
    │
    ├─→ CHECK(rating BETWEEN 1 AND 5)
    │   └─→ Ensures valid ratings
    │
    ├─→ Foreign keys with CASCADE
    │   └─→ Maintains referential integrity
    │
    └─→ NOT NULL constraints
        └─→ Prevents incomplete records
```

---

## 📡 Integration Points

```
┌────────────┐
│   Next.js  │ ◄─── RSC (React Server Components)
│   Frontend │ ◄─── TypeScript
└────────┬───┘
         │
    ┌────┴─────────┬──────────┬─────────────┐
    │              │          │             │
    ▼              ▼          ▼             ▼
┌────────┐  ┌──────────┐ ┌─────────┐ ┌──────────┐
│  Neon  │  │ Gemini   │ │ Dropbox │ │  Clerk   │
│ Postgres│  │   API    │ │   SDK   │ │ Auth     │
└────────┘  └──────────┘ └─────────┘ └──────────┘

Each integration is:
- Secure (API keys in .env)
- Fault-tolerant (try-catch)
- Type-safe (TypeScript)
```

---

## 🔄 Request/Response Cycle

```
USER ACTION (Button Click)
    │
    ▼
Next.js Page/Component
    │
    ├─→ Client-side validation (if needed)
    │
    ├─→ Call Server Action
    │   (marked with "use server")
    │
    └─→ Server Action
        │
        ├─→ Database query (Neon)
        │   or API call (Gemini/Dropbox)
        │
        ├─→ Error handling
        │   (try-catch)
        │
        └─→ Return result
            │
            ▼
        Component Re-renders
        or Redirect
            │
            ▼
USER SEES UPDATE
```

---

This architecture is:
- ✅ **Scalable** - Neon handles connections
- ✅ **Secure** - All data validated server-side
- ✅ **Maintainable** - Clear separation of concerns
- ✅ **Extensible** - Easy to add new integrations