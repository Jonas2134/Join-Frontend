import ListViewIcon from "../../assets/icons/list-view.svg?raw";
import GridViewIcon from "../../assets/icons/grid-view.svg?raw";

export type ViewMode = "list" | "card";

interface ViewToggleOptions {
  name: string;
  currentView: ViewMode;
}

export class ViewToggle {
  private name: string;
  private currentView: ViewMode;

  constructor(options: ViewToggleOptions) {
    this.name = options.name;
    this.currentView = options.currentView;
  }

  private renderRadioInput(id: string, value: string) {
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = this.name;
    radioInput.id = id;
    radioInput.value = value;
    radioInput.classList.add("sr-only");
    if (this.currentView === value) radioInput.checked = true;
    return radioInput;
  }

  private renderInputLabel(labelFor: string, labelTitle: string, icon: string) {
    const label = document.createElement("label");
    label.htmlFor = labelFor;
    label.title = labelTitle;
    label.classList.add("view-toggle-label");
    label.innerHTML = icon;
    return label;
  }

  render() {
    const fieldset = document.createElement("fieldset");
    fieldset.id = "viewToggle";
    fieldset.classList.add("view-toggle");

    const legend = document.createElement("legend");
    legend.classList.add("sr-only");
    legend.textContent = "View mode";

    const listInput = this.renderRadioInput("viewList", "list");
    const listLabel = this.renderInputLabel("viewList", "List view", ListViewIcon);
    const cardInput = this.renderRadioInput("viewCard", "card");
    const cardLabel = this.renderInputLabel("viewCard", "Card view", GridViewIcon);

    fieldset.append(legend, listInput, listLabel, cardInput, cardLabel);
    return fieldset;
  }
}
