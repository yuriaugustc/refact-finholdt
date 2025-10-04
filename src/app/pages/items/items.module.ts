import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsRoutingModule } from './items-routing.module';
import { CreateItemComponent } from './create/create-item.component';
import { LinkItemComponent } from './link/link-item.component';
import { ManageItemComponent } from './manage/manage-item.component';

import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FocusTrapModule } from 'primeng/focustrap';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { OrdenateItemComponent } from './ordenate/ordenate-item.component';
import { ItemService } from 'src/app/services/app.item.service';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
	declarations: [
		CreateItemComponent,
		OrdenateItemComponent,
		ManageItemComponent,
		LinkItemComponent
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
		ItemsRoutingModule,
		MultiSelectModule,
		TableModule,
		ToastModule,
		TooltipModule,
	],
	providers: [ItemService]
})
export class ItemsModule { }