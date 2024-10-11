import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-tabla-general',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './tabla-general.component.html',
  styleUrl: './tabla-general.component.scss'
})
export class TablaGeneralComponent {

  @Input() columns: string[] = [];

  @Input() dataSource: any[] = [];

  @Input() showActions: boolean = false;

  get displayedColumns(): string[] {
    return this.showActions ? [...this.columns, 'actions'] : this.columns;
  }
}
