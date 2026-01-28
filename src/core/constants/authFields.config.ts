import User from "../../assets/icons/user.svg?raw";
import Email from "../../assets/icons/email.svg?raw";
import LockOn from "../../assets/icons/lock-on.svg?raw";

export const signupFields = [
  {
    label: "Enter your Username:",
    name: "username",
    type: "text" as const,
    placeholder: "Username",
    icon: User,
    autocomplete: "username" as const,
  },
  {
    label: "Enter your Email:",
    name: "email",
    type: "email" as const,
    placeholder: "Email",
    icon: Email,
    autocomplete: "email" as const,
  },
  {
    label: "Enter your Password:",
    name: "password",
    type: "password" as const,
    placeholder: "Password",
    icon: LockOn,
    autocomplete: "new-password" as const,
  },
  {
    label: "Repeat your Password:",
    name: "confpassword",
    type: "password" as const,
    placeholder: "Confirm Password",
    icon: LockOn,
    autocomplete: "new-password" as const,
  },
];

export const loginFields = [
  {
    label: "Enter your Username:",
    name: "username",
    type: "text" as const,
    placeholder: "Username",
    icon: User,
    autocomplete: "username" as const,
  },
  {
    label: "Enter your Password:",
    name: "password",
    type: "password" as const,
    placeholder: "Password",
    icon: LockOn,
    autocomplete: "current-password" as const,
  },
];
