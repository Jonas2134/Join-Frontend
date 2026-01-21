interface AvatarRenderOptions {
  size?: "sm" | "md" | "lg";
  isOwner?: boolean;
}

export class Avatar {
  avatar: HTMLButtonElement;
  size: "sm" | "md" | "lg";
  isOwner: boolean;

  private sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  };

  constructor(options: AvatarRenderOptions = {}) {
    this.size = options.size || "md";
    this.isOwner = options.isOwner || false;
    this.avatar = document.createElement("button");
    this.avatar.type = "button";
    this.avatar.classList.add("round-base-btn");
    this.avatar.classList.add(...this.sizeClasses[this.size].split(" "));
    if (this.isOwner) this.avatar.classList.add("avatar-owner");
    else this.avatar.classList.add("avatar-normal");
  }

  createAvatar(value: string) {
    this.avatar.title = value;
    this.avatar.textContent = this.getInitials(value);
    return this.avatar;
  }

  private getInitials(username: string): string {
    return username
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
}
