import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { TableLazyLoadEvent } from 'primeng/table';
import { Formulario } from 'src/app/models/formulario';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { FormService } from 'src/app/services/app.form.service';
import { environment } from 'src/enviroments/enviroments';
@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
})
export class ManageFormComponent {
  loading: boolean = false;
  showModal: boolean = false;
  submitted: boolean = false;
  action: string = "";
  selectedForms: Formulario[] = [];

  constructor(
    public formService: FormService,
    public consultancyService: ConsultancyService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.consultancyService.loadConsultancyTypes();
  }

  loadQuestions(id: number) {
    this.formService.loadQuestionsById(id);
    this.cdr.markForCheck();
  }

  openModal(form: Formulario, action: string) {
    switch (action) {
      case 'create':
        this.formService.selectedForm = { id: 0, perguntas: [] };
        this.loadQuestions(0);
        break;
      case 'edit':
        this.formService.selectedForm = { ...form };
        this.loadQuestions(this.formService.selectedForm.id);
        this.formService.loadFormQuestions(this.formService.selectedForm.id);
        break;
    }
    this.action = action;
    this.submitted = false;
    this.showModal = true;
  }

  onSave() {
    if (this.formService.selectedForm.perguntas) {
      for (let i = 1; i <= this.formService.selectedForm.perguntas.length; i++) {
        this.formService.selectedForm.perguntas[i - 1].ordenacao = i;
      }
    }

    switch (this.action) {
      case 'create':
        this.formService.createForm();
        break;
      case 'edit':
        this.formService.updateForm();
        break;
    }
    this.closeModal();
  }

  closeModal() {
    this.formService.selectedForm = { id: 0 };
    this.action = "";
    this.submitted = false;
    this.showModal = false;
  }

  deleteSelectedForms(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente inativar este(s) formulário(s)?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        for (let q of this.selectedForms) {
          ids.push(q.id);
        }

        this.formService.deleteForm(ids);
      }
    });
  }
}
