import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FileSelectEvent } from 'primeng/fileupload';
import { NivelAcesso } from 'src/app/enums/NivelAcesso';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/app.auth.service';
import { UserService } from 'src/app/services/app.user.service';

@Component({
  selector: 'app-crud-user',
  templateUrl: './crud-user.component.html',
  providers: [AuthService]
})
export class CrudUserComponent {
  role: number = 0;
  selectedUsers: Usuario[] = [];
  file?: File;
  loading: boolean = false;
  showModal: boolean = false;
  submitted: boolean = false;
  action: string = "";
  options!: any[];
  activeItem!: any;
  loginInvalid: boolean = false;
  cpfInvalid: boolean = false;
  emailInvalid: boolean = false;

  constructor(
    public userService: UserService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.userService.loadAccessLevels();
    this.role = parseInt(this.authService.getSessionStorage('role'));

    this.options = [
      { label: 'Ativo', value: true, severity: 'success' },
      { label: 'Inativo', value: false, severity: 'danger' }
    ];
  }

  isComercialRole(){
    return this.role == NivelAcesso.COMERCIAL;
  }

  openModal(user: Usuario, action: string) {
    switch (action) {
      case 'create':
        this.userService.selectedUser = { id: 0 };
        switch(this.role){
          case NivelAcesso.COMERCIAL: // comercial só pode criar acesso de clientes;
          this.userService.selectedUser.id_nivel_acesso = NivelAcesso.CLIENTE;
          break;
        }
        break;
      case 'edit':
        this.userService.selectedUser = { ...user };
        this.activeItem = user.ativo ? this.options[0] : this.options[1];
        break;
    }
    this.action = action;
    this.submitted = false;
    this.showModal = true;
  }

  onSave() {
    if (!this.userService.validateUser(this.loginInvalid, this.cpfInvalid, this.emailInvalid))
      return;

    switch (this.action) {
      case 'create':
        this.userService.createUser(this.makeFormData(this.userService.selectedUser));
        break;
      case 'edit':
        this.userService.updateUser(this.makeFormData(this.userService.selectedUser));
        break;
    }

    this.closeModal();
  }

  closeModal() {
    this.userService.selectedUser = { id: 0 };
    this.action = "";
    this.submitted = false;
    this.showModal = false;
  }

  deleteSelectedUsers(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente inativar este(s) usuário(s)?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(this.isComercialRole()){
          let any = this.selectedUsers.findIndex(u => u.id_nivel_acesso != NivelAcesso.CLIENTE);
          if(any != -1){
            this.authService.sendMessage('warn', 'Atenção!', 'Você pode inativar apenas usuários de Nivel Cliente');
            return;
          }
        }

        let ids = [];
        for (let u of this.selectedUsers) {
          ids.push(u.id);
        }
        this.userService.deleteUser(ids);
      }
    });
  }

  getActiveLabel(id: number) {
    return this.options.find(a => a.value == id).label;
  }

  changePassword(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente alterar a senha deste usuário para a senha padrão do sistema?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.resetPassword(this.userService.selectedUser);
      }
    });
  }

  onUpload(event: FileSelectEvent) {
    this.file = <File>event.files[0];
  }

  makeFormData(user: Usuario) {
    let formData = new FormData();
    formData.append("id", user.id.toString());
    formData.append("nome_completo", user.nome_completo ?? "");
    formData.append("apelido", user.apelido ?? "");
    formData.append("login", user.login ?? "");
    formData.append("cpf", user.cpf ?? "");
    formData.append("email", user.email ?? "");
    formData.append("celular", user.celular ?? "");
    formData.append("ativo", user.ativo ? "true" : "false");
    formData.append("id_nivel_acesso", user.id_nivel_acesso?.toString() ?? "0");
    formData.append("foto", user.foto ?? "");
    formData.append("nome_foto", user.nome_foto ?? "");

    if (this.file) {
      formData.append("hasPic", "1");
      formData.append("profilePic", <File>this.file);
    }

    return formData;
  }

  changeActiveItem(ev: DropdownChangeEvent){
    this.activeItem = this.options.find(x => x.value == ev.value);
  }

  checkUser(whichColumn: number){
    if(whichColumn == 1 && !this.userService.selectedUser.login?.length ||
       whichColumn == 2 && !this.userService.selectedUser.cpf?.length   ||
       whichColumn == 3 && !this.userService.selectedUser.email?.length)
      return;
    
      this.userService.checkUser(whichColumn).subscribe({
      next: (response: any) => {
        switch(whichColumn){
          case 1:
            this.loginInvalid = response.invalid;
          break;
          case 2:
            this.cpfInvalid = response.invalid;
          break;
          case 3:
            this.emailInvalid = response.invalid;
          break;
        }
      },
      error: (error) => {
        this.userService.error(error);
      }
    });
  }

  validateEmailInput(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9@._-]+/g, '');
  }

  allowEmailCharacters(event: KeyboardEvent): void {
    if (!/^[a-zA-Z0-9@._-]+$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
