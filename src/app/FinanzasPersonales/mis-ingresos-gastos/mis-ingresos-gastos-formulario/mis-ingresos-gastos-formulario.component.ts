import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-mis-ingresos-gastos-formulario',
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
    MatSlideToggleModule
  ],
  templateUrl: './mis-ingresos-gastos-formulario.component.html',
  styleUrl: './mis-ingresos-gastos-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisIngresosGastosFormularioComponent {

  // Selección del tipo de registro
  selectedType = signal(null)

  // Controla el formulario de recurrencia
  isRecurrence = signal(false)

  // Variables de dialog
  readonly data = inject(MAT_DIALOG_DATA)
  readonly actionTypes = ActionType
  readonly dialogRef = inject(MatDialogRef<MisIngresosGastosFormularioComponent>)

  // Tipos de registro
  readonly types: string[] = ['Income', 'Expense']


  // Formulario de ingreso / gasto
  incomeOrExpenseForm!: FormGroup

  // Formulario de recurrencia
  recurrenceForm!: FormGroup

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

  submitForm(): void {

    if(this.incomeOrExpenseForm.valid)

    this.dialogRef.close()
  }

}
