import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pendencias } from 'src/app/enums/Pendencias';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { FormService } from 'src/app/services/app.form.service';
import { UserService } from 'src/app/services/app.user.service';
import { AssessoriaVM } from 'src/app/view_models/assessoria';
import { PerguntaVM } from 'src/app/view_models/formulario';

@Component({
  selector: 'app-consultancy-modal',
  templateUrl: './consultancy-modal.component.html'
})
export class ConsultancyModalComponent {
  @Input() consultancy?: AssessoriaVM;
  @Input() edit: boolean = false;
  @Input() pendencies: boolean = false;
  @Input() get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    this._visible = value;
  }
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  _visible: boolean = false;
  submitted: boolean = false;
  editForm: boolean = false;
  tomorrow: Date = new Date();

  constructor(
    public consultancyService: ConsultancyService,
    public userService: UserService,
    public formService: FormService,
  ) { }

  onVisibleChange(ev: boolean){
    this.editForm = false;
    this.visibleChange.emit(ev);
  }

  onUpload(pergunta: PerguntaVM, event: any) {
    pergunta.resposta.resposta_file = <File> event.target.files[0];
    event.target.value = null;
  }

  getFormQuestions(formId: number){
    if (this.consultancyService.consultancy_view?.formulario) {
      this.consultancyService.consultancy_view.formulario.perguntas = [];
    }
    this.formService.loadFormQuestionsForConsultancy(formId).subscribe({
      next: (response: any) => {
        for(let p of response.data){
          let pergunta: PerguntaVM = {
            id: p.id,
            descricao: p.descricao,
            ordenacao: p.ordenacao,
            id_tipo: p.id_tipo,
            obrigatoria: p.obrigatoria,
            resposta : {
              id: 0,
              descricao: '',
              id_resposta_dropdown: 0,
              id_resposta_multi: [],
            }
          }

          // selecionaveis
          if(pergunta.id_tipo == 3 || pergunta.id_tipo == 4){
            this.formService.loadQuestionAnswersForConsultancy(pergunta.id).subscribe({
              next: (response: any) => {
                pergunta.respostasDropDown = response.data;
              },
              error: (error) => {
                this.formService.error(error);
              }
            });
          }

          this.consultancyService.consultancy_view?.formulario?.perguntas?.push(pergunta);
        }
      },
      error: (error) => {
        this.formService.error(error);
      },
    });
  }

  check(){
    this.submitted = true;
    if( 
        this.consultancyService.consultancy.id_tipo_assessoria != 0
    &&  this.consultancyService.consultancy.id_cliente != 0
    &&  this.consultancyService.consultancy.id_funcionario != 0
    &&  this.consultancyService.consultancy.id_status_assessoria != 0
    && (!this.consultancyService.checkConsultancyTypeStrict() || this.consultancyService.consultancy.id_tipo_visto != 0)
    && (!this.consultancyService.checkConsultancyType() || this.consultancyService.consultancy.id_pais != 0)
    &&  this.consultancyService.consultancy.valor_assessoria != 0
    &&  this.consultancyService.consultancy.id_tipo_pagamento != 0
    //&& (!this.consultancyService.checkPaymentStatus([1]) || (this.consultancyService.consultancy.id_status_pagamento != 0 && this.consultancyService.file))
    //&& (!this.consultancyService.checkPaymentStatus([2,3]) || fazer validação de dados do cartão )
    && (!this.editForm || (!this.consultancyService.consultancy.id_formulario || !this.consultancyService.validateAnswers(this.consultancyService.consultancy_view?.formulario)))
    ){
      this.submitted = false;
      this.visible = false;
      this.onVisibleChange(this.visible);

      if(!this.consultancyService.checkChanges()){
        this.consultancyService.sendMessage('Info', 'Nenhuma alteração detectada!', 'info');
        return;
      }

      this.consultancyService.updateConsultancy();
      return;
    }

    this.consultancyService.sendMessage('Atenção', 'Preencha corretamente os campos.', 'warn');
  }

  checkPayment(){
    this.submitted = true;
    if( this.consultancyService.consultancy.valor_assessoria != 0
    &&  this.consultancyService.consultancy.id_tipo_pagamento != 0
    && (!this.consultancyService.checkPaymentStatus([1]) || (this.consultancyService.consultancy.id_status_pagamento != 0 && this.consultancyService.file))
    //&& (!this.consultancyService.checkPaymentStatus([2,3]) || fazer validação de dados do cartão )
    && (!this.editForm || (!this.consultancyService.consultancy.id_formulario || !this.consultancyService.validateAnswers(this.consultancyService.consultancy_view?.formulario)))
    ){
      this.submitted = false;

      this.consultancyService.resolvePendencies(Pendencias.PAGAMENTO);
      this.consultancyService.reloadPendencies();

      this.visible = false;
      this.onVisibleChange(this.visible);
      return;
    }

    this.consultancyService.sendMessage('Atenção', 'Preencha corretamente os campos.', 'warn');
  }

  saveAnswers() {
    if(!this.consultancyService.checkChanges()){
      this.consultancyService.sendMessage('Info', 'Nenhuma alteração detectada!', 'info');
      return;
    }
    
    this.consultancyService.saveAnswers();
    this.consultancyService.reloadPendencies();

    this.visible = false;
    this.onVisibleChange(this.visible);
  }

  checkAnswers() {
    return this.consultancyService.validateAnswers(
      this.consultancyService.consultancy_view?.formulario
    ) > 0;
  }

  checkForm(){
    this.submitted = true;
    if(!this.consultancy?.status_pagamento){
      this.consultancyService.sendMessage(
        'Atenção', 
        'Você precisa resolver a pendência de pagamento antes de preencher o formulário.', 
        'warn'
      );
      return;
    }

    if( this
        .consultancyService
        .validateAnswers(this.consultancyService.consultancy_view?.formulario)
      ){
      this.consultancyService.sendMessage('Atenção', 'Preencha os campos corretamente.', 'warn');
      return;
    }

    if( !this.consultancyService.checkChanges()
    ){
      this.consultancyService.sendMessage('Info', 'Nenhuma alteração detectada!', 'info');
      return;
    }

    this.submitted = false;

    this.consultancyService.resolvePendencies(Pendencias.STATUS);
    this.consultancyService.reloadPendencies();

    this.visible = false;
    this.onVisibleChange(this.visible);
  }
}
