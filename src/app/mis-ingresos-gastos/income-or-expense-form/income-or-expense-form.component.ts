import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { MatInputModule } from '@angular/material/input';
import { BaseCategory, Categories, IncomeOrExpense, RecurrenceDetails } from '../interfaces/IncomeOrExpense.interface';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CurrencySymbolPipe } from 'src/app/shared/pipes/SimboloDivisa/currency-symbol.pipe';
import { CurrencyCodeENUM, CurrencyNameENUM } from 'src/app/shared/enums/Currency.enum';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { filterAutocomplete } from 'src/app/shared/functions/AutocompleteFilter';
import { capitalizeString, markForms } from 'src/app/shared/functions/Utils';
import { CurrencyExchangeService } from 'src/app/shared/services/CurrencyExchange/currency-exchange.service';
import moment from 'moment';
import { objectSelectedValidator } from 'src/app/shared/functions/Validators';
import { TypeCheckPipe } from 'src/app/shared/pipes/TypeCheck/type-check.pipe';
import { CategoriesAndSubCategoriesService } from '../services/Categories&SubCategories/categories-and-sub-categories.service';
import { CurrencyExchange } from 'src/app/shared/services/CurrencyExchange/CurrencyExchange.interface';

@Component({
  selector: 'app-income-or-expense-form',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    // Angular material
    MatInputModule,
    MatFormFieldModule,
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    // Pipes
    CurrencySymbolPipe,
    TypeCheckPipe
  ],
  templateUrl: './income-or-expense-form.component.html',
  styleUrl: './income-or-expense-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeOrExpenseFormComponent implements OnInit {

  // Selección del tipo de registro
  selectedType = signal<'income' | 'expense' | null>(null)

  // Controla el formulario de recurrencia
  isRecurrence = signal(false)

  // Variables de dialog
  readonly data: {
    actionType: string
    incomeOrExpense: IncomeOrExpense | null
    categories: Categories[]
  } = inject(MAT_DIALOG_DATA)
  readonly dialogRef = inject(MatDialogRef<IncomeOrExpenseFormComponent>)
  
  // Tipos de acción
  readonly actionTypes = ActionType

  // Tipos de recurrencia
  readonly recurrenceTypes: string[] = ['daily', 'weekly', 'monthly', 'yearly']

  // Función para capitalizar strings
  capitalize = capitalizeString

  // Formulario de ingreso / gasto
  incomeOrExpenseForm!: FormGroup

  // Formulario de recurrencia
  recurrenceForm!: FormGroup

  // Tamaño del texto del botón dinámico
  textSizeRem: number = 1.5

  // Categorías y subCategorías
  categories: Categories[] = []
  filteredCategories: Categories[] = []

  subcategories: BaseCategory[] = []
  filteredSubcategories: BaseCategory[] = []

  // Divisas ENUM
  readonly currencyCode = CurrencyCodeENUM
  readonly currencyName = CurrencyNameENUM

  // Máximo de longitud para las notas
  maxNotesLength: number = 150

  constructor(
    public currencyExchangeService: CurrencyExchangeService,
    public categoriesService: CategoriesAndSubCategoriesService
  ) {

    this.incomeOrExpenseForm = new FormGroup({

      date: new FormControl('', [Validators.required]),

      type: new FormControl('', [Validators.required]),

      category: new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(50), objectSelectedValidator]),

      subcategory: new FormControl({value: '', disabled: true}, [Validators.maxLength(50), objectSelectedValidator]),

      amount: new FormControl('', [
        Validators.required, 
        Validators.pattern('^\\d{1,13}(\\.\\d{1,2})?$'), // Acepta hasta 13 enteros y 2 decimales
        Validators.maxLength(18) 
      ]),

      currency: new FormControl(this.currencyExchangeService.selectedCurrency(), [Validators.required]),

      exchangeRate: new FormControl(this.currencyExchangeService.selectedCurrency().exchangeRateToUsd, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,4})?$/), // Permite números con hasta 4 decimales
        Validators.min(0.000001) // Valor mínimo positivo
      ]),

      notes: new FormControl('', [Validators.maxLength(this.maxNotesLength)])

    })

    this.recurrenceForm = new FormGroup({

      recurrenceType: new FormControl('', [Validators.required]),
      
      frequency: new FormControl('', [
        Validators.required, 
        Validators.pattern('^[0-9]+$'),
        Validators.maxLength(3)
      ]),

      endDate: new FormControl(''),

      occurrences: new FormControl('', [Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]),

    })

    effect( () => {

      if(!this.isRecurrence()) {

        this.recurrenceForm.reset()

      }

    })

  }

  ngOnInit(): void {

    this.categories = this.data.categories

    if(this.data.incomeOrExpense) {

      this.loadForm()

    }

  }

  filterCategories(): void {

    // Reinicia la categoría
    this.resetCategory()

    const categoriesFiltered = this.categories.filter(category => category.type === this.selectedType())

    this.filteredCategories = categoriesFiltered ?? []

    // Habilita el form de categoría en caso de que existan con el mismo tipo
    if (this.filteredCategories.length > 0) {

      this.incomeOrExpenseForm.get('category')?.enable();

    }

  }

  filterSubcategories(): void {

    // Reinicia la subcategoría
    this.resetSubcategory()

    const subcategoriesFiltered = this.categories.find(category => category.name === this.incomeOrExpenseForm.get('category')?.value.name)?.subcategories

    this.subcategories = subcategoriesFiltered ?? []
    this.filteredSubcategories = subcategoriesFiltered ?? []

    // Habilita el form de subcategoría en caso de que existan
    if (this.filteredSubcategories.length > 0) {

      this.incomeOrExpenseForm.get('subcategory')?.enable();

    }

  }

  loadForm(): void {

    // Setea los signals
    this.selectedType.set(this.data.incomeOrExpense?.type!)
    this.isRecurrence.set(!!this.data.incomeOrExpense?.recurrenceDetails)

    // Formulario de ingreso / gasto
    this.incomeOrExpenseForm.get('type')?.setValue(this.data.incomeOrExpense?.type)
    this.incomeOrExpenseForm.get('amount')?.setValue(this.selectedType() === 'expense' ? -this.data.incomeOrExpense!.amount : this.data.incomeOrExpense?.amount)
    this.incomeOrExpenseForm.get('currency')?.setValue(this.currencyExchangeService.currencies().find(currency => currency.currencyCode === this.data.incomeOrExpense?.currency))
    this.incomeOrExpenseForm.get('date')?.setValue(this.data.incomeOrExpense?.transactionDate)
    this.incomeOrExpenseForm.get('notes')?.setValue(this.data.incomeOrExpense?.notes ? this.data.incomeOrExpense?.notes : '')

    // Filtra categorías
    this.filterCategories()
    this.incomeOrExpenseForm.get('category')?.setValue(this.data.incomeOrExpense?.category)

    // Filtra subcategorías
    this.filterSubcategories()
    this.incomeOrExpenseForm.get('subcategory')?.setValue(this.data.incomeOrExpense?.subcategory)   

    if(this.isRecurrence()) {

      // Formulario de recurrencia
      this.recurrenceForm.get('frequency')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.frequency)
      this.recurrenceForm.get('recurrenceType')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.recurrenceType)
      this.recurrenceForm.get('endDate')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.endDate)
      this.recurrenceForm.get('occurrences')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.occurrences)

    }

    // Comprueba la selección de divisa
    this.checkCurrencySelection()

  }

  onCategorySearch(): void {

    const searchTerm = this.incomeOrExpenseForm.get('category')?.value

    if(typeof this.incomeOrExpenseForm.get('category')?.value !== 'object' && this.incomeOrExpenseForm.get('subcategory')?.enabled) {

      this.resetSubcategory()

    }

    this.filteredCategories = filterAutocomplete(this.categories.filter(category => category.type === this.selectedType()), searchTerm, ['name'])

  }

  onSubcategorySearch(): void {

    const searchTerm = this.incomeOrExpenseForm.get('subcategory')?.value

    this.filteredSubcategories = filterAutocomplete(this.subcategories, searchTerm, ['name'])

  }

  resetCategory(): void {

    // Reseta el form
    this.incomeOrExpenseForm.get('category')?.disable()
    this.incomeOrExpenseForm.get('category')?.reset()

    // Vacía la lista filtrada
    this.filteredCategories = []

  }

  resetSubcategory(): void {

    // Reseta el form
    this.incomeOrExpenseForm.get('subcategory')?.disable()
    this.incomeOrExpenseForm.get('subcategory')?.reset()

    // Vacía las listas (dependen de la categoría)
    this.filteredSubcategories = []
    this.subcategories = []

  }

  onChangeChip(matChipChange: MatChipListboxChange): void {

    // Setea el signal con la selección o deselección
    this.selectedType.set(matChipChange.value)

    // Filtra las categorías por selección
    this.filterCategories()

    // Resetea la subcategoría
    this.resetSubcategory()

  }

  checkMandatoryFields(): void {

    // Marca el formulario de ingreso o gasto
    this.markForms(this.incomeOrExpenseForm)

    // Marca el formulario de recurrencia
    this.markForms(this.recurrenceForm)

  }

  markForms(form: FormGroup): void {

    markForms(form)

  }

  submitForm(): void {

    if(this.shouldSaveIncomeOrExpense()) {

        let saveIncomeOrExpense: IncomeOrExpense = {

          id: this.data.incomeOrExpense ? this.data.incomeOrExpense.id : undefined,
          amount: this.selectedType() === 'expense' ? Number(-this.incomeOrExpenseForm.get('amount')?.value) : Number(this.incomeOrExpenseForm.get('amount')?.value),
          category: this.incomeOrExpenseForm.get('category')?.value,
          currency: this.incomeOrExpenseForm.get('currency')?.value.currencyCode,
          exchangeRateToUsd: this.incomeOrExpenseForm.get('exchangeRate')?.value,
          transactionDate: moment(this.incomeOrExpenseForm.get('date')?.value).format('YYYY-MM-DD'),
          type: this.incomeOrExpenseForm.get('type')?.value,
          notes: this.incomeOrExpenseForm.get('notes')?.value,
          subcategory: this.incomeOrExpenseForm.get('subcategory')?.value ? this.incomeOrExpenseForm.get('subcategory')?.value : undefined,
          ...(this.isRecurrence() && { recurrenceDetails: this.buildRecurrenceDetails() })    

        }

        this.dialogRef.close(saveIncomeOrExpense)

    }

  }

  private shouldSaveIncomeOrExpense(): boolean {

    return (
      !!this.selectedType() &&
      this.incomeOrExpenseForm.valid &&
      (!this.isRecurrence() || this.recurrenceForm.valid)
    )

  }

  private buildRecurrenceDetails(): RecurrenceDetails {

    const id = (this.data.incomeOrExpense && this.data.incomeOrExpense.recurrenceDetails) 
      ? this.data.incomeOrExpense.recurrenceDetails.id
      : undefined 

    const endDate = moment(this.recurrenceForm.get('endDate')?.value).isValid() 
      ? moment(this.recurrenceForm.get('endDate')?.value).format('YYYY-MM-DD') 
      : undefined

    return {
      id: id,
      frequency: this.recurrenceForm.get('frequency')?.value,
      recurrenceType: this.recurrenceForm.get('recurrenceType')?.value,
      endDate: endDate,
      occurrences: this.recurrenceForm.get('occurrences')?.value
    };

  }

  onAmountInput(event: Event): void {

    const input = event.target as HTMLInputElement
    const currentValue = input.value
  
    // Reemplaza comas por puntos
    const correctedValue = currentValue.replace(',', '.')
  
    // Actualiza el valor del control de formulario
    this.incomeOrExpenseForm.get('amount')?.setValue(correctedValue, { emitEvent: false })

  }

  applyExchangeRate(): void {

    this.checkCurrencySelection()

    this.incomeOrExpenseForm.get('exchangeRate')?.setValue(this.incomeOrExpenseForm.get('currency')?.value.exchangeRateToUsd)

  }

  private checkCurrencySelection(): void {

    const currencyControl = this.incomeOrExpenseForm.get('currency')
    const exchangeRateControl = this.incomeOrExpenseForm.get('exchangeRate')
    const isUSD = currencyControl?.value?.currencyCode === this.currencyCode.USD
    
    if (isUSD) {

      // tar si no está ya deshabilitado
      if (exchangeRateControl?.enabled) {
        exchangeRateControl.disable()
      }

    } else {

      // Solo habilitar si no está ya habilitado
      if (exchangeRateControl?.disabled) {
        exchangeRateControl.enable()
      }

    }

  }

}
