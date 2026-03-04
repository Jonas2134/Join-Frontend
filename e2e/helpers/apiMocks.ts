import type { Page } from "@playwright/test";

const testUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  is_guest: false,
};

const testBoards = [
  {
    id: "1",
    title: "Project Alpha",
    is_active: true,
    member_count: 3,
    is_user_owner: true,
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-15T14:30:00Z",
  },
  {
    id: "2",
    title: "Sprint Board",
    is_active: true,
    member_count: 2,
    is_user_owner: false,
    created_at: "2025-02-01T08:00:00Z",
    updated_at: "2025-02-10T16:00:00Z",
  },
];

const testBoardDetail = {
  id: "1",
  title: "Project Alpha",
  description: "Main project board",
  members: [{ id: "1", username: "testuser", first_name: "Test", last_name: "User" }],
  owner: "testuser",
  is_active: true,
  created_at: "2025-01-01T10:00:00Z",
  updated_at: "2025-01-15T14:30:00Z",
  columns: [
    {
      id: "1",
      name: "To Do",
      position: 0,
      wip_limit: null,
      created_at: "2025-01-01T10:00:00Z",
      updated_at: "2025-01-01T10:00:00Z",
      tasks: [
        {
          id: "1",
          title: "Setup project",
          description: "Initial setup",
          assignee: null,
          position: 0,
          column: 1,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
        },
      ],
    },
    {
      id: "2",
      name: "In Progress",
      position: 1,
      wip_limit: null,
      created_at: "2025-01-01T10:00:00Z",
      updated_at: "2025-01-01T10:00:00Z",
      tasks: [],
    },
  ],
};

const testProfile = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  first_name: "Test",
  last_name: "User",
  tele_number: "+49123456789",
  bio: "A test user profile",
};

const testContacts = [
  { id: 2, username: "contact1", email: "contact1@example.com" },
  { id: 3, username: "contact2", email: "contact2@example.com" },
];

export async function mockAuthenticatedAPI(page: Page) {
  // Auth endpoints
  await page.route("**/api/login/", async (route) => {
    await route.fulfill({ status: 200, json: {} });
  });

  await page.route("**/api/guest-login/", async (route) => {
    await route.fulfill({ status: 200, json: {} });
  });

  await page.route("**/api/logout/", async (route) => {
    await route.fulfill({ status: 200, json: {} });
  });

  await page.route("**/api/auth/status/", async (route) => {
    await route.fulfill({
      status: 200,
      json: { is_authenticated: true, user: testUser },
    });
  });

  await page.route("**/api/token/refresh/", async (route) => {
    await route.fulfill({ status: 200, json: {} });
  });

  await page.route("**/api/password/change/", async (route) => {
    await route.fulfill({ status: 200, json: {} });
  });

  // Board endpoints
  await page.route("**/api/boards/", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        json: {
          ...testBoardDetail,
          ...body,
          id: "99",
          columns: [],
        },
      });
    } else {
      await route.fulfill({ status: 200, json: testBoards });
    }
  });

  await page.route("**/api/boards/*/", async (route) => {
    const method = route.request().method();
    if (method === "DELETE") {
      await route.fulfill({ status: 204 });
    } else if (method === "PATCH") {
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        json: { ...testBoardDetail, ...body },
      });
    } else {
      await route.fulfill({ status: 200, json: testBoardDetail });
    }
  });

  // Column endpoints
  await page.route("**/api/boards/*/columns/", async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      json: {
        id: "99",
        name: body.name,
        position: 0,
        wip_limit: null,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: "2025-01-01T10:00:00Z",
        tasks: [],
      },
    });
  });

  await page.route("**/api/columns/*/", async (route) => {
    const method = route.request().method();
    if (method === "DELETE") {
      await route.fulfill({ status: 204 });
    } else if (method === "PATCH") {
      await route.fulfill({
        status: 200,
        json: { id: "1", name: "Updated", position: 0, wip_limit: null, tasks: [] },
      });
    } else {
      await route.fulfill({
        status: 200,
        json: { id: "1", name: "To Do", position: 0, wip_limit: null, tasks: [] },
      });
    }
  });

  // Task endpoints
  await page.route("**/api/columns/*/tasks/", async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      json: {
        id: "99",
        title: body.title,
        description: body.description || null,
        assignee: body.assignee || null,
        position: 0,
        column: 1,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: "2025-01-01T10:00:00Z",
      },
    });
  });

  await page.route("**/api/tasks/*/", async (route) => {
    const method = route.request().method();
    if (method === "DELETE") {
      await route.fulfill({ status: 204 });
    } else if (method === "PATCH") {
      await route.fulfill({
        status: 200,
        json: { id: "1", title: "Updated Task", description: null, assignee: null, position: 0, column: 1 },
      });
    } else {
      await route.fulfill({
        status: 200,
        json: testBoardDetail.columns[0].tasks[0],
      });
    }
  });

  // Profile endpoint
  await page.route("**/api/profile/", async (route) => {
    if (route.request().method() === "PATCH") {
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        json: { ...testProfile, ...body },
      });
    } else {
      await route.fulfill({ status: 200, json: testProfile });
    }
  });

  // User endpoints
  await page.route("**/api/users/?search=*", async (route) => {
    await route.fulfill({
      status: 200,
      json: [{ id: 5, username: "searchresult", email: "search@test.com" }],
    });
  });

  await page.route("**/api/users/*/add-contact/", async (route) => {
    await route.fulfill({ status: 201, json: {} });
  });

  await page.route("**/api/users/*/", async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        id: 2,
        username: "contact1",
        email: "contact1@example.com",
        first_name: "Contact",
        last_name: "One",
        tele_number: "+49111111111",
        bio: "A contact",
      },
    });
  });

  // Contact endpoints
  await page.route("**/api/contacts/", async (route) => {
    await route.fulfill({ status: 200, json: testContacts });
  });

  await page.route("**/api/contacts/*/", async (route) => {
    await route.fulfill({ status: 204 });
  });
}

export async function mockUnauthenticatedAPI(page: Page) {
  await page.route("**/api/auth/status/", async (route) => {
    await route.fulfill({
      status: 200,
      json: { is_authenticated: false, user: null },
    });
  });

  await page.route("**/api/token/refresh/", async (route) => {
    await route.fulfill({ status: 401, json: { detail: "Token expired" } });
  });
}

export async function mockLoginFailure(page: Page) {
  await page.route("**/api/login/", async (route) => {
    await route.fulfill({
      status: 401,
      json: { detail: "Invalid credentials" },
    });
  });

  await page.route("**/api/auth/status/", async (route) => {
    await route.fulfill({
      status: 401,
      json: { detail: "Not authenticated" },
    });
  });
}
