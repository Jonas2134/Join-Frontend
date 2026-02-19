import type { Boards } from "../../../../core/types/board.types";

interface StatCard {
  label: string;
  value: number;
}

export class DashboardStatsRenderer {

  renderStats(boards: Boards[]): HTMLElement {
    const section = document.createElement("section");
    section.id = "dashboardStats";
    section.classList.add("stats-grid");

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
      section.appendChild(this.renderCard(card));
    });

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
