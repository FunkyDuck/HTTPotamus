import { Component, Input } from '@angular/core';
import { RequestService } from '../../../core/request.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './request-editor.component.html',
  styleUrl: './request-editor.component.scss'
})
export class RequestEditorComponent {
  @Input() action: any;
  @Input() url: any;

  constructor(private _req: RequestService) {}

  sendRequest() {
    console.log(this.url)
    this._req.getRequest(this.url).subscribe(res => {
      this._req.updateResponse(res);
    });
  }
}
