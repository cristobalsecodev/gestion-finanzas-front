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
import { DynamicButtonComponent } from 'src/app/shared/components/dynamic-flat-button/dynamic-button.component';

@Component({
  selector: 'app-mis-ingresos-gastos-formulario',
  standalone: true,
  imports: [
    // Components
    DynamicButtonComponent,
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
    MatSlideToggleModule
  ],
  templateUrl: './mis-ingresos-gastos-formulario.component.html',
  styleUrl: './mis-ingresos-gastos-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisIngresosGastosFormularioComponent implements OnInit {

  // Selección del tipo de registro
  selectedType = signal<'income' | 'expense' | null>(null)

  // Controla el formulario de recurrencia
  isRecurrence = signal(false)

  // Variables de dialog
  readonly data: {actionType: string; incomeOrExpense: IncomeOrExpense | null} = inject(MAT_DIALOG_DATA)
  readonly dialogRef = inject(MatDialogRef<MisIngresosGastosFormularioComponent>)
  
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

  constructor() {

    this.incomeOrExpenseForm = new FormGroup({

      date: new FormControl('', [Validators.required]),
      
      category: new FormControl('', [Validators.required]),

      subCategory: new FormControl(''),

      amount: new FormControl('', [Validators.required]),

      currency: new FormControl('', [Validators.required]),

      notes: new FormControl('')

    })

    this.recurrenceForm = new FormGroup({

      recurrenceType: new FormControl('', [Validators.required]),
      
      frequency: new FormControl('', [Validators.required]),

      endDate: new FormControl(''),

      occurrences: new FormControl(''),

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
      this.recurrenceForm.get('ocurrences')?.setValue(this.data.incomeOrExpense?.recurrenceDetails?.occurrences)

    }

  }

  submitForm(): void {

    if(this.shouldSaveIncomeOrExpense()) {

        let saveIncomOrExpense: IncomeOrExpense = {

          amount: this.incomeOrExpenseForm.get('amount')?.value,
          category: this.incomeOrExpenseForm.get('category')?.value,
          currency: this.incomeOrExpenseForm.get('currency')?.value,
          date: this.incomeOrExpenseForm.get('date')?.value,
          type: this.selectedType()!,
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

    return {
      frequency: this.recurrenceForm.get('frequency')?.value,
      recurrenceType: this.recurrenceForm.get('recurrenceType')?.value,
      endDate: this.recurrenceForm.get('endDate')?.value,
      occurrences: this.recurrenceForm.get('ocurrences')?.value
    };

  }

}
