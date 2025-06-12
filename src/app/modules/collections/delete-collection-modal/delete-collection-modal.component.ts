import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-collection-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-collection-modal.component.html',
  styleUrl: './delete-collection-modal.component.scss'
})
export class DeleteCollectionModalComponent implements OnInit {
  @Input() objectToDelete = null;
  @Output() closed = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    
  }
}
