import { Component, OnInit } from '@angular/core';
import { RequestHistoryComponent } from "../../request-history/request-history/request-history.component";
import { CollectionsComponent } from '../../collections/collections/collections.component';
import { SettingsComponent } from "../../settings/settings/settings.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RequestHistoryComponent, CollectionsComponent, SettingsComponent, TranslateModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  public navigate: string[] = ['history', 'collection', 'settings']
  protected view: string;

  constructor() {
    this.view = this.navigate[1];
  }

  ngOnInit(): void {
    
  }

  updatePage(page: string): void {
    this.view = page;

    document.getElementById('nav-history')?.classList.remove('active');
    document.getElementById('nav-collection')?.classList.remove('active');
    document.getElementById('nav-settings')?.classList.remove('active');

    document.getElementById(`nav-${page}`)?.classList.add('active');
  }

  setTitle(str: string): string {
    if(str === 'history')
      return 'History';
    if(str === 'collection')
      return 'Flavors';
    if(str === 'settings')
      return 'SETTINGS.TITLE';

    return 'HTTPotamus';
  }
}
