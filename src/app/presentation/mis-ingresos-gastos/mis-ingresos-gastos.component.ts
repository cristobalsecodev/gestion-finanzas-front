import { Component } from '@angular/core';
import { TablaGeneralComponent } from 'src/app/shared/components/tabla-general/tabla-general.component';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-mis-ingresos',
  standalone: true,
  imports: [
    TablaGeneralComponent,
    MatCardModule
  ],
  templateUrl: './mis-ingresos-gastos.component.html',
  styleUrl: './mis-ingresos-gastos.component.scss'
})
export class MisIngresosGastosComponent {

}
