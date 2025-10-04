import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ItemService } from 'src/app/services/app.item.service';
import { UserService } from 'src/app/services/app.user.service';

@Component({
  selector: 'app-link-item',
  templateUrl: './link-item.component.html',
  providers: [UserService]
})
export class LinkItemComponent {
  selectedUser: number = 0;
  showModal: boolean = false;
  filteredItems: any[] = [];
  selectedItems: any[] = [];

  constructor(
    public itemService: ItemService,
    public userService: UserService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.userService.loadUsersForDropdown();
    this.itemService.loadItemsForDropdown();
  }

  async loadItemsByUserId() {
    this.itemService.loadItemsByUser(this.selectedUser);
  }

  removeSelectedItems(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja remover o acesso do usuário deste(s) item(ns)?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        for (let a of this.selectedItems) {
          ids.push(parseInt(a.id));
        }

        const body = {
          id_user: this.selectedUser,
          ids: ids,
        };

        this.itemService.unlinkUserItems(body);
        this.selectedItems = [];
        this.loadItemsByUserId();
      },
      reject: () => { }
    });
  }

  openModal() {
    let ids: any[] = [];
    for (let item of this.itemService.userItems) {
      ids.push(item.id);
    }

    this.filteredItems = this.itemService.items.filter(i => !ids.includes(i.id));
    this.selectedItems = [];
    this.showModal = true;
  }

  closeModal() {
    this.filteredItems = [];
    this.selectedItems = [];
    this.showModal = false;
  }

  onSave() {
    const body = {
      id_user: this.selectedUser,
      ids: this.selectedItems,
    };

    this.itemService.linkUserItems(body);
    this.closeModal();
    this.loadItemsByUserId();
  }
}
