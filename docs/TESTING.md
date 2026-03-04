# Frontend Testing Guide

This guide explains how to write tests for a vanilla TypeScript frontend project using **Vitest** (unit/integration tests) and **Playwright** (E2E tests).

---

## Table of Contents

1. [Why Test Frontend Code?](#1-why-test-frontend-code)
2. [Types of Frontend Tests](#2-types-of-frontend-tests)
3. [What to Test (and What Not To)](#3-what-to-test-and-what-not-to)
4. [Test Structure: Arrange-Act-Assert](#4-test-structure-arrange-act-assert)
5. [Mocking: Why and How](#5-mocking-why-and-how)
6. [Vitest Basics](#6-vitest-basics)
7. [Testing DOM Manipulation](#7-testing-dom-manipulation)
8. [Playwright Basics (E2E)](#8-playwright-basics-e2e)
9. [Project-Specific Patterns](#9-project-specific-patterns)
10. [Running Tests - Quick Reference](#10-running-tests---quick-reference)

---

## 1. Why Test Frontend Code?

- **Catch bugs early** - Find issues before they reach users
- **Refactor with confidence** - Change code knowing tests will catch regressions
- **Living documentation** - Tests describe how code is supposed to behave
- **Faster development** - Automated tests are faster than manual testing every time

---

## 2. Types of Frontend Tests

### Unit Tests

Test a **single function or class** in isolation. Dependencies (like API calls) are replaced with mocks.

```ts
// Example: Testing that AppStore.createBoard() dispatches an event
it('dispatches board:created event', async () => {
  const spy = vi.spyOn(window, 'dispatchEvent');
  await appStore.createBoard('My Board');
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'board:created' })
  );
});
```

### Integration Tests

Test **multiple units working together**. For example, a Page component with its Controller and a mocked API.

```ts
// Example: LoginPage submits form and navigates on success
it('navigates to dashboard after login', async () => {
  // Mount the page, fill the form, submit
  // Verify the router navigated to /dashboard
});
```

### E2E Tests (End-to-End)

Test the **entire application** as a real user would - in a real browser. API calls can be intercepted and mocked at the network level.

```ts
// Example: Playwright test
test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="username"]', 'testuser');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### The Testing Trophy

```
        ╭──────────╮
        │   E2E    │  Few - expensive, slow, but test real user flows
        ╰──────────╯
      ╭──────────────╮
      │ Integration  │  Some - test units working together
      ╰──────────────╯
   ╭────────────────────╮
   │    Unit Tests      │  Many - fast, cheap, test logic in isolation
   ╰────────────────────╯
  ╭──────────────────────╮
  │   Static Analysis    │  TypeScript compiler catches type errors
  ╰──────────────────────╯
```

Write **many unit tests**, some integration tests, and a few E2E tests for critical user flows.

---

## 3. What to Test (and What Not To)

### Do Test

- **Business logic** - Store methods, data transformations, calculations
- **Error handling** - What happens when an API call fails?
- **Edge cases** - Empty arrays, null values, boundary conditions
- **User interactions** - Click handlers, form submissions, navigation
- **State changes** - After calling `login()`, is `currentUser` set?

### Don't Test

- **Framework internals** - Don't test that `document.createElement` works
- **Trivial code** - Simple getters that just return a property
- **Implementation details** - Test *what* happens, not *how* it happens
- **Third-party libraries** - Vitest, Vite, Tailwind already have their own tests

---

## 4. Test Structure: Arrange-Act-Assert

Every test follows three steps:

```ts
it('loads boards and stores them', async () => {
  // ARRANGE - Set up the test scenario
  const mockBoards = [{ id: '1', title: 'Board 1' }];
  vi.mocked(http.get).mockResolvedValue(mockBoards);

  // ACT - Perform the action being tested
  const result = await appStore.loadDashboard();

  // ASSERT - Verify the expected outcome
  expect(result).toEqual(mockBoards);
  expect(appStore.boards).toEqual(mockBoards);
});
```

**Arrange**: Create test data, set up mocks, prepare the environment.
**Act**: Call the function or trigger the event you're testing.
**Assert**: Check that the result matches your expectations.

---

## 5. Mocking: Why and How

### What is Mocking?

Mocking means **replacing real dependencies with controlled fakes**. When testing `AppStore.createBoard()`, you don't want to make a real HTTP request - you replace `fetch` with a fake function that returns whatever you tell it to.

### `vi.fn()` - Create a Mock Function

```ts
const mockFn = vi.fn();         // Creates a function that does nothing
mockFn();                        // Call it
expect(mockFn).toHaveBeenCalled(); // Passes!

// With a return value:
const mockFn = vi.fn().mockReturnValue(42);
expect(mockFn()).toBe(42);

// With async return:
const mockFn = vi.fn().mockResolvedValue({ id: 1, title: 'Board' });
const result = await mockFn();  // { id: 1, title: 'Board' }
```

### `vi.mock()` - Replace Entire Modules

```ts
// Replace the entire HttpClient module
vi.mock('../api/HttpClient', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setUnauthorizedHandler: vi.fn(),
  },
}));

// Now when AppStore imports `http`, it gets the mock
```

### `vi.spyOn()` - Watch a Real Function

```ts
// Spy on window.dispatchEvent without replacing it
const spy = vi.spyOn(window, 'dispatchEvent');

window.dispatchEvent(new CustomEvent('test'));

expect(spy).toHaveBeenCalledWith(
  expect.objectContaining({ type: 'test' })
);
```

### `vi.stubGlobal()` - Replace Global Variables

```ts
// Replace the global fetch function
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: () => Promise.resolve({ data: 'test' }),
}));
```

### When to Mock vs. When to Use the Real Thing

| Mock it | Use the real thing |
|---------|-------------------|
| HTTP requests (`fetch`) | DOM APIs (`document.createElement`) |
| External modules you don't own | Pure utility functions |
| Time-dependent code (`setTimeout`) | Data transformations |
| Router navigation | Simple calculations |

---

## 6. Vitest Basics

### Test File Structure

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AppStore', () => {           // Group related tests
  beforeEach(() => {                   // Run before each test
    // Reset state
  });

  afterEach(() => {                    // Run after each test
    vi.restoreAllMocks();
  });

  describe('createBoard', () => {      // Nested group
    it('sends POST request with title', async () => {
      // Test code here
    });

    it('dispatches board:created event', async () => {
      // Test code here
    });
  });
});
```

### Common Matchers

```ts
// Equality
expect(value).toBe(42);                    // Strict equality (===)
expect(obj).toEqual({ id: 1 });            // Deep equality
expect(value).toBeTruthy();                // Truthy check
expect(value).toBeNull();                  // Null check

// Strings
expect(str).toContain('hello');            // Substring

// Arrays
expect(arr).toHaveLength(3);              // Array length
expect(arr).toContain('item');             // Array includes

// Functions
expect(fn).toHaveBeenCalled();             // Was called at all
expect(fn).toHaveBeenCalledTimes(2);       // Called exactly N times
expect(fn).toHaveBeenCalledWith('arg');     // Called with specific args

// Errors
expect(() => throwingFn()).toThrow();              // Sync error
await expect(asyncFn()).rejects.toThrow('msg');    // Async error

// Partial matching
expect(fn).toHaveBeenCalledWith(
  expect.objectContaining({ type: 'board:created' })
);
```

### Async Tests

```ts
// Just use async/await - Vitest handles it
it('loads data', async () => {
  const result = await store.loadData();
  expect(result).toBeDefined();
});
```

---

## 7. Testing DOM Manipulation

Vitest uses **happy-dom** to simulate a browser environment. You get `document`, `window`, `HTMLElement` and all standard DOM APIs without running a real browser.

### Creating and Querying Elements

```ts
it('creates a button with the correct text', () => {
  const button = new Button({ text: 'Click me' });
  const el = button.renderBtn();

  expect(el.tagName).toBe('BUTTON');
  expect(el.textContent).toBe('Click me');
});
```

### Testing Event Listeners

```ts
it('calls handler on click', () => {
  const handler = vi.fn();
  const button = document.createElement('button');
  button.addEventListener('click', handler);

  button.click();  // Simulate a click

  expect(handler).toHaveBeenCalled();
});
```

### Testing Components that Append to DOM

```ts
it('attaches page to root element', () => {
  const root = document.createElement('div');
  document.body.appendChild(root);

  const page = new MyPage();
  page.attachTo(root);

  expect(root.children.length).toBeGreaterThan(0);
});
```

---

## 8. Playwright Basics (E2E)

Playwright opens a **real browser** and interacts with your app like a user would.

### Test Structure

```ts
import { test, expect } from '@playwright/test';

test('user can create a board', async ({ page }) => {
  // Navigate to the page
  await page.goto('/dashboard');

  // Interact with elements
  await page.click('#createBoardBtn');
  await page.fill('[name="title"]', 'New Board');
  await page.click('button[type="submit"]');

  // Assert results
  await expect(page.locator('.board-row')).toContainText('New Board');
});
```

### Mocking API at the Network Level

Instead of running a real backend, intercept network requests:

```ts
test('shows boards from API', async ({ page }) => {
  // Intercept the API call and return fake data
  await page.route('**/api/boards/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: '1', title: 'Mocked Board', is_active: true, member_count: 3 }
      ]),
    });
  });

  await page.goto('/dashboard');
  await expect(page.locator('.board-row')).toContainText('Mocked Board');
});
```

### Common Playwright Actions

```ts
await page.goto('/path');                    // Navigate
await page.click('button');                  // Click
await page.fill('input[name="x"]', 'val');   // Type into input
await page.waitForSelector('.element');       // Wait for element
await expect(page).toHaveURL('/expected');    // Check URL
await expect(page.locator('h1')).toHaveText('Title');  // Check text
```

---

## 9. Project-Specific Patterns

### Testing Singleton Stores

The stores (e.g., `appStore`, `authStore`) are singletons. Reset their state between tests:

```ts
import { appStore } from '../AppStore';

beforeEach(() => {
  appStore.boards = [];
  appStore.singleBoard = null;
  appStore.columns = {};
  appStore.tasks = {};
});
```

### Mocking `http` for Store Tests

All stores use the `http` singleton from `HttpClient.ts`. Mock the entire module:

```ts
vi.mock('../../api/HttpClient', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setUnauthorizedHandler: vi.fn(),
  },
}));

import { http } from '../../api/HttpClient';

it('loads boards', async () => {
  const mockBoards = [{ id: '1', title: 'Test' }];
  vi.mocked(http.get).mockResolvedValue(mockBoards);

  await appStore.loadDashboard();

  expect(http.get).toHaveBeenCalledWith('/boards/');
  expect(appStore.boards).toEqual(mockBoards);
});
```

### Testing Custom Events

Stores dispatch custom events on `window`. Spy on `dispatchEvent`:

```ts
it('dispatches board:created event', async () => {
  vi.mocked(http.post).mockResolvedValue({ id: '1', title: 'New' });
  const spy = vi.spyOn(window, 'dispatchEvent');

  await appStore.createBoard('New');

  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'board:created' })
  );
});
```

### Testing HttpClient (Fresh Instance per Test)

Don't use the singleton `http` - create fresh instances to avoid state leakage:

```ts
import { HttpClient } from '../HttpClient';

let client: HttpClient;

beforeEach(() => {
  client = new HttpClient('http://test-api.example.com');
  vi.stubGlobal('fetch', vi.fn());
});
```

---

## 10. Running Tests - Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run Vitest in watch mode (re-runs on file change) |
| `npm run test:run` | Run all tests once (CI mode) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright with interactive UI |

### Debugging Failed Tests

1. **Read the error message** - It tells you what was expected vs. what was received
2. **Check the mock setup** - Is the mock returning what the code expects?
3. **Add `console.log`** - Temporary logs help understand what's happening
4. **Run a single test** - Use `it.only(...)` to isolate a failing test
5. **Check `beforeEach`** - Is state properly reset between tests?

```ts
// Run only this one test:
it.only('my specific test', () => { ... });

// Skip a test temporarily:
it.skip('broken test', () => { ... });
```
