# Contributing to FineFinance

Thank you for taking the time to contribute! This document explains how to set up the project, coding standards, workflows, and best practices.

---

## 📦 Tech Stack Overview

- Next.js 15 (App Router) / React 19
- Tailwind + shadcn/ui (design system)
- Prisma + PostgreSQL
- Clerk (auth)
- Inngest (background jobs)
- Resend (emails)
- Gemini AI (insights)

---

## 🔧 Local Setup

```bash
git clone <repo-url>
cd finefinance
npm install
cp .env.example .env  # create and fill secrets
npx prisma generate
npm run dev
```

If you alter the schema:

```bash
npx prisma migrate dev --name <change>
```

---

## 🚥 Branching & Workflow

| Step | Action                                            |
| ---- | ------------------------------------------------- |
| 1    | Create issue or reference existing one            |
| 2    | Branch: `feat/<slug>` `fix/<slug>` `chore/<slug>` |
| 3    | Commit frequently (see format)                    |
| 4    | Open PR to `main` (or `develop` if introduced)    |
| 5    | Request review / address comments                 |
| 6    | Squash merge (keeping conventional title)         |

### Conventional Commit Format

```
<type>(optional-scope): short imperative summary

body (optional)

BREAKING CHANGE: (optional)
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`, `perf`, `ci`.

Examples:

```
feat(currency): add searchable combobox selector
fix(recurring): prevent duplicate processing on race condition
```

---

## 🧪 Testing / Quality

Currently minimal formal tests. When adding logic-heavy utilities (currency conversion, schedule calculations), add unit tests (Jest/Vitest if introduced). Keep pure functions in `lib/`.

Run lint:

```bash
npm run lint
```

---

## 🎨 UI / Accessibility Guidelines

- Use existing shadcn/ui primitives; extend in `components/ui`.
- Maintain dark/light contrast. Test WCAG AA for body text.
- Use semantic roles for custom scroll areas (`role="list"` / `role="listitem"`).
- Preserve keyboard focus (no `outline: none` without replacement).
- Favor `flex` + `gap` over nested margins.

---

## 💱 Currency Layer Extensions

To add or override metadata:

1. Open `lib/currency.js`.
2. Extend `SUPPORTED_CURRENCIES` or metadata maps.
3. Avoid hardcoding rates—rates are fetched via API & cached.
4. If adding a code not in API response, ensure fallback symbol.

---

## 🔄 Background Jobs (Inngest)

Add new jobs under `lib/inngest/`:

- Keep idempotent (check existing state before mutating).
- Wrap external calls with try/catch & log context.
- Use descriptive event / function names.

---

## ✉️ Emails

Emails are sent via Resend using React templates. Keep templates small & inline styles minimal. Test dark mode rendering (some clients invert colors).

---

## 🤖 AI Integration

AI (Gemini) used for monthly insights. If extending:

- Keep prompt concise & deterministic.
- Always implement error fallback (static suggestions).
- Never leak secrets in prompts.

---

## 🔐 Security

- Never commit real secrets or production URLs in test fixtures.
- Validate user ownership before mutating accounts/transactions.
- Sanitize user-facing strings (React auto-escapes; avoid `dangerouslySetInnerHTML`).

---

## 📁 Project Structure Conventions

- `app/` → routes + layout-level composition.
- `components/` → reusable feature components.
- `contexts/` → React context providers only.
- `lib/` → pure utilities, integrations, prisma, background jobs.
- `prisma/` → schema & seeds.

---

## 🗂️ Import Order (Recommended)

1. React / Next / external libs
2. Internal libs (`@/lib/...`)
3. Components
4. Styles

---

## 📝 Pull Request Checklist

- [ ] Linked issue (or explain rationale)
- [ ] Descriptive title using conventional format
- [ ] Added / updated documentation or comments
- [ ] No console errors in dev
- [ ] Lint passes
- [ ] UI tested in light & dark modes + mobile viewport
- [ ] Fallbacks for network / API failure paths

---

## 🚀 Deployment Notes

- Ensure DATABASE_URL set in hosting provider.
- Add all required env vars (Clerk, Resend, Gemini, Inngest) before enabling background tasks.
- Run migrations before first prod deploy.

---

## 🙌 Code of Conduct

Be respectful. Assume good intent. Provide actionable reviews. Avoid unconstructive negativity.

---

## 💡 Suggestions

Open an issue tagged `enhancement` describing the problem before large feature PRs—saves review cycles.

---

Happy hacking! 🎉
