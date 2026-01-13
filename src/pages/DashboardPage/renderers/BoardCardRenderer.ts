import type { Board } from "../../../core/types/board.types";

export class BoardCard {
  private element!: HTMLButtonElement;
  private board: Board;
  private onClick;

  constructor(board: Board, onClick: () => void) {
    this.board = board;
    this.onClick = onClick;
    this.element = document.createElement('button');
  }

  render() {
    this.element.classList.add(
      'p-4', 'rounded-2xl', 'shadow-sm', 'hover:shadow-md',
      'transition-shadow', 'border', 'border-gray-200', 'bg-white',
      'text-left'
    );
    this.element.innerHTML = `
      <h3 class="font-semibold text-lg text-gray-800">${this.board.title}</h3>
    `;

    this.element.addEventListener('click', this.onClick);
    return this.element;
  }
}
