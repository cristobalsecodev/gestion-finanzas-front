import { Component } from '@angular/core';
import { TablaGeneralComponent } from 'src/app/shared/components/tabla-general/tabla-general.component';

@Component({
  selector: 'app-mis-ingresos',
  standalone: true,
  imports: [
    TablaGeneralComponent
  ],
  templateUrl: './mis-ingresos-gastos.component.html',
  styleUrl: './mis-ingresos-gastos.component.scss'
})
export class MisIngresosGastosComponent {

}
