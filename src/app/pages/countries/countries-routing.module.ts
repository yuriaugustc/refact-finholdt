import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManageCountriesComponent } from './manage-countries.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ManageCountriesComponent },
        ])
    ],
    exports: [RouterModule]
})
export class CountriesRoutingModule {
}
