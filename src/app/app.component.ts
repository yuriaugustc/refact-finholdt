import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PrimeNGConfig, Translation } from 'primeng/api';

@Component({
  selector: 'app-root',
  template: `
  <p-toast></p-toast>
  <p-confirmPopup></p-confirmPopup>
  <ngx-spinner name="spinner" [fullScreen]="true" type="ball-fussion" size="medium"></ngx-spinner>
  <router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'Arca Vistos';

  constructor(
    private config: PrimeNGConfig, 
    private http: HttpClient,
  ) {
    this.http.get('../assets/translate/pt-br.json', { responseType: "json" }).subscribe({
      next: (response: Translation) => {
        this.config.setTranslation(response);
      },
      error: (response) => {
        console.error(response);
      }
    });
  }
}
