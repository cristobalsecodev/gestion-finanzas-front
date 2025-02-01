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

  sumIncome: number = 0
  sumExpense: number = 0

  incomeOrExpenses = computed(() => allRecordsSignal())

  Highcharts: typeof Highcharts = Highcharts

  resumeOptions: any = {
    chart: {
        type: 'bar',
        height: 170,
        backgroundColor: null
    },
    title: {
        text: 'Income and expense resume',
        style: {
          color: 'var(--sys-on-background)'
        }
    },
    plotOptions: {
        bar: {
            headSize: 6,
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                y: 20,
                verticalAlign: 'bottom'
            },
            color: 'rgb(255, 7, 77)',
            negativeColor: 'rgb(1, 127, 250)',
            accessibility: {
                exposeAsGroupOnly: true
            }
        }
    },
    tooltip: {
        format: '<span style="color:{point.color}">\u25CF</span> ' +
            '<b>{series.name}: {point.y}</b>'
    },
    accessibility: {
        typeDescription: 'Stacked bar "force" chart. Positive forces ' +
            'are shown on the right side and negative on the left.',
        series: {
            descriptionFormat: 'Series {add series.index 1} of ' +
            '{chart.series.length}, Name: {series.name}, ' +
            '{#if (gt series.points.0.y 0)}accelerating' +
            '{else}decelerating{/if} value of {series.points.0.y}.'
        }
    },
    yAxis: {
        reversedStacks: false,
        opposite: true,
        labels: {
            enabled: false
        },
        title: '',
        accessibility: {
            description: ''
        },
        stackLabels: {
            enabled: true,
            verticalAlign: 'top',
            style: {
                fontSize: '1.2em'
            },
            format: '{#if isNegative}Expense{else}Income{/if}: {total}'
        },
        startOnTick: false,
        endOnTick: false
    },
    xAxis: {
        visible: false,
        title: '',
        accessibility: {
            description: ''
        }
    },
    legend: {
        enabled: false
    },
    credits: {
      enabled: false
    },
    series: [

        { name: 'Income', data: [0] },
        { name: 'Expense', data: [-0] },

    ]
  }

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
        data: []
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
        data: []
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
      this.updateResumeChart()

    })

  }

  private updateResumeChart() {

    this.resumeOptions = {
      ...this.resumeOptions,
      series: [
        {
          name: 'Income',
          data: [this.sumIncome]
        },
        {
          name: 'Expense',
          data: [this.sumExpense]
        }
      ]
    }

  }

  private updateIncomeChart() {

    const data = this.processChartData('income')

    this.sumIncome = Number((data.reduce((sum, record) => sum + record.y!, 0)).toFixed(2))

    this.incomeChartOptions = {
      ...this.incomeChartOptions,
      subtitle: {
        text: 'Total Income: +' + this.sumIncome,
        style: {
          color: 'var(--sys-on-background)'
        }
      },
      series: [{
        ...this.incomeChartOptions.series[0],
        data: data
      }]
    };

  }

  private updateExpenseChart() {

    const data = this.processChartData('expense')

    this.sumExpense = Number((data.reduce((sum, record) => sum + record.y!, 0)).toFixed(2)) * -1

    this.expenseChartOptions = {
      ...this.expenseChartOptions,
      subtitle: {
        text: 'Total Expense: ' + this.sumExpense,
        style: {
          color: 'var(--sys-on-background)'
        }
      },
      series: [{
        ...this.expenseChartOptions.series[0],
        data: data
      }]
    };    

    // this.expenseChartOptions = this.createDonutChartOptions(

    //   'Expense Overview',
    //   'Total Expense: -' + data.reduce((sum, record) => sum + record.y!, 0).toFixed(2),
    //   data

    // )
  }

  // private createDonutChartOptions(
  //   title: string,
  //   total: string,
  //   data: Highcharts.PointOptionsObject[]
  // ): any {
    
  //   return {

  //     chart: {
  //         type: 'pie',
  //         backgroundColor: null, // Elimina el fondo blanco
  //     },
  //     accessibility: {
  //         point: {
  //             valueSuffix: '%'
  //         }
  //     },
  //     title: {
  //         text: title,
  //         style: {
  //           color: 'var(--sys-on-background)'
  //         }
  //     },
  //     subtitle: {
  //       text: total,
  //       style: {
  //         color: 'var(--sys-on-background)'
  //       }
  //     },
  //     tooltip: {
  //         pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>',
  //         style: {
  //           backgroundColor: 'var(--sys-surface-container-low)',
  //         }
  //     },
  //     legend: {
  //         enabled: false
  //     },
  //     plotOptions: {
  //         series: {
  //             allowPointSelect: true,
  //             cursor: 'pointer',
  //             borderRadius: 1,
  //             dataLabels: [{
  //                 enabled: true,
  //                 distance: 20,
  //                 format: '{point.name}'
  //             }, {
  //                 enabled: true,
  //                 distance: -15,
  //                 format: '{point.percentage:.0f}%',
  //                 style: {
  //                     fontSize: '0.9em'
  //                 }
  //             }],
  //             showInLegend: true
  //         }
  //     },
  //     series: [{
  //         name: 'Registrations',
  //         colorByPoint: true,
  //         innerSize: '75%',
  //         data: data
  //     }],
  //     credits: {
  //       enabled: false
  //     }
  //   }
  // }


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
