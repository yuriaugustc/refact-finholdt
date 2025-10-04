import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ActionService } from 'src/app/services/app.action.service';
import { UserService } from 'src/app/services/app.user.service';

@Component({
  selector: 'app-link-action',
  templateUrl: './link-action.component.html',
  providers: [UserService]
})
export class LinkActionComponent {
  selectedUser: number = 0;
  showModal: boolean = false;
  filtered_actions: any[] = [];
  selectedActions: any[] = [];

  constructor(
    public actionService: ActionService,
    public userService: UserService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(){
    this.userService.loadUsersForDropdown();
    this.actionService.loadActionsForDropdown();
  }

  removeSelectedActions(event: Event){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja remover o acesso do usuário a esta(s) ação(ões)?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
      for(let a of this.selectedActions){
        ids.push(parseInt(a.id));
      }

      const body = {
        id_user: this.selectedUser,
        ids: ids,
      };

      this.actionService.unlinkActions(this.selectedUser, ids);
      this.selectedActions = [];
      this.actionService.loadActionsByUserId(this.selectedUser);
      }
    });
  }

  openModal(){
    let ids: any[] = [];
    for(let action of this.actionService.userActions){
      ids.push(action.id);
    }

    this.filtered_actions = this.actionService.actions.filter(a => !ids.includes(a.id));
    this.selectedActions = [];
    this.showModal = true;
  }
  
  closeModal(){
    this.filtered_actions = [];
    this.selectedActions = [];
    this.showModal = false;
  }

  onSave(){
    this.actionService.linkActions(this.selectedUser, this.selectedActions)
    this.actionService.loadActionsByUserId(this.selectedUser);
    this.closeModal();
  }
}
