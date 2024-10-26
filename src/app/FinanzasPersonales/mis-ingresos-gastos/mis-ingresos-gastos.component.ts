import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SimboloDivisaPipe } from 'src/app/shared/pipes/SimboloDivisa/simbolo-divisa.pipe';
import { MisIngresosGastosFormularioComponent } from './mis-ingresos-gastos-formulario/mis-ingresos-gastos-formulario.component';
import { ActionType } from 'src/app/shared/enums/ActionType.enum';
import { IngresoGasto } from './IngresoGasto.interface';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-mis-ingresos',
  standalone: true,
  imports: [
    // Angular material
    MatTableModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    // Pipes
    SimboloDivisaPipe,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './mis-ingresos-gastos.component.html',
  styleUrl: './mis-ingresos-gastos.component.scss'
})
export class MisIngresosGastosComponent {

  displayedColumns: string[] = ['date', 'category', 'amount', 'notes', 'actions']

  dataSource: IngresoGasto[] = [
    {
      fecha: new Date(),
      cantidad: 100,
      divisa: 'EUR',
      categoria: 'Comida',
      subCategoria: 'Cena',
      numeroRecurrencia: 2,
      tipoRecurrencia: 'M',
      notas: 'This dialog showcases the title, close, content and actions elements. dsd adsadadsadsad adasd asdsa'
    }
  ]

  readonly actionType = ActionType

  readonly dialog = inject(MatDialog)

  constructor() {}

  openDialog(type: string): void {



    this.dialog.open(MisIngresosGastosFormularioComponent, {

      data: type

    }).afterClosed().subscribe((record => {



    }))

  }


}
