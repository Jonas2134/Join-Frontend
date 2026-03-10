import { Avatar } from "../../../components/common/Avatar";
import { Button } from "../../../components/common/Button";
import { editBoardBtn, moreIndicator } from "../../../core/constants/appBoardBtns.config";
import type { Board } from "../../../core/types/board.types";
import ToggleIcon from "../../../assets/icons/ToggleIcon.svg?raw";

export class BoardHeaderRenderer {
  renderHeaderContent(header: HTMLElement, board: Board, currentUserId?: number) {
    if (!board.is_active) {
      header.appendChild(this.renderArchivedBanner());
    }

    const details = document.createElement("details");
    details.classList.add("group");

    const summary = this.renderHeaderSummary(board);
    const detailsContent = this.renderDetailsContent(board, currentUserId);

    details.append(summary, detailsContent);
    header.appendChild(details);
  }

  private renderArchivedBanner(): HTMLElement {
    const banner = document.createElement("div");
    banner.classList.add("archived-banner");
    banner.textContent = "This board is archived. Editing is disabled.";
    return banner;
  }

  renderHeaderSummary(board: Board) {
    const summary = document.createElement("summary");
    summary.classList.add("detail-header-summary");

    const title = document.createElement("h3");
    title.classList.add("detail-header-summary-headline");
    title.textContent = board.title;

    const toggleIcon = document.createElement("span");
    toggleIcon.classList.add("detail-header-summary-icon");
    toggleIcon.innerHTML = ToggleIcon;

    summary.append(title, toggleIcon);
    return summary;
  }

  renderDetailsDescriptionSection(board: Board) {
    const descriptionSection = document.createElement("section");

    const descriptionTitle = document.createElement("h4");
    descriptionTitle.classList.add("detail-content-headline");
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
    membersTitle.classList.add("detail-content-headline");
    membersTitle.textContent = "Members";

    const membersList = this.renderMemberList(board);

    membersSection.append(membersTitle, membersList);
    return membersSection;
  }

  renderMemberList(board: Board) {
    const membersList = document.createElement("ul");
    membersList.classList.add("detail-list");

    const maxVisibleMembers = 5;
    const sortedMembers = [...board.members].sort((a, b) => {
      if (a.id === board.owner) return -1;
      if (b.id === board.owner) return 1;
      return 0;
    });
    const visibleMembers = sortedMembers.slice(0, maxVisibleMembers);
    const remainingCount = board.members.length - maxVisibleMembers;

    for (const member of visibleMembers) {
      const isOwner = member.id === board.owner;
      membersList.appendChild(this.renderMemberListItem(member, isOwner));
    }

    if (remainingCount > 0) {
      membersList.appendChild(this.renderOverflowIndicator(remainingCount));
    }

    return membersList;
  }

  private renderMemberListItem(
    member: Board["members"][number],
    isOwner: boolean,
  ): HTMLElement {
    const listItem = document.createElement("li");
    const avatar = new Avatar({ size: "lg", isOwner });
    listItem.appendChild(avatar.createAvatar(member.username));
    return listItem;
  }

  private renderOverflowIndicator(count: number): HTMLElement {
    const listItem = document.createElement("li");
    const btn = new Button({
      ...moreIndicator,
      text: `+${count}`,
    }).renderBtn();
    listItem.appendChild(btn);
    return listItem;
  }

  private isCurrentUserOwner(board: Board, currentUserId?: number): boolean {
    return currentUserId !== undefined && String(currentUserId) === String(board.owner);
  }

  renderDetailsContent(board: Board, currentUserId?: number) {
    const detailsContent = document.createElement("main");
    detailsContent.classList.add("detail-main");

    const descriptionSection = this.renderDetailsDescriptionSection(board);
    const membersSection = this.renderDetailsMembersSection(board);

    detailsContent.append(descriptionSection, membersSection);

    if (board.is_active && this.isCurrentUserOwner(board, currentUserId)) {
      const editBtn = new Button(editBoardBtn).renderBtn();
      detailsContent.append(editBtn);
    }

    return detailsContent;
  }
}
