export const columnRenameField = {
  value: "name" as const,
  config: {
    label: "Rename column:",
    name: "column-rename",
    type: "text" as const,
    placeholder: "New column name",
    required: true,
  },
};

export const columnLimitField = {
  value: "wip_limit" as const,
  config: {
    label: "Set Task Limit:",
    name: "task-limit",
    type: "number" as const,
    placeholder: "Task limit",
    required: true,
  },
};

export const addColumnField = {
  label: "Column Name:",
  name: "columnName",
  type: "text" as const,
  placeholder: "Enter column name...",
  required: true,
};

export const createTaskFields = [
  {
    type: "input" as const,
    config: {
      label: "Task Title:",
      name: "title",
      type: "text" as const,
      placeholder: "Title",
      className: "input-b-border",
      required: true,
    },
  },
  {
    type: "textarea" as const,
    config: {
      label: "Task description:",
      name: "description",
      placeholder: "Write your description.",
      className: "input-b-border",
      rows: 5,
      maxLength: 500,
      required: true,
    },
  },
];
