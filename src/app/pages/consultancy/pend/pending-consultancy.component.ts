import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NivelAcesso } from 'src/app/enums/NivelAcesso';
import { AuthService } from 'src/app/services/app.auth.service';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { LayoutService } from 'src/app/services/app.layout.service';
import { UserService } from 'src/app/services/app.user.service';

@Component({
  selector: 'app-pend',
  templateUrl: './pending-consultancy.component.html',
})
export class PendingConsultancyComponent {
  costumer:boolean = false;
  visible: boolean = false;
  pendency: boolean = false;

  constructor(
    private authService: AuthService,
    public layoutService: LayoutService,
    public userService: UserService,
    public consultancyService: ConsultancyService,
    private router: Router
  ) { }

  ngOnInit(){
    this.consultancyService.consultancies = [];
    this.consultancyService.totalRecords = 0;

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

  openModal(id: number, pendency: boolean){
    this.consultancyService.getConsultancyById(id, pendency);
    this.pendency = pendency;
    this.visible = true;

    if(pendency){
      this.consultancyService.loadPaymentTypes();
    }
  }

  closeModal(){
    this.consultancyService.consultancy_view = {};
    this.visible = this.pendency = false;
  }

  onChangeModal(open: boolean) {
    this.router.navigate([this.router.url], { skipLocationChange: true });
  }
}
