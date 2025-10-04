import { Component } from '@angular/core';
import { NivelAcesso } from 'src/app/enums/NivelAcesso';
import { AuthService } from 'src/app/services/app.auth.service';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { UserService } from 'src/app/services/app.user.service';

@Component({
  selector: 'app-mine-consultancy',
  templateUrl: './mine-consultancy.component.html',
})
export class MineConsultancyComponent {
  visible:boolean = false;
  costumer:boolean = false;

  constructor(
    private authService: AuthService,
    public userService: UserService,
    public consultancyService: ConsultancyService
  ) { }

  ngOnInit(){
    // loadfilters;
    this.consultancyService.loadConsultancyTypes();
    this.consultancyService.loadConsultancyStatus();

    let role = parseInt(this.authService.getSessionStorage('role'));
    switch(role){
      case NivelAcesso.CLIENTE:
        this.costumer = true;
        this.userService.loadSellers();
        break;
      default:
        this.userService.loadCostumers();
        break;
    }
  }

  filter(){
    this.consultancyService.loadMyConsultancies(
      this.consultancyService.customEvent
    );
  }

  clearFilter(){
    this.consultancyService.filters = { };
    this.consultancyService.loadMyConsultancies(
      this.consultancyService.customEvent
    );
  }

  openModal(id?: number){
    if(!id)
      return;
    this.consultancyService.getConsultancyById(id);
    this.visible = true;
  }

  closeModal(){
    this.consultancyService.consultancy_view = {}
    this.visible = false;
  }
}
