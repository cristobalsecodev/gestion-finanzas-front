import { Routes } from '@angular/router';
import { MisIngresosGastosComponent } from './presentation/mis-ingresos-gastos/mis-ingresos-gastos.component';
import { MisInversionesComponent } from './presentation/mis-inversiones/mis-inversiones.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ResumenComponent } from './presentation/resumen/resumen.component';

export const routes: Routes = [
  {
    path: 'mis-ingresos-gastos', component: MisIngresosGastosComponent
  },
  {
    path: 'mis-inversiones', component: MisInversionesComponent
  },
  {
    path: '', component: ResumenComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];
