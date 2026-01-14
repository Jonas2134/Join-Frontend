import type { Board } from "../../../core/types/board.types";
import ToggleIcon from "../../../assets/icons/ToggleIcon.svg?raw";
import EditIcon from "../../../assets/icons/edit.svg?raw";

export class BoardHeaderRenderer {
  renderHeaderContent(header: HTMLElement, board: Board) {
    const details = document.createElement("details");
    details.classList.add("group");

    const summary = this.renderHeaderSummary(board);
    const detailsContent = this.renderDetailsContent(board);

    details.append(summary, detailsContent);
    header.appendChild(details);
  }

  renderHeaderSummary(board: Board) {
    const summary = document.createElement("summary");
    summary.classList.add(
      "flex",
      "items-center",
      "justify-between",
      "cursor-pointer",
      "list-none"
    );

    const title = document.createElement("h3");
    title.classList.add(
      "text-(--color-light-blue)",
      "font-semibold",
      "underline"
    );
    title.textContent = board.title;

    const toggleIcon = document.createElement("span");
    toggleIcon.innerHTML = ToggleIcon;

    summary.append(title, toggleIcon);
    return summary;
  }

  renderDetailsDescriptionSection(board: Board) {
    const descriptionSection = document.createElement("section");

    const descriptionTitle = document.createElement("h4");
    descriptionTitle.classList.add(
      "text-(--color-placeholder-gray)",
      "font-semibold",
      "underline",
      "mb-1"
    );
    descriptionTitle.textContent = "Description";

    const descriptionText = document.createElement("p");
    descriptionText.classList.add("max-w-2xs");
    descriptionText.textContent = board.description || "No description";

    descriptionSection.append(descriptionTitle, descriptionText);
    return descriptionSection;
  }

  renderDetailsMembersSection(board: Board) {
    const membersSection = document.createElement("section");

    const membersTitle = document.createElement("h4");
    membersTitle.classList.add(
      "text-(--color-placeholder-gray)",
      "font-semibold",
      "underline",
      "mb-1"
    );
    membersTitle.textContent = "Members";

    const membersList = document.createElement("ul");
    membersList.classList.add("list-disc", "list-inside");

    for (const member of board.members) {
      const memberItem = document.createElement("li");
      memberItem.textContent = member.username;
      membersList.appendChild(memberItem);
    }

    membersSection.append(membersTitle, membersList);
    return membersSection;
  }

  renderEditButton() {
    const editButton = document.createElement("button");
    editButton.id = "changeBoardBtn";
    editButton.classList.add("cursor-pointer", "p-2", "rounded");
    editButton.title = "Edit board";
    editButton.innerHTML = EditIcon;
    return editButton;
  }

  renderDetailsContent(board: Board) {
    const detailsContent = document.createElement("main");
    detailsContent.classList.add(
      "flex",
      "items-start",
      "justify-between",
      "mt-4",
      "px-3"
    );

    const descriptionSection = this.renderDetailsDescriptionSection(board);
    const membersSection = this.renderDetailsMembersSection(board);
    const editBtn = this.renderEditButton();

    detailsContent.append(descriptionSection, membersSection, editBtn);
    return detailsContent;
  }
}
