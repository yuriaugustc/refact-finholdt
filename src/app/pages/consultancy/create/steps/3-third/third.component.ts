import { Component } from '@angular/core';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';

@Component({
  selector: 'app-third',
  templateUrl: './third.component.html',
})
export class ThirdComponent {
  submitted: boolean = false;
  
  constructor(
    public consultancyService: ConsultancyService
  ) { }

  ngOnInit(){
    this.consultancyService.loadPaymentTypes();
    this.consultancyService.loadPaymentStatus();
  }

  check(){
    this.submitted = true;
    if( this.consultancyService.consultancy.valor_assessoria != 0
    &&  this.consultancyService.consultancy.id_tipo_pagamento != 0
    && (!this.consultancyService.checkPaymentStatus([1]) || (this.consultancyService.consultancy.id_status_pagamento != 0 && this.consultancyService.file))
    //&& (!this.consultancyService.checkPaymentStatus([2,3]) || fazer validação de dados do cartão )
    ){
      this.submitted = false;
      this.consultancyService.fourthStep();
    }
  }
}
