import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-mis-ingresos-gastos-modal',
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
  templateUrl: './mis-ingresos-gastos-modal.component.html',
  styleUrl: './mis-ingresos-gastos-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisIngresosGastosModalComponent {

  readonly tipo = inject(MAT_DIALOG_DATA);
  readonly modalRef = inject(MatDialogRef<MisIngresosGastosModalComponent>);

  formulario = new FormGroup({
    
    fecha: new FormControl(''),
    categoria: new FormControl(''),
    subCategoria: new FormControl(''),
    cantidad: new FormControl(''),
    notas: new FormControl('')

  })
  

  aceptarFormulario(): void {
    this.modalRef.close()
  }

}
