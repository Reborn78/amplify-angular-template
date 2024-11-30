import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { MediaownersComponent } from './mediaowners/mediaowners.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, TodosComponent, MediaownersComponent, AmplifyAuthenticatorModule, NavBarComponent, MatButtonModule],
})
export class AppComponent {
  
  title = 'amplify-angular-template';
 
  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
  }


}
