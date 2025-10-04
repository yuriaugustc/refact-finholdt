import { Component } from '@angular/core';
import { Pais } from 'src/app/models/assessoria';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { FormService } from 'src/app/services/app.form.service';
import { UserService } from 'src/app/services/app.user.service';

@Component({
  selector: 'app-fourth',
  templateUrl: './fourth.component.html',
})
export class FourthComponent {
  country?: Pais;

  constructor(
    public userService: UserService,
    public consultancyService: ConsultancyService,
    public formService: FormService,
  ) { }

  ngOnInit(){
    console.log(this.consultancyService.travelers)
    this.country = this
    .consultancyService
    .countries
    .find(
      x =>
        x.id == this
          .consultancyService
          .consultancy
          .id_pais
    );
  }

  userName() {
    return this
      .userService
      .costumers
      .find(
        x =>
          x.id == this
            .consultancyService
            .consultancy
            .id_cliente
      )?.nome_completo;
  }

  consultancyType() {
    return this
      .consultancyService
      .consultancyTypes
      .find(
        x =>
          x.id == this
            .consultancyService
            .consultancy
            .id_tipo_assessoria
      )?.nome;
  }

  formName(){
    return this
      .formService
      .forms
      .find(
        x =>
          x.id == this
            .consultancyService
            .consultancy
            .id_formulario
      )?.nome ?? 'Não Selecionado';
  }

  visaType() {
    return this
      .consultancyService
      .visaTypes
      .find(
        x =>
          x.id == this
            .consultancyService
            .consultancy
            .id_tipo_visto
      )?.nome;
  }

  paymentType() {
    return this
      .consultancyService
      .paymentTypes
      .find(
        x =>
          x.id == this
            .consultancyService
            .consultancy
            .id_tipo_pagamento
      )?.nome;
  }

  paymentStatus() {
    return this
      .consultancyService
      .paymentStatus
      .find(
        x =>
          x.id == this
            .consultancyService
            .consultancy
            .id_status_pagamento
      )?.nome;
  }

  noun(){
    // fazer métodos de parcelamento
  }

  formatDate(date?: Date) {
    if (date == undefined)
      return;
    // Obter o mês com zero à esquerda se for menor que 10
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    // Obter o ano com dois dígitos
    const year = date.getFullYear().toString().slice(2);
    // Retornar a data formatada
    return month + '/' + year;
  }
}
