import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ItemService } from '../../../services/app.item.service';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-manage-item',
  templateUrl: './manage-item.component.html',
})
export class ManageItemComponent {

  constructor(
    public itemService: ItemService,
    private confirmationService: ConfirmationService
  ) { }

  onRowEditInit(item: Item) {
    this.itemService.clonedItems[item.id.toString()] = { ...item };
  }

  onRowEditSave(item: Item) {
    if(item.id)
      delete this.itemService.clonedItems[item.id.toString()];

    this.itemService.updateItem(item);
  }

  onRowEditCancel(item: Item, index: number) {
    this.itemService.items[index] = this.itemService.clonedItems[item.id.toString()];
    delete this.itemService.clonedItems[item.id.toString()];
  }

  deleteItem(event: Event, item: Item){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente deletar este item? (As ações atreladas ao mesmo serão apenas inativadas)',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemService.deleteItem(item.id);
      }
    });
  }
}
