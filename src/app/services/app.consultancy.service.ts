import { Injectable } from '@angular/core';
import { Assessoria, Pais, TipoAssessoria, TipoVisto, TipoPagamento, StatusPagamento, StatusAssessoria, Cartao, Viajante } from '../models/assessoria';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { environment } from 'src/enviroments/enviroments';
import { MessageService } from 'primeng/api';
import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { AssessoriaVM } from '../view_models/assessoria';
import { FormularioVM, PerguntaVM, RespostaVM } from '../view_models/formulario';
import { TipoPergunta } from '../enums/TipoPergunta';
import { Pendencias } from '../enums/Pendencias';

@Injectable()
export class ConsultancyService {
  consultancy!: Assessoria;
  travelers: Viajante[] = [];
  consultancy_view?: AssessoriaVM;
  // para fins de log
  old_consultancy?: Assessoria;
  old_consultancy_view?: AssessoriaVM;
  card: Cartao = {};
  file?: File;
  consultancyTypes: TipoAssessoria[] = [];
  visaTypes: TipoVisto[] = [];
  countries: Pais[] = [];
  paymentTypes: TipoPagamento[] = [];
  paymentStatus: StatusPagamento[] = [];
  consultancies: AssessoriaVM[] = [];
  loading: boolean = false;
	totalRecords: number = 0;
  filters: any = {};
  consultancyStatus :StatusAssessoria[] = [];
  customEvent!: DataViewLazyLoadEvent;
  tableEvent!: TableLazyLoadEvent;
  limitConsultanciesHistory: number = 10;

  constructor(
    private http: HttpClient,
    private router: Router,
    public messageService: MessageService
  ) {
    this.consultancy = {
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
    }
  }

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

  firstStep(){
    this.router.navigate(['/home/consultancy/create/first'], { skipLocationChange: true });
  }

  secondStep(){
    this.router.navigate(['/home/consultancy/create/second'], { skipLocationChange: true });
  }

  thirdStep(){
    this.router.navigate(['/home/consultancy/create/third'], { skipLocationChange: true });
  }

  fourthStep(){
    this.router.navigate(['/home/consultancy/create/fourth'], { skipLocationChange: true });
  }

  createConsultancy(){
    this.http.post(`${environment.apiUrl}/consultancy/create`, this.makeFormData(), { withCredentials: true }).subscribe({
      next: (response : any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Assessoria criada!' });
				this.router.navigate(['/home/consultancy/mine']);
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  updateConsultancy(){
    this.http.post(`${environment.apiUrl}/consultancy/update`, this.makeFormData(), { withCredentials: true }).subscribe({
      next: (response : any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Assessoria atualizada!' });
        this.loadConsultancies(this.tableEvent);
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  updateConsultancyPanel(id: number, id_status_assessoria: number, ordenacao: number){
    this.http.post(`${environment.apiUrl}/consultancy/update/panel`, JSON.stringify({ id, id_status_assessoria, ordenacao }), { withCredentials: true }).subscribe({
      next: (response : any) => {
				//this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Assessoria atualizada!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  resolvePendencies(pendency: number){
    let consultancy = this.makeFormData();
    consultancy.append('pendency', pendency.toString());

    this.http.post(`${environment.apiUrl}/consultancy/resolve`, consultancy, { withCredentials: true }).subscribe({
      next: (response : any) => {
        let msg = '';
        switch(pendency){
          case Pendencias.PAGAMENTO:
            msg = 'Pendência de pagamento regularizada!';
            break;
          case Pendencias.STATUS:
            msg = 'Formulário Preenchido!';
            break;
        }
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  saveAnswers(){
    let consultancy = this.makeFormData();

    this.http.post(`${environment.apiUrl}/consultancy/saveAnswers`, consultancy, { withCredentials: true }).subscribe({
      next: (response : any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Respostas salvas!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  reloadPendencies(){
    this.loadPendingConsultancies(this.customEvent);
  }

  updatePanelOrdenation(consultancies: Array<any>){
    this.http.post(`${environment.apiUrl}/consultancy/update/ordenation`, JSON.stringify(consultancies), { withCredentials: true }).subscribe({
      next: (response : any) => {
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  deleteConsultancy(){

  }

  getConsultancyById(id?: number, pendecies?: boolean){
    this.consultancy_view = { };
    pendecies ??= false;

    if(!id) {
      return;
    }

    this.http.get(`${environment.apiUrl}/consultancy/get?id=${id}&pend=${pendecies}`, { withCredentials: true }).subscribe({
      next: (response : any) => {
        this.consultancy_view = { ...response.data, editado: false };
        this.consultancy = {
          id: this.consultancy_view?.id ?? 0,
          id_cliente: this.consultancy_view?.cliente?.id ?? 0,
          id_funcionario: this.consultancy_view?.funcionario?.id ?? 0,
          id_tipo_assessoria: this.consultancy_view?.tipo_assessoria?.id ?? 0,
          id_tipo_visto: this.consultancy_view?.tipo_visto?.id,
          id_pais: this.consultancy_view?.pais?.id,
          id_status_assessoria: this.consultancy_view?.status_assessoria?.id ?? 0,
          valor_assessoria: this.consultancy_view?.valor_assessoria ?? 0,
          id_tipo_pagamento: this.consultancy_view?.tipo_pagamento?.id ?? 0,
          id_status_pagamento: this.consultancy_view?.status_pagamento?.id ?? 0,
          id_formulario: this.consultancy_view?.formulario?.id,
          data_contratacao: new Date(response.data.data_contratacao),
        }

        this.old_consultancy = { ...this.consultancy };
        this.old_consultancy_view = JSON.parse(JSON.stringify(response.data));

        // convertendo respostas do tipo Date em um objeto Date
        if(this.consultancy_view?.formulario?.perguntas){
          for(let p of this.consultancy_view?.formulario?.perguntas){
            if(p.resposta.resposta_date){
              p.resposta.resposta_date = new Date(p.resposta.resposta_date);
            }
          }
        }
        // convertendo respostas do tipo Date em um objeto Date
        if(this.old_consultancy_view?.formulario?.perguntas){
          for(let p of this.old_consultancy_view?.formulario?.perguntas){
            if(p.id_tipo == TipoPergunta.Data){
              p.resposta.resposta_date = new Date(p.resposta.resposta_date ?? '');
            }
          }
        }
      },
      error: (error) => {
				this.error(error);
		  }
    });
  }

  loadConsultancies(event: TableLazyLoadEvent){
    this.tableEvent = event;
    this.loading = true;
    this.http.post(`${environment.apiUrl}/consultancy/all`, JSON.stringify(event), { withCredentials: true }).subscribe({
      next: (response : any) => {
        this.consultancies = response.data.map((c: any) => {
          c.data_contratacao = new Date(c.data_contratacao);
          return c;
        });
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
				this.error(error);
		  }
    });
    this.loading = false;
  }

  loadMyConsultancies(event: DataViewLazyLoadEvent){
    this.loading = true;
    this.customEvent = event;
    let customEvent = {
      first: event.first,
      rows: event.rows,
      filters: this.filters,
      sortOptions: { field: event.sortField, order: event.sortOrder }
    }
    
    this.http.post(`${environment.apiUrl}/consultancy/mine`, JSON.stringify(customEvent), { withCredentials: true }).subscribe({
      next: (response : any) => {
        this.consultancies = response.data.map((c: any) => {
          c.data_contratacao = new Date(c.data_contratacao);
          return c;
        });
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
				this.error(error);
		  }
    });
    this.loading = false;
  }

  loadMyConsultanciesPanel(status: number){
    return this.http.get(`${environment.apiUrl}/consultancy/panel?status=${status}`, { withCredentials: true });
  }

  loadMyConsultanciesHistory(){
    this.loading = true;
    let customEvent = {
      first: 0,
      rows: this.limitConsultanciesHistory,
      filters: this.filters,
      sortOptions: { field: 'data_contratacao', order: 'DESC' }
    }
    
    this.http.post(`${environment.apiUrl}/consultancy/mine`, JSON.stringify(customEvent), { withCredentials: true }).subscribe({
      next: (response : any) => {
        this.consultancies = response.data.map((c: any) => {
          c.data_contratacao = new Date(c.data_contratacao);
          return c;
        });
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
				this.error(error);
		  }
    });
    this.loading = false;
  }

  loadPendingConsultancies(event: DataViewLazyLoadEvent){
    this.loading = true;
    this.customEvent = event;
    let customEvent = {
      first: event.first,
      rows: event.rows,
    }
    
    this.http.post(`${environment.apiUrl}/consultancy/costumer/pend`, JSON.stringify(customEvent), { withCredentials: true }).subscribe({
      next: (response : any) => {
        this.consultancies = response.data.map((c: any) => {
          c.data_contratacao = new Date(c.data_contratacao);
          return c;
        });
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
				this.error(error);
		  }
    });
    this.loading = false;
  }

  loadConsultancyTypes() {
    this.http.get(`${environment.apiUrl}/consultancy/types`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.consultancyTypes = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadConsultancyStatus() {
    this.http.get(`${environment.apiUrl}/consultancy/status`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.consultancyStatus = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadVisaTypes() {
    this.http.get(`${environment.apiUrl}/consultancy/visatypes`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.visaTypes = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadCountries() {
    this.http.get(`${environment.apiUrl}/consultancy/countries`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.countries = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadPaymentTypes() {
    this.http.get(`${environment.apiUrl}/consultancy/paymenttypes`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.paymentTypes = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  loadPaymentStatus() {
    this.http.get(`${environment.apiUrl}/consultancy/paymentstatus`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.paymentStatus = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  checkConsultancyType(){
    return environment
      .inArray(
        this.consultancy.id_tipo_assessoria, 
        [1, 2]
      );
  }

  checkConsultancyTypeCountry(){
    return environment
      .inArray(
        this.consultancy.id_tipo_assessoria, 
        [1, 2, 3]
      );
  }

  checkConsultancyTypeStrict(){
    return environment
      .inArray(
        this.consultancy.id_tipo_assessoria, 
        [1]
      );
  }

  checkPaymentStatus(ids: number[]){
    return environment
      .inArray(
        this.consultancy.id_status_pagamento,
        ids
      );
  }

  checkPaymentType(ids: number[]){
    return environment
      .inArray(
        this.consultancy.id_tipo_pagamento,
        ids
      ) 
  }

  onUploadComprovante(event: any) {
    this.file = <File>event.target.files[0];
    event.target.value = null;
  }

  formatDate(date?: Date, showTime: number = 0){
    if (!date)
      return;
    // Obter o dia com zero à esquerda se for menor que 10
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    // Obter o mês com zero à esquerda se for menor que 10
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    // Obter o ano com dois dígitos
    const year = date.getFullYear().toString();

    let time = '';

    if(showTime){
      // Obter a hora com zero à esquerda se for menor que 10
      const hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
      // Obter o minuto com zero à esquerda se for menor que 10
      const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
      // Obter o segundo com zero à esquerda se for menor que 10
      const seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
      time = `${hours}:${minutes}:${seconds}`;
    }

    // Retornar a data formatada
      return `${day}/${month}/${year} ${time}`.trimEnd(); // remover espaço caso showtime = 0;
  }

  attachmentName(path?: string){
    if(!path)
      return;

    let path_split = path.split('\\');
    return path_split[path_split.length-1];
  }

  makeFormData() {
    let formData = new FormData();
    formData.append("id", this.consultancy.id.toString());
    formData.append("id_cliente", this.consultancy.id_cliente.toString());
    formData.append("id_funcionario", this.consultancy.id_funcionario.toString());
    formData.append("id_tipo_assessoria", this.consultancy.id_tipo_assessoria.toString());
    formData.append("id_tipo_visto", this.consultancy.id_tipo_visto?.toString() ?? "0");
    formData.append("id_pais", this.consultancy.id_pais?.toString() ?? "0");
    formData.append("id_formulario", this.consultancy.id_formulario?.toString() ?? "0");
    formData.append("id_status_assessoria", this.consultancy.id_status_assessoria.toString());
    formData.append("valor_assessoria", this.consultancy.valor_assessoria.toString());
    formData.append("id_tipo_pagamento", this.consultancy.id_tipo_pagamento.toString());
    formData.append("id_status_pagamento", this.consultancy.id_status_pagamento.toString());
    formData.append("data_contratacao", this.consultancy.id == 0 ? new Date().toLocaleString() : this.consultancy.data_contratacao!.toLocaleString());

    if (this.file) {
      formData.append("hasPic", "1");
      formData.append("attachment", <File> this.file);
    }

    if(this.consultancy_view?.formulario){
      formData = this.appendChecklistOnForm(formData, this.consultancy_view?.formulario);
    }

    if(this.travelers.length > 0){
      formData.append('viajantes[]', JSON.stringify(this.travelers));
    }

    return formData;
  }

  appendChecklistOnForm(formData: FormData, form?: FormularioVM) {
    if(!form?.perguntas){
      return formData;
    }

    formData.append('form_updated', form.editado ? 'true' : 'false');
    for(let p of form.perguntas){
      let obj = {
        id: p.id,
        descricao: p.descricao,
        id_tipo: p.id_tipo,
        obrigatoria: p.obrigatoria,
        ativo: p.ativo,
        ordenacao: p.ordenacao,
        respostasDropDown: p.respostasDropDown,
        editado: p.editado,
        resposta: {
          id: p.resposta.id,
          descricao: p.resposta.descricao,
          id_resposta_dropdown: p.resposta.id_resposta_dropdown,
          id_resposta_multi: p.resposta.id_resposta_multi,
          resposta_date: p.resposta.resposta_date?.toLocaleString(), // reconstruindo todo o obj por conta de um date
          caminho_anexo: p.resposta.caminho_anexo
        }
      };
      formData.append('perguntas[]', JSON.stringify(obj));
      if(p.id_tipo == 5 && p.obrigatoria){
        formData.append(`attachment_${p.id}`, <File> p.resposta.resposta_file);
      }
    }

    return formData;
  }

  validateAnswers(form?: FormularioVM){
    if(!form?.perguntas){
      return -1;
    }

    let id = 0;
    for(let p of form.perguntas){
      if( (p.obrigatoria) 
      && 
      (
           (p.id_tipo == TipoPergunta.Texto && (p.resposta.descricao == null || p.resposta.descricao == ''))
        || (p.id_tipo == TipoPergunta.Data && !p.resposta.resposta_date)
        || (p.id_tipo == TipoPergunta.Selecionavel && p.resposta.id_resposta_dropdown == 0) 
        || (p.id_tipo == TipoPergunta.MultiSelecionavel && p.resposta.id_resposta_multi?.length == 0)
        || (p.id_tipo == TipoPergunta.Anexo && !p.resposta.resposta_file)
      )){
        id = p.id;
        break;
      }
    }

    return id;
  }

  checkQuestion(p: PerguntaVM){
    return (
      (p.obrigatoria) 
      && 
      (
           (p.id_tipo == TipoPergunta.Texto && (p.resposta.descricao == null || p.resposta.descricao == ''))
        || (p.id_tipo == TipoPergunta.Data && !p.resposta.resposta_date)
        || (p.id_tipo == TipoPergunta.Selecionavel && p.resposta.id_resposta_dropdown == 0) 
        || (p.id_tipo == TipoPergunta.MultiSelecionavel && p.resposta.id_resposta_multi?.length == 0)
        || (p.id_tipo == TipoPergunta.Anexo && !p.resposta.resposta_file)
      )
    );
  }

  checkChanges(){
    // verificar alteracoes item a item (cansativo mas nao conheço nada dinamico pra isso)
    let updated = 
       this.consultancy.id_tipo_assessoria != this.old_consultancy?.id_tipo_assessoria
    || this.consultancy.id_tipo_visto != this.old_consultancy?.id_tipo_visto
    || this.consultancy.id_pais != this.old_consultancy?.id_pais
    || this.consultancy.id_funcionario != this.old_consultancy?.id_funcionario
    || this.consultancy.id_cliente != this.old_consultancy?.id_cliente
    || this.consultancy.id_tipo_pagamento != this.old_consultancy?.id_tipo_pagamento
    || this.consultancy.id_status_pagamento != this.old_consultancy?.id_status_pagamento
    || this.consultancy.id_formulario != this.old_consultancy?.id_formulario
    || this.consultancy.data_contratacao != this.old_consultancy?.data_contratacao
    || this.consultancy.id_status_assessoria != this.old_consultancy?.id_status_assessoria;

    if(updated) return updated;

    // verificando agora o formulario, se foi alterado;
    if(this.consultancy.id_formulario && this.old_consultancy_view?.formulario?.perguntas){
      for(let p of this.old_consultancy_view?.formulario?.perguntas){
        let perguntaAtual = this.consultancy_view?.formulario?.perguntas?.find(pe => pe.id == p.id);
        if(!perguntaAtual)
          continue;
        
        perguntaAtual.editado = false;
        let iguais = 
          perguntaAtual?.resposta.id_resposta_multi?.length == p.resposta.id_resposta_multi?.length &&
          perguntaAtual?.resposta.id_resposta_multi?.every(id => p.resposta.id_resposta_multi.includes(id));

          console.log(p)

        if(
             (p.id_tipo == TipoPergunta.Texto && perguntaAtual?.resposta.descricao != p.resposta.descricao)
          || (p.id_tipo == TipoPergunta.Data && perguntaAtual?.resposta.resposta_date?.getTime() != p.resposta.resposta_date?.getTime())
          || (p.id_tipo == TipoPergunta.Selecionavel && perguntaAtual?.resposta.id_resposta_dropdown != p.resposta.id_resposta_dropdown) 
          || (p.id_tipo == TipoPergunta.MultiSelecionavel && !iguais)
          || (p.id_tipo == TipoPergunta.Anexo && perguntaAtual?.resposta.resposta_file) // anexo nao inicializado para visualizacao;
        ){
          updated = perguntaAtual.editado = true;
        }
      }
    }

    this.consultancy_view!.formulario!.editado = updated;

    return updated;
  }

  sendMessage(title: string, msg: string, severity: string){
    this.messageService.add({ severity, summary: title, detail: msg });
  }
}