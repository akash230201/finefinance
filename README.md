# FineFinance

> Modern, intelligent personal finance & budgeting platform.

<p align="center">
  <strong>Next.js 15</strong> • <strong>React 19</strong> • <strong>Prisma</strong> • <strong>PostgreSQL</strong> • <strong>shadcn/ui</strong> • <strong>Clerk</strong> • <strong>Inngest</strong> • <strong>Gemini AI</strong> • <strong>Resend</strong>
</p>

<p align="center">
  <a href="#-key-features">Features</a> ·
  <a href="#-architecture-overview">Architecture</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-currency-conversion-logic">Currency</a> ·
  <a href="#-recurring-transactions-flow">Automations</a> ·
  <a href="#-development-notes">Dev Notes</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>


## ✨ Key Features

### Core Finance

- Accounts (multiple, type: CURRENT / SAVINGS, selectable default)
- Transactions (income & expense) with category, date, recurring flag, status
- Recurring transaction engine (scheduled processing)
- Monthly summaries (income, expenses, net)
- Category pie visualization (Recharts)
- Budget model with automated budget alert checks

### Currency & Internationalization

- Live exchange rates via **exchangerate-api.com** (cached in‑memory 30 min)
- Graceful fallback to static approximate rates if API fails
- 150+ currency metadata entries (code, symbol, name, flag, country)
- User preferred currency (persisted + localStorage safeguard)
- Universal currency utilities: convertFromUSD, convertToUSD, convertBetween, formatAmount
- Searchable combobox currency picker with favorites & live rate badges
- Dedicated Currency Center dashboard: converter, searchable & paginated list

### Automation (Inngest Functions)

| Function                                                   | Schedule       | Purpose                                       |
| ---------------------------------------------------------- | -------------- | --------------------------------------------- |
| generateMonthlyReports                                     | `0 0 1 * *`    | Email monthly financial summary + AI insights |
| checkBudgetAlerts                                          | `0 */6 * * *`  | Monitor budgets & trigger alert logic         |
| processRecurringTransaction / triggerRecurringTransactions | interval logic | Applies due recurring transactions            |

- Batched sending logic & exponential retry strategy

### AI & Communication

- AI financial insight generation (Gemini 2.5 Flash) for monthly reports
- Resend transactional emails with React email template

### UX & UI

- shadcn/ui + Radix primitives (accessible & composable)
- Light / Dark mode with tuned contrast (next-themes)
- Adaptive responsive layout (cards, grids, scrollable sections)
- High–contrast in dark mode, softened surfaces in light mode
- Accessible semantics (roles for lists, focus states, reduced motion friendly)
- Command palette–style currency search (cmdk)
- Animated subtle gradients & hover states without excessive GPU cost

### Performance & Reliability

- Exchange rate caching (30 min TTL) to minimize external calls
- Defensive fallbacks for network failures
- Progressive enhancement: UI still works with partial metadata
- Prisma client generated to `lib/generated/prisma` for faster cold starts

---

## 🧱 Architecture Overview

```
/app                 → Next.js App Router routes & layouts
/components          → UI + feature components (currency, dashboard, forms, etc.)
/components/ui       → shadcn/ui generated primitives
/contexts            → React context providers (currency, floating buttons, etc.)
/lib                 → Utilities (currency, prisma, inngest client & functions, helpers)
/lib/currency.js     → Currency metadata + rate fetch + conversion helpers
/lib/inngest         → Inngest client + background function definitions
/prisma/schema.prisma→ Data models (User, Account, Transaction, Budget)
/public              → Static assets (logos, images)
```

### Data Model (Prisma)

- User: preferredCurrency, relations to accounts, transactions, budget
- Account: balance, type, isDefault
- Transaction: type, amount, category, recurring fields (interval, next date)
- Budget: simple per-user budget + lastAlertSent tracking

### Currency Layer

1. Fetch rates (base USD) → cache
2. Build combined currency metadata map (SUPPORTED_CURRENCIES + API discovered codes)
3. Context provides: currentCurrency, exchangeRates, allAvailableCurrencies, formatting & conversion helpers
4. UI consumers (selectors, dashboard cards, converter) use safe lookup + fallback symbol

---

## ⚙️ Environment Variables

Create a `.env` file (never commit real secrets):

```
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
DIRECT_URL=postgresql://user:pass@host:port/db

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx (if using webhooks)

# Resend (email)
RESEND_API_KEY=re_xxx

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# (Optional) Inngest
INNGEST_EVENT_KEY=optional_if_using_direct_event_api
```

> If you deploy on Vercel, add all variables in the project settings.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# (Optional) Run migrations (if you add migrations logic later)
# npx prisma migrate dev --name init

# Start dev server (Turbopack)
npm run dev
```

Visit: http://localhost:3000

### Initial Database Setup

If you have not created the database schema yet (fresh database), after defining migrations run:

```bash
npx prisma migrate dev --name init
```

Prisma client is auto‑generated on postinstall (`postinstall` script).

---

## 📬 Emails & AI Insights

- Monthly report function composes financial stats + AI generated insights (3 concise suggestions)
- React email template renders the content
- Delivery via Resend API
- Gemini failures fallback to predefined generic suggestions

---

## 🔄 Recurring Transactions Flow

1. User marks a transaction as recurring (interval stored)
2. Inngest scheduled function checks due items (`isTransactionDue`)
3. If due → clone/apply new transaction & compute next date via `calculateNextRecurringDate`
4. Updates `lastProcessed` + `nextRecurringDate`

---

## 💱 Currency Conversion Logic

```text
Input Amount (From) → Divide by fromRate (USD base) → Multiply by toRate → Rounded (2dp)
```

Safeguards: if rates missing → fallback 1 (no crash) / show placeholder.

Caching prevents rate storming; fallback object contains approximations for resilience.

---

## 🧪 Scripts

| Command           | Action                                 |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start Next.js dev with Turbopack       |
| `npm run build`   | Production build                       |
| `npm start`       | Start production server                |
| `npm run lint`    | Lint project                           |
| `prisma generate` | (prebuild/postinstall) Generate client |

---

## 🛡️ Security & Auth

- Clerk handles sessions & user identity
- Currency preference stored both in DB & localStorage (fallback for schema/load issues)
- Safe guards around unsupported currency selection

---

## ♿ Accessibility

- Semantic roles for scrollable lists (`role="list"` / `role="listitem"`)
- Focus styles preserved & enhanced
- Color choices tuned for contrast in both themes
- Truncation with tooltips-ready structure (could extend)

---

## 🎨 Theming

- next-themes toggles dark/light
- Dark mode: layered subtle spectral gradients + higher contrast tokens
- Light mode: softened surfaces (reduced stark contrast after refinement)
- Uses Tailwind v4 (beta) utility tokens & shadcn/ui design primitives

---

## 📊 Visualizations

- Recharts Pie for category spend distribution
- Custom tooltip & legend components
- ResponsiveContainer adapts to parent sizing

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines, coding standards, commit format (Conventional Commits), accessibility checklist, and how to extend currencies, Inngest jobs, or email templates.

---

## 🧭 Roadmap Summary (Short)

- Multi‑budget envelopes & alerts
- Historical FX snapshots & charting
- Data import/export (CSV/OFX)
- Goal tracking & projections
- Notification center (in‑app / push)
- Offline / PWA read‑only mode

---

## 🙏 Support

If this project helps you, consider starring the repo or opening an issue with feedback. Your input shapes the roadmap.

---

## 🛠️ Development Notes

- Keep currency metadata additions in `lib/currency.js` (extend SUPPORTED_CURRENCIES or dynamic enrich)
- If adding new scheduled logic → colocate in `lib/inngest/functions.js`
- When modifying schema run: `npx prisma migrate dev --name <change>`
- Favor context selectors over passing deep props (currency context already optimized)

---

## ❓ Troubleshooting

| Issue                       | Cause                            | Fix                                                   |
| --------------------------- | -------------------------------- | ----------------------------------------------------- |
| Rates show "Loading..."     | API latency or network           | Wait / check console; fallback will appear if failure |
| Currency selection disabled | Unsupported code                 | Ensure code exists in combined metadata               |
| AI insights missing         | Gemini key invalid               | Verify `GEMINI_API_KEY`                               |
| Emails not received         | Resend key / domain not verified | Check Resend dashboard                                |

---

## 📄 License

MIT © 2025 FineFinance Contributors

---

## 🙌 Acknowledgements

- **shadcn/ui** for the component system
- **Clerk** for authentication
- **Inngest** for background orchestration
- **Resend** for email infrastructure
- **Gemini** for AI assistance

---

### Enjoy building & extending FineFinance!

Feel free to open issues or adapt this stack for your own finance tools.
