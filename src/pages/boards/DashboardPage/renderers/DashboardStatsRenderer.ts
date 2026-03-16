import type { AuthUser } from "../../../../core/types/auth.types";
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

  private renderGreeting(currentUser: AuthUser | null): HTMLElement | null {
    const user = currentUser;
    if (!user) return null;

    const greeting = document.createElement("div");
    greeting.classList.add("text-xl", "text-center", "text-(--color-blue-gray)", "pb-2");

    if (user.is_guest) {
      greeting.textContent = "Welcome, Guest!";
    } else {
      const greetText = document.createElement("span");
      greetText.classList.add("text-3xl", "text-(--color-dark-blue)");
      greetText.textContent = this.getTimeOfDayGreeting();

      const username = document.createElement("span");
      username.textContent = user.username;

      greeting.append(greetText, ", ", username);
    }

    return greeting;
  }

  renderStats(boards: Boards[], currentUser: AuthUser | null): HTMLElement {
    const section = document.createElement("section");
    section.id = "dashboardStats";

    const greeting = this.renderGreeting(currentUser);
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
      <span class="text-3xl font-bold text-(--color-light-blue)">${card.value}</span>
      <span class="text-sm text-(--color-blue-gray)">${card.label}</span>
    `;
    return el;
  }
}
