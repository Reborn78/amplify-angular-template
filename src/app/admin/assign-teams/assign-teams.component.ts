import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assign-teams',
  standalone: true,
  templateUrl: './assign-teams.component.html',
  styleUrls: ['./assign-teams.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class AssignTeamsComponent implements OnInit {
  teams: { id: number; name: string }[] = [];
  teamForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeams(); // Load existing teams on initialization
  }

  loadTeams(): void {
    const apiUrl = 'https://your-api-url.com/teams'; // Replace with your actual API URL
    this.http.get<{ id: number; name: string }[]>(apiUrl).subscribe(
      (teams) => {
        console.log('Fetched teams:', teams); // Log the fetched teams
        this.teams = teams; // Assign the fetched teams to the component's teams array
      },
      (error) => {
        console.error('Error loading teams:', error); // Handle error
      }
    );
  }

  addTeam(): void {
    if (this.teamForm.valid) {
      const newTeam = {
        name: this.teamForm.value.name // Only send the name to the API
      };

      const apiUrl = 'https://your-api-url.com/teams'; // Replace with your actual API URL
      this.http.post<{ id: number }>(apiUrl, newTeam).subscribe(
        (response) => {
          console.log('Added team:', response); // Log the response
          this.teams.push({ id: response.id, name: newTeam.name }); // Add the new team to the local array
          this.teamForm.reset(); // Reset the form
        },
        (error) => {
          console.error('Error adding team:', error); // Handle error
        }
      );
    }
  }

  deleteTeam(team: { id: number; name: string }): void {
    const apiUrl = `https://your-api-url.com/teams/${team.id}`; // Replace with your actual API URL
    this.http.delete(apiUrl).subscribe(
      () => {
        this.teams = this.teams.filter(t => t.id !== team.id); // Remove the team from the array
        console.log('Deleted team:', team); // Log the deleted team
      },
      (error) => {
        console.error('Error deleting team:', error); // Handle error
      }
    );
  }
}