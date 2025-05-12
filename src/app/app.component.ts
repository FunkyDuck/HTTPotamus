import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestEditorComponent } from './modules/request-editor/request-editor/request-editor.component';
import { HeaderComponent } from './modules/header/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RequestEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'HTTPotamus';
}
