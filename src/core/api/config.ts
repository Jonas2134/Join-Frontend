export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ROUTES = {
  auth: {
    login: "/login/",
    register: "/register/",
    logout: "/logout/",
    refresh: "/token/refresh/",
    guestLogin: "/guest-login/",
    status: "/auth/status/",
    passwordChange: "/password/change/",
  },
  boards: {
    list: "/boards/",
    detail: (id: string) => `/boards/${id}/`,
  },
  columns: {
    list: (boardId: string) => `/boards/${boardId}/columns/`,
    detail: (columnId: string) => `/columns/${columnId}/`,
  },
  tasks: {
    list: (columnId: string) => `/columns/${columnId}/tasks/`,
    detail: (taskId: string) => `/tasks/${taskId}/`,
  },
  profile: "/profile/",
  users: {
    list: "/users/",
    addContact: (userId: string) => `/users/${userId}/add-contact/`,
  },
  contacts: {
    list: "/contacts/",
    detail: (userId: string) => `/contacts/${userId}/`,
  },
} as const;