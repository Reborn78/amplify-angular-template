import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams: any[] = []; // Array to hold teams

  ngOnInit(): void {
    this.fetchTeams();
  }

  fetchTeams() {
    // Fetch all teams
    client.models.Team.observeQuery().subscribe({
      next: ({ items }) => {
        this.teams = items; // Store teams
      },
      error: (error) => {
        console.error('Error fetching teams', error);
      }
    });
  }
}