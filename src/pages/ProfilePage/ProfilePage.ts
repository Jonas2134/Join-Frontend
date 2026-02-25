import { BasePage } from "../../components/bases/BasePage";
import { AppLayout } from "../../layouts/AppLayout";
import { profileStore } from "../../core/store/ProfileStore";
import { ProfilePageController } from "./ProfilePageController";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { showChangePasswordBtn } from "../../core/constants/profileBtns.config";

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

  render() {
    const container = document.createElement("div");
    container.id = "profilePage";
    container.classList.add("profile-page");

    container.append(
      this.renderProfileHeader(),
      this.renderProfileSection(),
    );

    return this.wrapWithLayout(container);
  }

  // ============================================
  // Header render
  // ============================================

  renderProfileHeaderInfoContainer(username: string, email: string) {
    const info = document.createElement("div");
    info.classList.add("profile-user-info");

    const nameEl = document.createElement("span");
    nameEl.classList.add("profile-username");
    nameEl.textContent = username;

    const emailEl = document.createElement("span");
    emailEl.classList.add("profile-email");
    emailEl.textContent = email;

    info.append(nameEl, emailEl);
    return info;
  }

  updateProfileHeader(header: HTMLElement, profile: Profile) {
    const infoWrapper = document.createElement("div");
    infoWrapper.classList.add("profile-info-wrapper");

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
    console.log(profileStore.profile);
    this.updateProfileUI();
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  mount() {
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
