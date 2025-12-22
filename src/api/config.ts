export const API_BASE_URL = "http://localhost:8000/api";

export const API_ROUTES = {
  auth: {
    login: "/login/",
    register: "/register/",
    logout: "/logout/",
    refresh: "/token/refresh/",
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
} as const;