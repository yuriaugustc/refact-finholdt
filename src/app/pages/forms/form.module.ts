import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { CrudQuestionComponent } from './question/crud-question.component';
import { FormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/app.form.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ManageFormComponent } from './form/manage-form.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { PickListModule } from 'primeng/picklist';
import { TooltipModule } from 'primeng/tooltip';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';

@NgModule({
	declarations: [
		CrudQuestionComponent,
		ManageFormComponent
	],
	imports: [
		ButtonModule,
		ConfirmPopupModule,
		CommonModule,
		CheckboxModule,
		DialogModule,
		DropdownModule,
		FormRoutingModule,
		FormsModule,
		InputTextModule,
		MultiSelectModule,
		TableModule,
		TooltipModule,
		PickListModule,
	],
	providers: [
		FormService,
		ConsultancyService
	]
})
export class FormModule { }