import { Component } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/app.item.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
})
export class CreateItemComponent {
  item: Item = {
    id: 0,
    nome: "",
    rota: "",
    icone : "bi bi-file-earmark"
  }

  constructor(public itemService: ItemService) { }

  ngOnInit(){
    this.loadItems();
  }

  createItem(){
    this.itemService.createItem(this.item);
    this.item.nome = "";
    this.item.rota = "";
    this.loadItems();
  }

  loadItems() {
    this.itemService.loadItems({
      sortField : 'ordenacao',
      sortOrder : 1,
      first : 0,
      rows : 9999,
      filters: {}
    });
  }
}
