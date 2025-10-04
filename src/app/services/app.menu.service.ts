import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from '../models/menuchangeevent';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroments';
import { MessageService } from 'primeng/api';
import { AuthService } from './app.auth.service';

@Injectable({
	providedIn: 'root',
})
export class MenuService {
	private menuItems: any[] = [];

	private menuSource = new Subject<MenuChangeEvent>();
	private resetSource = new Subject();

	menuSource$ = this.menuSource.asObservable();
	resetSource$ = this.resetSource.asObservable();

	constructor(
		private http: HttpClient,
		private messageService: MessageService,
		private authService: AuthService
	) { }

	onMenuStateChange(event: MenuChangeEvent) {
		this.menuSource.next(event);
	}

	reset() {
		this.resetSource.next(true);
	}

	get getItems() {
		this.getItemsFromServer();

		return this.menuItems;
	}

	getItemsFromServer() {
		this.http.get(`${environment.apiUrl}/user/items`, { withCredentials: true }).subscribe({
			next: (response: any) => {
				if (response.data.length <= 0) {
					this.messageService.add({
						summary: 'Atenção',
						detail: 'Parece que você não possui nenhum item liberado ainda. Entre em contato com o administrador do sistema para receber seus acessos!',
						severity: 'warn'
					});
					return;
				}
				this.menuItems.length = 0;
				this.menuItems.push(...response.data);
				this.saveRoutesAllowed();
			},
			error: (response) => {
				console.error(response);

				if (response.status == 401) {
					this.messageService.add({
						summary: 'Atenção',
						detail: 'Sua sessão expirou! É necessário se reconectar novamente.',
						severity: 'warn'
					});
					this.authService.logOut();
					return;
				}

				this.messageService.add({
					summary: 'Erro',
					detail: response.error.errors.msg ?? 'Houve um erro interno, tente novamente em breve.',
					severity: 'error'
				});
			}
		});
	}

	saveRoutesAllowed() {
		let routes = [];

		sessionStorage.removeItem('allowed_routes');

		for(let item of this.menuItems){
			if(!item.items){
				routes.push(`/home/${item.routerLink}`);
			}
			else{
				for(let subItem of item.items){
					routes.push(`/home/${subItem.routerLink}`)
				}
			}
		}

		routes.push('/home/profile')

		// rotas filhas de consultancy. 
		//TODO: pensar em fazer isso dinamicamente, pode vir a aparecer mais rotas filhas
		if(routes.includes('/home/consultancy/create')){
			routes.push('/home/consultancy/create/first')
			routes.push('/home/consultancy/create/second')
			routes.push('/home/consultancy/create/third')
			routes.push('/home/consultancy/create/fourth')
		}

		sessionStorage.setItem('allowed_routes', JSON.stringify(routes));
	}
}
