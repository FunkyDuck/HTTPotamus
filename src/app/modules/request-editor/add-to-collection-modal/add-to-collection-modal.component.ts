import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StorageService } from '../../../core/storage.service';

@Component({
  selector: 'app-add-to-collection-modal',
  standalone: true,
  imports: [],
  templateUrl: './add-to-collection-modal.component.html',
  styleUrl: './add-to-collection-modal.component.scss'
})
export class AddToCollectionModalComponent implements OnInit {
  @Input() data: any;
  @Output() closed = new EventEmitter();
  collections: any;
  select: string = '';

  constructor(private _store: StorageService) {}

  ngOnInit(): void {
    this._store.collection$.subscribe(c => this.collections = c.sort((a, b) => { return b.createdAt - a.createdAt; }));
    this.select = this.collections[0].id;
    this.data.collectionId = this.select;
  }
  
  onClose(): void {
    this.closed.emit();
  }
  
  setCollection(e: Event) {
    const t = <HTMLOptionElement>e.target;
    this.select = t.value;
    this.data.collectionId = this.select;
  }

  saveToCollection(): void {
    try {
      this.data.collectionId = this.select;
      this._store.addToCollection(this.data);
    } catch (err) {
      console.log(err);
    }
    this.onClose();
  }
}
