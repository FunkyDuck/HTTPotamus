import { Component, OnInit } from '@angular/core';
import { AddCollectionModalComponent } from "../add-collection-modal/add-collection-modal.component";
import { StorageService } from '../../../core/storage.service';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [AddCollectionModalComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent implements OnInit {
  displayModal: boolean = false;
  collections: any;

  constructor(private _store: StorageService) {}

  ngOnInit(): void {
    this.getCollections();
  }

  getCollections(): void {
    this._store.collection$.subscribe(c => this.collections = c.sort((a, b) => { return b.createdAt - a.createdAt; }));
    this._store.getCollection();
    console.log(this.collections)
  }

  onModalClosed(): void {
    this.displayModal = false;
    this.getCollections();
  }
}
