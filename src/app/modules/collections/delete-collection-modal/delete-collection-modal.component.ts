import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-collection-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './delete-collection-modal.component.html',
  styleUrl: './delete-collection-modal.component.scss'
})
export class DeleteCollectionModalComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
  }

  close(b: boolean): void {
    this.closed.emit(b);
  }
}
