export const editBoardDialogFields = [
  {
    type: "input" as const,
    config: {
      label: "Edit Board Title:",
      name: "title",
      type: "text" as const,
      placeholder: "New Title",
      className: "input-b-border",
      required: true,
    },
  },
  {
    type: "textarea" as const,
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
