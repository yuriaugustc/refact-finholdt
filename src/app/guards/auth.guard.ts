import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/app.auth.service';

@Injectable()
export class AuthGuard {

	constructor(private authService: AuthService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean 
	{
		return this.checkToken();
	}

	checkToken(): boolean
	{
		const token = this.authService.getLocalStorage('token') == '' ? this.authService.getSessionStorage('token') : this.authService.getLocalStorage('token');
		const expires = this.authService.getSessionStorage('expires');
		// token vazio/inválido ou expiração vazia ou já expirado, pois a data de expiração é menor que hoje/agora;
		if (!token || !expires || (parseInt(expires) < new Date().getTime())){
			this.authService.sendMessage('warn', 'Atenção', 'Seu sessão expirou, entre novamente.');
			this.authService.logOut();
			return false;
		}

		return true;
	}
}
