import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-mis-ingresos',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './mis-ingresos-gastos.component.html',
  styleUrl: './mis-ingresos-gastos.component.scss'
})
export class MisIngresosGastosComponent {

  displayedColumns: string[] = ['categoria', 'cantidad', 'notas', 'acciones'];

  dataSource: any[] = [];


}
