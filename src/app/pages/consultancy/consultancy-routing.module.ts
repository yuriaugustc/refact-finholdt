import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateConsultancyComponent } from './create/create-consultancy.component';
import { ConsultancyPanelComponent } from './panel/consultancy-panel.component';
import { ManageConsultancyComponent } from '../../../../manage/manage-consultancy.component';
import { MineConsultancyComponent } from './mine/mine-consultancy.component';
import { FirstComponent } from './create/steps/1-first/first.component';
import { FourthComponent } from './create/steps/4-fourth/fourth.component';
import { SecondComponent } from './create/steps/2-second/second.component';
import { ThirdComponent } from './create/steps/3-third/third.component';
import { PendingConsultancyComponent } from './pend/pending-consultancy.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'create', component: CreateConsultancyComponent,
				children: [
					{ path: 'first', component: FirstComponent },
					{ path: 'second', component: SecondComponent },
					{ path: 'third', component: ThirdComponent },
					{ path: 'fourth', component: FourthComponent },
				]
			},
			{ path: 'panel', component: ConsultancyPanelComponent },
			{ path: 'manage', component: ManageConsultancyComponent },
			{ path: 'mine', component: MineConsultancyComponent },
			{ path: 'pend', component: PendingConsultancyComponent },
		])
	],
	exports: [RouterModule]
})
export class ConsultancyRoutingModule {
}
