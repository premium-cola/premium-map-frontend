import { Component, Input } from "@angular/core";

@Component({
  selector: "app-dropdown-component",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"]
})
export class DropdownComponent {
  @Input()
  public selectItems: { [id: string]: { name: string; value: boolean } };

  public getSelectItems(): { name: string; value: boolean }[] {
    return Object.keys(this.selectItems).map(id => this.selectItems[id]);
  }
}
