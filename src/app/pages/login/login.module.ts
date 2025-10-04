import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { FocusTrapModule } from 'primeng/focustrap';
import { InputTextModule } from 'primeng/inputtext';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    LoginRoutingModule,
    ButtonModule,
    CheckboxModule,
    CommonModule,
    DialogModule,
    FocusTrapModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  providers: [],
})
export class LoginModule { }
