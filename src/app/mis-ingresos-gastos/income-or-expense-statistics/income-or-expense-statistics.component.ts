import { Component, computed, effect, inject } from '@angular/core';
import { allRecordsSignal } from '../utils/SharedList';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import { CurrencySelectorComponent } from 'src/app/shared/components/currency-selector/currency-selector.component';
import { CurrencyExchange } from 'src/app/shared/services/CurrencyExchange/CurrencyExchange.interface';
import { CurrencyExchangeService } from 'src/app/shared/services/CurrencyExchange/currency-exchange.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { IncomeOrExpense } from '../interfaces/IncomeOrExpense.interface';
import { convertAmountsIntoOneCurrency } from 'src/app/shared/functions/ConvertCurrencies';
import { MatIconModule } from '@angular/material/icon';
import { style } from '@angular/animations';

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
    CurrencySelectorComponent
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
  resumeOptions: any = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      height: 300
    },
    title: {
      text: 'Comparation of income and expenses',
      align: 'left',
      style: {
        color: 'var(--sys-on-background)',
        fontSize: '16px'
      }
    },
    xAxis: {
      categories: ['Resume'],
      labels: {
        style: {
          color: 'var(--sys-on-background)'
        }
      }
    },
    yAxis: {
      min: 0,
      title: { text: '' },
      gridLineWidth: 0,
      labels: {
        style: {
          color: 'var(--sys-on-background)'
        }
      }
    },
    legend: {
      reversed: true,
      itemStyle: {
        color: 'var(--sys-on-background)'
      }
    },
    plotOptions: {
      bar: {
        borderWidth: 0,
        pointWidth: 25, // Altura de las barras del gráfico
        dataLabels: {
          enabled: true,
          color: 'var(--sys-on-background)'
        }
      },
      series: {
        dataLabels: {
          enabled: true,
          style: {
            textOutline: 'none', // 🔹 Contorno del texto
          }
        }
      }
    },
    tooltip: {
      backgroundColor: 'var(--sys-background)',
      borderColor: 'var(--sys-on-background)',
      style: {
        color: 'var(--sys-on-background)',
      }
    },
    credits: { enabled: false },
    series: [
      {
        name: 'Income',
        data: [0]
      },
      {
        name: 'Expense',
        data: [0]
      }
    ]
  };
  
  // resumeOptions: any = {
  //   chart: {
  //       type: 'bar',
  //       height: 130,
  //       backgroundColor: 'transparent'
  //   },
  //   title: {
  //       text: 'Income and expense resume',
  //       style: {
  //         color: 'var(--sys-on-background)'
  //       }
  //   },
  //   plotOptions: {
  //       bar: {
  //           borderWidth: 0,
  //           borderColor: 'transparent',
  //           headSize: 6,
  //           stacking: 'normal',
  //           dataLabels: {
  //               enabled: false
  //           },
  //           color: 'var(--sys-action-green)',
  //           negativeColor: 'var(--sys-action-red)',
  //       }
  //   },
  //   tooltip: {
  //       format: '<span style="color:{point.color}">\u25CF</span> ' +
  //           '<b>{series.name}: {point.y}</b>'
  //   },
  //   yAxis: {
  //       reversedStacks: false,
  //       gridLineWidth: 0,
  //       opposite: true,
  //       labels: {
  //           enabled: false,
  //       },
  //       title: '',
  //       stackLabels: {
  //           enabled: true,
  //           verticalAlign: 'top',
  //           style: {
  //             color: 'var(--sys-on-background)',
  //             fontSize: '0.9em',
  //             fontWeight: 'bold',
  //             textOutline: 'none'
  //           },
  //           format: '{#if isNegative}Expense{else}Income{/if}: {total}'
  //       },
  //       startOnTick: false,
  //       endOnTick: false
  //   },
  //   xAxis: {
  //       visible: false,
  //       gridLineWidth: 0,
  //       title: '',
  //   },
  //   legend: {
  //       enabled: false
  //   },
  //   credits: {
  //       enabled: false
  //   },
  //   series: [

  //       { name: 'Income', data: [0] },
  //       { name: 'Expense', data: [-0] },

  //   ]
  // }

  // Gráfico de ingresos
  incomeChartOptions: any = {

    chart: {
        type: 'pie',
        backgroundColor: null,
    },
    title: {
        text: 'Income Overview',
        style: {
          color: 'var(--sys-on-background)'
        }
    },
    tooltip: {
      useHTML: true,
      backgroundColor: 'var(--sys-background)',
      borderRadius: 0, // Bordes redondeados
      style: {
        color: 'var(--sys-on-background)',
        fontSize: '14px',
        fontWeight: 'bold'
      },
      pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            borderColor: 'transparent',
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 0,
            dataLabels: [{
                enabled: true,
                distance: 20,
                format: '{point.name}',
                style: {
                  color: 'var(--sys-on-background)',
                  fontSize: '0.9em',
                  fontWeight: 'bold',
                  textOutline: 'none'
                }
            }, {
                enabled: true,
                distance: -15,
                format: '{point.percentage:.0f}%',
                style: {
                    fontSize: '0.9em'
                }
            }],
            showInLegend: true
        }
    },
    series: [{
        name: 'Total',
        colorByPoint: true,
        innerSize: '75%',
        data: []
    }],
    credits: {
      enabled: false
    }
  }

  // Gráfico de gastos
  expenseChartOptions: any = {

    chart: {
        type: 'pie',
        backgroundColor: null,
    },
    title: {
        text: 'Expense Overview',
        style: {
            color: 'var(--sys-on-background)'
        }
    },
    tooltip: {
      useHTML: true,
      backgroundColor: 'var(--sys-background)',
      borderRadius: 0,
      style: {
        color: 'var(--sys-on-background)',
        fontSize: '14px',
        fontWeight: 'bold'
      },
      pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            borderColor: 'transparent',
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 0,
            dataLabels: [{
                enabled: true,
                distance: 20,
                format: '{point.name}',
                style: {
                  color: 'var(--sys-on-background)',
                  fontSize: '0.9em',
                  fontWeight: 'bold',
                  textOutline: 'none'
                }
            }, {
                enabled: true,
                distance: -15,
                format: '{point.percentage:.0f}%',
                style: {
                    fontSize: '0.9em'
                }
            }],
            showInLegend: true
        }
    },
    series: [{
        name: 'Total',
        colorByPoint: true,
        innerSize: '75%',
        data: []
    }],
    credits: {
      enabled: false
    }
  }

  // Servicios
  currencyExchangeService = inject(CurrencyExchangeService)
  tokenService = inject(TokenService)

  constructor() {

    // Suscribe los cambios del signal para actualizar los gráficos
    effect(() => {

      this.currencyChange(
        this.currencyExchangeService.currencies().find(currency => currency.currencyCode === this.tokenService.favoriteCurrency()) 
        || this.currencyExchangeService.defaultCurrency
      )

    })

  }

  private updateResumeChart() {

    this.resumeOptions = {
      ...this.resumeOptions,
      series: [
        {
          name: 'Income',
          data: [this.sumIncome],
          color: 'var(--sys-action-green)'
        },
        {
          name: 'Expense',
          data: [this.sumExpense],
          color: 'var(--sys-action-red)'
        }
      ]
    }

  }

  private updateIncomeChart() {

    const data = this.processChartData('income')

    this.sumIncome = Number((data.reduce((sum, record) => sum + record.y!, 0)).toFixed(2))

    this.incomeChartOptions = {
      ...this.incomeChartOptions,
      series: [{
        ...this.incomeChartOptions.series[0],
        data: data
      }]
    };

  }

  private updateExpenseChart() {

    const data = this.processChartData('expense')

    this.sumExpense = Number((data.reduce((sum, record) => sum + record.y!, 0)).toFixed(2))

    this.expenseChartOptions = {
      ...this.expenseChartOptions,
      series: [{
        ...this.expenseChartOptions.series[0],
        data: data
      }]
    };    

  }

  private processChartData(type: 'income' | 'expense'): Highcharts.PointOptionsObject[] {
  
    const categoryMap = new Map<string, { value: number, color: string }>()
  
    this.convertedRecords
      .filter(record => record.type === type)
      .forEach(record => {
  
        const categoryName = record.category.name
        const categoryColor = record.category.color
        const existing = categoryMap.get(categoryName)
  
        categoryMap.set(categoryName, {
          value: (existing?.value || 0) + Math.abs(record.amount),
          color: existing?.color || categoryColor
        })
  
      })
  
    return Array.from(categoryMap, ([name, data]) => ({
      name,
      y: data.value,
      color: data.color
    }))
  }
  
  currencyChange(currency: CurrencyExchange) {

    // Convierte los registros a una divisa seleccionada
    this.convertedRecords = convertAmountsIntoOneCurrency(this.recordsComputed(), currency)

    // Actualiza los gráficos
    this.updateIncomeChart()
    this.updateExpenseChart()
    this.updateResumeChart()


  }

}
