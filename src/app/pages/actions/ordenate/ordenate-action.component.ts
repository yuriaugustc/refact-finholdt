import { Component } from '@angular/core';
import { ActionService } from 'src/app/services/app.action.service';
import { ItemService } from 'src/app/services/app.item.service';

@Component({
  selector: 'app-ordenate-action',
  templateUrl: './ordenate-action.component.html',
})
export class OrdenateActionComponent {
  idItem: number = 0;
  
  constructor(
    public itemService: ItemService,
    public actionService: ActionService
  ) { }

  ngOnInit() {
    this.itemService.loadItemsForDropdown();
  }
}
