import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../core/storage.service';
import { RequestService } from '../../../core/request.service';

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [],
  templateUrl: './request-history.component.html',
  styleUrl: './request-history.component.scss'
})
export class RequestHistoryComponent implements OnInit {
  history: any;
  maxHistory: number;

  constructor(private _storage: StorageService, private _request: RequestService) {
    this.maxHistory = <number>(localStorage.getItem('history') as any);
  }

  ngOnInit(): void {
    this.getHistory();
  }

  getHistory(): void {
    this._storage.history$.subscribe(h => this.history = h.sort((a, b) => { return b.createdAt - a.createdAt;}));
    this._storage.getHistory();
  }

  setRequestEditor(request: any) {
    this._request.setRequest(request);
  }

  formatTitle(url: string): string {
    const str = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    const formattedStr = str.charAt(0).toUpperCase() + str.slice(1, 18) + '…';
    return formattedStr;
  }

  displayMethod(m: string): string {
    return (m.length <= 4) ? m : m.substring(0, 3) + '.';
  }
}
