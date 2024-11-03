import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dynamic-flat-button',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    MatIconModule,
    MatButtonModule,
  ],
  host: { 
    '[style.--mdc-filled-button-label-text-size]': 'textSizeRem + "rem"',
    '[style.--mdc-filled-button-container-shape]': 'shapePx+ "px"',
    '[style.--mdc-filled-button-container-height]': 'heightPx + "px"'
  },
  templateUrl: './dynamic-flat-button.component.html',
  styleUrl: './dynamic-flat-button.component.scss'
})
export class DynamicFlatButtonComponent {

  // Opciones de personalización
  @Input() textSizeRem: number = 1.450
  @Input() shapePx: number = 10
  @Input() heightPx: number = 70
  @Input() buttonClass: string = ''

  // Inputs de texto
  @Input() buttonText: string = ''
  @Input() matIcon: string = ''

  @Output() buttonClicked = new EventEmitter<void>();

  clicked(): void {

    this.buttonClicked.emit

  }

}
