import User from "../../assets/icons/user.svg?raw";
import Textareaicon from "../../assets/icons/textarea.svg?raw";

export const dashboardFields = [
  {
    type: 'input' as const,
    config: {
      label: "Board Title:",
      name: "title",
      type: "text" as const,
      placeholder: "Title",
      className: "input-b-border",
      icon: User,
      required: true,
    }
  },
  {
    type: 'textarea' as const,
    config: {
      label: "Board description:",
      name: "description",
      placeholder: "Write your description.",
      icon: Textareaicon,
      className: "input-b-border",
      rows: 5,
      maxLength: 500,
      required: true,
    }
  }
];
