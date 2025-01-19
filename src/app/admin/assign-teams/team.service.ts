// team.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'https://your-api-url.com/teams'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getTeams(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(this.apiUrl);
  }
}