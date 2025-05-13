import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestEditorComponent } from './modules/request-editor/request-editor/request-editor.component';
import { HeaderComponent } from './modules/header/header/header.component';
import { RequestHistoryComponent } from "./modules/request-history/request-history/request-history.component";
import { ResponseViewerComponent } from './modules/response-viewer/response-viewer/response-viewer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RequestEditorComponent, RequestHistoryComponent, ResponseViewerComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'HTTPotamus';
}
