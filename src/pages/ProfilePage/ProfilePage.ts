import { BasePage } from "../../components/bases/BasePage";
import { AppLayout } from "../../layouts/AppLayout";
import { profileStore } from "../../core/store/ProfileStore";
import { ProfilePageController } from "./ProfilePageController";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { showChangePasswordBtn } from "../../core/constants/profileBtns.config";
import { isGuest } from "../../core/store/AuthStore";

import type { Profile } from "../../core/types/profile.types";

export class ProfilePage extends BasePage {
  private eventController = new ProfilePageController();

  constructor() {
    super(new AppLayout());
  }

  // ============================================
  // Base render
  // ============================================

  renderProfileHeader(): HTMLElement {
    const header = document.createElement("header");
    header.id = "profileHeader";
    header.classList.add("profile-header");
    return header;
  }

  renderProfileSection(): HTMLElement {
    const section = document.createElement("section");
    section.id = "profileSection";
    section.classList.add("profile-section");
    return section;
  }

  private renderGuestRestriction(): HTMLElement {
    const hintContainer = document.createElement("div");

    const hintTitle = document.createElement("h2");
    hintTitle.classList.add("text-(--color-light-blue)", "underline");
    hintTitle.textContent = "Profile";

    const hint = document.createElement("span");
    hint.classList.add("profile-guest-hint");
    hint.textContent = "You can only show, edit your profile or change your password as a registered user.";

    hintContainer.append(hintTitle, hint);
    return hintContainer;
  }

  render() {
    const container = document.createElement("div");
    container.id = "profilePage";
    container.classList.add("space-y-8");

    if (isGuest()) {
      container.append(this.renderGuestRestriction());
    } else {
      container.append(
        this.renderProfileHeader(),
        this.renderProfileSection(),
      );
    }

    return this.wrapWithLayout(container);
  }

  // ============================================
  // Header render
  // ============================================

  renderProfileHeaderInfoContainer(username: string, email: string) {
    const info = document.createElement("div");
    info.classList.add("flex", "flex-col", "gap-1");

    const nameEl = document.createElement("span");
    nameEl.classList.add("text-2xl", "font-bold", "text-(--color-dark-blue)");
    nameEl.textContent = username;

    const emailEl = document.createElement("span");
    emailEl.classList.add("text-sm", "text-(--color-blue-gray)");
    emailEl.textContent = email;

    info.append(nameEl, emailEl);
    return info;
  }

  updateProfileHeader(header: HTMLElement, profile: Profile) {
    const infoWrapper = document.createElement("div");
    infoWrapper.classList.add("profile-header-info");

    const avatar = new Avatar({ size: "lg" }).createAvatar(profile.username);
    const info = this.renderProfileHeaderInfoContainer(
      profile.username,
      profile.email
    );

    const changePasswordBtn = new Button(showChangePasswordBtn).renderBtn();

    infoWrapper.append(avatar, info);
    header.append(infoWrapper, changePasswordBtn);
  }

  // ============================================
  // Lifecycle
  // ============================================

  updateProfileUI() {
    const header = document.getElementById("profileHeader");
    const profile = profileStore.profile;
    if (!header || !profile) return;

    header.innerHTML = "";

    this.updateProfileHeader(header, profile);
    this.eventController.rerenderProfileSection();
  }

  private async initLoadProfile() {
    await profileStore.loadProfile();
    this.updateProfileUI();
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  mount() {
    if (isGuest()) return;

    this.initLoadProfile();

    const pageroot = document.getElementById("profilePage");
    if (!pageroot) throw new Error("ProfilePage not found!");

    this.events.on(pageroot, "click", (e: Event) => this.eventController.registerEditToggleListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventController.registerCancelEditListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventController.registerShowPasswordSectionListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.eventController.registerCancelPasswordSectionListener(e));

    this.events.on(pageroot, "submit", (e: Event) => this.eventController.registerSaveProfileListener(e));
    this.events.on(pageroot, "submit", (e: Event) => this.eventController.registerChangePasswordListener(e));

    this.events.on(window, "profile:updated", () => this.initLoadProfile());
  }
}
