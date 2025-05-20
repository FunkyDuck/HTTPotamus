import { Component, OnInit } from '@angular/core';
import { RequestHistoryComponent } from "../../request-history/request-history/request-history.component";
import { RequestSavedComponent } from "../../request-saved/request-saved/request-saved.component";
import { SettingsComponent } from "../../settings/settings/settings.component";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RequestHistoryComponent, RequestSavedComponent, SettingsComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  public navigate: string[] = ['history', 'collection', 'settings']
  protected view: string;

  constructor() {
    this.view = this.navigate[2];
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

  upperFirstChar(str: string) {
    return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
  }
}
