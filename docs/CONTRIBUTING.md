# Contributing Guide

Welkom bij het Energie Besparing Tools project! Deze guide helpt je om bij te dragen aan het project.

## Development Setup

1. Clone het repository
2. Installeer dependencies: `npm install`
3. Maak `.env.local` aan (zie `.env.example`)
4. Start development server: `npm run dev`

## Development Workflow

### Pre-commit Hooks

Het project gebruikt Husky en lint-staged voor automatische checks:

- ESLint wordt automatisch uitgevoerd
- Prettier formatteert code automatisch
- Alleen staged files worden gecheckt

### Code Quality

#### Linting

```bash
# Check voor linting errors
npm run lint

# Fix automatisch
npm run lint:fix
```

#### Formatting

```bash
# Format alle files
npm run format

# Check formatting
npm run format:check
```

#### Type Checking

```bash
npm run type-check
```

## Testing

Zie [TESTING.md](./TESTING.md) voor uitgebreide testing guidelines.

## Pull Request Process

1. Maak een feature branch van `main` of `develop`
2. Implementeer je changes
3. Zorg dat alle tests slagen: `npm test && npm run test:e2e`
4. Zorg dat linting en formatting correct zijn
5. Maak een PR met duidelijke beschrijving

## Code Style

- Gebruik TypeScript voor alle nieuwe code
- Volg de ESLint regels
- Format code met Prettier (automatisch bij commit)
- Gebruik meaningful variable names
- Voeg comments toe waar nodig

## Commit Messages

Gebruik duidelijke, beschrijvende commit messages:

```
feat: add new calculator for solar panels
fix: resolve calculation error in warmtepomp
docs: update README with new features
```

## Vragen?

Neem contact op met het development team voor vragen of hulp.

