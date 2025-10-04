import { Component, HostListener } from '@angular/core';
import { AssessoriaVM } from 'src/app/view_models/assessoria';
import { StatusAssessoria } from 'src/app/enums/StatusAssessoria';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';

@Component({
  selector: 'app-consultancy-panel',
  templateUrl: './consultancy-panel.component.html',
})
export class ConsultancyPanelComponent {
  pending: AssessoriaVM[] = [];
  waiting: AssessoriaVM[] = [];
  inService: AssessoriaVM[] = [];
  finished: AssessoriaVM[] = [];
  showModal: boolean = false;

  constructor(
    public consultancyService: ConsultancyService,
  ) { }

  ngOnInit(){
    this.loadConsultancies();
  }

  ngOnDestroy(){
    this.saveConsultanciesOrdenation();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.saveConsultanciesOrdenation();
  }

  loadConsultancies(){
    this.consultancyService.loadMyConsultanciesPanel(StatusAssessoria.FormularioPendente).subscribe({
      next: (response : any) => {
        this.pending = response.data.map((c: any) => {
          c.data_contratacao = new Date(c.data_contratacao);
          return c;
        });
      },
      error: (error) => {
				this.consultancyService.error(error);
		  }
    });
    this.consultancyService.loadMyConsultanciesPanel(StatusAssessoria.AguardandoAtendimento).subscribe({
      next: (response : any) => {
        this.waiting = response.data.map((c: any) => {
          c.data_contratacao = new Date(c.data_contratacao);
          return c;
        });
      },
      error: (error) => {
				this.consultancyService.error(error);
		  }
    });
    this.consultancyService.loadMyConsultanciesPanel(StatusAssessoria.EmAtendimento).subscribe({
      next: (response : any) => {
        this.inService = response.data.map((c: any) => {
          c.data_contratacao = new Date(c.data_contratacao);
          return c;
        });
      },
      error: (error) => {
				this.consultancyService.error(error);
		  }
    });
    this.consultancyService.loadMyConsultanciesPanel(StatusAssessoria.Finalizada).subscribe({
      next: (response : any) => {
        this.finished = response.data.map((c: any) => {
          c.data_contratacao = new Date(c.data_contratacao);
          return c;
        });
      },
      error: (error) => {
				this.consultancyService.error(error);
		  }
    });
  }

  saveConsultanciesOrdenation(){
    let consultancies: any[] = [];

    this.pending.map((ass, index)=> {
      consultancies.push({ id: ass.id, ordenacao: index+1 });
    });
    this.waiting.map((ass, index)=> {
      consultancies.push({ id: ass.id, ordenacao: index+1 });
    });
    this.inService.map((ass, index)=> {
      consultancies.push({ id: ass.id, ordenacao: index+1 });
    });

    this.consultancyService.updatePanelOrdenation(consultancies);
  }

  drop(event: CdkDragDrop<AssessoriaVM[]>, novoStatus: number) {
    // atualizando o novo status da assessoria de acordo com a coluna
    let item = event.previousContainer.data[event.previousIndex];
    item.status_assessoria!.id = novoStatus;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      novoStatus = 0; // gerando o status;
    } else {
      // inserindo na nova posição da nova lista
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    // atualizando o status no backend
    this.consultancyService.updateConsultancyPanel(item.id!, novoStatus, event.currentIndex+1);
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
}
