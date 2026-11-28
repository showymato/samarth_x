# CHANGES: portfolio → SamarthX ed-tech landing page

The UI is unchanged: same layout, CSS, tokens, fonts, GSAP/Lenis motion and interactive mechanics.
Content, images, links, meta and terminal/notification copy changed. Pricing and FAQ were added by
composing existing classes only (`bench__card`, `rc__n`, `skills`/`sk`, `chip`, `pc__link`). No new CSS.

## Section map

| Existing section | File(s) | Content source | New purpose |
| --- | --- | --- | --- |
| Halftone loader | `components/Loader.tsx`, `lib/behaviors/loader.ts` | `loader` | "low-res aspirant. loading discipline." |
| Top bar (file / status / clock) | `components/Hero.tsx` | `hero.file`, `hero.status` | `{{BRAND_NAME}} /` · admissions open · JEE 2028 · NEET 2028 · Olympiad · `{{CITY}}, IN` |
| Hero h1, photo, bubble, CTAs, lede, quip, cursors, x-ray | `components/Hero.tsx`, `lib/behaviors/hero.ts` | `hero`, `brand` | brand wordmark · illustrated aspirant · "start for ₹3,999/mo" → `#pricing` · free diagnostic · call line · parent/mentor cursor chat |
| "been around" flip-board | `components/Hero.tsx` | `flipboard` | **built for**: JEE Main/Adv, BITSAT, NEET-UG, IOQM/INMO, NSEP/INPhO, NSEC/INChO, NSEB/INBO, NSEJS, boards (text only, no logos) |
| The short version | `components/Short.tsx` | `shortVersion` | coaching or self-study · `+mentor −confusion` · "our results do." |
| Receipts | `components/Short.tsx` | `receipts` | **Launch mode** (1:1 · 52+ · 20 yrs · 12 · ₹133). Results mode is commented out in `content.ts` |
| Selected work (3 stacked cards + live mocks) | `components/Work.tsx`, `components/Mocks.tsx`, `lib/behaviors/mocks.ts` | `work.stack` | **What's inside the app**: mentor chat · mock result 214/300 · parent dashboard (sample data) |
| The bench (3 cards) | same | `work.bench` | **Pick your battlefield**: JEE · NEET · Olympiad |
| Also built (list) | `components/Work.tsx` | `work.more` | **Add-ons**: 8 rows with prices |
| *(new)* Pricing `#pricing` | `components/Pricing.tsx` | `plans`, `P` | three billing cards, everything included, trust chips |
| Some play (gallery + marquee) | `components/PlayJourney.tsx` | `play` | **The wall**: 12 typographic posters (same sizes) |
| The arcade | `components/Arcade.tsx`, `lib/behaviors/arcade.ts` | `play`, inline | whack-a-distraction · lab-kit memory · integer-type guess · focus lane |
| Journey (git graph) + `~/hiring` | `components/PlayJourney.tsx`, `lib/behaviors/journey.ts` | `journey` | **release notes for your rank** (v0.1 → v4.0) · `npm install rank@latest` |
| Off the record (desk, terminal, phone, notes) | `components/About.tsx`, `lib/behaviors/desk.ts`, `lib/behaviors/terminal.ts` | `about` | study mode 6 a.m. / revision mode 11 p.m. · terminal commands · app notifications |
| The stack | `components/About.tsx` | `about.stack` | **the stack (that gets you selected)**: 5 categories (analytics merged into tests so it fits the 5-column grid) |
| *(new)* FAQ `#faq` | `components/Pricing.tsx` | `faq` | 10 questions + FAQPage JSON-LD |
| Footer + dock + bug game + duck | `components/Footer.tsx`, `lib/behaviors/footer.ts` | `footer` | "let's make it work on every answer sheet." · students/parents/follow/paperwork · distractions game · study-advice duck |

Terminal commands: `help plans jee neet olympiad addons parent discipline quote diagnostic faq contact socials`,
plus `enroll --plan monthly|quarterly|annual`, `sudo crack jee`, `npm install rank@latest`, `git status`, `reels` and a few more.

## Files

- **Changed:** `lib/content.ts` (rewritten), `app/layout.tsx`, `app/page.tsx`, all of `components/*`,
  `lib/behaviors/{hero,mocks,desk,terminal,footer,arcade,journey,cursor,loader}.ts` (copy and selectors only),
  `app/original.css` + `app/additions.css` (class **renames only**, below), `package.json`, `package-lock.json` (name), `README.md`, `.gitignore`.
- **Added:** `components/Pricing.tsx`, `lib/seo.ts`, `scripts/gen-assets.mjs`, `public/img/hero-aspirant.png`,
  `public/img/avatar.jpg`, `public/og.png`, `public/img/icons/{mentor,parent}.svg`, `public/img/wall/*`.
- **Rewritten:** `scripts/gen-posters.mjs`, `public/icon.svg`.
- **Deleted (previous owner):** `public/img/me.jpg`, `me-cutout.png`, `me-mask.svg`, `public/img/play/*`,
  `public/img/icons/{car,plane}.svg`, the résumé PDF, `source-photos/`, `.vercel/` (it linked to the old
  owner's `rishika-portfolio` Vercel project, so a deploy would have overwritten their site), `scripts/theme-girly.mjs`, build caches.
- **Class renames** (identical rules, names only, to clear the identity grep): `mp--yash→mp--mentor`,
  `stk--saral/browzie→stk--a/b`, `mock--browzie/refund/crowd→mock--web/score/map`, `mock--saral→mock--mentor`,
  `ph__ic--coc/bgmi/cr→ph__ic--mentor/streak/check`, `dock__resume→dock__cta`.

## Placeholders to fill (all in `lib/content.ts` unless noted)

| Placeholder | Where it shows |
| --- | --- |
| ~~`{{BRAND_NAME}}`~~ | **done: SamarthX** (`brand.name`), hero wordmark `['samarth', 'x']`. OG image regenerated. |
| `{{TAGLINE}}` | `brand.tagline` (not shown yet) |
| `{{DOMAIN}}` | canonical, OG url, JSON-LD (`metadataBase` falls back to localhost until set) |
| `{{PHONE}}`, `{{WHATSAPP}}`, `{{EMAIL}}` | hero call line, footer, terminal, business card, plan CTAs (WhatsApp `wa.me` links) |
| `{{CITY}}` | top bar + footer clock |
| `{{INSTAGRAM}}`, `{{YOUTUBE}}`, `{{LINKEDIN}}` | full URLs: wall CTA, footer, terminal, JSON-LD `sameAs` |
| `{{brand}}` | terminal prompt `student@{{brand}}` |
| `{{MENTOR_CRITERIA}}` | FAQ "How are mentors selected?" |
| `{{PRIVACY_POLICY_URL}}` | FAQ "Is my child's data private?" |
| `{{CONFIRM_GST}}` | price note under the plans |
| `{{RESULT_TOP_AIR}}`, `{{RESULT_SELECTIONS}}`, `{{RESULT_AVG_IMPROVEMENT}}`, `{{RESULT_OLYMPIAD_QUALIFIERS}}`, `{{YEAR}}`, `{{SOURCE}}` | Results-mode receipts (commented out). **Only with verified data.** |

## {{CONFIRM}}: business facts I wrote but you must confirm

- **7-day full refund** (trust chips + FAQ), **EMI available**, **sibling discount 10%**.
- **Hindi/English medium** (FAQ answer is just `{{CONFIRM}}`).
- **Doubts answered within 24h**, **2 × 1:1 a month**, **52+ tests/year**, **20 years of PYQs**, **12 parent reports/year**, quarterly video PTM: these are shown as plan commitments.
- Prices are `P` in `lib/content.ts`. Per-day, effective-monthly and savings figures are computed from it. `scripts/gen-assets.mjs` also prints "from ₹3,999/mo" on the OG image.
- Diagnostic test is "90 minutes, all subjects" in the timeline and terminal.

## Couldn't do, or did differently

- **No `/work/*` case-study pages exist** in this codebase (it's a single page), so §4.14 `/programs/*` pages weren't built. Programs live in the "pick your battlefield" cards.
- **No checkout or diagnostic form exists.** All "start" / "diagnostic" CTAs open WhatsApp (`wa.me/{{WHATSAPP}}?text=…`). Swap `cta.diagnosticHref` and `plans.cycles[].href` when there's a form or payment page.
- **Terms, privacy and brochure.pdf pages don't exist**, so the paperwork column links to plans, FAQ (refund) and top. Add the pages, then the links.
- **Billing toggle:** no existing toggle could switch prices without new behaviour code, so Pricing shows three cards (as the brief allows).
- **Hero image** is a generated illustration in the exact pose of the original cut-out (mirror selfie, phone over the face), because the x-ray overlay and the halftone loader are drawn to that pose. To use a photo: a transparent PNG at a 289:695 ratio, same pose, saved over `public/img/hero-aspirant.png`. No stock faces posing as real students.
- Sample data in the mocks (214/300, "Aarav", 96%, percentile 97.1) is labelled "sample" in the mock UI. It's illustrative, not a claim.
- The "(that gets you selected)" stack title is rendered in the eyebrow style (no new serif style).

## Verified

- `next build` passes, TypeScript clean.
- Headless Chrome at 1440 / 768 / 360: no console errors, no 4xx requests, no horizontal overflow except the hero's design/code split handle (same as the original).
- Exercised: terminal (`plans`, `jee`, `discipline`, `quote`, `sudo crack jee`, `enroll --plan annual`, an unknown command), study/revision mode toggle (6:00 a.m. ↔ 11:00 p.m.), phone notifications, footer distraction squashing, every in-page `#anchor` resolves, JSON-LD present.
- Identity grep (`yash dhiman dmtoyash 7906618397 dehradun saral browzie emitrr kasol resume rishika chaudhary chandigarh punjab hackathon`) returns nothing outside `node_modules`.
- Not checked by hand: desk drag physics on touch devices, and a Lighthouse comparison against the original.

---

## 2026-11-27 · Hero character: "sticker-collage aspirant" (the one approved UI exception)

Brand set to **SamarthX** (`brand.name`, wordmark `samarth` · `x`, terminal `student@samarthx`, OG image).

**What changed**
- The hero `<img>` cut-out (design layer only) is now an **inline SVG**: `scripts/gen-aspirant.mjs` → `lib/art/aspirant-figure.svg` (11.7 KB) + `lib/art/aspirant-stickers.svg` (8.4 KB), inlined by `components/Hero.tsx` at build time. 100% original vector art. No downloaded images, no new libraries.
- Same container and hooks: still `.hx__me > .hx__cut > .hx__photo` (so `hero.ts` layout, the loader and the intro are untouched). The bubble, multiplayer cursors, sparkles and the 42 badge are kept.
- The same generator rasterises the character to `public/img/hero-aspirant.png`, which the halftone loader and the code-layer x-ray mask still sample, so all three match.
- Art: mirror-selfie pose on the x-ray skeleton; torn white paper edge + grain (one SVG noise filter, outline layer only); oversized tee "SHOW UP daily." with the purple card and 42 badge; hoodie tied at the waist; scrunchie; doodled sneakers (they sit behind the yellow strip on desktop).
- Stickers (each its own `<g>`, `aria-hidden`): PYQ, AIR ??, NCERT ✓, Bohr atom, pendulum, DNA, sticky note "kal se nahi, aaj se.", reels. Doodles: coffee ring, washi tape, F = ma, PV = nRT.
- Phone screen cycles every 2.5 s: streak 🔥 42 → sunday mock 214/300 ↑18 → reels blocked 🚫 → mentor call 7 pm.
- Motion (`lib/behaviors/aspirant.ts`, existing GSAP/ScrollTrigger): breathing bob; stickers float at different speeds (pendulum swings, atom orbits); scroll peels stickers outward with parallax + rotation, scrubbed so they settle back on scroll-up; head tilts toward the cursor (desktop only); click or Enter toggles focus mode (headphones slide on, "focus mode: ON" pill, reels flicked away; again resets); hovering any pricing CTA on the page gives a thumbs-up. Idle loops pause off-screen and while scrolling.
- `prefers-reduced-motion`: static collage, no float, parallax, cursor tracking or phone cycling. Focus mode still toggles, instantly.
- A11y: `role="img"`, `aria-label="Illustrated student taking a selfie, surrounded by study stickers."`, focusable, keyboard toggle.
- **Never covers hero text:** after layout (and on resize/refresh) each sticker is checked against the hero's text. A colliding sticker slides inward onto the figure; it's hidden only if that fails.
- CSS added (additions.css, `.ax*` only): positioning, focus ring, transform origins. For performance the inherited container drop-shadows are switched off for the new figure, and the character carries its own shadow on its own layer.
- `hero.ts`: one change, `[data-ax]` added to the "interactive" list so clicking the character doesn't start the hero's drag-to-split.

**Verified** (headless Chrome, production build)
- 360 / 768 / 1440: no document overflow, **0 sticker/hero-text overlaps** after the intro settles, no console errors.
- Phone cycling, focus mode on/off, reels flick and thumbs-up all confirmed by script. Reduced-motion run confirmed static.
- Scroll frame rate, A/B with the collage hidden vs shown in the same page on this machine (~80% CPU busy): 55–68 fps with vs 61–93 fps without, so roughly 10% overhead and mostly at or near 60. The first version cost ~35% (container drop-shadow re-blurring each frame), which led to the perf changes above.
- **Not run:** Lighthouse (no Lighthouse install here). Compare before/after with Chrome DevTools → Lighthouse on `npm run build && npm start`.
- At 768px the layout puts the figure close to both text columns (the short second word "x" pushes the gap right), so stickers often sit on the figure there. That's by design of the guard.

Regenerate after editing the art: `npm run gen:aspirant && npm run gen:assets`.

---

## 2026-11-27 · Prompt 2: lead funnel, starter offers, updated add-ons (no UI changes)

Funnel: **Free (Diagnostic / Predictor / Scholarship) → ₹1 trial or ₹99 Mock Review → Coaching Companion ₹999 → Core plan ₹3,999 (annual is the hero).**

**Lead capture (no new form UI).** Every CTA goes through one of two builders in `lib/content.ts`:
- `lead(offer, extra)` → `{{FORM_URL}}?offer=…` (plus `from=` / `exam=` so you can tell which CTA a lead came from)
- `WHATSAPP_URL(message)` → `https://wa.me/{{WHATSAPP}}?text=…` (prefilled per CTA)

Verified by script: 18 distinct `offer=` values across all lead links, every WhatsApp link prefilled, no dead anchors, nothing else outbound except `tel:`, the sample PDF and the social placeholders.

**Component reuse (no new styles)**

| Item | Reused component |
| --- | --- |
| Status pill → "scholarship test · up to 50% off · {{SCHOLARSHIP_DATE}}" → `#start` | `.hx__status` (text now wrapped in a link) |
| Hero: "take the free diagnostic test" (₹0) · "scholarship test" · "or the full plan at ₹1 for 7 days · 15-min mentor call included · parents welcome" | the two `.hx__btn`s + `.hx__call` |
| **New `#start`** "start here. it's free." (after receipts): Diagnostic · Scholarship (tiers as chips) · Predictor ("try it in the terminal ↓" + WhatsApp) | section head + `bench__card` grid with a `rc__n` number |
| Pillar 3: "see a sample parent report (PDF)" | `pc__links` |
| Programs: NEET "NCERT line-by-line + daily biology flashcards"; "Olympiad & Foundation · Class 8–12" (weekend problem camps mentioned in copy only); second CTA "free diagnostic" with `exam=jee/neet/olympiad` | bench cards (data) |
| Pricing: "Boards + competitive, together" in included; **"not ready for ₹3,999? start small."** row: Free Diagnostic ₹0 · 7-day trial ₹1 · Mock + Mentor Review ₹99 · Exam Strategy Blueprint ₹499 · Coaching Companion ₹999/mo; trial disclosure line; new trust chips | `receipts__list` / `rc` cards + `pc__link`; `chip` row |
| Add-ons (8 rows): Extra 1:1s, PCMB Doubt Pass, Backlog Khatam Bootcamp, Dropper Reset, Away From Home, Olympiad Pro, Counselling (open to non-members), Printed Kit. Removed: Mock Marathon, Parent Pro, Calm Mind. Each row → its own `offer=addon-…` | `more__list` rows |
| Terminal: `predict jee <percentile>`, `predict neet <marks>`, `challenge`, `scholarship`, `trial`, `diagnostic`; `help` lists them | desk terminal |
| Phone: "Scholarship · you scored 82%. 30% off unlocked." and "Challenge · day 4/7 done. 3 more to win." | phone notification data |
| Wall CTA → "join the 7-day discipline challenge" (Instagram stays in the footer) | `play__be` link |
| Timeline: v0.1 "+ free. with a mentor call. parents welcome."; v4.0 "+ counselling desk: choice filling done right" | commit notes |
| FAQ: +6 (scholarship, ₹1 trial & charges, Coaching Companion, predictor accuracy, Study Buddy, Away-From-Home) | FAQ bench cards |
| Footer: students "scholarship test · {{SCHOLARSHIP_DATE}}"; parents "sample parent report" + "book the free diagnostic"; footer and dock CTAs → free diagnostic; dock: start · plans · journey · faq | footer / dock data |

All prices live in `P` (`starter` + `addons`). Offers, tiers, dates, referral terms and trial terms live in `funnel`.
`funnel.sprint.enabled = false`: the Last-60-Days Sprint renders nothing. Not built (as instructed): Daily Problem, past-paper solutions, parent webinar, weekend-camp cards/prices, separate Boards or NCERT products.

**Predictor: no invented data.** `data/predictor/jee.json` and `neet.json` ship with an empty schema plus `data/predictor/README.md` (fill only from official JoSAA / MCC / NTA data). With no data, `predict` says so and hands off to WhatsApp. Every output ends "estimate based on {{YEAR}} data, not a guarantee." The JEE rank estimate `(100 − percentile) × TOTAL / 100` only runs once `predictor.jeeTotalCandidates` is a real number.

**Sample parent report.** `public/sample-parent-report.pdf` (`npm run gen:report`): fictional data, a "SAMPLE" watermark, and a banner saying every number is made up. Replace it with your real template.

**Bug fixed along the way.** `additions.css` hid every `.pc__links` until revealed, but only the stacked app cards reveal theirs. So the CTAs on the program cards, plan cards, `#start`, starter offers and FAQ were invisible (since the first pass). The hidden state is now scoped to `.stack__item`.

**New placeholders / confirm items**

| Placeholder | Where |
| --- | --- |
| `{{FORM_URL}}` | `LEAD_URL`: every lead CTA |
| `{{WHATSAPP}}` | `brand.whatsapp`: WhatsApp CTAs, predictor handoff |
| `{{SCHOLARSHIP_DATE}}` | status pill, `#start`, footer, FAQ, terminal |
| `{{CONFIRM_SCHOLARSHIP_TIERS}}` | `funnel.scholarshipTiers` (90%+ → 50, 75–89 → 30, 60–74 → 15, everyone → 5) |
| `{{CONFIRM_TRIAL_TERMS}}` | `funnel.trialTerms` ("no auto-debit") + FAQ |
| `{{JEE_MAIN_TOTAL_CANDIDATES}}` | `predictor.jeeTotalCandidates` (official NTA count, as a number) |
| `{{YEAR}}` | `predictor.year` / the `year` in each predictor JSON |
| predictor data | `data/predictor/jee.json`, `neet.json` (see README there) |
| `{{CONFIRM}}` | sample parent report (replace with yours), 7-day refund chip, Study Buddy/Squad terms |

**Verified:** build passes; terminal commands run; none of the excluded items appear on the page; 360 / 768 / 1440 show no overflow (only the hero's intentional split handle); all CTA links are visible.

---

## 2026-11-27 · Prompt 3: "Two futures, one aspirant" (engineer ⟷ doctor hero)

Scope: the hero figure, the background behind it, the callouts/chips/bubble around it, and the split handle. Nothing else changed.

**How it works**
- The existing DESIGN ⟷ code handle is now **JEE ⟷ NEET** (same pill + knob markup/styles). 100 = future engineer (default), 0 = future doctor. Slider 50 is mapped onto the **figure's centre** (the figure isn't at the hero's centre because of the "samarth x" wordmark), so at 50% the aspirant is split exactly down the middle at every width. 0–50 and 50–100 stretch over each side, and the knob stays under the pointer while dragging.
- **Drag:** snaps to 0 / 50 / 100 with `back.out(1.7)`. **Tap** the knob: toggles with a 600 ms sweep. **Keyboard:** ← → move 10%, Home/End jump; `role="slider"`, `aria-valuenow`, `aria-valuetext`, label "Switch between future engineer and future doctor". **Scroll:** the first 60vh sweeps engineer → doctor (scrubbed), and stops the moment the visitor drags, taps or uses the keyboard. **Idle hint:** after the intro, the handle peeks 12% once and springs back; the hint label reads "drag → see the doctor".
- **The curtain uses transforms, not clip-path.** Each side sits in a window that slides one way while its content slides back, so dragging never repaints the art. Measured drag frame rate, scripted drag A/B on this machine: old hero 21–25 fps → new 59–80 fps (first-ever reveal ~24 fps while the doctor art is painted the first time).
- The old duplicate "code" copy of the hero (outlined heading, blueprint text) is no longer revealed (`.hx__layer--code { visibility: hidden }`; still in the DOM because the layout code measures it). The heading, tagline, copy, buttons, top bar, banner, clock, status dot and scroll cue look the same in every state.

**Art** (`scripts/gen-aspirant.mjs` → `lib/art/*.svg`, 34 KB of inline SVG in total; no new libraries)
- One shared base (skin, hair, bow, pose, phone, sneakers) plus two outfit layers, so the figures line up to the pixel (verified: 0 px difference at 50%).
- **Engineer:** charcoal hoodie (hood collar, drawstrings, kangaroo pocket) with the SHOW UP daily. card + 42, sleeves pushed up, safety goggles on the head, pencil behind the ear, scale ruler in the back pocket, navy joggers, gear-doodle sneakers, circuit-pattern phone case.
- **Doctor:** white coat over mint scrubs, stethoscope, ID lanyard "Dr. ___ (loading…)", pen-torch in the breast pocket with the SHOW UP card as a pocket badge (+ 42), red-cross phone case, an x-ray lightbox behind the shoulder.
- **Backgrounds:**
  - Engineer blueprint: 24 px grid, projectile parabola + vector, incline FBD, circuit trace off-edge, dimension lines "rank: TBD" and "Δ effort → Δ rank", and `F = ma`, `∮E·dA = Q/ε₀`, `PV = nRT`, `∫₀π sin x dx = 2`.
  - Doctor clinic: mint tint + "+" pattern, cell diagram, glucose ring, `ATP`, `Krebs cycle`, `Ksp`, `NCERT pg. 128`.
  - Animated pieces are their own transform-only layers: counter-rotating gears, a heart beating at 72 bpm, a twisting DNA helix. Each side's set pauses when that side is fully hidden or the hero is off-screen.
- **Divider:** follows the handle; a circuit trace (engineer side) and an ECG line (doctor side) run top → bottom, with a spark at the knob and a 150 ms scan flash when the curtain crosses the figure's centre.
- **Text around the figure** (`components/Futures.tsx`, copy in `futures` in `lib/content.ts`): x-ray callouts (frontal/occipital/cerebellum/phone/heart), 4 chips, the bottom label (blueprint ⟷ x-ray), the phone screen (cycles every 2.5 s, engineer vs NEET mock), and the caption chip "future engineer · JEE" ⟷ "future doctor · NEET" (crossfades at 50%). At 50% the bubble says "why not both? ask your mentor." All numbers are illustrative mock UI.
- A guard hides any callout/chip that would overlap hero text at the current width. Visible at 1440: 17/21; at 360: 11/21; at 768 the columns leave little room, so only 3/21 show.
- Desktop: background parallax (5–8 px) and a head tilt toward the cursor. Click/Enter on the figure: focus mode (headphones slide on). Pricing-CTA hover: thumbs-up. Dropped from the previous hero: the scroll "peel" of the stickers (scroll now drives the curtain) and the old sticker set (PYQ/NCERT/AIR/atom/…), which is replaced by the brief's callouts and chips.
- `prefers-reduced-motion`: no parallax, peek or idle animation; the slider still works and moves instantly (verified).

**Verified** (headless Chrome, production build, compared against the live pre-change site)
- Hero text: position, size, colour, font and content of the heading, role, buttons, call line, lede, quip, file, status, clock, stamp and "built for" strip are **identical** at 1440 / 768 / 360. The only diff is the clock's minute.
- Scroll 30vh → 50, 70vh → doctor; keyboard 10% steps + Home/End; drag released at 43% snaps to 50; tap toggles; no horizontal overflow at any width.
- **Contrast:** body text stays 13:1+. The backgrounds were softened and fade to plain paper behind the top bar to protect contrast. The pink 40px "chase" stays above the 3:1 large-text threshold on both sides (worst case on a grid line/plus mark ~3.3 vs 3.65 before). The small grey "SamarthX /" breadcrumb was already below AA before (2.66) and remains so; it now sits on plain paper as before.
- **Not run:** Lighthouse (not installed here). Run it from Chrome DevTools on `npm run build && npm start` to compare LCP/CLS. The hero has no images to load (inline SVG), so LCP should not regress.

**Missing assets / owner options**
- `/img/hero/aspirant-engineer.webp` and `/img/hero/aspirant-doctor.webp` were not supplied, so both figures are original layered SVG as the brief allows. To use photos or renders instead: identical canvas (289:695), identical pose/face/hair position, transparent background. Tell us and we'll swap the inline art for `<img>` (engineer `fetchpriority="high"`, doctor lazy).
- Regenerate after editing the art: `npm run gen:aspirant && npm run gen:assets`.

---

## 2026-11-27 · Hero characters: owner-supplied engineer + doctor images

- Uses the two supplied illustrations (originals kept in `source-art/hero/`, excluded from Vercel uploads): **engineer** (hard hat, safety goggles, hi-vis vest) and **doctor** (lab coat, stethoscope, scrubs), both arms-crossed busts.
- `scripts/prep-hero-images.mjs` (`npm run gen:hero`) puts both on **one identical canvas**: the engineer defines it, and the doctor is scaled to the same face size (×0.80) and moved so her eyes sit exactly on the engineer's. At the 50% split the face continues cleanly (eyes, nose, mouth and goggles line up). It also adds the site's white sticker edge and exports WebP at 720×1038 (engineer 96 KB, loaded first with `fetchpriority="high"`; doctor 73 KB, low priority), plus `hero-aspirant.png` for the loader halftone.
- **Centred character:** the figure now sits centred between the two text columns (`brand.cutoutCentred`) instead of in the gap between "samarth" and "x". It shows 95% of the bust above the yellow strip (`cutoutVisible`, was 76% for the full-length figure), sized to 62% of the space between the columns (`cutoutMaxCol`) so the chips and callouts have room. All three are in `lib/content.ts`.
- Callouts, chips and the caption are re-plotted for the bust:
  - lobes beside the head (right); heart and crossed arms (left)
  - chips beside the head
  - caption over the crossed arms
- The selfie-specific bits are gone with the new art: the phone screen and its "covering face" callout (now "arms: crossed: the … mock is done."), the head tilt and the headphones. Clicking the character now switches engineer ⟷ doctor (same sweep as the JEE/NEET tags).
- The generated SVG figures are retired; `scripts/gen-aspirant.mjs` now only makes the backgrounds, divider and animated pieces.
- **Verified** at 1440 and 360:
  - both images on the identical box (0 px)
  - 50% = the figure's centre, with the knob on the curtain
  - scroll 30vh → 50 and 70vh → doctor; keyboard, drag-snap and tap all work
  - no overflow
- **Please confirm** you have the rights to use these two illustrations commercially (the file names suggest they may come from a stock or AI-image service).

---

## 2026-11-28 · Content transformation: "a mentor. a guide. a companion." (copy only)

Text-only pass. No layout, CSS, motion, routes, prices, IDs, `data-*` hooks or terminal command names changed.

**Files:** `lib/content.ts`, `lib/behaviors/terminal.ts` (responses only), `lib/behaviors/arcade.ts` (1 message), `components/Mocks.tsx` (2 chat lines), `components/Hero.tsx` (1 hidden layer label), `app/layout.tsx` (OG alt), `lib/seo.ts` (title/description), `scripts/gen-posters.mjs` + regenerated `public/img/wall/poster-{01,02,03,04,06,07,09,10,11}.svg` (same sizes), `scripts/gen-assets.mjs` (OG text, **not regenerated**: `public/og.png` still says "one rank to chase").

**Messaging:** hero "one dream, one mentor, every step together." · bubble "you don't need more information. you need direction." · quip "less confusion. more clarity. someone by your side." · battlefield → "discover your path" · "Parents see everything" → "Parents stay informed. Students stay trusted." · marks framed as feedback · journey "release notes for your prep." · footer "let's figure it out / every step of the way." · terminal `sudo crack jee` now prints the preparation-status readout.

**Renamed in copy (owner to confirm):** "Discipline Engine" → "Consistency Engine"; "7-day discipline challenge" → "7-day consistency challenge". Internal keys (`discipline` filter/command) unchanged.

**Verified:** `next build` passes. Headless Chrome vs the live site at 1440 / 768 / 390: no horizontal overflow; every changed text block keeps its original line count except (a) the hero bubble (cycles, as before) and (b) at 768 the hero headline wraps to 3 lines (clean break via a non-breaking space in "one mentor"; grows upward into empty space). Poster text stays inside the 640px canvas.

---

## 2026-11-28 · Interactive #start previews + SamarthX One passes

Scope: the `#start` three-card row and the three billing cards in `#pricing`. Headings, starter offers, trust chips, the "everything included" grid, FAQ and all other sections are unchanged. No new dependencies (React state, CSS transitions, native SVG).

**Files:** new `components/StartCards.tsx`, `components/PlanCards.tsx`, `lib/hooks.ts`, `lib/predictor.ts`, `app/experiences.css`; edited `components/Pricing.tsx` (mounts them), `lib/content.ts` (copy + `scholarshipTiers[].min`, `scholarshipConfirmed`, plan `months`/copy, illustrative stages), `app/globals.css` (one import).

**#start**
- *Diagnostic:* JEE/NEET switch, selectable subject rows, "preview assessment" → analysing (ring, staggered rows, scan, animated bars and values) → mentor insight with word reveal; replay; subject changes update the insight. Sample data, labelled.
- *Scholarship pass:* ticket with perforation and stub; score slider + band selector; animated % and score; light sweep on tier change. Uses `funnel.scholarshipTiers` only, labelled "illustrative · not an offer yet" while `scholarshipConfirmed` is false.
- *Predictor:* JEE Main / NEET-UG switch (percentile ↔ marks), example-score slider, "explore" → signal along the path, nodes light in order, result panel. Uses the terminal's formula and `data/predictor/*.json` via `lib/predictor.ts`; with no official data it shows "awaiting official data" and no rank or college. Terminal (`#about`) and WhatsApp links kept.

**SamarthX One:** view switch (total billed / per month / savings) with animated amounts; "you pay …" line always visible; effective monthly labelled "not billed monthly". Monthly: 30-day calendar (arrow keys, Home/End) with illustrative weekly stages. Quarterly: 3-month roadmap slider + savings bars. Annual: 12-month ring in 4 phases + savings bars. All amounts derived from `P`. IDs `#plan-*`, CTA links and `data-cursor="enroll"` kept.

**Verified** (production build, headless Chrome at 1440 / 768 / 390 and 390 with reduced motion): every control driven by script (rapid replays, mid-run changes, keyboard on calendar and phases); no console errors; no overflow inside any panel; no horizontal scroll; equal card heights and aligned CTAs on desktop.

---

## 2026-11-28 · Opening sequence: "find your way"

Replaces the halftone DPI loader. Scope: the loader and its handoff into the hero; nothing else on the page changes.

**Concept:** a pink line (the student's path) wanders in and loops back on itself; a steady ink line (the mentor's path) sweeps in to meet it. They cross, and the crossing becomes the x: the tails retract into two diagonals that gain the glyph's weight and land on the real "x", which takes over in pink. "samarth" rises letter by letter through masks at the hero wordmark's exact position, then "a mentor. a guide. a companion." The x turns ink and the page opens as an iris from it; the hero wordmark underneath is pixel-identical, so the swap is invisible, and the rest of the hero intro plays as it opens. On narrow screens the composition plays larger and centred, then the wordmark glides home before the iris (a shared-element move).

**Behaviour:** waits for real readiness (fonts + the hero image), not a fixed delay. Full form ~3 s from first paint of the sequence; repeat loads in a session get a ~1 s short form. If the image is still loading: a calm waiting state (status line, a pink sweep under the tagline), "enter now" after 3.2 s, page opens regardless after 8 s. Escape skips at any time. A viewport-width change mid-sequence opens the page immediately. CSS failsafe removes the cover after 14 s if the script never runs. Reduced motion: no loader.

**Files:** `components/Loader.tsx`, `lib/behaviors/loader.ts` (rewritten), new `app/loader.css`; `lib/behaviors/hero.ts` (from the loader, the wordmark is handed over in place instead of tipping in), `lib/behaviors/index.ts` (call signature), `app/additions.css` (old loader styles removed), `app/globals.css` (import), `lib/content.ts` (`loader` copy).

**Verified** (production build, headless Chrome, frames stepped with virtual time at 1440 / 768 / 390): wordmark handoff lands on the hero's pixels; full and short forms; delayed hero image → waiting state → "enter now" → opens when ready; blocked image → opens normally; Escape mid-intro; reduced motion; no console errors; all #start / pricing interactions unchanged afterwards.
