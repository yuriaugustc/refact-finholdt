import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Acao } from 'src/app/models/item';
import { ActionService } from 'src/app/services/app.action.service';
import { ItemService } from 'src/app/services/app.item.service';

@Component({
  selector: 'app-create-action',
  templateUrl: './create-action.component.html',
})
export class CreateActionComponent {
  action: Acao = {
    id: 0,
    nome: "",
    rota: "",
    icone: "bi bi-file-earmark",
    idItem: 0
  }

  constructor(
    public actionService: ActionService,
    public itemService: ItemService
  ) { }

  async ngOnInit(){
    this.loadItems();
  }

  createAction(){
    this.actionService.createAction(this.action);
    this.action = { id: 0 };
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

  loadActions() {
    const event = {
      sortField : 'ordenacao',
      sortOrder : 1,
      first : 0,
      rows : 9999,
      filters: {}
    }
    this.actionService.loadActions(event as TableLazyLoadEvent);
  }
}
