import { Component } from '@angular/core';
import { AuthService } from '../../services/app.auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})

export class LoginComponent {
	date: number = new Date().getFullYear();
	usuario: string = '';
	senha: string = '';
	manter_conectado: boolean = false;
	modal_esqueci_minha_senha: boolean = false;
	submitted: boolean = false;
	email: string = '';

	constructor(
		public authService: AuthService
	) { }

	ngOnInit(){
		this.authService.clearSessionStorage();
		this.authService.verifyTokenExpirationAtLocalStorage();
	}

	signIn(){
		if(this.usuario.trim() == '' || this.senha.trim() == ''){
			this.authService.sendMessage('warn', 'Atenção', 'Usuário e/ou senha em branco!');
			return;
		}

		this.authService.login(this.usuario, this.senha, this.manter_conectado);
	}

	signUp(){
		this.authService.redirectToSignin();
	}

	toggleModal(){
		this.modal_esqueci_minha_senha = !this.modal_esqueci_minha_senha;
	}

	forgotPassword(){
		if(!this.email){
			this.authService.sendMessage('warn', 'Atenção', 'Preencha um e-mail válido!');
			this.submitted = false;
			return;
		}

		this.authService.forgotPasswordEmail(this.email);
		this.toggleModal();
	}
}