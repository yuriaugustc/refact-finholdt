import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ConsultancyService } from 'src/app/services/app.consultancy.service';
import { ConsultancyModule } from '../consultancy/consultancy.module';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { NgModule } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { StyleClassModule } from 'primeng/styleclass';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { UserService } from 'src/app/services/app.user.service';

@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        ButtonModule,
        CardModule,
        ConsultancyModule,
        CommonModule,
        DialogModule,
        DividerModule,
        FormsModule,
        ImageModule,
        PanelModule,
        PasswordModule,
        ProfileRoutingModule,
        StyleClassModule,
        TabViewModule,
        TimelineModule,
    ],
    providers: [
        ConsultancyService,
        UserService,
    ]
})
export class ProfileModule { }
