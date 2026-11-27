# {{BRAND_NAME}} · ed-tech landing page (Next.js)

Landing page for a mentor-first JEE · NEET · Olympiad app with a parent dashboard.
The layout, styles and interactions are unchanged from the design this was built on;
only the content, images and two composed sections (Pricing, FAQ) are new.

## Run it

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Where things live

| What | File |
| --- | --- |
| **All text, links and placeholders** | `lib/content.ts` |
| **All prices** (plans + add-ons, one object) | `lib/content.ts` → `P` |
| Brand name / phone / email / socials | `lib/content.ts` → `brand` |
| SEO title, description, JSON-LD | `lib/seo.ts`, `app/layout.tsx` |
| Desk terminal commands | `lib/behaviors/terminal.ts` |
| Pricing + FAQ sections | `components/Pricing.tsx` |
| Hero cut-out (transparent PNG) | `public/img/hero-aspirant.png` |
| Avatar (stickers, polaroid) | `public/img/avatar.jpg` |
| Wall posters | `public/img/wall/*.svg` (`npm run gen:posters`) |
| Hero art, avatar, OG image, favicon, icons | `npm run gen:assets` |
| Original page styles (unchanged) | `app/original.css`, `app/additions.css` |
| Animations & interactions | `lib/behaviors/*.ts` (GSAP + ScrollTrigger + Lenis) |

See `CHANGES.md` for the section map and every placeholder still to fill.
