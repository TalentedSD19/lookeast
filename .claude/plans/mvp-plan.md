# Eastern News Network â€” MVP: Initial Deployable Version

## Goal

Ship a working, publicly accessible news website as fast as possible. Admins can log in and post articles. Viewers can read them. Nothing more. All features from the full plan that are not strictly necessary for this are deferred.

---

## What's IN the MVP

| Feature | Notes |
|---|---|
| Public homepage | Latest articles in a simple grid, no hero/ticker yet |
| Article detail page | Full article content, author, date, category label |
| Category filter pages | `/category/[slug]` lists articles for that category |
| Admin login | Email + password, redirect to dashboard |
| Admin: create article | Title, body (rich text), cover image, category, publish/draft toggle |
| Admin: edit article | Same form pre-filled |
| Admin: article list | Simple table â€” title, status, date, edit/delete actions |
| Admin: manage categories | Add/rename/delete categories |
| Image upload | Upload cover image, stored in Supabase Storage |
| Responsive layout | Mobile-readable on phones |
| Deployment | Live on Vercel with Supabase backend |

## What's DEFERRED (full plan features)

- Breaking news ticker
- Featured/hero article selection
- Search
- Tags
- Related articles
- Share buttons
- Dashboard stats/analytics
- Media library page
- Site settings page
- View count tracking
- JSON-LD schema markup
- ISR/on-demand revalidation (use dynamic rendering initially)
- `loading.tsx` skeletons and `error.tsx` boundaries

---

## Tech Stack (same as full plan, no change)

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS + shadcn/ui**
- **PostgreSQL via Supabase**
- **Prisma ORM**
- **NextAuth.js** (CredentialsProvider)
- **TipTap** (rich text editor)
- **Supabase Storage** (images)
- **Vercel** (deployment)

---

## MVP Database Schema

Simpler than the full schema â€” no Tags, no BreakingNews, no SiteSetting.

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String
  createdAt DateTime  @default(now())
  articles  Article[]
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  articles Article[]
}

model Article {
  id          String        @id @default(cuid())
  title       String
  slug        String        @unique
  excerpt     String
  body        String
  coverImage  String?
  status      ArticleStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  authorId    String
  author      User          @relation(fields: [authorId], references: [id])
  categoryId  String
  category    Category      @relation(fields: [categoryId], references: [id])

  @@index([status, publishedAt])
  @@index([categoryId])
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
}
```

---

## MVP Project Structure

Only files that need to exist for the MVP. No stubs, no empty placeholders.

```
Eastern News Network/
â”œâ”€â”€ prisma/
â”‚   â”œâ”€â”€ schema.prisma
â”‚   â””â”€â”€ seed.ts               # 2 admin users + 5 default categories
â”œâ”€â”€ public/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ layout.tsx        # fonts, global nav, footer
â”‚   â”‚   â”œâ”€â”€ page.tsx          # homepage: article grid
â”‚   â”‚   â”œâ”€â”€ not-found.tsx
â”‚   â”‚   â”œâ”€â”€ (public)/
â”‚   â”‚   â”‚   â”œâ”€â”€ article/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [slug]/page.tsx
â”‚   â”‚   â”‚   â””â”€â”€ category/
â”‚   â”‚   â”‚       â””â”€â”€ [slug]/page.tsx
â”‚   â”‚   â”œâ”€â”€ (admin)/
â”‚   â”‚   â”‚   â”œâ”€â”€ layout.tsx         # admin shell (sidebar)
â”‚   â”‚   â”‚   â”œâ”€â”€ login/page.tsx
â”‚   â”‚   â”‚   â””â”€â”€ dashboard/
â”‚   â”‚   â”‚       â”œâ”€â”€ page.tsx                    # redirect to /dashboard/articles
â”‚   â”‚   â”‚       â”œâ”€â”€ articles/
â”‚   â”‚   â”‚       â”‚   â”œâ”€â”€ page.tsx                # article list table
â”‚   â”‚   â”‚       â”‚   â”œâ”€â”€ new/page.tsx            # create form
â”‚   â”‚   â”‚       â”‚   â””â”€â”€ [id]/edit/page.tsx      # edit form
â”‚   â”‚   â”‚       â””â”€â”€ categories/
â”‚   â”‚   â”‚           â””â”€â”€ page.tsx                # add/delete categories
â”‚   â”‚   â””â”€â”€ api/
â”‚   â”‚       â”œâ”€â”€ auth/[...nextauth]/route.ts
â”‚   â”‚       â”œâ”€â”€ articles/
â”‚   â”‚       â”‚   â”œâ”€â”€ route.ts          # GET list, POST create
â”‚   â”‚       â”‚   â””â”€â”€ [id]/route.ts     # PATCH, DELETE
â”‚   â”‚       â”œâ”€â”€ categories/
â”‚   â”‚       â”‚   â”œâ”€â”€ route.ts          # GET list, POST create
â”‚   â”‚       â”‚   â””â”€â”€ [id]/route.ts     # DELETE
â”‚   â”‚       â””â”€â”€ upload/route.ts       # image upload to Supabase Storage
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â”‚   â”œâ”€â”€ ArticleCard.tsx       # image, title, excerpt, category, date
â”‚   â”‚   â”‚   â”œâ”€â”€ ArticleGrid.tsx       # responsive 3-column grid
â”‚   â”‚   â”‚   â”œâ”€â”€ CategoryNav.tsx       # horizontal links to category pages
â”‚   â”‚   â”‚   â”œâ”€â”€ ArticleBody.tsx       # renders TipTap HTML with prose styles
â”‚   â”‚   â”‚   â”œâ”€â”€ SiteHeader.tsx        # logo + category nav + site name
â”‚   â”‚   â”‚   â””â”€â”€ SiteFooter.tsx
â”‚   â”‚   â””â”€â”€ admin/
â”‚   â”‚       â”œâ”€â”€ AdminSidebar.tsx      # nav links: Articles, Categories, logout
â”‚   â”‚       â”œâ”€â”€ ArticleForm.tsx       # create + edit (shared)
â”‚   â”‚       â”œâ”€â”€ RichTextEditor.tsx    # TipTap (dynamically imported, ssr:false)
â”‚   â”‚       â””â”€â”€ ImageUploader.tsx     # file input â†’ /api/upload â†’ URL
â”‚   â”œâ”€â”€ lib/
â”‚   â”‚   â”œâ”€â”€ prisma.ts           # PrismaClient singleton
â”‚   â”‚   â”œâ”€â”€ supabase.ts         # service-role client for upload API
â”‚   â”‚   â”œâ”€â”€ auth.ts             # NextAuth authOptions
â”‚   â”‚   â””â”€â”€ utils.ts            # cn(), slugify, formatDate
â”‚   â”œâ”€â”€ types/
â”‚   â”‚   â”œâ”€â”€ index.ts            # ArticleWithRelations, etc.
â”‚   â”‚   â””â”€â”€ next-auth.d.ts
â”‚   â””â”€â”€ middleware.ts           # protect /dashboard/*
```

**Total files to write:** ~28 (vs ~50+ in full plan). Every file earns its place.

---

## MVP Routes

### Public
| Route | What it shows |
|---|---|
| `/` | Grid of latest 12 published articles |
| `/article/[slug]` | Full article: cover image, body, author, date, category |
| `/category/[slug]` | Grid of published articles in that category |

### Admin
| Route | What it does |
|---|---|
| `/login` | Sign-in form |
| `/dashboard/articles` | Table: title, category, status, date, Edit / Delete |
| `/dashboard/articles/new` | Article create form |
| `/dashboard/articles/[id]/edit` | Article edit form (pre-filled) |
| `/dashboard/categories` | List + add + delete categories |

---

## API Endpoints (MVP only)

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/articles` | Admin | Article list for admin table |
| POST | `/api/articles` | Admin | Create article |
| PATCH | `/api/articles/[id]` | Admin | Update article (including status toggle) |
| DELETE | `/api/articles/[id]` | Admin | Hard delete |
| GET | `/api/categories` | Public | All categories (used in nav + forms) |
| POST | `/api/categories` | Admin | Create category |
| DELETE | `/api/categories/[id]` | Admin | Delete category |
| POST | `/api/upload` | Admin | Upload image, return Supabase public URL |

---

## Styling (MVP-level)

**Fonts:** `Playfair Display` (headlines) + `Inter` (body/UI) via `next/font/google`.

**Colors:**
```
brand-red:  #C8102E   (category badges, active nav, primary buttons)
brand-dark: #1A1A2E   (header background, footer)
gray-100:   #F3F4F6   (page background)
```

**Layout:** White article cards on a light gray background. Dark header with site name on the left, category links on the right. Clean footer with copyright.

**Article card:** Cover image (16:9, object-cover), category badge (red pill), title (Playfair Display, bold), excerpt (2-line clamp), author + date in gray.

---

## Build Sequence

### Step 1 â€” Setup (do once, ~1 hour)
1. `npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git`
2. Install deps:
   ```
   npm install next@14 react@18 react-dom@18
   npm install @prisma/client next-auth @supabase/supabase-js
   npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
   npm install bcryptjs date-fns slugify sanitize-html
   npm install -D prisma @types/bcryptjs @types/sanitize-html
   npx shadcn@latest init
   npx shadcn@latest add button card badge input label textarea select dialog table separator toast
   ```
3. Create Supabase project â†’ copy connection strings â†’ create `article-images` bucket (public)
4. Fill in `.env.local`
5. Write `prisma/schema.prisma` (MVP schema above)
6. `npx prisma migrate dev --name init`
7. Write and run `prisma/seed.ts`
8. Configure `next.config.js` (Supabase image domain)
9. Configure `tailwind.config.ts` (brand colors, fonts)
10. Write `src/lib/prisma.ts`, `src/lib/supabase.ts`, `src/lib/utils.ts`, `src/types/`

### Step 2 â€” Auth (~1 hour)
11. Write `src/lib/auth.ts` (CredentialsProvider + bcrypt.compare)
12. Write `src/app/api/auth/[...nextauth]/route.ts`
13. Write `src/middleware.ts` (withAuth, matcher: `/dashboard/:path*`)
14. Write `/login` page â€” form calls `signIn("credentials", ...)`, shows error on failure
15. Test: login redirects to `/dashboard`, direct `/dashboard` visit redirects to `/login`

### Step 3 â€” Upload API (~30 min)
16. Write `src/lib/supabase.ts` (service-role client)
17. Write `POST /api/upload` â€” validate file type/size, upload to Supabase, return URL

### Step 4 â€” Article API (~1 hour)
18. Write `GET|POST /api/articles/route.ts`
19. Write `PATCH|DELETE /api/articles/[id]/route.ts`
20. Write `GET|POST /api/categories/route.ts`
21. Write `DELETE /api/categories/[id]/route.ts`

### Step 5 â€” Admin UI (~3 hours)
22. Write `AdminSidebar.tsx`
23. Write `(admin)/layout.tsx` (wraps content in sidebar shell)
24. Write `RichTextEditor.tsx` (TipTap, dynamically imported)
25. Write `ImageUploader.tsx` (file input â†’ fetch upload API â†’ set URL in form)
26. Write `ArticleForm.tsx` (title, slug auto-gen, excerpt, category select, image, body, status)
27. Wire up `/dashboard/articles/new` and `/dashboard/articles/[id]/edit`
28. Write article list table at `/dashboard/articles` (fetch from `/api/articles`, Edit/Delete actions)
29. Write category manager at `/dashboard/categories`

### Step 6 â€” Public UI (~2 hours)
30. Write `SiteHeader.tsx` and `SiteFooter.tsx`
31. Write `ArticleCard.tsx` and `ArticleGrid.tsx`
32. Write `CategoryNav.tsx`
33. Write `ArticleBody.tsx` (prose wrapper for TipTap HTML)
34. Write homepage `src/app/page.tsx` â€” fetch latest 12 published articles, render grid
35. Write `src/app/(public)/article/[slug]/page.tsx` â€” full article view
36. Write `src/app/(public)/category/[slug]/page.tsx` â€” filtered grid
37. Write `not-found.tsx`

### Step 7 â€” Deploy (~30 min)
38. `git init && git add . && git commit -m "initial MVP"`
39. Push to GitHub, connect to Vercel
40. Add all `.env.local` vars to Vercel environment settings
41. Set `NEXTAUTH_URL` to production URL
42. Deploy â€” verify login, article creation, public article view

---

## Seed Data (`prisma/seed.ts`)

Creates on first run:
- **2 admin users** with bcrypt-hashed passwords (printed to console after seed)
- **5 default categories:** Politics, Economy, Society, Culture, Environment

---

## Verification (before calling it done)

- [ ] `/login` works; wrong password shows error; correct credentials go to `/dashboard`
- [ ] Visiting `/dashboard` without login redirects to `/login`
- [ ] Admin can create a DRAFT article with a cover image and rich text body
- [ ] Admin can publish the draft (status â†’ PUBLISHED)
- [ ] Published article appears on homepage at `/`
- [ ] Article detail page renders body text with proper formatting
- [ ] Category page shows only articles from that category
- [ ] Admin can edit the article and changes appear on the public page
- [ ] Admin can delete the article; it disappears from homepage
- [ ] Admin can add and delete categories
- [ ] Site is accessible on the Vercel production URL
- [ ] Images load on production (Supabase Storage URL configured in next.config.js)
- [ ] Mobile layout is readable on a phone screen

---

## What gets added AFTER MVP (Phase 2)

Once the MVP is live and being used:

1. **Breaking news ticker** â€” `BreakingNews` model + admin management + homepage ticker
2. **Featured/hero article** â€” single featured flag, large hero block on homepage
3. **Search** â€” full-text search across title + excerpt
4. **Tags** â€” tag model, tag pages, article tagging UI
5. **ISR + cache revalidation** â€” `revalidatePath` calls, ISR intervals on public pages
6. **Dashboard stats** â€” article counts, recent activity
7. **Share buttons** â€” social share on article pages
8. **SEO polish** â€” `generateMetadata`, JSON-LD, Open Graph images
9. **Related articles** â€” same-category articles at bottom of article page
10. **View count** â€” client-side increment after mount

