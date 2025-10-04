import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../../src/enviroments/enviroments';
import { TableLazyLoadEvent } from 'primeng/table';
import { Item } from '../models/item';

@Injectable()
export class ItemService {
	loading: boolean = false;
	items: Item[] = [];
	userItems: Item[] = [];
	totalRecords: number = 0;
	clonedItems: { [s: string]: any } = {};

	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) { }

	error(response: any) {
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

	createItem(item: Item) {
		if (item.nome?.trim() == '') {
			this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Nome do item em branco' });
			return;
		}

		this.http
			.post(`${environment.apiUrl}/item/create`, JSON.stringify(item), { withCredentials: true, responseType: "json" })
			.subscribe({
				next: (response: any) => {
					this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Item criado!' });
				},
				error: (response) => {
					this.error(response);
				}
			});
	}

	saveOrdenation() {
		this.http.post(`${environment.apiUrl}/item/ordenate`, JSON.stringify(this.items), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordenação salva!' });
			},
			error: (response) => {
				this.error(response);
			}
		});
	}

	loadItems(event: TableLazyLoadEvent) {
		this.loading = true;
		this.http.post(`${environment.apiUrl}/item/all`, JSON.stringify(event), { withCredentials: true }).subscribe({
			next: (response: any) => {
				response.data = response.data.map((i: { ativo: number | boolean; }) => {
					i.ativo = i.ativo == 1;
					return i;
				});
				this.items = response.data;
				this.totalRecords = response.totalRecords;
			},
			error: (response) => {
				this.error(response);
			}
		});

		this.loading = false;
	}

	loadItemsForDropdown() {
		this.http.get(`${environment.apiUrl}/item/dropdown`, { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.items = response.data;
			},
			error: (response) => {
				this.error(response);
			}
		});
	}

	loadItemsByUser(id: number) {
		this.http.post(`${environment.apiUrl}/item/byuser`, JSON.stringify({ id_user: id }), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.userItems = response.data;
			},
			error: (response) => {
				this.error(response);
			}
		});
	}

	updateItem(item: Item) {
		this.http.post(`${environment.apiUrl}/item/update`, JSON.stringify(item), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item atualizado!' });
			},
			error: (response) => {
				this.error(response);
			}
		});
	}

	linkUserItems(body: any) {
		this.http.post(`${environment.apiUrl}/item/link`, JSON.stringify(body), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item liberado ao usuário!' });
			},
			error: (response) => {
				this.error(response);
			}
		});
	}

	unlinkUserItems(body: any) {
		this.http.post(`${environment.apiUrl}/item/unlink`, JSON.stringify(body), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item(ns) removido(s)!' });
			},
			error: (response) => {
				this.error(response);
			}
		});
	}

	deleteItem(id: number) {
		this.http.post(`${environment.apiUrl}/item/delete`, JSON.stringify({ id }), { withCredentials: true }).subscribe({
			next: (response: any) => {
				this.items = this.items.filter(i => i.id != id);
				this.totalRecords = this.items.length;
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item deletado!' });
			},
			error: (response) => {
				this.error(response);
			}
		});
	}
}