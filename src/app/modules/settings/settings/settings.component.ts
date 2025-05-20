import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../core/storage.service';
import { RequestService } from '../../../core/request.service';
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

  constructor(private _storage: StorageService, private _request: RequestService) {
    this.version = version;
  }

  ngOnInit(): void {
    const historyMaxEntries = document.getElementById('history-entries')as any;
    historyMaxEntries.value = localStorage.getItem('history');
  }

  sendToViewer(data: any): void {
    const json = {
      body: data
    };
    this._request.updateResponse(json);
  }

  changeMaxHistory(): void {
    const maxEntries = (document.getElementById('history-entries')as any).value;
    localStorage.setItem('history', maxEntries);
    this._storage.cleanupHistory(<number>maxEntries);
    const json = {
      action: 'Change Max history',
      success: true
    };
    this.sendToViewer(json);
  }

  deleteCurrentHistory(): void {
    this._storage.clearHistory();
    const json = {
      action: 'Clear History',
      success: true
    };
    this.sendToViewer(json);
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

    const json = {
      action: 'Download Database',
      success: true
    };
    this.sendToViewer(json);
  }

  uploadDb(): void {
    const jsonFile = <HTMLInputElement>document.getElementById('json-data-upload');
    
    if(!jsonFile || !jsonFile.files || jsonFile.files.length === 0) {
      console.warn('No file selected...');
      const json = {
        action: 'Upload database',
        success: false,
        error: 'No file selected'
      }
      this.sendToViewer(json);
      return;
    }

    const file = jsonFile.files[0];
    const reader = new FileReader();

    console.info('READER 1')

    reader.onload = (event: ProgressEvent<FileReader>) => {
      console.log('ON READER')
      try {
        const data = event.target?.result as string;
        const parsedData = JSON.parse(data);

        this._storage.uploadDb(parsedData.data);

        const json = {
          action: 'Upload database',
          success: true
        }
        this.sendToViewer(json);
      } catch (err) {
        console.error(err);
        const json = {
          action: 'Upload database',
          success: false,
          error: err
        }
        this.sendToViewer(json);
      }
    };
    
    reader.onerror = (err) => {
      console.error(err);
      const json = {
        action: 'Upload database',
        success: false,
        error: err
      }
      this.sendToViewer(json);
    };

    reader.readAsText(file);
  }

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
