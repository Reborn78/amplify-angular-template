import { Component } from '@angular/core';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { Amplify } from 'aws-amplify';
import outputs from '../../../amplify_outputs.json';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

Amplify.configure(outputs);
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [AmplifyAuthenticatorModule, RouterOutlet, RouterLinkActive, RouterLink, NavBarComponent,MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
  }
}
