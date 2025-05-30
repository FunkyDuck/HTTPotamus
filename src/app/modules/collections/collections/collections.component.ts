import { Component, OnInit } from '@angular/core';
import { AddCollectionModalComponent } from "../add-collection-modal/add-collection-modal.component";
import { StorageService } from '../../../core/storage.service';
import { RequestService } from '../../../core/request.service';

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

  constructor(private _store: StorageService, private _req: RequestService) {}

  ngOnInit(): void {
    this.getCollections();
  }

  getCollections(): void {
    // this._store.collection$.subscribe(c => this.collections = c.sort((a, b) => { return b.createdAt - a.createdAt; }));
    // this._store.getCollection();
    // console.log(this.collections)
    this._store.requested$.subscribe((c: any) => this.collections = c.sort((a: any, b: any) => { return b.createdAt - a.createdAt }));
    this._store.getAllCollection();
    console.log(this.collections)
  }

  setRequestEditor(rq: any): void {
    this._req.setRequest(rq);
  }

  formatTitle(url: string): string {
    const str = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    const formattedStr = str.charAt(0).toUpperCase() + str.slice(1, 18) + '…';
    return formattedStr;
  }

  onModalClosed(): void {
    this.displayModal = false;
    this.getCollections();
  }
}
