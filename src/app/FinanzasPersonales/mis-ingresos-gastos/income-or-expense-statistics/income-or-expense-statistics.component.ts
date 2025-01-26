import { Component, computed, effect } from '@angular/core';
import { allRecordsSignal } from '../utils/SharedList';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-income-or-expense-statistics',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    // Librería
    HighchartsChartModule
    // Componentes
  ],
  templateUrl: './income-or-expense-statistics.component.html',
  styleUrl: './income-or-expense-statistics.component.scss'
})
export class IncomeOrExpenseStatisticsComponent {

  incomeOrExpenses = computed(() => allRecordsSignal())

  Highcharts: typeof Highcharts = Highcharts

  incomeChartOptions: any = {

    chart: {
        type: 'pie',
        backgroundColor: null,
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    title: {
        text: 'Income Overview',
        style: {
          color: 'var(--sys-on-background)'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>',
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 8,
            dataLabels: [{
                enabled: true,
                distance: 20,
                format: '{point.name}'
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
        name: 'Registrations',
        colorByPoint: true,
        innerSize: '75%',
        data: [{
            name: 'Loading',
            y: 100
        }]
    }],
    credits: {
      enabled: false
    }
  }

  expenseChartOptions: any = {

    chart: {
        type: 'pie',
        backgroundColor: null,
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    title: {
        text: 'Expense Overview',
        style: {
            color: 'var(--sys-on-background)'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>',
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 8,
            dataLabels: [{
                enabled: true,
                distance: 20,
                format: '{point.name}'
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
        name: 'Registrations',
        colorByPoint: true,
        innerSize: '75%',
        data: [{
            name: 'Loading',
            y: 100
        }]
    }],
    credits: {
      enabled: false
    }
  }

  constructor() {

    // Suscribe los cambios del signal para actualizar los gráficos
    effect(() => {
      this.updateIncomeChart()
      this.updateExpenseChart()
    })

  }

  private updateIncomeChart() {

    const data = this.processChartData('income')

    this.incomeChartOptions = this.createDonutChartOptions(

      'Income Overview',
      'Total Income: +' + data.reduce((sum, record) => sum + record.y!, 0).toFixed(2),
      data

    )
  }

  private updateExpenseChart() {

    const data = this.processChartData('expense')

    this.expenseChartOptions = this.createDonutChartOptions(

      'Expense Overview',
      'Total Expense: -' + data.reduce((sum, record) => sum + record.y!, 0).toFixed(2),
      data

    )
  }

  private createDonutChartOptions(
    title: string,
    total: string,
    data: Highcharts.PointOptionsObject[]
  ): any {
    return {

      chart: {
          type: 'pie',
          backgroundColor: null, // Elimina el fondo blanco
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      title: {
          text: title,
          style: {
            color: 'var(--sys-on-background)'
          }
      },
      subtitle: {
        text: total,
        style: {
          color: 'var(--sys-on-background)'
        }
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>',
          style: {
            backgroundColor: 'var(--sys-surface-container-low)',
          }
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          series: {
              allowPointSelect: true,
              cursor: 'pointer',
              borderRadius: 1,
              dataLabels: [{
                  enabled: true,
                  distance: 20,
                  format: '{point.name}'
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
          name: 'Registrations',
          colorByPoint: true,
          innerSize: '75%',
          data: data
      }],
      credits: {
        enabled: false
      }
    }
  }


  private processChartData(type: 'income' | 'expense'): Highcharts.PointOptionsObject[] {
    
    const categoryMap = new Map<string, number>()

    this.incomeOrExpenses()
      .filter(record => record.type === type)
      .forEach(record => {

        const categoryName = record.category.name
        const amount = categoryMap.get(categoryName) || 0

        categoryMap.set(categoryName, amount + Math.abs(record.amount))

      })

    const a = Array.from(categoryMap, ([name, value]) => ({

      name,
      y: value

    }))

    return a

  }

}
