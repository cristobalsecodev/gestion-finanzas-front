import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Divisa } from 'src/app/services/ConversionDivisa/ConversionDivisa.interface';
import { DivisaService } from 'src/app/services/Divisa/divisa.service';
import { SimboloDivisaPipe } from 'src/app/shared/pipes/SimboloDivisa/simbolo-divisa.pipe';
import { MisIngresosGastosFormularioComponent } from './mis-ingresos-gastos-formulario/mis-ingresos-gastos-formulario.component';
import { TipoAccion } from 'src/app/shared/enums/TipoAccion.enum';
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

  displayedColumns: string[] = ['fecha', 'categoria', 'cantidad', 'notas', 'acciones']

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

  codigoDivisa: string = ''

  readonly tipoAccion = TipoAccion

  readonly modal = inject(MatDialog)

  constructor(
    private divisaService: DivisaService
  ) {

    this.divisaService.divisa$.subscribe((divisa: Divisa) => {
      this.codigoDivisa = divisa.codigoDivisa
    })

  }

  abrirModal(tipo: string): void {



    this.modal.open(MisIngresosGastosFormularioComponent, {

      data: tipo

    }).afterClosed().subscribe((registro => {



    }))

  }


}
