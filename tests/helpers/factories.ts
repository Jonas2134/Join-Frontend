import type { AuthUser, AuthStatusResponse } from "../../src/core/types/auth.types";
import type { Board, Boards, Column, Task, Member } from "../../src/core/types/board.types";
import type { Profile } from "../../src/core/types/profile.types";
import type { Contact, UserDetail } from "../../src/core/types/contact.types";

export function createAuthUser(overrides?: Partial<AuthUser>): AuthUser {
  return {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    is_guest: false,
    ...overrides,
  };
}

export function createAuthStatusResponse(
  overrides?: Partial<AuthStatusResponse>,
): AuthStatusResponse {
  return {
    is_authenticated: true,
    user: createAuthUser(),
    ...overrides,
  };
}

export function createBoards(overrides?: Partial<Boards>): Boards {
  return {
    id: "1",
    title: "Test Board",
    is_active: true,
    member_count: 2,
    is_user_owner: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

export function createMember(overrides?: Partial<Member>): Member {
  return {
    id: "1",
    username: "member1",
    first_name: "Test",
    last_name: "Member",
    ...overrides,
  };
}

export function createBoard(overrides?: Partial<Board>): Board {
  return {
    id: "1",
    title: "Test Board",
    description: "A test board",
    members: [createMember()],
    owner: "testuser",
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    columns: [],
    ...overrides,
  };
}

export function createColumn(overrides?: Partial<Column>): Column {
  return {
    id: "1",
    name: "To Do",
    position: 0,
    wip_limit: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    tasks: [],
    ...overrides,
  };
}

export function createTask(overrides?: Partial<Task>): Task {
  return {
    id: "1",
    title: "Test Task",
    description: "A test task",
    assignee: null,
    position: 0,
    column: 1,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

export function createProfile(overrides?: Partial<Profile>): Profile {
  return {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    tele_number: "+49123456789",
    bio: "A test user",
    ...overrides,
  };
}

export function createContact(overrides?: Partial<Contact>): Contact {
  return {
    id: 1,
    username: "contact1",
    email: "contact1@example.com",
    ...overrides,
  };
}

export function createUserDetail(overrides?: Partial<UserDetail>): UserDetail {
  return {
    id: 1,
    username: "contact1",
    email: "contact1@example.com",
    first_name: "Contact",
    last_name: "One",
    tele_number: "+49111111111",
    bio: "A test contact",
    ...overrides,
  };
}
