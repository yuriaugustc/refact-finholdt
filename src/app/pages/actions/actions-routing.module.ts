import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateActionComponent } from './create/create-action.component';
import { LinkActionComponent } from './link/link-action.component';
import { ManageActionComponent } from './manage/manage-action.component';
import { OrdenateActionComponent } from './ordenate/ordenate-action.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'create', component: CreateActionComponent },
            { path: 'manage', component: ManageActionComponent },
            { path: 'link', component: LinkActionComponent },
            { path: 'ordenate', component: OrdenateActionComponent},
        ])
    ],
    exports: [RouterModule]
})
export class ActionsRoutingModule {
}
