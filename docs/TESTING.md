# Testing Guidelines

Dit project gebruikt verschillende testing tools voor code kwaliteit en betrouwbaarheid.

## Unit Tests (Vitest)

Unit tests zijn geschreven voor calculation functions in `lib/calculations/`.

### Tests uitvoeren

```bash
# Alle tests
npm test

# Watch mode
npm run test:watch

# Met coverage
npm run test:coverage

# UI mode
npm run test:ui
```

### Test locaties

- Unit tests: `__tests__/lib/calculations/`
- Component tests: `__tests__/components/` (toekomstig)

## E2E Tests (Playwright)

E2E tests testen de volledige gebruikersflow van de applicatie.

### Tests uitvoeren

```bash
# Alle E2E tests
npm run test:e2e

# UI mode
npm run test:e2e:ui
```

### Test locaties

- E2E tests: `e2e/`

### Test structuur

- `homepage.spec.ts` - Homepage functionaliteit
- `zonnepanelen.spec.ts` - Zonnepanelen calculator
- `embed-mode.spec.ts` - Embed mode functionaliteit

## Test Coverage

Streef naar minimaal 80% code coverage voor calculation functions.

## Best Practices

1. Test edge cases en boundary conditions
2. Test error handling
3. Gebruik descriptive test names
4. Keep tests isolated en independent
5. Mock external dependencies waar nodig
