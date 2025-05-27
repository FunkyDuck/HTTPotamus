import { Component, Input, OnInit } from '@angular/core';
import { RequestService } from '../../../core/request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/storage.service';
import { HistoryRequest } from '../../../core/storage';

@Component({
  selector: 'app-request-editor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './request-editor.component.html',
  styleUrl: './request-editor.component.scss'
})
export class RequestEditorComponent implements OnInit {
  @Input() url: any;
  @Input() method: any;
  methods = ['GET', 'POST', 'PUT', 'DELETE'];
  arrayForm = [{slider: 1, key: '', value: ''}];
  jsonForm: string = '';
  selectedForm: string;
  instantRamens: string[] = [
    'https://api.sampleapis.com/coffee/hot',
    'https://api.sampleapis.com/coffee/iced',
    'https://api.sampleapis.com/beers/ale',
    'https://api.sampleapis.com/beers/stouts',
    'https://api.sampleapis.com/beers/red-ale',
    'https://www.freetogame.com/api/games',
    'https://pokeapi.co/api/v2/pokemon/',
    'https://www.eightballapi.com/api'
  ];

  constructor(private _req: RequestService, private _storage: StorageService) {
    this.method = this.methods[0];
    this.selectedForm = 'keyval';
  }

  ngOnInit(): void {
    this.getRequest();
  }

  parseJson(): void {
    const input = <any>document.getElementById('field-json');
    this.jsonForm = input.value;
  }

  getInstant() {
    const url: string = this.instantRamens[Math.floor(Math.random() * this.instantRamens.length)];
    this._req.setRequest({url: url, method: 'GET'});
  }

  getRequest() {
    this._req.request$.subscribe((r: any) => {
      this.method = r.method;
      this.url = r.url;
      this.arrayForm = Object.entries(r.headers || {}).map(([key, value]) => ({
        slider: 1,
        key,
        value: String(value)
      }));

      this.arrayForm.push({slider: 1, key: '', value: ''});
    });
  }

  formToRecord() {
    return this.arrayForm.filter(row => row.slider === 1 && row.key !== '' && row.value !== '').reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {} as Record<string, string>);
  }

  sendRequest(event: any = null) {
    if(event === null || event.keyCode == 13) {
      let data;

      if(this.selectedForm === 'keyval') {
        data = this.formToRecord();
      }

      if(this.selectedForm === 'json') {
        try {
          data = JSON.parse(this.jsonForm)
        } catch (err) {
          const json = {
            body: {
              error: err
            }
          };
          this._req.updateResponse(json);
        }
      }

      const historyItem: HistoryRequest = {
        method: this.method,
        url: this.url,
        headers: data,
        createdAt: Date.now()
      }

      this._storage.addHistory(historyItem);

      this._req.sendRequest(this.url, this.method, data).subscribe(res => {
        this._req.updateResponse(res);
      });
    }
  }

  addRow(event: any, idx: number, last: any): void {
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
    // const row = document.getElementById(`field-${idx}`);
    // row?.remove();
    this.arrayForm.splice(idx, 1);
    // console.log(this.arrayForm)
  }

  displayForm(str: string) {
    const keyvalBtn = document.getElementById('keyval-btn')?.classList;
    const keyvalForm = document.getElementById('keyval-form')?.classList;
    const jsonBtn = document.getElementById('json-btn')?.classList;
    const jsonForm = document.getElementById('json-form')?.classList;

    this.selectedForm = str;

    const a: string = 'active';
    const h: string = 'hidden';

    keyvalBtn?.remove(a);
    jsonBtn?.remove(a);
    keyvalForm?.add(h);
    jsonForm?.add(h);

    if(str === 'keyval') {
      keyvalBtn?.add(a);
      keyvalForm?.remove(h);
      this.arrayForm = Object.entries(JSON.parse(this.jsonForm)).map(([key, val]) => ({
        key,
        value: typeof val === 'string' ? val : JSON.stringify(val),
        slider: 1
      }));
    }
    if(str === 'json') {
      jsonBtn?.add(a);
      jsonForm?.remove(h);
      this.jsonForm = JSON.stringify(this.formToRecord());
    }
  }
}
