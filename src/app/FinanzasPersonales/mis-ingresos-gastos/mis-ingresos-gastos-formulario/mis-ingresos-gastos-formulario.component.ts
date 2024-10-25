import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-mis-ingresos-gastos-formulario',
  standalone: true,
  imports: [
    // Angular material
    MatFormFieldModule,
    MatDialogTitle, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose, 
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './mis-ingresos-gastos-formulario.component.html',
  styleUrl: './mis-ingresos-gastos-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisIngresosGastosFormularioComponent {

  readonly type = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<MisIngresosGastosFormularioComponent>);

  form = new FormGroup({
    
    fecha: new FormControl(''),
    categoria: new FormControl(''),
    subCategoria: new FormControl(''),
    cantidad: new FormControl(''),
    notas: new FormControl('')

  })
  

  submitForm(): void {
    this.dialogRef.close()
  }

}
