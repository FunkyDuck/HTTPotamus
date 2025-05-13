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
  @Input() sliderValue: any = 1;
  methods = ['GET', 'POST', 'PUT', 'DELETE'];

  constructor(private _req: RequestService) {
    this.method = this.methods[0];
  }

  sendRequest() {
    console.log(this.url)
    this._req.sendRequest(this.url, this.method).subscribe(res => {
      this._req.updateResponse(res);
    });
  }
}
