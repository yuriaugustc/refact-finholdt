import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../../services/app.layout.service";
import { AuthService } from 'src/app/services/app.auth.service';

@Component({
	selector: 'app-topbar',
	templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
	foto: string = '';
	items!: MenuItem[];
	options!: MenuItem[];

	@ViewChild('menubutton') menuButton!: ElementRef;

	@ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

	@ViewChild('topbarmenu') menu!: ElementRef;

	constructor(public layoutService: LayoutService, private authService: AuthService) {
		this.foto = sessionStorage.getItem('foto') ?? '';
		this.options = [
			{
				label: 'Meu perfil',
				icon: 'pi pi-fw pi-user-edit',
				command: () => {
					this.authService.profile();
				}
			},
			{
				label: 'Configurações visuais',
				icon: 'pi pi-fw pi-palette',
				command: () => {
					this.layoutService.showConfigSidebar();
				}
			},
			{
				separator: true,
			},
			{
				label: 'Sair',
				icon: 'pi pi-fw pi-sign-out',
				styleClass: 'logout',
				command: () => {
					this.layoutService.resetTheme();
					this.authService.logOut();
				}
			}
		];
	}
}
