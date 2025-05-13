import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { RequestService } from '../../../core/request.service';

@Component({
  selector: 'app-response-viewer',
  standalone: true,
  imports: [],
  templateUrl: './response-viewer.component.html',
  styleUrl: './response-viewer.component.scss'
})
export class ResponseViewerComponent implements OnInit, OnChanges {
  // @Input() jsonData: any;
  // highlitedJson = "";
  jsonData = {"user": {"id": 42,"name": "Alice","email": "alice@example.com","roles": ["admin", "editor"]},"active": true,"created_at": "2025-05-12T09:00:00Z"};
  jsonRaw = '';
  highlitedJson = '';

  constructor(private _req: RequestService) {}

  ngOnInit(): void {
    this._req.response$.subscribe((data) => {
      if(data) {
        this.jsonData = data;
        this.updateData();
      }
    });
    setTimeout(()=>{
      this.ngOnChanges();
    },1);
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

  copyJson(): void {
    
  }
}
