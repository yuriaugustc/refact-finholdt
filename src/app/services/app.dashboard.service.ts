import { Injectable } from '@angular/core';
import { Observable, from, pipe } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroments';
import { MessageService } from 'primeng/api';

@Injectable({
	providedIn: 'root',
})
export class DashBoardService {
	chartData: any = {};
	cardsData: any = {};
  consultancyTypes: any[] = [];
  products: any[] = [];

	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) { }

	error(response: any){
		console.error(response);

		let title = 'Erro';
		let severity = 'error';
		let msg = response.error.msg ?? environment.defaultMsgError;

		if (response.status == 400) {
			title = 'Atenção',
			severity = 'warn';
		}

		this.messageService.add({
			summary: title,
			detail: msg,
			severity: severity
		});
	}

	loadData(): Observable<void> {
    this.loadCardsData();
    this.loadConsultancyTypesForDash();

    return this.loadChartData();
  }

	loadCardsData(): Observable<void> {
    this.http.get(`${environment.apiUrl}/dashboard/cards`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.cardsData = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });

    return new Observable<void>();
  }

	loadConsultancyTypesForDash(): Observable<void> {
    this.http.get(`${environment.apiUrl}/dashboard/consultancytypes`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.consultancyTypes = response.data;
      },
      error: (error) => {
        this.error(error);
      }
    });

    return new Observable<void>();
  }

	loadChartData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/dashboard/chart`, { withCredentials: true }).pipe(
      map((response: any) => {
        return response.data; // Retorne os dados que deseja
      }),
      catchError(error => {
        this.error(error);
        throw error; // Reenvie o erro
      })
    )
  }
}
