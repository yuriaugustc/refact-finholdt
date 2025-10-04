import { Component } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { ItemService } from 'src/app/services/app.item.service';

@Component({
  selector: 'app-ordenate-item',
  templateUrl: './ordenate-item.component.html'
})
export class OrdenateItemComponent {

  constructor(public itemService: ItemService) { }

  ngOnInit(){
    this.loadItems();
  }

  loadItems() {
    const event = {
      sortField : 'ordenacao',
      sortOrder : 1,
      first : 0,
      rows : 9999,
      filters: {}
    }
    this.itemService.loadItems(event as TableLazyLoadEvent);
  }
}
