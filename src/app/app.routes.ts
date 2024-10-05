import { Routes } from '@angular/router';
import { MisIngresosComponent } from './presentation/mis-ingresos/mis-ingresos.component';
import { MisGastosComponent } from './presentation/mis-gastos/mis-gastos.component';
import { MisInversionesComponent } from './presentation/mis-inversiones/mis-inversiones.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ResumenComponent } from './presentation/resumen/resumen.component';

export const routes: Routes = [
  {
    path: 'mis-ingresos', component: MisIngresosComponent
  },
  {
    path: 'mis-gastos', component: MisGastosComponent
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
