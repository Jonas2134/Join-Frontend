export const API_BASE_URL = import.meta.env.VITE_API_URL;

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