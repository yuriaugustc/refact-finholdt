import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Acao } from 'src/app/models/item';
import { ActionService } from 'src/app/services/app.action.service';
import { ItemService } from 'src/app/services/app.item.service';

@Component({
  selector: 'app-manage-action',
  templateUrl: './manage-action.component.html',
})
export class ManageActionComponent {
  constructor(
    public actionService: ActionService,
    public itemService: ItemService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(){
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

  deleteAction(event: Event, action: Acao){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente deletar esta ação?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.actionService.deleteAction(action.id);
      }
    });
  }

  onRowEditInit(action: Acao) {
    this.actionService.clonedActions[action.id.toString()] = { ...action };
  }

  onRowEditSave(action: Acao) {
    if(action.id)
      delete this.actionService.clonedActions[action.id.toString()];

    this.actionService.updateAction(action);
    this.actionService.actions.map(a => {
      if(a.id == action.id){
        a = action;
      }
      return a;
    });
  }

  onRowEditCancel(action: Acao, index: number) {
    this.actionService.actions[index] = this.actionService.clonedActions[action.id.toString()];   
    delete this.actionService.clonedActions[action.id.toString()];
  }

  changeLabel(action: Acao){
    action.nomeItem = this.itemService.items.find(x => x.id == action.idItem)?.nome;
  }
}
