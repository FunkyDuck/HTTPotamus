import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { DeleteCollectionModalComponent } from '../delete-collection-modal/delete-collection-modal.component';
import { StorageService } from '../../../core/storage.service';

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

  constructor(private _store: StorageService) {}

  ngOnInit(): void {
    console.log(this.collection)
  }

  displayRequest(r: any): void {
    this.selectedRequest = r;
    const raw = JSON.stringify(this.selectedRequest.body, null, 4).trim();
    this.highlitedJson = Prism.highlight(raw, Prism.languages['json'], 'json');
  }

  deleteRequest(request: any): void {
    console.log(request)
    this.displayDelete = true;
  }

  close(): void {
    this.closed.emit();
  }

  onModalClosed(e: boolean): void {
    if(e === true) {
      if(this.selectedRequest === this.collection) {
        console.log('delete Collection');
      }
      else {
        console.log('delete Request')
        this.collection.requests = this.collection.requests.filter((c: any) => c !== this.selectedRequest);
        this._store.deleteRequest(this.selectedRequest.id);
      }
    }
    this.displayDelete = false;
    this.selectedRequest = null;
  }
}
