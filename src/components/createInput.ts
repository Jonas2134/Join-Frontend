export interface InputOptions {
  id: string;
  type?: string;
  label: string;
  svgIcon?: string;
}

export function createInput({
  id,
  type = "text",
  label,
  svgIcon,
}: InputOptions) {
  const wrapper = document.createElement("div");
  wrapper.className = "relative mb-6";

  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.placeholder = " ";
  input.className = "peer w-full border-b border-(--color-light-gray) placeholder-transparent focus:outline-none focus:ring-0";

  const lbl = document.createElement("label");
  lbl.htmlFor = id;
  lbl.textContent = label;
  lbl.className = "absolute left-0 top-1/2 transform -translate-y-1/2 text-(--color-paceholder-gray) text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600";
  lbl.style.pointerEvents = "none";

  wrapper.appendChild(input);
  wrapper.appendChild(lbl);

  const style = document.createElement("style");
  style.textContent = `
    #${id}:not(:placeholder-shown) + label {
      top: 0;
      font-size: 0.75rem; /* text-xs */
      color: #2563eb;     /* text-blue-600 */
    }
  `;
  wrapper.appendChild(style);

  if (svgIcon) {
    const iconWrap = document.createElement("span");
    iconWrap.className = "absolute right-0 top-1/2 transform -translate-y-1/2 p-2";
    iconWrap.style.pointerEvents = "none";
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.innerHTML = svgIcon;
    input.style.paddingRight = "2.5rem";
    wrapper.appendChild(iconWrap);
  }

  return wrapper;
}
