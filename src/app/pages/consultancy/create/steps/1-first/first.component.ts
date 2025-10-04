import { Component } from '@angular/core';
import { UserService } from 'src/app/services/app.user.service';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
})
export class FirstComponent {
  traveler_idx = 0;
  submitted: boolean = false;
  constructor(
    public userService: UserService,
    public consultancyService: ConsultancyService
  ) { }

  ngOnInit(){
    this.traveler_idx = 0;
    this.consultancyService.travelers = [];

    this.consultancyService.consultancy = {
      id: 0,
      id_cliente: 0,
      id_funcionario: 0,
      id_tipo_assessoria: 0,
      id_tipo_visto: 0,
      id_pais: undefined,
      id_status_assessoria: 1, // inicializando com status nova
      valor_assessoria: 0,
      id_tipo_pagamento: 0,
      id_status_pagamento: 0,
    };
    
    this.userService.loadCostumers();
  }

  check(){
    this.submitted = true;
    if(this.consultancyService.consultancy.id_cliente != 0){
      this.submitted = false;
      this.consultancyService.secondStep();
    }
  }

  addTravelers() {
    this.traveler_idx++;

    this.consultancyService.travelers.push({
      id: this.traveler_idx,
      id_assessoria: 0,
      nome: ''
    });
  }

  removeTraveler(id: number) {
    this.consultancyService.travelers =
      this.consultancyService.travelers.filter(t => t.id !== id);
  }
}
