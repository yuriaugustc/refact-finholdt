import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CrudQuestionComponent } from './question/crud-question.component';
import { ManageFormComponent } from './form/manage-form.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'question', component: CrudQuestionComponent },
			{ path: 'manage', component: ManageFormComponent },
		])
	],
	exports: [RouterModule]
})
export class FormRoutingModule {
}
