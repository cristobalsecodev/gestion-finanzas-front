import { Component, computed, effect, HostListener, inject } from '@angular/core';
import { allRecordsSignal } from '../utils/SharedList';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import { CurrencyExchange } from 'src/app/shared/services/CurrencyExchange/CurrencyExchange.interface';
import { CurrencyExchangeService } from 'src/app/shared/services/CurrencyExchange/currency-exchange.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { IncomeOrExpense } from '../interfaces/IncomeOrExpense.interface';
import { convertAmountsIntoOneCurrency } from 'src/app/shared/functions/ConvertCurrencies';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FLAGS } from 'src/app/shared/constants/svg.constants';
import { DomSanitizer } from '@angular/platform-browser';
import { DonutChartComponent, DonutChartData } from './donut-chart/donut-chart.component';
import { CurrencySymbolPipe } from 'src/app/shared/pipes/SimboloDivisa/currency-symbol.pipe';
import { FormatThousandSeparatorsPipe } from 'src/app/shared/pipes/FormatThousandSeparators/format-thousand-separators.pipe';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';

@Component({
  selector: 'app-income-or-expense-statistics',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    MatIconModule,
    // Librería
    HighchartsChartModule,
    // Componentes
    // CurrencySelectorComponent,
    DonutChartComponent,
    // Pipes
    CurrencySymbolPipe,
    FormatThousandSeparatorsPipe
  ],
  templateUrl: './income-or-expense-statistics.component.html',
  styleUrl: './income-or-expense-statistics.component.scss'
})
export class IncomeOrExpenseStatisticsComponent {

  sumIncome: number = 0
  sumExpense: number = 0

  recordsComputed = computed(() => allRecordsSignal())
  convertedRecords: IncomeOrExpense[] = []

  Highcharts: typeof Highcharts = Highcharts

  // Gráfico de resumen
  // resumeOptions: any = {
  //   chart: {
  //     type: 'bar',
  //     backgroundColor: 'transparent',
  //     height: 300
  //   },
  //   title: {
  //     text: 'Comparation of income and expenses',
  //     align: 'left',
  //     style: {
  //       color: 'var(--sys-on-background)',
  //       fontSize: '16px'
  //     }
  //   },
  //   xAxis: {
  //     categories: ['Resume'],
  //     labels: {
  //       style: {
  //         color: 'var(--sys-on-background)'
  //       }
  //     }
  //   },
  //   yAxis: {
  //     min: 0,
  //     title: { text: '' },
  //     gridLineWidth: 0,
  //     labels: {
  //       style: {
  //         color: 'var(--sys-on-background)'
  //       }
  //     }
  //   },
  //   legend: {
  //     reversed: true,
  //     itemStyle: {
  //       color: 'var(--sys-on-background)'
  //     }
  //   },
  //   plotOptions: {
  //     bar: {
  //       borderWidth: 0,
  //       pointWidth: 25, // Altura de las barras del gráfico
  //       dataLabels: {
  //         enabled: true,
  //         color: 'var(--sys-on-background)'
  //       }
  //     },
  //     series: {
  //       dataLabels: {
  //         enabled: true,
  //         style: {
  //           textOutline: 'none', // 🔹 Contorno del texto
  //         }
  //       }
  //     }
  //   },
  //   tooltip: {
  //     backgroundColor: 'var(--sys-background)',
  //     borderColor: 'var(--sys-on-background)',
  //     style: {
  //       color: 'var(--sys-on-background)',
  //     }
  //   },
  //   credits: { enabled: false },
  //   series: [
  //     {
  //       name: 'Income',
  //       data: [0]
  //     },
  //     {
  //       name: 'Expense',
  //       data: [0]
  //     }
  //   ]
  // };

  // Gráfico de ingresos
  // incomeChartOptions: any = {

  //   chart: {
  //       type: 'pie',
  //       backgroundColor: null,
  //   },
  //   title: {
  //       text: 'Income Overview',
  //       style: {
  //         color: 'var(--sys-on-background)'
  //       }
  //   },
  //   tooltip: {
  //     useHTML: true,
  //     backgroundColor: 'var(--sys-background)',
  //     borderRadius: 0, // Bordes redondeados
  //     style: {
  //       color: 'var(--sys-on-background)',
  //       fontSize: '14px',
  //       fontWeight: 'bold'
  //     },
  //     pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
  //   },
  //   legend: {
  //       enabled: false
  //   },
  //   plotOptions: {
  //       series: {
  //           borderWidth: 0,
  //           borderColor: 'transparent',
  //           allowPointSelect: true,
  //           cursor: 'pointer',
  //           borderRadius: 0,
  //           dataLabels: [
  //             {
  //                 enabled: true,
  //                 distance: -15,
  //                 format: '{point.percentage:.0f}%',
  //                 style: {
  //                     fontSize: '0.9em'
  //                 }
  //             }
  //           ],
  //           showInLegend: true
  //       }
  //   },
  //   series: [{
  //       name: 'Total',
  //       colorByPoint: true,
  //       innerSize: '75%',
  //       data: []
  //   }],
  //   credits: {
  //     enabled: false
  //   }
  // }

  // Gráfico de gastos
  // expenseChartOptions: any = {

  //   chart: {
  //       type: 'pie',
  //       backgroundColor: null,
  //   },
  //   title: {
  //       text: 'Expense Overview',
  //       style: {
  //           color: 'var(--sys-on-background)'
  //       }
  //   },
  //   tooltip: {
  //     useHTML: true,
  //     backgroundColor: 'var(--sys-background)',
  //     borderRadius: 0,
  //     style: {
  //       color: 'var(--sys-on-background)',
  //       fontSize: '14px',
  //       fontWeight: 'bold'
  //     },
  //     pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
  //   },
  //   legend: {
  //       enabled: false
  //   },
  //   plotOptions: {
  //       series: {
  //           borderWidth: 0,
  //           borderColor: 'transparent',
  //           allowPointSelect: true,
  //           cursor: 'pointer',
  //           borderRadius: 0,
  //           dataLabels: [
  //             {
  //                 enabled: true,
  //                 distance: -15,
  //                 format: '{point.percentage:.0f}%',
  //                 style: {
  //                     fontSize: '0.9em'
  //                 }
  //             }
  //           ],
  //           showInLegend: true
  //       }
  //   },
  //   series: [{
  //       name: 'Total',
  //       colorByPoint: true,
  //       innerSize: '75%',
  //       data: []
  //   }],
  //   credits: {
  //     enabled: false
  //   }
  // }

  // Servicios
  currencyExchangeService = inject(CurrencyExchangeService)
  tokenService = inject(TokenService)
  storageService = inject(StorageService)

  // Controla el menú desplegable de divisas
  dropdownOpen = false

  selectedCurrency: CurrencyExchange = this.currencyExchangeService.defaultCurrency

  incomeChartData: DonutChartData[] = []

  expenseChartData: DonutChartData[] = []
  
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {

    // Suscribe los cambios del signal para actualizar los gráficos
    effect(() => {

      const storedCurrency = this.storageService.getLocal('graphics-currency')
      let currency: CurrencyExchange | undefined

      if(storedCurrency) {

        currency = this.currencyExchangeService.currencies().find(currency => currency.currencyCode === storedCurrency)

      } else {

        currency = this.currencyExchangeService.currencies().find(currency => currency.currencyCode === this.tokenService.favoriteCurrency())

      }

      this.currencyChange(
        currency || this.currencyExchangeService.defaultCurrency
      )

    })

    // Añadimos los SVGs
    FLAGS.forEach(flag => {

      this.matIconRegistry.addSvgIconLiteral(
        flag.currencyCode,
        this.domSanitizer.bypassSecurityTrustHtml(flag.svg)
      )

    })

  }

  // private updateResumeChart() {

  //   this.resumeOptions = {
  //     ...this.resumeOptions,
  //     series: [
  //       {
  //         name: 'Income',
  //         data: [this.sumIncome],
  //         color: 'var(--sys-action-green)'
  //       },
  //       {
  //         name: 'Expense',
  //         data: [this.sumExpense],
  //         color: 'var(--sys-action-red)'
  //       }
  //     ]
  //   }

  // }

  // private updateIncomeChart() {

  //   const data = this.processChartData('income')

  //   this.sumIncome = Number((data.reduce((sum, record) => sum + record.y!, 0)).toFixed(2))

  //   this.incomeChartOptions = {
  //     ...this.incomeChartOptions,
  //     series: [{
  //       ...this.incomeChartOptions.series[0],
  //       data: data
  //     }]
  //   };

  // }

  // private updateExpenseChart() {

  //   const data = this.processChartData('expense')

  //   this.sumExpense = Number((data.reduce((sum, record) => sum + record.y!, 0)).toFixed(2))

  //   this.expenseChartOptions = {
  //     ...this.expenseChartOptions,
  //     series: [{
  //       ...this.expenseChartOptions.series[0],
  //       data: data
  //     }]
  //   };    

  // }

  // private processChartData(type: 'income' | 'expense'): Highcharts.PointOptionsObject[] {
  
  //   const categoryMap = new Map<string, { amount: number, color: string }>()
  
  //   this.convertedRecords
  //     .filter(record => record.type === type)
  //     .forEach(record => {
  
  //       const categoryName = record.category.name
  //       const categoryColor = record.category.color
  //       const existing = categoryMap.get(categoryName)
  
  //       categoryMap.set(categoryName, {
  //         amount: (existing?.amount || 0) + Math.abs(record.amount),
  //         color: existing?.color || categoryColor
  //       })
  
  //     })
  
  //   return Array.from(categoryMap, ([name, data]) => ({
  //     name,
  //     y: data.amount,
  //     color: data.color
  //   }))
  // }
























  private updateIncomeChart() {

    this.incomeChartData = this.processChartData('income')
    this.sumIncome = Number((this.incomeChartData.reduce((sum, record) => sum + record.amount!, 0)).toFixed(2))

  }

  private updateExpenseChart() {

    this.expenseChartData = this.processChartData('expense')
    this.sumExpense = Number((this.expenseChartData.reduce((sum, record) => sum + record.amount!, 0)).toFixed(2))

  }

  private processChartData(type: 'income' | 'expense'): DonutChartData[] {
  
    const categoryMap = new Map<string, { amount: number, color: string }>()
  
    this.convertedRecords
      .filter(record => record.type === type)
      .forEach(record => {
  
        const categoryName = record.category.name
        const categoryColor = record.category.color
        const existing = categoryMap.get(categoryName)
  
        categoryMap.set(categoryName, {
          amount: (existing?.amount || 0) + Math.abs(record.amount),
          color: existing?.color || categoryColor
        })
  
      })
  
    return Array.from(categoryMap, ([name, data]) => ({
      category: name,
      amount: data.amount,
      color: data.color
    }))
  }

  get incomeWidth(): string {

    const max = Math.max(this.sumIncome, this.sumExpense)
    return max > 0 ? `${(this.sumIncome / max) * 100}%` : '0%'

  }
  
  get expenseWidth(): string {

    const max = Math.max(this.sumIncome, this.sumExpense)
    return max > 0 ? `${(this.sumExpense / max) * 100}%` : '0%'

  }

  currencyChange(currency: CurrencyExchange) {

    // Cierra el dropdown
    this.dropdownOpen = false
    
    // Actualiza la clase del dropdown
    const dropdown = document.getElementById('graphics-currency-dropdown-menu')

    if (dropdown) {
      dropdown.classList.remove('show-dropdown-menu')
    } 

    // Asigna la divisa
    this.selectedCurrency = currency
    this.storageService.setLocal('graphics-currency', currency.currencyCode)

    // Convierte los registros a una divisa seleccionada
    this.convertedRecords = convertAmountsIntoOneCurrency(this.recordsComputed(), currency)

    // Actualiza los datos de los gráficos
    this.updateIncomeChart()
    this.updateExpenseChart()

  }

  toggleDropdown(event: MouseEvent) {

    this.dropdownOpen = !this.dropdownOpen

    const dropdown = document.getElementById('graphics-currency-dropdown-menu')

    if (dropdown) {
      if (this.dropdownOpen) {
        dropdown.classList.add('show-dropdown-menu')
      } else {
        dropdown.classList.remove('show-dropdown-menu')
      }
    }

  }
  
  // Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    // Si el dropdown no está abierto, no hace nada
    if (!this.dropdownOpen) return
    
    const target = event.target as HTMLElement
  
    // Referencia el dropdown
    const dropdown = document.getElementById('graphics-currency-dropdown-menu')
    
    // Verifica el botón que abre el dropdown
    const dropdownButton = document.getElementById('graphics-button-dropdown')
    
    // Comprueba si el clic fue dentro del dropdown o en el botón
    const clickedInDropdown = dropdown && dropdown.contains(target)
    const clickedOnButton = dropdownButton && dropdownButton.contains(target)
    
    // Solo cierra si el clic fue fuera de ambos elementos
    if (!clickedInDropdown && !clickedOnButton && this.dropdownOpen) {
      this.dropdownOpen = false
      
      if (dropdown) {
        dropdown.classList.remove('show-dropdown-menu')
      }

      event.stopPropagation()
    }
  }


}
