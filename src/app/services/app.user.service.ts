import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../../src/enviroments/enviroments';
import { TableLazyLoadEvent } from 'primeng/table';
import { NivelAcesso } from '../models/nivelacesso';
import { Usuario } from '../models/usuario';
import { UsuarioVM } from '../view_models/usuario';

@Injectable()
export class UserService {
	loading: boolean = false;
	users: Usuario[] = [];
	costumers: Usuario[] = [];
	selectedUser: Usuario = { id: 0 };
	accessLevels: NivelAcesso[] = [];
	totalRecords: number = 0;
	clonedItems: { [s: string]: any } = {};
	customEvent!: TableLazyLoadEvent;
  userProfile?: UsuarioVM;

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

	createUser(form: FormData){
    this.http.post(`${environment.apiUrl}/user/create`, form, { withCredentials: true}).subscribe({
      next: (response : any) => {
				this.reloadUsers();
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  checkUser(whichColumn: number){
    let body = {
      column: whichColumn,
      id: this.selectedUser.id,
      data: ''
    };
    switch(whichColumn){
      case 1: // login
      body.data = this.selectedUser.login ?? '';
      break;
      case 2: // cpf
      body.data = this.selectedUser.cpf ?? '';
      break;
      case 3: // email
      body.data = this.selectedUser.email ?? '';
      break;
    }

    return this.http.post(`${environment.apiUrl}/user/check`, JSON.stringify(body), { withCredentials: true });
  }

  updateUser(form: FormData){
    this.http.post(`${environment.apiUrl}/user/update`, form, { withCredentials: true}).subscribe({
      next: (response : any) => {
				this.reloadUsers();
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

	deleteUser(ids: number[]){
		this.http.post(`${environment.apiUrl}/user/inactivate`, JSON.stringify(ids), { withCredentials: true}).subscribe({
			next: (response : any) => {
				this.reloadUsers();
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário(s) inativado(s)!' });
      },
      error: (error) => {
        this.error(error);
      }
		});
	}

	loadUsersForDropdown() {
		this.http.get(`${environment.apiUrl}/user/dropdown`, { withCredentials: true}).subscribe({
		  next: (response : any) => {
				this.users = response.data;
		  },
		  error: (error) => {
				this.error(error);
		  }
		});
	}

	loadUsers(event: TableLazyLoadEvent){
    this.loading = true;
		this.customEvent = event;
    this.http.post(`${environment.apiUrl}/user/all`, JSON.stringify(event), { withCredentials: true }).subscribe({
      next: (response : any) => {
        response.data = response.data.map((u: { ativo: number | boolean; }) => {
          u.ativo = u.ativo == 1;
          return u;
        });
        this.users = response.data;
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
				this.error(error);
		  }
    });
    this.loading = false;
  }

	reloadUsers(){
		this.loadUsers(this.customEvent);
	}

	loadSellers(){
    this.loading = true;
    this.http.get(`${environment.apiUrl}/user/seller`, { withCredentials: true }).subscribe({
      next: (response : any) => {
        response.data = response.data.map((u: { ativo: number | boolean; }) => {
          u.ativo = u.ativo == 1;
          return u;
        });
        this.users = response.data;
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
				this.error(error);
		  }
    });
    this.loading = false;
  }

  loadCostumers(){
    this.loading = true;
    this.http.get(`${environment.apiUrl}/user/costumer`, { withCredentials: true }).subscribe({
      next: (response : any) => {
        response.data = response.data.map((u: { ativo: number | boolean; }) => {
          u.ativo = u.ativo == 1;
          return u;
        });
        this.costumers = response.data;
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
				this.error(error);
		  }
    });
    this.loading = false;
  }

  loadUserProfile(){
    this.http.get(`${environment.apiUrl}/user/profile`, { withCredentials: true }).subscribe({
      next: (response : any) => {
        this.userProfile = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

	loadAccessLevels(){
    this.http.post(`${environment.apiUrl}/access/levels`, JSON.stringify({}) ,{ withCredentials: true }).subscribe({
      next: (response : any) => {
        this.accessLevels = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

	validateUser(loginInvalid: boolean, cpfInvalid: boolean, emailInvalid: boolean){
    if(!this.selectedUser.nome_completo 	|| 
			 !this.selectedUser.apelido 				|| 
       !this.selectedUser.email 					|| 
			 !this.selectedUser.id_nivel_acesso ||
       (!this.selectedUser.cpf || (this.selectedUser.cpf.length < 11 || this.selectedUser.cpf.length > 11)) ||
       (!this.selectedUser.celular || (this.selectedUser.celular.length < 11 || this.selectedUser.celular.length > 11))
			) {
				this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
        return false;
    }

    if(loginInvalid || cpfInvalid || emailInvalid)
    {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Dados inconsistentes. Preencha corretamente os campos.' });
      return false;
   }
    return true;
  }
}