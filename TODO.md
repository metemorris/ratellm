# TODO

## 1. Human validation for reviews (keep anonymous submission)

Add a way to confirm a reviewer is human, while still allowing anonymous reviews.

- Anonymous submissions should pass some human check (e.g. Turnstile / hCaptcha,
  proof-of-work, or a lightweight heuristic) before they're accepted.
- Optional account flow: users can log in and verify their email.
  - Verified users face less scrutiny (skip or soften the human check).
  - They keep a persistent identity and don't have to re-verify each review.
- Consider:
  - Rate limiting / throttling per session or IP.
  - Review flagging and moderation for anonymous content.
  - A "verified reviewer" trust signal shown next to reviews from logged-in users.
  - Spam detection on the review body.

## 2. (to be added)

<!-- The original note for this item was cut off — fill in here. -->

## Productionize & publish

- [ ] **Database** — move from SQLite to Postgres (Neon / Turso / Supabase / RDS)
      and set `DATABASE_URL`.
- [ ] **Deploy** — Vercel (or Fly/Railway), connect the repo, configure env vars,
      add a custom domain.
- [ ] **HF API token** — add `HF_TOKEN` to avoid anonymous rate limits on
      search/detail calls.
- [ ] **Auth** — implement the email login + verification from #1 (Auth.js / Clerk).
- [ ] **Anti-abuse** — rate limiting, spam/flagging, a moderation queue.
- [ ] **Caching** — revisit HF data caching strategy (currently basic revalidate).
- [ ] **SEO** — per-model metadata, `sitemap.xml`, `robots.txt`, Open Graph images.
- [ ] **Analytics** — lightweight pageview/event tracking (Plausible / Vercel Analytics).
- [ ] **Error monitoring** — Sentry or similar.
- [ ] **Tests** — unit tests (survey/format/reviews libs), component tests, E2E for
      the review flow.
- [x] **CI/CD** — lint + typecheck + build on every PR (`.github/workflows/ci.yml`).
- [ ] **Content/legal** — terms of service, privacy policy, moderation guidelines.
- [ ] **Performance** — font/image optimization, bundle review, Lighthouse pass.
- [ ] **Accessibility** — keyboard navigation, focus states, contrast in both themes.
