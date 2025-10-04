import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './guards/auth.guard';
import { AccessGuard } from './guards/access.guard';

@NgModule({
	imports: [
		RouterModule.forRoot([
			{ path: '', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
			{ path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
			{
				path: 'home', component: AppLayoutComponent, canActivate: [AuthGuard],
				children: [
					{ path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
					{ path: 'item', loadChildren: () => import('./pages/items/items.module').then(m => m.ItemsModule) },
					{ path: 'action', loadChildren: () => import('./pages/actions/actions.module').then(m => m.ActionsModule) },
					{ path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
					{ path: 'form', loadChildren: () => import('./pages/forms/form.module').then(m => m.FormModule) },
					{ path: 'consultancy', loadChildren: () => import('./pages/consultancy/consultancy.module').then(m => m.ConsultancyModule) },
					{ path: 'countries', loadChildren: () => import('./pages/countries/countries.module').then(m => m.CountryModule) },
					{ path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
				], canActivateChild: [AccessGuard]
			},
			{ path: 'notfound', component: NotfoundComponent },
			{ path: '**', redirectTo: '/notfound' },
		], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
