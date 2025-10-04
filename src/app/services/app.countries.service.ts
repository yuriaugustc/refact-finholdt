import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../../src/enviroments/enviroments';
import { TableLazyLoadEvent } from 'primeng/table';
import { Pais } from '../models/assessoria';

@Injectable()
export class CountryService {
	loading: boolean = false;
	countries: Pais[] = [];
	totalRecords: number = 0;

	constructor(
		private http: HttpClient,
		private messageService: MessageService
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

	loadCountries(event: TableLazyLoadEvent) {
		this.loading = true;

		this.http.post(`${environment.apiUrl}/countries/all`, JSON.stringify(event), { withCredentials: true }).subscribe({
			next: (response: any) => {
				response.data = response.data.map((a: { ativo: number | boolean; }) => {
					a.ativo = a.ativo == 1;
					return a;
				});
				this.countries = response.data;
				this.totalRecords = response.totalRecords;
			},
			error: (error) => {
				this.error(error);
			}
		});

		this.loading = false;
	}

	activateCountries(ids: number[]) {
		this.http.post(`${environment.apiUrl}/countries/activate`, JSON.stringify({ ids }), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'País(es) atualizado(s)!' });
				this.countries = this.countries.map(c => {
					if(environment.inArray(c.id, ids)){
						c.ativo = true;
					}
					return c;
				});
			},
			error: (error) => {
				this.error(error);
			}
		});
	}

	deactivateCountries(ids: number[]) {
		this.http.post(`${environment.apiUrl}/countries/deactivate`, JSON.stringify({ ids }), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'País(es) atualizado(s)!' });
				this.countries = this.countries.map(c => {
					if(environment.inArray(c.id, ids)){
						c.ativo = false;
					}
					return c;
				});
			},
			error: (error) => {
				this.error(error);
			}
		});
	}
}