# Hotel Website Template

A modern, multilingual hotel website template built for South Tyrol hotels. Features a flexible variant system, multiple booking integrations, and full i18n support (German, English, Italian).

## Features

- **Next.js 16** with App Router and Turbopack
- **Trilingual support** (DE/EN/IT) with SEO optimization
- **Variant system** for flexible page layouts
- **Multiple booking integrations** (Seekda, AlpineBits, EasyChannel)
- **Email templates** with React Email and Resend
- **Responsive design** with Tailwind CSS and shadcn/ui components
- **Animations** with GSAP

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd hotel-website-template
npm install
```

### 2. Configure Environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

See `.env.example` for all available configuration options.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Customization Guide

### Files to Update Per Hotel

| File | Purpose |
|------|---------|
| `src/hotel-config.ts` | Hotel name, contact info, location, branding, SEO |
| `src/contents/variants/default.json` | All section content (hero, about, features, etc.) |
| `src/locales/de.ts`, `en.ts`, `it.ts` | Localized strings and metadata |
| `src/data/rooms.ts` | Room/suite definitions |
| `src/data/offers.ts` | Special offers and packages |
| `src/data/faqs.ts` | Frequently asked questions |
| `src/data/testimonials.ts` | Guest testimonials |
| `src/app/globals.css` | Brand colors (CSS variables) |
| `public/` | Logo images and assets |

### Brand Colors

Update the CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: #171717;        /* Primary brand color */
  --secondary: #f5f5f5;      /* Secondary color */
  --accent: #a3a3a3;         /* Accent color */
  --booking: #171717;        /* Booking button color */
  /* ... other variables */
}
```

### Logo and Images

Replace the placeholder files in `public/`:
- `full-logo.png` - Main logo
- `full-logo-mobile.png` - Mobile logo
- `footer-logo.png` - Footer logo
- `icon.png` - Favicon/icon

Add room images in `public/rooms/<room-id>/`.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run email:dev` | Preview email templates |
| `npm run variant:add` | Add a new section variant |
| `npm run variant:remove` | Remove section variants |

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [[...segments]]/    # Dynamic i18n routing
│   └── actions/            # Server actions (booking, forms)
├── components/
│   ├── sections/           # Page sections with variants
│   ├── ui/                 # shadcn/ui components
│   └── emails/             # React Email templates
├── contents/
│   └── variants/           # JSON variant definitions
├── data/                   # Static content (rooms, FAQs, etc.)
├── lib/
│   └── i18n/              # Internationalization
├── locales/               # Translation strings
└── stores/                # Zustand state management
```

### Section Variants

Each section supports multiple visual variants:

```
components/sections/hero/
├── variants/
│   ├── hero-v1/
│   ├── hero-v2/
│   └── hero-v3/
└── index.tsx
```

Configure which variant to use in `src/contents/variants/default.json`:

```json
{
  "hero": { "variant": 1 },
  "about": { "variant": 2 }
}
```

### Booking Integrations

Configure your booking system in `.env.local`:

- **Seekda**: Set `SEEKDA_PROPERTY_CODE` and `SEEKDA_TOKEN`
- **AlpineBits**: Set `ALPINEBITS_*` variables
- **EasyChannel**: Set `EASYCHANNEL_*` variables

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

Build and start:

```bash
npm run build
npm run start
```

## License

Private - All rights reserved.
