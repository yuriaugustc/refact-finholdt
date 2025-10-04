import { Component } from '@angular/core';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { FormService } from 'src/app/services/app.form.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
})
export class SecondComponent {
  submitted: boolean = false;

  constructor(
    public consultancyService: ConsultancyService,
    public formService: FormService
    ) { }
  
  ngOnInit(){
    this.consultancyService.loadConsultancyTypes();
    this.consultancyService.loadVisaTypes();
    this.consultancyService.loadCountries();
  }

  check(){
    this.submitted = true;
    if( this.consultancyService.consultancy.id_tipo_assessoria != 0
    && (!this.consultancyService.checkConsultancyTypeStrict() || this.consultancyService.consultancy.id_tipo_visto != 0)
    && (!this.consultancyService.checkConsultancyType() || this.consultancyService.consultancy.id_pais != 0)
    ){
      this.submitted = false;
      this.consultancyService.thirdStep();
    }
  }
}
