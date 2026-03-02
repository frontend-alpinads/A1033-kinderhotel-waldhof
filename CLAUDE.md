# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Development server with Turbopack
npm run build            # Production build
npm run lint             # ESLint
npm run email:dev        # Preview email templates
npm run variant:add      # Add a new section variant
npm run variant:remove   # Remove section variants
```

## Architecture

**Next.js 16 App Router** hotel website with trilingual support (de/en/it) and a variant system for flexible page layouts.

### Key Directories

- `src/app/[[...segments]]/` - Dynamic catch-all routing for i18n + versions
- `src/components/sections/` - Page sections (hero, about, gallery, rooms, etc.) with multiple visual variants (v1, v2, v3...)
- `src/components/ui/` - shadcn/ui base components
- `src/contents/variants/` - JSON files defining which variant each section uses
- `src/data/` - Static content (rooms, FAQs, offers, testimonials)
- `src/app/actions/` - Server actions for booking integrations and form submissions
- `src/lib/i18n/` - Internationalization utilities

### Important Files

- `src/hotel-config.ts` - Central config (hotel info, booking settings, SEO metadata)
- `src/contents/variants-manifest.ts` - Variant loader configuration
- `src/stores/booking-store.ts` - Zustand store for booking state

### Patterns

**Localized strings** use the `LocalizedString` type:
```typescript
{ de: string, en: string, it: string }
```

**Section variants** are organized as `sections/{name}/variants/{name}-v{number}/`. Each variant is a self-contained implementation of that section.

**Booking integrations**: AlpineBits, EasyChannel, Seekda, Yanovis - handled via server actions in `src/app/actions/`.
