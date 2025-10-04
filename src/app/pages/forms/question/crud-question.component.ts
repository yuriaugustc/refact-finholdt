import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Pergunta, RespostaDropdown } from 'src/app/models/formulario';
import { FormService } from 'src/app/services/app.form.service';
import { environment } from 'src/enviroments/enviroments';

@Component({
  selector: 'app-crud-question',
  templateUrl: './crud-question.component.html',
})
export class CrudQuestionComponent {
  loading: boolean = false;
  showModal: boolean = false;
  submitted: boolean = false;
  modalAnswer: boolean = false;
  selectedQuestions: any[] = [];
  selectedAnswer: any[] = [];
  action:string = "";

  constructor(
		public formService: FormService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(){
    this.formService.loadQuestionTypes();
  }

  openModal(question: Pergunta, action:string){
    switch(action){
      case 'create':
        this.formService.selectedQuestion = { id: 0 };
        break;
        case 'edit':
          this.formService.selectedQuestion = { ...question };
          if(environment.inArray(this.formService.selectedQuestion.id_tipo, [3, 4])){
            this.formService.loadQuestionAnswers(question.id);
          }
        break;
    }
    this.action = action;
    this.submitted = false;
    this.showModal = true;
  }

  onSave(){
    switch(this.action){
      case 'create':
          this.formService.createQuestion();
        break;
        case 'edit':
          this.formService.updateQuestion();
        break;
    }
    this.closeModal();
  }

  closeModal(){
    this.formService.selectedQuestion = { id: 0 };
    this.action = "";
    this.submitted = false;
    this.showModal = false;
  }

  updateAnswer(){
    if(this.formService.selectedAnswer.id == 0){
      this.formService.createAnswer(this.formService.selectedAnswer);
    }
    else {
      this.formService.updateAnswer(this.formService.selectedAnswer);
    }
    this.closeAnswerModal();
    this.formService.loadQuestionAnswers(this.formService.selectedQuestion.id);
  }

  editAnswer(answer: RespostaDropdown){
    this.formService.selectedAnswer = { ...answer };
    this.modalAnswer = true;
  }

  closeAnswerModal(){
    this.formService.selectedAnswer = { id: 0 };
    this.modalAnswer = false;
  }

  deleteSelectedQuestions(event: Event){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente inativar esta(s) pergunta(s)?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        for(let q of this.selectedQuestions){
          ids.push(parseInt(q.id));
        }
        this.formService.deleteQuestion(ids);
      }
    });
  }

  deleteAnswer(event: Event, answer: RespostaDropdown) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente inativar esta resposta?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formService.deleteAnswer(answer.id);
      }
    });
  }

  answersVisible(){
    return environment.inArray(this.formService.selectedQuestion.id_tipo, [3, 4])
  }
}
