import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';

@Component({
  selector: 'app-create-consultancy',
  templateUrl: './create-consultancy.component.html',
})
export class CreateConsultancyComponent {
  pages!: MenuItem[];

  constructor(
    public consultancyService: ConsultancyService
  ) { 
    this.consultancyService.firstStep();
  }

  ngOnInit() {
    this.pages = [
      {
        label: 'Informações Básicas',
        routerLink: 'first',
        replaceUrl: false,
        skipLocationChange: true,
      },
      {
        label: 'Assessoria',
        routerLink: 'second',
        replaceUrl: false,
        skipLocationChange: true,
      },
      {
        label: 'Pagamento',
        routerLink: 'third',
        replaceUrl: false,
        skipLocationChange: true,
      },
      {
        label: 'Confirmação',
        routerLink: 'fourth',
        replaceUrl: false,
        skipLocationChange: true,
      }
    ];
  }
}
