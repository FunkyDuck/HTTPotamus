import { Component, Input } from '@angular/core';
import { RequestService } from '../../../core/request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-editor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './request-editor.component.html',
  styleUrl: './request-editor.component.scss'
})
export class RequestEditorComponent {
  @Input() url: any;
  @Input() method: any;
  methods = ['GET', 'POST', 'PUT', 'DELETE'];
  arrayForm = [{slider: 1, key: '', value: ''}];

  constructor(private _req: RequestService) {
    this.method = this.methods[0];
  }

  sendRequest(event: any = null) {
    if(event === null || event.keyCode == 13) {
      let data = this.arrayForm.filter(row => row.slider === 1 && row.key !== '' && row.value !== '').reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {} as Record<string, string>);
      console.log(data)

      this._req.sendRequest(this.url, this.method, data).subscribe(res => {
        this._req.updateResponse(res);
      });
    }
  }

  addRow(event: any, idx: number, last: any): void {
    console.info(`Idx : ${idx} || ${last} : Last`)
    console.log(`[${event.target.id}] ${event.target.value}`)
    const selkey = (document.getElementById(`key-${idx}`)as any).value;
    const selvalue = (document.getElementById(`value-${idx}`)as any).value;
    this.arrayForm[idx].key = selkey;
    this.arrayForm[idx].value = selvalue;
    if(last && (selkey !== '' || selvalue !== '')) {
      this.arrayForm.push({slider: 1, key: '', value: ''});
    }
  }

  updateSlider(idx: number): void {
    const row = <any>document.getElementById(`slider-${idx}`);
    row.slider = (row.slider == 1)? 0 : 1;
    this.arrayForm[idx].slider = row.slider
  }

  deleteRow(idx: number) {
    const row = document.getElementById(`field-${idx}`);
    row?.remove();
    this.arrayForm.splice(idx, 1);
    console.log(this.arrayForm)
  }
}
