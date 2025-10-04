import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CrudUserComponent } from './crud/crud-user.component';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UserRoutingModule } from './user-routing.module';
import { UserService } from 'src/app/services/app.user.service';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@NgModule({
	declarations: [
		CrudUserComponent
	],
	imports: [
		ButtonModule,
		CommonModule,
		ConfirmPopupModule,
		DialogModule,
		DropdownModule,
		FileUploadModule,
		FormsModule,
		InputGroupModule,
		InputMaskModule,
		InputTextModule,
		KeyFilterModule,
		MultiSelectModule,
		OverlayPanelModule,
		SelectButtonModule,
		TableModule,
		TagModule,
		TooltipModule,
		UserRoutingModule
	],
	providers: [
		UserService
	]
})
export class UserModule { }