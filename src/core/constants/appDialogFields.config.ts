export const editBoardDialogFields = [
  {
    type: "input" as const,
    value: "title" as const,
    config: {
      label: "Edit Board Title:",
      name: "title",
      type: "text" as const,
      placeholder: "New Title",
      className: "input-b-border",
      required: false,
    },
  },
  {
    type: "textarea" as const,
    value: "description" as const,
    config: {
      label: "Edit Board description:",
      name: "description",
      placeholder: "Write New description.",
      className: "input-b-border",
      rows: 5,
      maxLength: 500,
      required: false,
    },
  },
];

export const editTaskDialogFields = [
  {
    type: "input" as const,
    value: "title" as const,
    config: {
      label: "Task Title:",
      name: "title",
      type: "text" as const,
      placeholder: "Title",
      className: "input-b-border",
      required: false,
    },
  },
  {
    type: "textarea" as const,
    value: "description" as const,
    config: {
      label: "Task description:",
      name: "description",
      placeholder: "Write your description.",
      className: "input-b-border",
      rows: 5,
      maxLength: 500,
      required: false,
    },
  },
];
