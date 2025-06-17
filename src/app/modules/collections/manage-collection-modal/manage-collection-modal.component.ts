import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { DeleteCollectionModalComponent } from '../delete-collection-modal/delete-collection-modal.component';
import { StorageService } from '../../../core/storage.service';
import { RequestService } from '../../../core/request.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-collection-modal',
  standalone: true,
  imports: [DeleteCollectionModalComponent, TranslateModule],
  templateUrl: './manage-collection-modal.component.html',
  styleUrl: './manage-collection-modal.component.scss'
})
export class ManageCollectionModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Input() collection: any = null;
  selectedRequest: any = null;
  highlitedJson: string = '';
  displayDelete: boolean = false;

  constructor(private _store: StorageService, private _req: RequestService) {}

  ngOnInit(): void {
    console.log(this.collection)
  }

  displayRequest(r: any): void {
    this.selectedRequest = r;
    const raw = JSON.stringify(this.selectedRequest.body, null, 4).trim();
    this.highlitedJson = Prism.highlight(raw, Prism.languages['json'], 'json');
  }

  deleteRequest(): void {
    this.displayDelete = true;
  }

  deleteCollection(collection: any): void {
    this.selectedRequest = collection;
    this.displayDelete = true;
  }

  close(): void {
    this.closed.emit();
  }

  onModalClosed(e: boolean): void {
    if(e === true) {
      if(this.selectedRequest === this.collection) {
        this.collection.requests.forEach((r: any) => {
          this._store.deleteRequest(r.id);
        });

        this._store.deleteCollection(this.collection.id);

        const json = {
          body:  {
            action: 'Collection deleted',
            collection: this.collection.name,
            success: true
          }
        };

        this._req.updateResponse(json);
        this.close();
      }
      else {
        this.collection.requests = this.collection.requests.filter((r: any) => r !== this.selectedRequest);
        this._store.deleteRequest(this.selectedRequest.id);
      }
    }
    this.displayDelete = false;
    this.selectedRequest = null;
  }
}
