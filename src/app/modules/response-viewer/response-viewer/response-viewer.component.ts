import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { RequestService } from '../../../core/request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-response-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-viewer.component.html',
  styleUrl: './response-viewer.component.scss'
})
export class ResponseViewerComponent implements OnInit, OnChanges {
  @Input() jsonData: any;
  highlitedJson: string = "";
  jsonRaw: string = '';
  duration: number = 0;
  status: number = 0;
  statusText: string = '';

  constructor(private _req: RequestService) {}

  ngOnInit(): void {
    this._req.response$.subscribe({
      next: (data) => {
        if(data) {
          this.jsonData = data.body ?? [];
          this.duration = data.duration;
          this.status = data.status;
          this.statusText = data.statusText;

          if(data.error) {
            console.warn(`ERrrr :://:: ${data.status}`)
          }

          this.updateData();
        }
      },
    });
    // setTimeout(()=>{
    //   this.ngOnChanges();
    // },1);
  }

  ngOnChanges(): void {
    
    // console.log(this._req.response$)
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
    
    rawBtn?.classList.remove("selected");
    rawPre?.classList.remove("selected");
    prettyBtn?.classList.remove("selected");
    prettyPre?.classList.remove("selected");
    
    if(format === "raw") {
      rawBtn?.classList.add("selected");
      rawPre?.classList.add("selected");
    }
    
    if(format === "pretty") {
      prettyBtn?.classList.add("selected");
      prettyPre?.classList.add("selected");
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
    console.info(`GET/CLASS [${this.status}]`)
    if(this.status >= 100 && this.status < 200) return 'blue';
    if(this.status >= 200 && this.status < 300) return 'green';
    if(this.status >= 300 && this.status < 400) return 'yellow';
    if(this.status >= 400 && this.status < 500) return 'orange';
    if(this.status >= 500 || this.status === 0) return 'red';
    return '';
  }
}

