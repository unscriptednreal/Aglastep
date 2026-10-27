# AglaStep quality and release readiness

This repository is the source of truth for https://aglastep.in/.

## Automated checks
Run locally:
```sh
node scripts/smoke-check.mjs
node scripts/quality-check.mjs
```
The pull-request workflow runs both checks. They validate navigation, script syntax, assessment data, basic HTML semantics, local asset references, external link protections, dashboard tab targets, and the presence of mock-call code.

## Production readiness is not the same as passing static tests
Do **not** claim a 90% readiness score until browser-level checks are documented. Complete and record:
- Mobile and desktop browser journeys for each dashboard area
- Keyboard-only navigation, focus visibility, screen-reader labels and contrast checks
- Supabase login, logout, consent, cloud sync, and RLS with two distinct test accounts
- No leaked credentials, sensitive data, or unexpected console/network errors
- Lighthouse performance, accessibility, best practices and SEO on deployed site
- Real-world assessment and mock-call completion and progress persistence
- GitHub Pages deploy, custom domain and HTTPS checks

Track each test as pass/fail/not-tested with evidence. A numerical score requires a published weighting and verified outcomes; static checks alone do not justify 90%.

## Deployment
The static GitHub Pages workflow is the intended deployment route. Avoid enabling a competing Jekyll deployment workflow.
