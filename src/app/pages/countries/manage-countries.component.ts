import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Pais } from 'src/app/models/assessoria';
import { CountryService } from 'src/app/services/app.countries.service';

@Component({
  selector: 'app-manage-countries',
  templateUrl: './manage-countries.component.html',
})
export class ManageCountriesComponent {
  selectedCountries!: Pais[];

  constructor(
    public countryService: CountryService,
    private confirmationService: ConfirmationService
  ) { }

  getIds(){
    let ids = [];
    for(let c of this.selectedCountries){
      ids.push(c.id);
    }
    return ids;
  }

  activateCountries(event: Event){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente ativar este(s) país(es)?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.countryService.activateCountries(this.getIds());
      }
    });
  }

  deactivateCountries(event: Event){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente inativar este(s) país(es)?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.countryService.deactivateCountries(this.getIds());
      }
    });
  }
}
