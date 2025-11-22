# Energie Besparing Tools Suite

Een complete Next.js applicatie met 11 interactieve energiebesparingstools voor Totaaladvies.nl.

## Features

- ✅ 11 interactieve calculators (Zonnepanelen, Warmtepomp, Airco, Thuisbatterij, Isolatie, CV-Ketel, Laadpaal, Energiecontract, Kozijnen, Energielabel, Boilers)
- ✅ Real-time berekeningen
- ✅ AI-integratie per tool via OpenRouter
- ✅ Leadgeneratie naar n8n webhook
- ✅ Iframe embedding voor WordPress
- ✅ Modern UI met Tailwind CSS
- ✅ Responsive design
- ✅ Complete testing setup (Vitest + Playwright)
- ✅ Error tracking met Sentry
- ✅ Analytics met Vercel Analytics
- ✅ CI/CD met GitHub Actions
- ✅ Code quality tools (Prettier, ESLint, Husky)

## Setup

### Installatie

```bash
npm install
```

### Environment Variables

Maak een `.env.local` bestand aan met:

```env
OPENROUTER_API_KEY=your_key_here
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
NEXT_PUBLIC_APP_URL=https://tools.totaaladvies.nl
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build voor productie
npm start                # Start production server

# Code Quality
npm run lint             # Check voor linting errors
npm run lint:fix         # Fix linting errors automatisch
npm run format           # Format code met Prettier
npm run format:check     # Check formatting
npm run type-check       # TypeScript type checking

# Testing
npm test                 # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests met coverage
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui      # Run E2E tests in UI mode

# Analysis
npm run analyze         # Analyze bundle size
npm run security:audit  # Security audit
```

### Build

```bash
npm run build
npm start
```

## Embedding in WordPress

Elke tool kan worden geëmbed via iframe:

```html
<iframe 
  src="https://tools.totaaladvies.nl/zonnepanelen?embed=true" 
  style="width:100%; min-height:600px; border:none;" 
  title="Zonnepanelen besparingstool">
</iframe>
```

De tools detecteren automatisch de embed mode en passen de styling aan.

## Projectstructuur

```
/app
  /(tools)          # Tool pagina's
  /api              # API routes (AI, leads)
/components
  /calculators      # Calculator componenten
  /shared           # Gedeelde UI componenten
/lib
  /calculations     # Berekening logica
  /ai               # OpenRouter client
/types              # TypeScript types
```

## Tools

1. **Zonnepanelen** - Bereken opbrengst en besparing
2. **Warmtepomp** - Hybride vs all-electric advies
3. **Airco** - Koelvermogen berekening
4. **Thuisbatterij** - Capaciteit en zelfconsumptie
5. **Isolatie** - Per maatregel besparing
6. **CV-Ketel** - Vervangingsadvies
7. **Laadpaal** - Laadvermogen en kosten
8. **Energiecontract** - Contract vergelijking
9. **Kozijnen** - HR++ glas besparing
10. **Energielabel** - Indicatief label en advies
11. **Boilers** - Boiler dimensionering

## Deployment

De applicatie is klaar voor deployment op Vercel:

1. Push naar GitHub
2. Import project in Vercel
3. Voeg environment variables toe
4. Deploy!

## Development Tools

Dit project gebruikt een complete set developer tools:

- **Prettier** - Code formatting
- **ESLint** - Linting met TypeScript en React plugins
- **Husky** - Git hooks voor pre-commit checks
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing
- **Sentry** - Error tracking en performance monitoring
- **Vercel Analytics** - Web Vitals tracking
- **Bundle Analyzer** - Bundle size monitoring
- **GitHub Actions** - CI/CD pipeline
- **Dependabot** - Automated dependency updates

Zie [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) voor development guidelines en [docs/TESTING.md](./docs/TESTING.md) voor testing guidelines.

## Licentie

Privé project voor Totaaladvies.nl

