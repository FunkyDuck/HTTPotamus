import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../core/storage.service';
import { version } from '../../../../../package.json';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  protected version: string;

  constructor(private _storage: StorageService) {
    this.version = version;
  }

  ngOnInit(): void {
    const historyMaxEntries = document.getElementById('history-entries')as any;
    historyMaxEntries.value = localStorage.getItem('history');
  }

  changeMaxHistory(): void {
    const maxEntries = (document.getElementById('history-entries')as any).value;
    localStorage.setItem('history', maxEntries);
    this._storage.cleanupHistory(<number>maxEntries);
  }

  deleteCurrentHistory(): void {
    this._storage.clearHistory();
  }

  async downloadDb(): Promise<any> {
    const now = new Date().toISOString()
    const data: any = await this._storage.downloadDb();
    const exportData: any = {
      app: "HTTPotamus",
      version: this.version,
      exportedAt: now,
      data: data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `httpotamus-backup_${now}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  uploadDb(): void {}

  displaySettings(params: string): void {
    const fDatas = document.getElementById('form-datas')?.classList;
    const sDatas = document.getElementById('set-datas')?.classList;
    const fHistory = document.getElementById('form-history')?.classList;
    const sHistory = document.getElementById('set-history')?.classList;
    const fTheme = document.getElementById('form-theme')?.classList;
    const sTheme = document.getElementById('set-theme')?.classList;
    const fFont = document.getElementById('form-font')?.classList;
    const sFont = document.getElementById('set-font')?.classList;
    const fLangage = document.getElementById('form-langage')?.classList;
    const sLangage = document.getElementById('set-langage')?.classList;

    const h = 'hidden';
    const s = 'selected';

    // unselect and hide all 
    fDatas?.add(h);
    fHistory?.add(h);
    fTheme?.add(h);
    fFont?.add(h);
    fLangage?.add(h);

    sDatas?.remove(s);
    sHistory?.remove(s);
    sTheme?.remove(s);
    sFont?.remove(s);
    sLangage?.remove(s);

    // Set up selected
    if(params === 'datas') {
      fDatas?.remove(h);
      sDatas?.add(s);
    }
    if(params === 'history') {
      fHistory?.remove(h);
      sHistory?.add(s);
    }
    if(params === 'theme') {
      fTheme?.remove(h);
      sTheme?.add(s);
    }
    if(params === 'font') {
      fFont?.remove(h);
      sFont?.add(s);
    }
    if(params === 'langage') {
      fLangage?.remove(h);
      sLangage?.add(s);
    }
  }
}
