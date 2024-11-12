import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { MatInput } from '@angular/material/input';
import { IncomeOrExpense, RecurrenceDetails } from '../IncomeOrExpense';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SimboloDivisaPipe } from 'src/app/shared/pipes/SimboloDivisa/simbolo-divisa.pipe';
import { CurrencyCodeENUM, CurrencyNameENUM } from 'src/app/shared/enums/Currency.enum';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyConversionService } from 'src/app/shared/services/APIs/CurrencyConversion/currency-conversion.service';

@Component({
  selector: 'app-income-or-expense-form',
  standalone: true,
  imports: [
    // Angular core
    ReactiveFormsModule,
    MatInput,
    // Angular material
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
    // Pipes
    SimboloDivisaPipe
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
  readonly data: {actionType: string; incomeOrExpense: IncomeOrExpense | null} = inject(MAT_DIALOG_DATA)
  readonly dialogRef = inject(MatDialogRef<IncomeOrExpenseFormComponent>)
  
  // Tipos de acción
  readonly actionTypes = ActionType

  // Tipos de registro
  readonly types: string[] = ['Income', 'Expense']

  // Formulario de ingreso / gasto
  incomeOrExpenseForm!: FormGroup

  // Formulario de recurrencia
  recurrenceForm!: FormGroup

  // Tamaño del texto del botón dinámico
  textSizeRem: number = 1.5

  // Divisas ENUM
  readonly currencyCode = CurrencyCodeENUM
  readonly currencyName = CurrencyNameENUM

  // Máximo de longitud para las notas
  maxNotesLength: number = 150

  constructor(
    public currencyConversionService: CurrencyConversionService
  ) {

    this.incomeOrExpenseForm = new FormGroup({

      date: new FormControl('', [Validators.required]),

      type: new FormControl(
        {
          value: '', 
          disabled: this.data.actionType === this.actionTypes.EDIT ? true : false
        }, [Validators.required]),

      category: new FormControl('', [Validators.required, Validators.maxLength(50)]),

      subCategory: new FormControl('', [Validators.maxLength(50)]),

      amount: new FormControl('', [
        Validators.required, 
        Validators.pattern('^\\d{1,15}(\\.\\d{1,2})?$'), // Acepta hasta 15 enteros y 2 decimales
        Validators.maxLength(18) 
      ]),

      currency: new FormControl(this.currencyConversionService.getUserCurrency().currencyCode, [Validators.required]),

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

    if(this.data.incomeOrExpense) {

      this.loadForm()

    }

  }

  loadForm(): void {

    // Setea los signals
    this.selectedType.set(this.data.incomeOrExpense?.type!)

    this.isRecurrence.set(!!this.data.incomeOrExpense?.recurrenceDetails)

    // Formulario de ingreso / gasto
    this.incomeOrExpenseForm.get('type')?.setValue(this.data.incomeOrExpense?.type.charAt(0).toUpperCase() + this.data.incomeOrExpense?.type.slice(1)!)
    this.incomeOrExpenseForm.get('amount')?.setValue(this.data.incomeOrExpense?.amount)
    this.incomeOrExpenseForm.get('category')?.setValue(this.data.incomeOrExpense?.category)
    this.incomeOrExpenseForm.get('currency')?.setValue(this.data.incomeOrExpense?.currency)
    this.incomeOrExpenseForm.get('date')?.setValue(this.data.incomeOrExpense?.date)
    this.incomeOrExpenseForm.get('notes')?.setValue(this.data.incomeOrExpense?.notes)
    this.incomeOrExpenseForm.get('subCategory')?.setValue(this.data.incomeOrExpense?.subCategory)   

    if(this.isRecurrence()) {

      // Formulario de recurrencia
      this.recurrenceForm.get('frequency')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.frequency)
      this.recurrenceForm.get('recurrenceType')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.recurrenceType)
      this.recurrenceForm.get('endDate')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.endDate)
      this.recurrenceForm.get('occurrences')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.occurrences)

    }

  }

  checkMandatoryFields(): void {

    // Marca el formulario de ingreso o gasto
    this.markForms(this.incomeOrExpenseForm)

    // Marca el formulario de recurrencia
    this.markForms(this.recurrenceForm)

  }

  markForms(form: FormGroup): void {

    Object.keys(form.controls).forEach(controlName => {

      const control = form.get(controlName);

      if (control && control.invalid && control.hasValidator(Validators.required)) {
        control.markAsTouched();
      }
      
    });

  }

  submitForm(): void {

    if(this.shouldSaveIncomeOrExpense()) {

        let saveIncomOrExpense: IncomeOrExpense = {

          id: this.data.incomeOrExpense ? this.data.incomeOrExpense.id : undefined,
          amount: this.incomeOrExpenseForm.get('amount')?.value,
          category: this.incomeOrExpenseForm.get('category')?.value,
          currency: this.incomeOrExpenseForm.get('currency')?.value,
          date: this.incomeOrExpenseForm.get('date')?.value,
          type: this.incomeOrExpenseForm.get('type')?.value,
          notes: this.incomeOrExpenseForm.get('notes')?.value,
          subCategory: this.incomeOrExpenseForm.get('subCategory')?.value,
          ...(this.isRecurrence() && { recurrenceDetails: this.buildRecurrenceDetails() })    

        }

        this.dialogRef.close(saveIncomOrExpense)

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

    return {
      id: id,
      frequency: this.recurrenceForm.get('frequency')?.value,
      recurrenceType: this.recurrenceForm.get('recurrenceType')?.value,
      endDate: this.recurrenceForm.get('endDate')?.value,
      occurrences: this.recurrenceForm.get('occurrences')?.value
    };

  }

}
