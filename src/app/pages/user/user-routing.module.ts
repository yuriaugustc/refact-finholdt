import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CrudUserComponent } from './crud/crud-user.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: CrudUserComponent }
		])
	],
	exports: [RouterModule]
})
export class UserRoutingModule {
}
