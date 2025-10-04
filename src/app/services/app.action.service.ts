import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../../src/enviroments/enviroments';
import { TableLazyLoadEvent } from 'primeng/table';
import { Acao, Item } from '../models/item';

@Injectable()
export class ActionService {
	loading: boolean = false;
	actions: Acao[] = [];
	totalRecords: number = 0;
	clonedActions: { [s: string]: any } = {};
	userActions: Acao[] = [];

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

	createAction(action: Acao) {
		if (action.nome?.trim() == '') {
			this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Nome da ação em branco' });
			return;
		}
		else if(action.idItem == 0){
			this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione um item para ser vinculado' });
			return;
		}

		this.http
			.post(`${environment.apiUrl}/action/create`, JSON.stringify(action), { withCredentials: true, responseType: "json" })
			.subscribe({
				next: (response: any) => {
					this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ação criada!' });
				},
				error: (response) => {
					this.error(response);
				}
			});
	}

	loadActions(event: TableLazyLoadEvent) {
		this.loading = true;

		this.http.post(`${environment.apiUrl}/action/all`, JSON.stringify(event), { withCredentials: true }).subscribe({
			next: (response: any) => {
				response.data = response.data.map((a: { ativo: number | boolean; }) => {
					a.ativo = a.ativo == 1;
					return a;
				});
				this.actions = response.data;
				this.totalRecords = response.totalRecords;
			},
			error: (error) => {
				this.error(error);
			}
		});

		this.loading = false;
	}

	loadActionsForDropdown() {
		this.http.get(`${environment.apiUrl}/action/dropdown`, { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.actions = response.data;
			},
			error: (error) => {
				this.error(error);
			}
		});
	}

	loadActionsByItemId(id: number) {
		this.loading = true;

		this.http.post(`${environment.apiUrl}/action/byitem`, JSON.stringify({ id_item: id }), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.actions = response.data;
			},
			error: (error) => {
				this.error(error);
			}
		});

		this.loading = false;
	}

	loadActionsByUserId(id: number) {
		this.http.post(`${environment.apiUrl}/action/byuser`, JSON.stringify({ id_user: id }), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.userActions = response.data;
			},
			error: (error) => {
				this.error(error);
			}
		});
	}

	saveOrdenation() {
		this.http.post(`${environment.apiUrl}/action/ordenate`, JSON.stringify(this.actions), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordenação salva!' });
			},
			error: (error) => {
				this.error(error);
			}
		});
	}

	updateAction(action: Acao) {
		this.http.post(`${environment.apiUrl}/action/update`, JSON.stringify(action), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ação atualizada!' });

			},
			error: (error) => {
				this.error(error);
			}
		});
	}

	deleteAction(id: number) {
		this.http.post(`${environment.apiUrl}/action/delete`, JSON.stringify({ id }), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.actions = this.actions.filter(i => i.id != id);
				this.totalRecords = this.actions.length;
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ação deletada!' });

			},
			error: (error) => {
				this.error(error);
			}
		});
	}

	linkActions(selectedUser: number, selectedActions: Array<number>) {
		const body = {
			id_user: selectedUser,
			ids: selectedActions,
		};
		this.http.post(`${environment.apiUrl}/action/link`, JSON.stringify(body), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ação(ões) liberada(s)!' });
			},
			error: (error) => {
				this.error(error);
			}
		});
	}

	unlinkActions(selectedUser: number, selectedActions: Array<number>) {
		const body = {
			id_user: selectedUser,
			ids: selectedActions,
		};

		this.http.post(`${environment.apiUrl}/action/unlink`, JSON.stringify(body), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ação(ões) removida(s)!' });
			},
			error: (error) => {
				this.error(error);
			}
		});
	}
}