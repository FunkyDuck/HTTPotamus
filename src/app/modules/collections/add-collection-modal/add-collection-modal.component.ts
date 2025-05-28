import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StorageService } from '../../../core/storage.service';
import { RequestCollection } from '../../../core/storage';
import { RequestService } from '../../../core/request.service';

@Component({
  selector: 'app-add-collection-modal',
  standalone: true,
  imports: [],
  templateUrl: './add-collection-modal.component.html',
  styleUrl: './add-collection-modal.component.scss'
})
export class AddCollectionModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Input() title: string = '';

  constructor(private _storage: StorageService, private _req: RequestService) {}

  ngOnInit(): void {
    
  }

  addCollection() {
    if(this.title && this.title !== '') {
      try {
        const collectionItem: RequestCollection = {
          id: crypto.randomUUID(),
          name: this.title,
          createdAt: Date.now()
        }
        this._storage.addCollection(collectionItem);
        this._req.updateResponse({body: collectionItem});
      } catch (err) {
        this._req.updateResponse({body: err});
      }
    }
    this.closed.emit();
  }

  onInput(e: Event) {
    const input = <HTMLInputElement>e?.target;
    this.title = input.value;
  }

  close() {
    this.closed.emit();
  }
}
