import { Component, computed, effect, HostListener, inject } from '@angular/core';
import { allTransactions } from '../utils/SharedList';
import { CommonModule } from '@angular/common';
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
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-income-or-expense-statistics',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    MatIconModule,
    MatTooltipModule,
    // Componentes
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

  recordsComputed = computed(() => allTransactions())
  convertedRecords: IncomeOrExpense[] = []

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

      if(currency) {
        this.currencyChange(
          currency
        )
      }

    })

    // Añadimos los SVGs
    FLAGS.forEach(flag => {

      this.matIconRegistry.addSvgIconLiteral(
        flag.currencyCode,
        this.domSanitizer.bypassSecurityTrustHtml(flag.svg)
      )

    })

  }

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
    })).sort((a, b) => b.amount - a.amount)
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
