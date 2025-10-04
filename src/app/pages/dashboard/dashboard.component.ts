import { Component } from '@angular/core';
import { DashBoardService } from 'src/app/services/app.dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  chartData: any;
  chartOptions: any;

  constructor(public dashBoardService: DashBoardService) { }

  ngOnInit() {
    this.dashBoardService.loadCardsData();
    this.dashBoardService.loadConsultancyTypesForDash();
    this.dashBoardService.loadChartData().subscribe({
      next: (data) => {
        this.dashBoardService.chartData = data;
        this.initChart();
      }
    });
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: this.dashBoardService.chartData.labels,
      datasets: [
        {
          data: this.dashBoardService.chartData.values,
          fill: true,
          tension: .4,
          borderColor: documentStyle.getPropertyValue('--text-color'), //documentStyle.getPropertyValue('--cyan-700'),
          backgroundColor: documentStyle.getPropertyValue('--primary-color'), //'rgba(148, 224, 237, 0.2)',
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
