import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Divisa } from 'src/app/services/ConversionDivisa/ConversionDivisa.interface';
import { DivisaService } from 'src/app/services/Divisa/divisa.service';
import { DivisaCodigoENUM } from 'src/app/shared/enums/Divisa.enum';
import { SimboloDivisaPipe } from 'src/app/shared/pipes/simbolo-divisa.pipe';

@Component({
  selector: 'app-mis-ingresos',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    SimboloDivisaPipe
  ],
  templateUrl: './mis-ingresos-gastos.component.html',
  styleUrl: './mis-ingresos-gastos.component.scss'
})
export class MisIngresosGastosComponent {

  displayedColumns: string[] = ['categoria', 'cantidad', 'notas', 'acciones']

  dataSource: any[] = []

  codigoDivisa: string = ''

  constructor(
    private divisaService: DivisaService
  ) {

    this.divisaService.divisa$.subscribe((divisa: Divisa) => {
      this.codigoDivisa = divisa.codigoDivisa
    })

  }


}
