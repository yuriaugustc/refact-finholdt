import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FocusTrapModule } from 'primeng/focustrap';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ActionService } from 'src/app/services/app.action.service';
import { ItemService } from 'src/app/services/app.item.service';
import { ManageCountriesComponent } from './manage-countries.component';
import { CountriesRoutingModule } from './countries-routing.module';
import { ConfirmationService } from 'primeng/api';
import { CountryService } from 'src/app/services/app.countries.service';

@NgModule({
	declarations: [
		ManageCountriesComponent,
	],
	imports: [
		ButtonModule,
		CheckboxModule,
		CommonModule,
		ConfirmPopupModule,
		CountriesRoutingModule,
		DialogModule,
		DropdownModule,
		FocusTrapModule,
		FormsModule,
		InputTextModule,
		MultiSelectModule,
		TableModule,
		ToastModule,
		TooltipModule,
	],
	providers: [
		ConfirmationService,
		CountryService
	]
})
export class CountryModule { }