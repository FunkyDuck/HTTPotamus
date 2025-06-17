import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestEditorComponent } from './modules/request-editor/request-editor/request-editor.component';
import { HeaderComponent } from './modules/header/header/header.component';
import { RequestHistoryComponent } from "./modules/request-history/request-history/request-history.component";
import { ResponseViewerComponent } from './modules/response-viewer/response-viewer/response-viewer.component';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from "./modules/side-bar/side-bar/side-bar.component";
import { StorageService } from './core/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RequestEditorComponent, RequestHistoryComponent, ResponseViewerComponent, FormsModule, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'HTTPotamus';

  constructor(private _storage: StorageService, private _translate: TranslateService) {
    _translate.addLangs(['en', 'fr', 'nl']);
    _translate.setDefaultLang('en');

    const storedLang = localStorage.getItem('lang');
    if(!storedLang) {
      const browserLang = _translate.getBrowserLang();
      _translate.use(browserLang?.match(/en|fr|nl/) ? browserLang : 'en');
    }
    else {
      _translate.use(storedLang);
    }
  }

  ngOnInit(): void {
    this._storage.requestPersistentStorage();
  }
}
