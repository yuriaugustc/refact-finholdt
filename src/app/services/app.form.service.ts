import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../enviroments/enviroments';
import { TableLazyLoadEvent } from 'primeng/table';
import { Formulario, Pergunta, RespostaDropdown, TipoPergunta } from '../models/formulario';

@Injectable()
export class FormService {
  loading: boolean = false;
  forms: Formulario[] = [];
  selectedForm: Formulario = { id: 0 };
  questions: Pergunta[] = [];
  questionTypes: TipoPergunta[] = [];
  selectedQuestion: Pergunta = { id: 0 };
  selectedAnswer: RespostaDropdown = { id: 0 };
  totalRecords: number = 0;
  clonedItems: { [s: string]: any } = {};
  customEvent!: TableLazyLoadEvent;
  submitted: boolean = false;

  constructor(
    private http: HttpClient,
    public messageService: MessageService
  ) { }

  error(response: any){
		console.error(response);

		let title = 'Erro';
		let severity = 'error';
		let msg = response.error.msg ?? environment.defaultMsgError;

		if (response.status == 400) {
			title = 'Atenção',
			severity = 'warn';
		}

		this.messageService.add({
			summary: title,
			detail: msg,
			severity: severity
		});
	}

  createForm() {
    if (!this.validateForm())
      return;

    this.http.post(`${environment.apiUrl}/form/create`, JSON.stringify(this.selectedForm), { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.reloadForms();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Formulário criado!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  updateForm() {
    if (!this.validateForm())
      return;

    this.http.post(`${environment.apiUrl}/form/update`, JSON.stringify(this.selectedForm), { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.reloadForms();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Formulário atualizado!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  deleteForm(ids: number[]) {
    this.http.post(`${environment.apiUrl}/form/inactivate`, JSON.stringify(ids), { withCredentials: true }).subscribe({
      next: (response: any) => {
        if (!response.success) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail: response.message ?? "Houve um erro ao inativar este(s) formulário(s)."
          });
          return;
        }
        this.reloadForms();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Formulário(s) inativado(s)!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  reloadForms() {
    this.loadForms(this.customEvent);
  }

  loadForms(event: TableLazyLoadEvent) {
    this.loading = true;
    this.customEvent = event;

    this.http.post(`${environment.apiUrl}/form/all`, JSON.stringify(event), { withCredentials: true }).subscribe({
      next: (response: any) => {
        response.data = response.data.map((q: { ativo: number | boolean }) => {
          q.ativo = q.ativo == 1;
          return q;
        });
        this.forms = response.data;
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
        this.error(error);
      }
    });

    this.loading = false;
  }

  loadFormsByConsultancyType(id: number){
    this.http.get(`${environment.apiUrl}/form/byconsultancytype?id=${id}`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.forms = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  createQuestion() {
    if (!this.validateQuestion())
      return;

    this.http.post(`${environment.apiUrl}/question/create`, JSON.stringify(this.selectedQuestion), { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.loadQuestions(this.customEvent);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pergunta criada!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  updateQuestion() {
    if (!this.validateQuestion())
      return;

    this.http.post(`${environment.apiUrl}/question/update`, JSON.stringify(this.selectedQuestion), { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.loadQuestions(this.customEvent);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pergunta atualizada!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  deleteQuestion(ids: number[]) {
    this.http.post(`${environment.apiUrl}/question/inactivate`, JSON.stringify(ids), { withCredentials: true }).subscribe({
      next: (response: any) => {
        if (!response.success) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail: response.message ?? 'Houve um erro ao inativar estas perguntas.'
          });
          return;
        }
        this.loadQuestions(this.customEvent);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pergunta(s) inativada(s)!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  createAnswer(answer: RespostaDropdown) {
    answer = {
      id: 0,
      descricao: answer.descricao,
      id_pergunta: this.selectedQuestion.id,
      ativo: true
    }
    this.http.post(`${environment.apiUrl}/answer/create`, JSON.stringify(answer), { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.loadQuestions(this.customEvent);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Resposta criada!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  updateAnswer(answer: RespostaDropdown) {
    this.http.post(`${environment.apiUrl}/answer/update`, JSON.stringify(answer), { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.loadQuestions(this.customEvent);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Resposta atualizada!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  deleteAnswer(id: number) {
    this.http.post(`${environment.apiUrl}/answer/inactivate`, JSON.stringify({ id }), { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.loadQuestionAnswers(this.selectedQuestion.id);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Resposta inativada!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  reloadQuestions() {
    this.loadQuestions(this.customEvent);
  }

  loadQuestions(event: TableLazyLoadEvent) {
    this.loading = true;
    this.customEvent = event;

    this.http.post(`${environment.apiUrl}/question/all`, JSON.stringify(event), { withCredentials: true }).subscribe({
      next: (response: any) => {
        response.data = response.data.map((q: { ativo: number | boolean; obrigatoria: number | boolean }) => {
          q.obrigatoria = q.obrigatoria == 1;
          q.ativo = q.ativo == 1;
          return q;
        });
        this.questions = response.data;
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
        this.error(error);
      }
    });

    this.loading = false;
  }

  loadQuestionsById(id: number) {
    this.http.get(`${environment.apiUrl}/question/get?id=${id}`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.questions = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadFormQuestions(id: number) {
    this.http.get(`${environment.apiUrl}/form/questions?id=${id}`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.selectedForm.perguntas = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadFormQuestionsForConsultancy(id: number) {
    return this.http.get(`${environment.apiUrl}/form/questions?id=${id}`, { withCredentials: true });
  }

  loadQuestionTypes() {
    this.http.get(`${environment.apiUrl}/question/types`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.questionTypes = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadQuestionAnswers(id: number) {
    this.http.get(`${environment.apiUrl}/question/answers?id=${id}`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.selectedQuestion.respostas = response.data.map((r: RespostaDropdown) => {
          r.ativo = r.ativo?.toString() == "1";
          return r;
        });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadQuestionAnswersForConsultancy(id: number) {
    return this.http.get(`${environment.apiUrl}/question/answers?id=${id}`, { withCredentials: true });
  }

  validateForm() {
    this.submitted = true;
    if (!this.selectedForm.nome || !this.selectedForm.id_tipo_assessoria) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return false;
    }
    return true;
  }

  validateQuestion() {
    this.submitted = true;
    if (!this.selectedQuestion.descricao || !this.selectedQuestion.id_tipo) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return false;
    }
    return true;
  }
}