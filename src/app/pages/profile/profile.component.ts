import { Component } from '@angular/core';
import { NivelAcesso } from 'src/app/enums/NivelAcesso';
import { AuthService } from 'src/app/services/app.auth.service';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { UserService } from 'src/app/services/app.user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  showModal:boolean = false;
  showModalPassword:boolean = false;
  submitted: boolean = false;
  old_password: string = '';
  new_password: string = '';
  confirm_password: string = '';
  regex_medium: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}';
  regex_strong: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}';
  title?: string;

  constructor(
    public userService: UserService,
    private authService: AuthService,
    public consultancyService: ConsultancyService
  ) { }

  ngOnInit() {
    this.userService.loadUserProfile();
    this.consultancyService.loadMyConsultanciesHistory();

    let role = parseInt(this.authService.getSessionStorage('role'));
    switch(role){
      case NivelAcesso.CLIENTE:
        this.title = `Histórico de Assessorias <small>(últimas ${this.consultancyService.limitConsultanciesHistory} assessorias)</small>`
        break;
      default:
        this.title = `Histórico de Vendas <small>(últimas ${this.consultancyService.limitConsultanciesHistory} vendas)</small>`
        break;
    }
  }

  openModal(id?: number){
    if(!id)
      return;

    this.consultancyService.getConsultancyById(id);
    this.showModal = true;
  }

  closeModal(){
    this.consultancyService.consultancy_view = {}
    this.showModal = false;
  }

  modalPassword(){
    this.showModalPassword = true;
  }

  closeModalPassword(){
    this.old_password = '';
    this.new_password = '';
    this.confirm_password = '';
    this.showModalPassword = false;
  }

  onSavePassword(){
    let strong_regex = new RegExp(this.regex_strong);

    if(!strong_regex.test(this.new_password)){
      this.authService.sendMessage('warn', 'Senha fora do padrão', 'A senha não segue os requisitos de segurança do sistema, modifique a senha e tente novamente.');
      return;
    }

    this.authService.updatePassword(this.old_password, this.new_password);
    this.closeModalPassword();
  }
}
