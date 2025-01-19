import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // Import RouterModule
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { HttpClientModule } from '@angular/common/http';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, RouterModule, AmplifyAuthenticatorModule, NavBarComponent, MatButtonModule, ReactiveFormsModule, HttpClientModule ], // Add RouterModule here
})
export class AppComponent {
  title = 'amplify-angular-template';

  constructor(public authenticator: AuthenticatorService) {}
}