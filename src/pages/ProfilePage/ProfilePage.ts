import { BasePage } from "../../components/bases/BasePage";
import { AppLayout } from "../../layouts/AppLayout";
import { authStore } from "../../core/store/AuthStore";
import { profileStore } from "../../core/store/ProfileStore";
import { ProfileInfoRenderer } from "./renderers/ProfileInfoRenderer";
import { ProfilePasswordRenderer } from "./renderers/ProfilePasswordRenderer";
import { ProfilePageController } from "./ProfilePageController";

export class ProfilePage extends BasePage {
  private infoRenderer = new ProfileInfoRenderer();
  private passwordRenderer = new ProfilePasswordRenderer();
  private controller = new ProfilePageController();

  constructor() {
    super(new AppLayout());
  }

  // ============================================
  // Base render
  // ============================================

  render() {
    const container = document.createElement("div");
    container.id = "profilePage";
    container.classList.add("profile-page");

    const user = authStore.currentUser;
    const username = user?.username ?? "User";
    const email = user?.email ?? "";

    container.append(
      this.infoRenderer.renderProfileHeader(username, email),
      this.infoRenderer.renderProfileForm(),
      this.passwordRenderer.renderPasswordSection(),
    );

    return this.wrapWithLayout(container);
  }

  // ============================================
  // Lifecycle
  // ============================================

  private async initLoadProfile() {
    await profileStore.loadProfile();
    console.log(profileStore.profile);
    const profile = profileStore.profile;
    if (profile) {
      this.infoRenderer.updateProfileHeader(profile.username, profile.email);
      this.controller.populateFormFields();
    }
  }

  // ============================================
  // Mount Eventlistener
  // ============================================

  mount() {
    this.initLoadProfile();

    const pageroot = document.getElementById("profilePage");
    if (!pageroot) throw new Error("ProfilePage not found!");

    this.events.on(pageroot, "click", (e: Event) => this.controller.registerEditToggleListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.controller.registerCancelEditListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.controller.registerShowPasswordSectionListener(e));
    this.events.on(pageroot, "click", (e: Event) => this.controller.registerCancelPasswordSectionListener(e));

    const profileForm = document.getElementById("profileForm") as HTMLFormElement;
    if (profileForm) {
      this.events.on(profileForm, "submit", (e: Event) => this.controller.registerSaveProfileListener(e));
    }

    const passwordForm = document.getElementById("changePasswordForm") as HTMLFormElement;
    if (passwordForm) {
      this.events.on(passwordForm, "submit", (e: Event) => this.controller.registerChangePasswordListener(e));
    }

    this.events.on(window, "profile:updated", () => this.initLoadProfile());
  }
}
