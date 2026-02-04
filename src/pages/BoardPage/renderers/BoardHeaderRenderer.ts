import { Avatar } from "../../../components/common/Avatar";
import { Button } from "../../../components/common/Button";
import { editBoardBtn, moreIndicator } from "../../../core/constants/appBoardBtns.config";
import type { Board } from "../../../core/types/board.types";
import ToggleIcon from "../../../assets/icons/ToggleIcon.svg?raw";

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

    visibleMembers.forEach((member) => {
      const listItem = document.createElement("li");
      const isOwner = member.id === board.owner;
      const avatar = new Avatar({ size: "lg", isOwner });
      listItem.appendChild(avatar.createAvatar(member.username));
      membersList.appendChild(listItem);
    });

    if (remainingCount > 0) {
      const listItem = document.createElement("li");
      const moreIndicatorBtn = new Button({...moreIndicator, text: `+${remainingCount}`}).renderBtn();
      listItem.appendChild(moreIndicatorBtn);
      membersList.appendChild(listItem);
    }
    return membersList;
  }

  renderDetailsContent(board: Board) {
    const detailsContent = document.createElement("main");
    detailsContent.classList.add("detail-main");

    const descriptionSection = this.renderDetailsDescriptionSection(board);
    const membersSection = this.renderDetailsMembersSection(board);
    const editBtn = new Button(editBoardBtn).renderBtn();

    detailsContent.append(descriptionSection, membersSection, editBtn);
    return detailsContent;
  }
}
