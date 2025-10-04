import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { FormService } from 'src/app/services/app.form.service';
import { DashBoardService } from 'src/app/services/app.dashboard.service';

@NgModule({
	declarations: [DashboardComponent],
	imports: [
		CommonModule,
		FormsModule,
		ChartModule,
		MenuModule,
		TableModule,
		StyleClassModule,
		PanelMenuModule,
		ButtonModule,
		DashboardsRoutingModule
	],
	providers: [
		ConsultancyService,
		FormService,
		DashBoardService
	]
})
export class DashboardModule { }
