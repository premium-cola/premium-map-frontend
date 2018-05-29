import { Component, Input, Output, EventEmitter } from "@angular/core";

export interface SelectItem {
  id: string;
  name: string;
  value: boolean;
  icon?: string;
}

@Component({
  selector: "app-dropdown-component",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"]
})
export class DropdownComponent {
  @Output() selectItemValueChanged = new EventEmitter<SelectItem>();

  @Input() selectMessage;
  @Input()
  public selectItems: {
    [id: string]: SelectItem;
  };
  public isDropdown = false;

  public getSelectItems(): SelectItem[] {
    return Object.keys(this.selectItems).map(id => this.selectItems[id]);
  }

  public openDropdown() {
    this.isDropdown = !this.isDropdown;
  }

  public toggleProperty(id: string) {
    this.selectItems[id].value = !this.selectItems[id].value;
    this.selectItemValueChanged.emit(this.selectItems[id]);
  }
}
