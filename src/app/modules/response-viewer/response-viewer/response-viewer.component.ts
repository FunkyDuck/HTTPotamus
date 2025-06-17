import { Component, Input, OnInit } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { RequestService } from '../../../core/request.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-response-viewer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './response-viewer.component.html',
  styleUrl: './response-viewer.component.scss'
})
export class ResponseViewerComponent implements OnInit {
  @Input() jsonData: any;
  highlitedJson: string = "";
  jsonRaw: string = '';
  duration: number = 0;
  status: number = 0;
  statusText: string = '';
  headers: any;
  bodySize: number = 0;
  headersSize: number = 0;

  constructor(private _req: RequestService) {}

  ngOnInit(): void {
    this._req.response$.subscribe({
      next: (data) => {
        if(data) {
          this.jsonData = data.body ?? [];
          this.duration = data.duration;
          this.status = data.status;
          this.statusText = data.statusText;
          this.headers = data.headers ?? [];
          this.headersSize = data.headersSize;
          this.bodySize = data.bodySize;

          console.log('HEADERS', this.headers)
          console.log('HEADERS KEYS', this.headers.keys())
          console.info('CONTENT-TYPE', this.headers.get('content-type'))

          if(data.error) {
            console.warn(data.status)
          }

          this.updateData();
        }
      },
    });
  }

  updateData(): void {
    this.jsonRaw = JSON.stringify(this.jsonData);
    const raw = JSON.stringify(this.jsonData, null, 4).trim();
    this.highlitedJson = Prism.highlight(raw, Prism.languages['json'], 'json');
  }

  toggleFormat(format: string): void {
    const rawPre = document.getElementById("format-raw");
    const prettyPre = document.getElementById("format-pretty");
    const rawBtn = document.getElementById("btn-raw");
    const prettyBtn = document.getElementById("btn-pretty");
    const headersPre = document.getElementById("format-headers");
    const headersBtn = document.getElementById("btn-headers");
    
    rawBtn?.classList.remove("selected");
    rawPre?.classList.remove("selected");
    prettyBtn?.classList.remove("selected");
    prettyPre?.classList.remove("selected");
    headersBtn?.classList.remove("selected");
    headersPre?.classList.remove("selected");
    
    if(format === "raw") {
      rawBtn?.classList.add("selected");
      rawPre?.classList.add("selected");
    }
    
    if(format === "pretty") {
      prettyBtn?.classList.add("selected");
      prettyPre?.classList.add("selected");
    }
    
    if(format === "headers") {
      headersBtn?.classList.add("selected");
      headersPre?.classList.add("selected");
    }
  }
  
  copyToClipboard(): void {
    const prettyBtn = document.getElementById("btn-pretty");
    let cp;
    
    if(prettyBtn?.classList.contains("selected")) {
      cp = this.highlitedJson;
    }
    else {
      cp = this.jsonRaw;
    }

    navigator.clipboard.writeText(JSON.stringify(this.jsonData));
  }

  getClass(): string {
    if(this.status >= 100 && this.status < 200) return 'blue';
    if(this.status >= 200 && this.status < 300) return 'green';
    if(this.status >= 300 && this.status < 400) return 'yellow';
    if(this.status >= 400 && this.status < 500) return 'orange';
    if(this.status >= 500 || this.status === 0) return 'red';
    return '';
  }

  getSizesString(): string {
    return `Headers:  ${this.headersSize}\nBody: ${this.bodySize}`;
  }
}

