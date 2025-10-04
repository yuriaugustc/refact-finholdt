import { Component } from '@angular/core';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { FormService } from 'src/app/services/app.form.service';
import { UserService } from 'src/app/services/app.user.service';
import { AssessoriaVM } from 'src/app/view_models/assessoria';
import { PerguntaVM } from 'src/app/view_models/formulario';

@Component({
  selector: 'app-manage-consultancy',
  templateUrl: './manage-consultancy.component.html',
})
export class ManageConsultancyComponent {
  showModal: boolean = false;
  submitted: boolean = false;
  editForm: boolean = false;
  tomorrow: Date = new Date();

  constructor(
    public consultancyService: ConsultancyService,
    public userService: UserService,
    public formService: FormService,
  ) { }

  ngOnInit(){
    // limpando assessorias, se vier de 'minhas assessorias' para 'gerenciar assessorias'
    // como as duas telas usam o array consultancies, ele buga
    this.consultancyService.consultancies = [];
    // loadfilters;
    this.consultancyService.loadConsultancyTypes();
    this.consultancyService.loadVisaTypes();
    this.consultancyService.loadCountries();
    this.userService.loadSellers();
    this.userService.loadCostumers();
    this.consultancyService.loadConsultancyStatus();
  }

  editConsultancy(consultancy: AssessoriaVM){
    this.formService.loadFormsByConsultancyType(consultancy.tipo_assessoria?.id ?? 0);
    this.consultancyService.getConsultancyById(consultancy.id);
    this.showModal = true;
  }

  visibleChanged(){
    if(!this.showModal) {
      this.consultancyService.consultancy_view = { }
      this.editForm = false;
      this.submitted = false;
    }
  }

  checkChanges(){
    if(this.consultancyService.checkChanges()){
      this.consultancyService.updateConsultancy();
    }else{
      this.consultancyService.sendMessage('Info', 'Nenhuma alteração detectada!', 'info');
    }
  }
}
