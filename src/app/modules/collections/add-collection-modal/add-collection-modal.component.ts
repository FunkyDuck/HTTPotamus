import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../../../core/storage.service';

@Component({
  selector: 'app-add-collection-modal',
  standalone: true,
  imports: [],
  templateUrl: './add-collection-modal.component.html',
  styleUrl: './add-collection-modal.component.scss'
})
export class AddCollectionModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();

  constructor(private _storage: StorageService) {}

  ngOnInit(): void {
    
  }

  close() {
    this.closed.emit();
  }
}
