import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dynamic-button',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    MatIconModule,
    MatButtonModule,
  ],
  host: { 
    // Flat
    '[style.--mdc-filled-button-label-text-size]': 'textSizeRem + "rem"',
    '[style.--mdc-filled-button-container-shape]': 'shapePx+ "px"',
    '[style.--mdc-filled-button-container-height]': 'heightPx + "px"',

    // Stroked
    '[style.--mdc-outlined-button-label-text-size]': 'textSizeRem + "rem"',
    '[style.--mdc-outlined-button-container-shape]': 'shapePx+ "px"',
    '[style.--mdc-outlined-button-container-height]': 'heightPx + "px"',

    // Raised
    '[style.--mdc-protected-button-label-text-size]': 'textSizeRem + "rem"',
    '[style.--mdc-protected-button-container-shape]': 'shapePx+ "px"',
    '[style.--mdc-protected-button-container-height]': 'heightPx + "px"',

    // Basic
    '[style.--mdc-text-button-label-text-size]': 'textSizeRem + "rem"',
    '[style.--mdc-text-button-container-shape]': 'shapePx+ "px"',
    '[style.--mdc-text-button-container-height]': 'heightPx + "px"',
  },
  templateUrl: './dynamic-button.component.html',
  styleUrl: './dynamic-button.component.scss'
})
export class DynamicButtonComponent {

  // Opciones de personalización
  @Input() textSizeRem: number = 1.450
  @Input() shapePx: number = 10
  @Input() heightPx: number = 70
  @Input() buttonClass: string = ''
  @Input() buttonType: 'flat' | 'basic' | 'raised' | 'stroked' = 'basic';

  // Inputs de texto
  @Input() buttonText: string = ''
  @Input() matIcon: string = ''

  @Output() buttonClicked = new EventEmitter<void>();

  clicked(): void {

    this.buttonClicked.emit

  }

}
