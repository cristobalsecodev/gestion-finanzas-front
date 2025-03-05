import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


export enum ModalType {
  INFO = 'info',
  WARNING = 'warning',
  DELETE = 'delete'
}

interface DialogData {
  type: ModalType;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    MatIconModule,
    MatButtonModule,
    MatDialogContent
  ],
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.scss'
})
export class ActionDialogComponent {

  ModalType = ModalType

  constructor(
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false)
  }

  onConfirm(): void {
    this.dialogRef.close(true)
  }

  // Obtener iconos según el tipo de diálogo
  getIcon(): string {

    switch (this.data.type) {

      case 'warning': return 'warning'

      case 'info': return 'info';

      case 'delete': return 'delete_forever'

      default: return 'question_mark'

    }

  }

  getTitle(type: string): string {

    switch (type) {

      case 'warning': return 'Warning'

      case 'info': return 'Info'

      case 'delete': return 'Delete'

      default: return 'Message'

    }
  }
}
