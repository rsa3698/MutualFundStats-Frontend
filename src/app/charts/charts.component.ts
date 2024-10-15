import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [BaseChartDirective,CommonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent {
  @Input() chartData: any[] = [];
  @Input() months: string[] = [];   // Array to store months
  @Input() values: number[] = [];   // Array to store netInflowOutflow values
  @Input()
  parameter!: string;

  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: "",
        fill: false,
        tension: 0,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.chartData.length > 0) {
      this.updateChartData();
    }
  }

  // Extract and bind data to chart
  private updateChartData(): void {

    const months = this.chartData.map(item => item.month);
    const values = this.chartData.map(item => item[this.parameter]);

    // Update chart labels and dataset
    this.lineChartData.labels = months;
    this.lineChartData.datasets[0].data = values;
    this.lineChartData.datasets[0].label = this.parameter;
  }

  
}
