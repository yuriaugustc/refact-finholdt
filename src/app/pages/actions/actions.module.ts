import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsRoutingModule } from './actions-routing.module';
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
import { CreateActionComponent } from './create/create-action.component';
import { LinkActionComponent } from './link/link-action.component';
import { ManageActionComponent } from './manage/manage-action.component';
import { OrdenateActionComponent } from './ordenate/ordenate-action.component';
import { ItemService } from 'src/app/services/app.item.service';

@NgModule({
	declarations: [
		CreateActionComponent,
		LinkActionComponent,
		ManageActionComponent,
		OrdenateActionComponent,
	],
	imports: [
		ButtonModule,
		CheckboxModule,
		ConfirmPopupModule,
		CommonModule,
		DialogModule,
		DropdownModule,
		FocusTrapModule,
		FormsModule,
		InputTextModule,
		ActionsRoutingModule,
		MultiSelectModule,
		TableModule,
		ToastModule,
		TooltipModule,
	],
	providers: [
		ActionService, 
		ItemService,
	]
})
export class ActionsModule { }