import { Component, OnInit } from '@angular/core';
import { AddCollectionModalComponent } from "../add-collection-modal/add-collection-modal.component";

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [AddCollectionModalComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent implements OnInit {
  displayModal: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  onModalClosed(): void {
    this.displayModal = false;
  }
}
