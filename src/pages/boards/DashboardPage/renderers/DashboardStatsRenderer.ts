import { authStore } from "../../../../core/store/AuthStore";
import type { Boards } from "../../../../core/types/board.types";

interface StatCard {
  label: string;
  value: number;
}

export class DashboardStatsRenderer {

  private getTimeOfDayGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    return "Good evening";
  }

  private renderGreeting(): HTMLElement | null {
    const user = authStore.currentUser;
    if (!user) return null;

    const greeting = document.createElement("div");
    greeting.classList.add("dashboard-greeting");

    if (user.is_guest) {
      greeting.textContent = "Welcome, Guest!";
    } else {
      const greetText = document.createElement("span");
      greetText.classList.add("greet-text");
      greetText.textContent = this.getTimeOfDayGreeting();

      const username = document.createElement("span");
      username.textContent = user.username;

      greeting.append(greetText, ", ", username);
    }

    return greeting;
  }

  renderStats(boards: Boards[]): HTMLElement {
    const section = document.createElement("section");
    section.id = "dashboardStats";

    const greeting = this.renderGreeting();
    if (greeting) section.appendChild(greeting);

    const grid = document.createElement("div");
    grid.classList.add("stats-grid");

    const active = boards.filter((b) => b.is_active);
    const archived = boards.filter((b) => !b.is_active);
    const owner = active.filter((b) => b.is_user_owner);
    const member = active.filter((b) => !b.is_user_owner);

    const cards: StatCard[] = [
      { label: "Active Boards", value: active.length },
      { label: "As Owner", value: owner.length },
      { label: "As Member", value: member.length },
      { label: "Archived", value: archived.length },
    ];

    cards.forEach((card) => {
      grid.appendChild(this.renderCard(card));
    });

    section.appendChild(grid);
    return section;
  }

  private renderCard(card: StatCard): HTMLElement {
    const el = document.createElement("div");
    el.classList.add("stat-card");
    el.innerHTML = `
      <span class="stat-value">${card.value}</span>
      <span class="stat-label">${card.label}</span>
    `;
    return el;
  }
}
