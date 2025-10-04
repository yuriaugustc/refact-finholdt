import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './menu/app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './topbar/app.topbar.component';
import { AppFooterComponent } from './footer/app.footer.component';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from "./sidebar/app.sidebar.component";
import { AppLayoutComponent } from "./app.layout.component";
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../services/app.auth.service';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
    ],
    imports: [
        AppConfigModule,
        AvatarModule,
        BadgeModule,
        BrowserAnimationsModule,
        BrowserModule,
        ButtonModule,
        DialogModule,
        DividerModule,
        FormsModule,
        HttpClientModule,
        InputSwitchModule,
        MenuModule,
        PasswordModule,
        RadioButtonModule,
        RippleModule,
        RouterModule,
        SidebarModule,
        TooltipModule,
        ToastModule,
    ],
    providers: [AuthService],
    exports: [AppLayoutComponent]
})
export class AppLayoutModule { }
