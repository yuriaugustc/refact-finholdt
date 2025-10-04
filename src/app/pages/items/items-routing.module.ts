import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateItemComponent } from './create/create-item.component';
import { LinkItemComponent } from './link/link-item.component';
import { ManageItemComponent } from './manage/manage-item.component';
import { OrdenateItemComponent } from './ordenate/ordenate-item.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'create', component: CreateItemComponent },
			{ path: 'ordenate', component: OrdenateItemComponent },
			{ path: 'manage', component: ManageItemComponent },
			{ path: 'link', component: LinkItemComponent },
		])
	],
	exports: [RouterModule]
})
export class ItemsRoutingModule {
}
