import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { DeleteCollectionModalComponent } from '../delete-collection-modal/delete-collection-modal.component';

@Component({
  selector: 'app-manage-collection-modal',
  standalone: true,
  imports: [DeleteCollectionModalComponent],
  templateUrl: './manage-collection-modal.component.html',
  styleUrl: './manage-collection-modal.component.scss'
})
export class ManageCollectionModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Input() collection: any = null;
  selectedRequest: any = null;
  highlitedJson: string = '';
  displayDelete: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log(this.collection)
  }

  displayRequest(r: any): void {
    this.selectedRequest = r;
    const raw = JSON.stringify(this.selectedRequest.headers, null, 4).trim();
    this.highlitedJson = Prism.highlight(raw, Prism.languages['json'], 'json');
  }

  deleteRequest(request: any): void {
    console.log(request)
  }

  close(): void {
    this.closed.emit();
  }
}
