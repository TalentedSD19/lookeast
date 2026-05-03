# Eastern News Network â€” News Website: Spec Sheet & Implementation Plan

## Context

Build a fully functional regional news website ("Eastern News Network") from a blank directory. The site has two user roles: **Admins** (2â€“3 people) who post and manage articles, and **Viewers** (the public) who browse with no login. UI is inspired by Eastern News Network.in, eastindiastory.com, and indiatoday.in: white background, red accent for breaking news, serif headlines, clean sans-serif body, multi-column article grid, hero section, and a scrolling breaking-news ticker.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR/ISR for news SEO; server components reduce JS bundle |
| Styling | **Tailwind CSS + shadcn/ui** | Rapid UI + accessible components |
| Database | **PostgreSQL via Supabase** | Free tier, includes Storage for images |
| ORM | **Prisma** | Type-safe queries; migration workflow |
| Auth | **NextAuth.js** (CredentialsProvider) | Admin-only login, JWT sessions, no public registration |
| Rich Text | **TipTap** | ProseMirror-based editor with image/link extensions |
| Image Storage | **Supabase Storage** | Co-located with DB; generous free tier |
| Deployment | **Vercel** | Native Next.js ISR support |

---

## Database Schema

### `prisma/schema.prisma`

**Models:**
- `User` â€” id, email (unique), password (bcrypt hash), name, role (ADMIN | SUPER_ADMIN)
- `Category` â€” id, name (unique), slug, description, color (hex), order
- `Article` â€” id, title, slug (unique), excerpt (160-char), body (HTML), coverImage (URL), coverImageAlt, status (DRAFT | PUBLISHED | ARCHIVED), isFeatured (bool), isBreaking (bool), viewCount, publishedAt, authorId â†’ User, categoryId â†’ Category
- `Tag` + `ArticleTag` (junction) â€” many-to-many tags
- `BreakingNews` â€” id, text, url?, active (bool), order, expiresAt?
- `SiteSetting` â€” key/value store for site title, OG image, footer text

**Key indexes:** `[status, publishedAt]`, `[categoryId, status]`, `[slug]`

**Featured article rule:** `isFeatured` is a boolean; enforced via Prisma transaction that sets all others to false before setting one to true.

---

## Environment Variables (`.env.local`)

```
DATABASE_URL=       # Supabase pooling URI (PgBouncer)
DIRECT_URL=         # Supabase direct URI (for migrations)
NEXTAUTH_URL=       # http://localhost:3000
NEXTAUTH_SECRET=    # openssl rand -base64 32
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only, never NEXT_PUBLIC_
```

---

## Project Structure

```
Eastern News Network/
â”œâ”€â”€ prisma/
â”‚   â”œâ”€â”€ schema.prisma
â”‚   â””â”€â”€ seed.ts                   # creates 2-3 admin users + default categories
â”œâ”€â”€ public/
â”‚   â””â”€â”€ og-default.jpg
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ layout.tsx            # root: fonts (Playfair Display + Inter), providers
â”‚   â”‚   â”œâ”€â”€ page.tsx              # homepage (ISR, revalidate: 60s)
â”‚   â”‚   â”œâ”€â”€ not-found.tsx
â”‚   â”‚   â”œâ”€â”€ (public)/
â”‚   â”‚   â”‚   â”œâ”€â”€ article/[slug]/page.tsx    # ISR 300s
â”‚   â”‚   â”‚   â”œâ”€â”€ category/[slug]/page.tsx   # ISR 120s, paginated
â”‚   â”‚   â”‚   â””â”€â”€ search/page.tsx            # dynamic
â”‚   â”‚   â”œâ”€â”€ (admin)/
â”‚   â”‚   â”‚   â”œâ”€â”€ layout.tsx                 # sidebar + topbar shell
â”‚   â”‚   â”‚   â”œâ”€â”€ login/page.tsx
â”‚   â”‚   â”‚   â””â”€â”€ dashboard/
â”‚   â”‚   â”‚       â”œâ”€â”€ page.tsx               # stats overview
â”‚   â”‚   â”‚       â”œâ”€â”€ articles/(list, new, [id]/edit)
â”‚   â”‚   â”‚       â”œâ”€â”€ categories/page.tsx
â”‚   â”‚   â”‚       â”œâ”€â”€ breaking-news/page.tsx
â”‚   â”‚   â”‚       â”œâ”€â”€ media/page.tsx
â”‚   â”‚   â”‚       â””â”€â”€ settings/page.tsx
â”‚   â”‚   â””â”€â”€ api/
â”‚   â”‚       â”œâ”€â”€ auth/[...nextauth]/route.ts
â”‚   â”‚       â”œâ”€â”€ articles/(route.ts + [id]/route.ts)
â”‚   â”‚       â”œâ”€â”€ categories/(route.ts + [id]/route.ts)
â”‚   â”‚       â”œâ”€â”€ breaking-news/(route.ts + [id]/route.ts)
â”‚   â”‚       â”œâ”€â”€ upload/route.ts
â”‚   â”‚       â””â”€â”€ search/route.ts
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â”‚   â”œâ”€â”€ HeroSection.tsx        # featured article, full-width, server rendered
â”‚   â”‚   â”‚   â”œâ”€â”€ NewsTicker.tsx         # CSS marquee, client component
â”‚   â”‚   â”‚   â”œâ”€â”€ CategoryNav.tsx        # horizontal scrollable nav
â”‚   â”‚   â”‚   â”œâ”€â”€ ArticleCard.tsx        # variants: compact | featured | horizontal
â”‚   â”‚   â”‚   â”œâ”€â”€ ArticleGrid.tsx        # responsive CSS grid wrapper
â”‚   â”‚   â”‚   â”œâ”€â”€ CategoryGrid.tsx       # homepage per-category previews
â”‚   â”‚   â”‚   â”œâ”€â”€ ArticleBody.tsx        # prose rendering of TipTap HTML
â”‚   â”‚   â”‚   â”œâ”€â”€ ShareButtons.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ RelatedArticles.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ SearchBar.tsx          # debounced, navigates to /search?q=
â”‚   â”‚   â”‚   â””â”€â”€ Footer.tsx
â”‚   â”‚   â””â”€â”€ admin/
â”‚   â”‚       â”œâ”€â”€ AdminSidebar.tsx
â”‚   â”‚       â”œâ”€â”€ AdminTopBar.tsx
â”‚   â”‚       â”œâ”€â”€ ArticleForm.tsx        # create + edit (shared), most complex component
â”‚   â”‚       â”œâ”€â”€ RichTextEditor.tsx     # TipTap (dynamic import, ssr:false)
â”‚   â”‚       â”œâ”€â”€ ImageUploader.tsx      # drag-drop â†’ /api/upload â†’ Supabase Storage
â”‚   â”‚       â”œâ”€â”€ ArticleTable.tsx       # sortable list with inline actions
â”‚   â”‚       â”œâ”€â”€ CategoryManager.tsx
â”‚   â”‚       â”œâ”€â”€ BreakingNewsManager.tsx
â”‚   â”‚       â”œâ”€â”€ PublishToggle.tsx
â”‚   â”‚       â””â”€â”€ DashboardStats.tsx
â”‚   â”œâ”€â”€ lib/
â”‚   â”‚   â”œâ”€â”€ prisma.ts              # PrismaClient singleton
â”‚   â”‚   â”œâ”€â”€ supabase.ts            # anon client + service-role client
â”‚   â”‚   â”œâ”€â”€ auth.ts                # NextAuth authOptions (shared with middleware)
â”‚   â”‚   â””â”€â”€ utils.ts               # cn(), slugify, formatDate, truncate
â”‚   â”œâ”€â”€ types/index.ts             # ArticleWithRelations, CategoryWithCount, etc.
â”‚   â”œâ”€â”€ types/next-auth.d.ts       # augment Session with id + role
â”‚   â””â”€â”€ middleware.ts              # protects /dashboard/* via withAuth
```

---

## All Routes

### Public
| Route | Rendering | Purpose |
|---|---|---|
| `/` | ISR 60s | Homepage: hero, ticker, category grid, latest |
| `/article/[slug]` | ISR 300s | Full article with related articles |
| `/category/[slug]` | ISR 120s | Paginated article list per category |
| `/search?q=` | Dynamic | Search results |

### Admin (all behind `/dashboard`, protected by middleware)
| Route | Purpose |
|---|---|
| `/login` | Credentials sign-in form |
| `/dashboard` | Stats: totals, recent activity |
| `/dashboard/articles` | Article table with filters |
| `/dashboard/articles/new` | Create article |
| `/dashboard/articles/[id]/edit` | Edit article |
| `/dashboard/categories` | Category CRUD |
| `/dashboard/breaking-news` | Ticker management |
| `/dashboard/media` | Image library |
| `/dashboard/settings` | Site-wide settings |

---

## API Endpoints

| Method | Route | Auth | Action |
|---|---|---|---|
| GET | `/api/articles` | Public | List with filters (status, category, search, pagination) |
| POST | `/api/articles` | Admin | Create; if isFeatured, use transaction to unset others |
| GET | `/api/articles/[id]` | Admin | Full article for edit form |
| PATCH | `/api/articles/[id]` | Admin | Update; revalidatePath after |
| DELETE | `/api/articles/[id]` | Admin | Soft-delete (ARCHIVED) or hard-delete (?permanent=true) |
| GET/POST/PATCH/DELETE | `/api/categories/[id]?` | Mixed | Category CRUD |
| GET/POST/PATCH/DELETE | `/api/breaking-news/[id]?` | Mixed | Ticker CRUD |
| POST | `/api/upload` | Admin | Upload image to Supabase Storage, return public URL |
| GET | `/api/search?q=` | Public | Full-text search across title + excerpt |

---

## Styling System

**Fonts:** `Playfair Display` (serif, headlines) + `Inter` (sans-serif, body/UI) â€” loaded via `next/font/google`.

**Brand colors:**
- `brand-red: #C8102E` â€” breaking news badge, CTAs, active nav
- `brand-dark: #1A1A2E` â€” header/footer background
- `brand-muted: #6B7280` â€” secondary text, metadata

**Breaking news ticker:** Custom Tailwind keyframe `marquee` animating `translateX(0% â†’ -50%)` at 30s linear infinite.

**Article body:** `@tailwindcss/typography` `prose prose-lg` class with serif heading overrides.

---

## Key Implementation Details

- **TipTap SSR:** Dynamic import with `ssr: false` in `ArticleForm` â€” TipTap uses browser APIs.
- **HTML sanitization:** Run TipTap output through `sanitize-html` **server-side before DB write**, not client-side. Prevents XSS at rest.
- **Slug collision:** If slug exists, append first 6 chars of a `cuid()`. Handled in POST/PATCH API routes.
- **View count:** Incremented client-side via fire-and-forget fetch after mount â€” avoids counting bot/ISR requests.
- **Supabase uploads:** Use `SUPABASE_SERVICE_ROLE_KEY` in `/api/upload` to bypass RLS. Max 5MB, JPEG/PNG/WebP/GIF only.
- **Cache invalidation:** Every mutating API route calls `revalidatePath` on affected pages (homepage, category page, article slug).
- **Breaking news expiry:** Filter in GET: `active = true AND (expiresAt IS NULL OR expiresAt > NOW())`.
- **Admin seeding:** `prisma/seed.ts` creates admin users with bcrypt-hashed passwords. No registration UI exists.

---

## Build Sequence (Ordered Sprints)

### Sprint 1 â€” Foundation (Days 1â€“3)
- `create-next-app@14`, install all deps, `shadcn init`
- Supabase: project, bucket `article-images` (public), connection strings
- `prisma/schema.prisma` â†’ `prisma migrate dev` â†’ `prisma db seed`
- `next.config.js`, `tailwind.config.ts`, `src/lib/prisma.ts`, `src/lib/supabase.ts`

### Sprint 2 â€” Auth (Day 4)
- `src/lib/auth.ts` (CredentialsProvider + bcrypt)
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/middleware.ts` (`withAuth`, matcher: `/dashboard/:path*`)
- `/login` page with sign-in form; test redirect flow

### Sprint 3 â€” Admin CRUD (Days 5â€“7)
- `POST /api/upload`, all article/category/breaking-news API routes
- Admin layout (sidebar + topbar)
- `RichTextEditor.tsx` (TipTap), `ImageUploader.tsx`
- `ArticleForm.tsx` (create + edit), article create/edit pages
- `ArticleTable.tsx`, `CategoryManager.tsx`, `BreakingNewsManager.tsx`
- Dashboard stats overview

### Sprint 4 â€” Public Pages (Days 8â€“11)
- `HeroSection`, `NewsTicker`, `ArticleCard` (3 variants), `ArticleGrid`, `CategoryGrid`, `CategoryNav`, `SearchBar`, `Footer`
- Homepage (`/`), article detail, category page, search page
- Global font wiring in `layout.tsx`

### Sprint 5 â€” SEO & Performance (Day 12)
- `generateMetadata` on all public pages (title, description, OG, canonical)
- `generateStaticParams` on article + category pages
- JSON-LD `Article` schema on article detail
- `next/image` with correct `sizes` + `priority` on hero

### Sprint 6 â€” Polish & Deploy (Days 13â€“14)
- `not-found.tsx`, `loading.tsx` skeletons, `error.tsx` boundaries
- Vercel: add all env vars, set `NEXTAUTH_URL` to prod domain
- Deploy, verify ISR revalidation and Supabase Storage in production

---

## Verification Checklist

- [ ] Admin can log in, is redirected to `/dashboard`; unauthenticated access to `/dashboard/*` redirects to `/login`
- [ ] Admin can create, edit, publish, and delete articles
- [ ] Article with `isFeatured: true` appears in hero; only one article is featured at a time
- [ ] Breaking news items appear in ticker on homepage; expired items do not show
- [ ] Public homepage shows hero, ticker, category grid, latest articles
- [ ] Article detail renders full body with proper typography
- [ ] Category pages paginate correctly; URL query param changes page
- [ ] Search returns relevant results for a test query
- [ ] Images uploaded via admin form appear in articles on public site
- [ ] ISR: publishing an article appears on homepage within 60s without redeployment
- [ ] `generateMetadata` populates `<title>` and OG tags for article pages
- [ ] `next/image` serves images in WebP/AVIF from Supabase Storage

---

## Critical Files

1. `prisma/schema.prisma` â€” entire data model; migrate this first
2. `src/lib/auth.ts` â€” authentication config, session shape, role propagation
3. `src/middleware.ts` â€” admin route protection
4. `src/app/api/articles/route.ts` â€” featured-article transaction, slug collision, cache revalidation
5. `src/components/admin/ArticleForm.tsx` â€” most complex component; integrates TipTap, ImageUploader, all metadata
6. `src/app/page.tsx` â€” homepage; assembles all public components and drives first impression

