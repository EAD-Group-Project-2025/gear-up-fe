# Testing Documentation

## Overview

This project uses **Jest** and **React Testing Library** for unit and integration testing. The testing setup is configured for Next.js with TypeScript.

## Test Structure

```
src/
├── components/
│   ├── ui/
│   │   └── __tests__/
│   │       ├── button.test.tsx
│   │       ├── input.test.tsx
│   │       └── card.test.tsx
│   └── shared/
│       └── __tests__/
│           └── ProtectedRoute.test.tsx
├── lib/
│   ├── context/
│   │   └── __tests__/
│   │       └── AuthContext.test.tsx
│   ├── services/
│   │   └── __tests__/
│   │       └── authService.test.ts
│   └── utils/
│       └── __tests__/
│           ├── authUtils.test.ts
│           ├── validators.test.ts
│           └── currency.test.ts
└── componenets/
    └── landing/
        └── __tests__/
            ├── Navbar.test.tsx
            └── HeroSection.test.tsx
```

## Running Tests

### Available Scripts

```bash
npm test                 # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:ci          # Run tests in CI mode
```

### Running Specific Tests

```bash
npm test Button          # Run tests matching "Button"
npm test -- --testPathPattern=auth  # Run tests in files matching "auth"
```

## Testing Utilities

### Test Utils (`src/lib/test-utils.tsx`)

Custom render function with providers:

```typescript
import { render } from '@/lib/test-utils'

render(<MyComponent />, { withAuth: true })
```

### Mocks

#### Next.js Router Mock (`src/lib/__mocks__/next/navigation.ts`)

```typescript
import { useRouter } from 'next/navigation'

const mockPush = jest.fn()
useRouter().push('/path')
```

#### Auth Service Mock (`src/lib/services/__mocks__/authService.ts`)

```typescript
import { mockAuthService, mockUser } from '@/lib/services/__mocks__/authService'

mockAuthService.login.mockResolvedValue({ user: mockUser, token: 'mock-token' })
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Service Tests

```typescript
import { myService } from '../myService'

describe('myService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should process data correctly', async () => {
    const result = await myService.processData({ id: 1 })
    expect(result).toEqual({ processed: true })
  })
})
```

### Testing with Authentication

```typescript
import { render } from '@/lib/test-utils'
import { AuthProvider } from '@/lib/context/AuthContext'

it('should work with auth context', () => {
  render(
    <AuthProvider>
      <MyProtectedComponent />
    </AuthProvider>
  )
})
```

## Coverage

Generate coverage reports with:

```bash
npm run test:coverage
```

Coverage reports are generated in:
- `coverage/` directory (HTML, LCOV, JSON)
- Console summary after test run

### Coverage Thresholds

Current configuration:
- Branches: No minimum
- Functions: No minimum  
- Lines: No minimum
- Statements: No minimum

To add thresholds, update `jest.config.ts`:

```typescript
coverageThresholds: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

## Test Configuration

### Jest Configuration (`jest.config.ts`)

- **Environment**: jsdom (browser-like environment)
- **Setup**: `jest.setup.ts` for global test setup
- **Module Resolution**: Path aliases configured (`@/...`)
- **Transform**: Next.js transformer for JSX/TSX

### Setup File (`jest.setup.ts`)

Global mocks and configurations:
- `@testing-library/jest-dom` matchers
- `matchMedia` mock
- `ResizeObserver` mock  
- `localStorage` and `sessionStorage` mocks

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
```

### 2. Use User Events Over FireEvent

```typescript
const user = userEvent.setup()
await user.click(button)
```

### 3. Query Priority

1. `getByRole` - Preferred
2. `getByLabelText` - Forms
3. `getByPlaceholderText` - Last resort
4. `getByTestId` - Only when necessary

### 4. Async Testing

```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### 5. Clean Up

```typescript
beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})
```

## Continuous Integration

The `test:ci` command is optimized for CI/CD:
- Runs in non-interactive mode (`--ci`)
- Generates coverage reports (`--coverage`)
- Limits workers for stability (`--maxWorkers=2`)

### GitHub Actions Example

```yaml
- name: Run Tests
  run: npm run test:ci
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Troubleshooting

### Tests Timing Out

Increase timeout in test file:

```typescript
jest.setTimeout(10000)
```

### Mock Not Working

Ensure mock is in correct location:
- `__mocks__/` folder next to module
- Named export matches original

### localStorage Issues

Mock is configured in `jest.setup.ts`. Clear between tests:

```typescript
beforeEach(() => {
  localStorage.clear()
})
```

### Next.js Import Errors

Ensure `jest.config.ts` has correct `moduleNameMapper` for aliases.

## Testing Examples

### Button Component Test

```typescript
it('should handle click events', async () => {
  const handleClick = jest.fn()
  const user = userEvent.setup()
  
  render(<Button onClick={handleClick}>Click me</Button>)
  await user.click(screen.getByRole('button'))
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Form Validation Test

```typescript
it('should validate email format', async () => {
  const user = userEvent.setup()
  render(<EmailInput />)
  
  const input = screen.getByRole('textbox')
  await user.type(input, 'invalid-email')
  await user.tab()
  
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
})
```

### Protected Route Test

```typescript
it('should redirect unauthenticated users', async () => {
  (authService.isAuthenticated as jest.Mock).mockReturnValue(false)
  
  render(
    <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
      <div>Protected</div>
    </ProtectedRoute>
  )
  
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing](https://nextjs.org/docs/testing)

