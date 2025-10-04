import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { MenuService } from 'src/app/services/app.menu.service';

@Component({
	selector: 'app-menu',
	templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
	model: any[] = [];

	constructor(
		public layoutService: LayoutService,
		public menuService: MenuService
	) { }

	ngOnInit() {
		this.model = this.menuService.getItems;
	}
}
