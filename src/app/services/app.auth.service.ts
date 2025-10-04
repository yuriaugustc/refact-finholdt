import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { environment } from '../../../src/enviroments/enviroments';
import { NgxSpinnerService } from 'ngx-spinner';
import { Usuario } from '../models/usuario';
import { sha512 } from 'js-sha512';

@Injectable()
export class AuthService {
	private keepLoggedIn = false;

	constructor(private http: HttpClient,
		private spinner: NgxSpinnerService,
		private router: Router,
		private messageService: MessageService,
	) { }

	error(response: any){
		setTimeout(() => {
			this.spinner.hide('spinner');
		}, 1200);
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

	createCookie(name: string, value: string, days: number) {
		let date = new Date();
		let expires = "";
		if (days) {
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = `expires=${date.toUTCString()}`;
		}
		document.cookie = `${name}=${value}; SameSite=Lax; Secure; Path=/; ${expires};`;
	}

	verifyTokenExpirationAtCookie() {
		let token = this.getCookie('token');

		if (token.trim() == '') {
			this.logOut();
			return;
		}

		this.loginAgain();
	}

	getCookie(name: string) {
		const regex = new RegExp(`(^| )${name}=([^;]+)`)
		const match = document.cookie.match(regex)
		if (match) {
			return match[2];
		}

		return '';
	}

	clearCookies() {
		let cookies = document.cookie.split(";");
		for (let cookie of cookies) {
			let name = cookie.split('=')[0];
			document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;";
		}
	}

	createLocalStorage(name:string, value:string){
		localStorage.setItem(name, value);
	}

	createSessionStorage(name:string, value:string){
		sessionStorage.setItem(name, value);
	}

	getLocalStorage(name: string){
		return localStorage.getItem(name) ?? '';
	}

	getSessionStorage(name: string){
		return sessionStorage.getItem(name) ?? '';
	}

	clearLocalStorage(){
		localStorage.clear();
	}

	clearSessionStorage(){
		sessionStorage.clear();
	}

	verifyTokenExpirationAtLocalStorage(){
		this.spinner.show('spinner');
		setTimeout(() => {
			this.spinner.hide('spinner');
		}, 1200);
		
		let token = this.getLocalStorage('token');
		let expires = this.getLocalStorage('expires');
		if(token == '' || expires == ''){
			return;
		}

		let today = new Date();
		let expiration_date = new Date(parseInt(expires));
		
		if(expiration_date.getTime() < today.getTime()){
			this.logOut();
			return;
		}

		this.keepLoggedIn = true;
		this.loginAgain();
	}

	// aqui validamos apenas a session storage, pois daremos refresh apenas enquanto o usuário está logado
	// o token de remember-me só é atualizado ao login;
	refreshToken() {
		let expires = this.getSessionStorage('expires');
		if(!expires){
			this.logOut();
		}
		let date = new Date(parseInt(expires));

		if(date.getTime() < Date.now()){
			this
				.http
				.post(`${environment.apiUrl}/auth/refresh`, {}) // token vai ser injetado no Authorization
				.subscribe({
					next: (response: any) => {
						this.saveInfoOnSessionStorage(response);
					},
					error: (error) => {
						this.error(error);
					}
				});
		}
	}

	loginAgain(){
		this.http.post(`${environment.apiUrl}/auth/login`, {})
			.subscribe({
				next: (response: any) => {
					this.clearSessionStorage();

					this.saveInfoOnSessionStorage(response);
					if(this.keepLoggedIn){
						this.clearLocalStorage();
						let tokenExpiresAt = new Date();
						tokenExpiresAt.setDate(tokenExpiresAt.getDate() + response.days);
						this.createLocalStorage('token', response.token);
						this.createLocalStorage('expires', tokenExpiresAt.getTime().toString());
					}

					this.redirect('/home');
					setTimeout(() => {
						this.spinner.hide('spinner');
					}, 1200);
				},
				error: (error) => {
					this.error(error);
				}
			});
	}

	isLoggedIn() {
		return this.getSessionStorage('token') != '';
	}

	isLoggedOut() {
		return !this.isLoggedIn();
	}

	redirect(route: string){
		this.router.navigate([route]);
	}

	signup(novoUsuario: Usuario) {
		// TODO: implement signup
	}

	login(usuario: string, senha: string, keepConnected: boolean) {
		this.spinner.show('spinner');
		const body = {
			usuario: usuario,
			senha: sha512(senha)
		};
		this.http.post(`${environment.apiUrl}/auth/login`, JSON.stringify(body))
			.subscribe({
				next: (response: any) => {
					this.saveInfoOnSessionStorage(response);
					this.keepLoggedIn = keepConnected;
					if(keepConnected){
						let tokenExpiresAt = new Date();
						tokenExpiresAt.setDate(tokenExpiresAt.getDate() + response.days);
						this.createLocalStorage('token', response.token);
						this.createLocalStorage('expires', tokenExpiresAt.getTime().toString());
					}
					this.redirect('/home');

					setTimeout(() => {
						this.spinner.hide('spinner');
					}, 1200);
				},
				error: (error) => {
					this.error(error);
				}
			});
	}

	saveInfoOnSessionStorage(info: any)
	{
		let tokenExpiresAt = new Date();
		tokenExpiresAt.setDate(tokenExpiresAt.getDate() + info.days);
		this.createSessionStorage('token', info.token);
		this.createSessionStorage('expires', tokenExpiresAt.getTime().toString());
		this.createSessionStorage('foto', info.payload.foto);
		this.createSessionStorage('role', info.payload.role);
	}

	logOut() {
		this.spinner.show('spinner');

		this.clearSessionStorage();
		this.clearLocalStorage();
		this.clearCookies();

		this.redirect('/login');
		
		setTimeout(() => {
		this.spinner.hide('spinner');
		}, 1200);
	}

	redirectToSignin(){
		this.router.navigate(['/signUp']);
	}

	forgotPasswordEmail(email: string){
		this.http
			.post(`${environment.apiUrl}/auth/forgot`, JSON.stringify({ email }))
			.subscribe({
				next: (response) => {
					this.messageService.add({
						summary: 'Info',
						detail: 'Um email foi enviado com as instruções de renovação de senha!',
						severity: 'info'
					});
				},
				error: (error) => {
					this.error(error);
				}
			});
	}

	resetPassword(user: Usuario){
		this.http.post(`${environment.apiUrl}/user/reset`, JSON.stringify(user)).subscribe({
			next: (response : any) => {
				this.messageService.add({
					summary: 'Sucesso!',
					detail: 'Senha alterada para a padrão do sistema.',
					severity: 'success'
				});
			},
			error: (error) => {
				this.error(error);
			}
		});
	}

	updatePassword(actual_password: string, new_password: string, first_login: boolean = false){
    let body = {
			actual: sha512(actual_password),
			new: sha512(new_password),
			first_login
    }
    this.http.post(`${environment.apiUrl}/user/alter`, JSON.stringify(body), { withCredentials: true }).subscribe({
      next: (response : any) => {
				this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada!' });
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

	checkPassword(){
    return this.http.get(`${environment.apiUrl}/user/validate`, { withCredentials: true });
  }

	profile(){
		this.router.navigate(['/home/profile'], { skipLocationChange: true });
	}

	sendMessage(severity: string, summary: string, detail: string){
		this.messageService.add({ severity, summary, detail });
	}
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = this.authService.getLocalStorage('token') == '' ? this.authService.getSessionStorage('token') : this.authService.getLocalStorage('token');
		const cloned = req.clone({
			headers: req.headers.set('Authorization', token),
		});
		return next.handle(cloned);
	}
}