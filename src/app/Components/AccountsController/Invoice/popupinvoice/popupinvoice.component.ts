import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popupinvoice',
  templateUrl: './popupinvoice.component.html',
  styleUrls: ['./popupinvoice.component.scss']
})
export class PopupinvoiceComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupinvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) {}

  close(): void {
    this.dialogRef.close();
  }
}
