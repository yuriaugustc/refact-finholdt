import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { FocusTrapModule } from 'primeng/focustrap';
import { InputTextModule } from 'primeng/inputtext';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';

import { AppLayoutModule } from './layout/app.layout.module';
import { AppComponent } from './app.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthInterceptor, AuthService } from './services/app.auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { AccessGuard } from './guards/access.guard';

@NgModule({
  declarations: [
    AppComponent,
    //SignUpComponent,
    NotfoundComponent,
  ],
  imports: [
    AppLayoutModule,
    AppRoutingModule,
    BrowserModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    FocusTrapModule,
    FormsModule,
    InputTextModule,
    MessagesModule,
    NgxSpinnerModule,
    PasswordModule,
    ToastModule,
  ],
  providers: [
    MessageService, ConfirmationService,
    AuthService, AuthGuard, AccessGuard,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
