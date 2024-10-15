import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartsComponent } from "./charts/charts.component";
import { ChartdataService } from './chartdata.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { SCHEME_DICTIONARY } from './constants/scheme-dictionary';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChartsComponent ,ReactiveFormsModule , MatDatepickerModule , MatFormFieldModule ,MatSelectModule,MatInputModule ,MatNativeDateModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MutualFundStats';
  formattedParameter : string ="";
  generateStatus : boolean = false;
  fundForm: FormGroup;
  fundTypes: string[] = Object.keys(SCHEME_DICTIONARY);
  parameters: string[] = ['NumberOfFolios', 'FundsMobilized', 'RepurchaseRedemption', 'NetInflowOutflow', 'NetAssetsUnderManagement', 'AverageNetAssetsUnderManagement'];
  chartData: any[] = [];
  months: string[] = [];   // Array to store months
  values: number[] = [];   // Array to store netInflowOutflow values
  private extractChartData(parameter: string): void {
    // Convert the first letter of fundType to lowercase
  this.formattedParameter = parameter.charAt(0).toLowerCase() + parameter.slice(1);
    this.months = this.chartData.map(item => item.month);
    this.values = this.chartData.map(item => item[this.formattedParameter]);
  }

  ngOnInit(): void {
    
  }

  constructor(private chartDataService: ChartdataService, private fb: FormBuilder) {
    this.fundForm = this.fb.group({
      fundType: ['', Validators.required],
      parameter: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }


  public formatToYearMonth(dateString: Date): string {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  
    return `${year}-${month}`;
  }

  public generateGraph()
  {
    this.generateStatus = true;
  }

  resetGraph() {
    this.chartData = [];  // Clear the chart data
    this.months = [];     // Clear the months
    this.values = [];     // Clear the values
    this.formattedParameter = ''; // Reset the parameter
    this.generateStatus = false; // Reset the generation status
  }
  

  getSchemeId(schemeName: string): number{
    return SCHEME_DICTIONARY[schemeName];
  }

  onSubmit() {
    if (this.fundForm.valid) {
      const startDate = new Date(this.fundForm.value.startDate);
      const endDate = new Date(this.fundForm.value.endDate)
      const formattedStartDate = this.formatToYearMonth(startDate);
      const formattedEndDate = this.formatToYearMonth(endDate);
      let parameter = this.fundForm.value.parameter;
      this.chartDataService
      .getMonthWiseData(this.getSchemeId(this.fundForm.value.fundType), this.fundForm.value.parameter, formattedStartDate, formattedEndDate)
      .subscribe({
        next: (data) => {
          this.chartData = data;
          console.log('Chart Data:', data);
          this.extractChartData(parameter);
        },
        error: (error) => {
          console.error('Error fetching chart data:', error);
        }
      });
    }
  }
}
