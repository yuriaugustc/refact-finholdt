import { AccordionModule } from 'primeng/accordion';
import { AutoFocusModule } from 'primeng/autofocus';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConsultancyRoutingModule } from './consultancy-routing.module';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DropdownModule } from 'primeng/dropdown';
import { FocusTrapModule } from 'primeng/focustrap';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgModule } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TimelineModule } from 'primeng/timeline';

import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { FormService } from 'src/app/services/app.form.service';
import { UserService } from 'src/app/services/app.user.service';

import { ConsultancyModalComponent } from './modal/consultancy-modal.component';
import { ConsultancyPanelComponent } from './panel/consultancy-panel.component';
import { CreateConsultancyComponent } from './create/create-consultancy.component';
import { FirstComponent } from './create/steps/1-first/first.component';
import { FourthComponent } from './create/steps/4-fourth/fourth.component';
import { ManageConsultancyComponent } from '../../../../manage/manage-consultancy.component';
import { MineConsultancyComponent } from './mine/mine-consultancy.component';
import { PendingConsultancyComponent } from './pend/pending-consultancy.component';
import { SecondComponent } from './create/steps/2-second/second.component';
import { ThirdComponent } from './create/steps/3-third/third.component';

@NgModule({
	declarations: [
		FirstComponent,
		SecondComponent,
		ThirdComponent,
		FourthComponent,
		ConsultancyModalComponent,
		ConsultancyPanelComponent,
		CreateConsultancyComponent,
		ManageConsultancyComponent,
		MineConsultancyComponent,
		PendingConsultancyComponent,
	],
	imports: [
		AccordionModule,
		AutoFocusModule,
		AvatarModule,
		BadgeModule,
		ButtonModule,
		CalendarModule,
		CheckboxModule,
		CommonModule,
		ConfirmPopupModule,
		ConsultancyRoutingModule,
		DataViewModule,
		DialogModule,
		DragDropModule,
		DropdownModule,
		FocusTrapModule,
		FormsModule,
		InputNumberModule,
		InputTextModule,
		KeyFilterModule,
		MultiSelectModule,
		StepsModule,
		TableModule,
		TabViewModule,
		TimelineModule,
		ToggleButtonModule,
	],
	providers: [
		ConsultancyService,
		FormService,
		UserService,
	], 
	exports: [
		ConsultancyModalComponent
	]
})
export class ConsultancyModule { }