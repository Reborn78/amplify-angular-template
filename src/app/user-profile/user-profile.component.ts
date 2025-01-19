import { Component, OnInit } from '@angular/core';
import type { Schema } from '../../../amplify/data/resource';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  imports: [CommonModule],
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  users: any[] = [];

  ngOnInit(): void {
    this.loadUsers(); // Load users when the component initializes
  }

  loadUsers(): void {
    // Simulating an API call to fetch users
    this.users = [
      { userId: 1, username: 'john_doe' },
      { userId: 2, username: 'jane_smith' },
      { userId: 3, username: 'alice_jones' },
      // Add more users as needed
    ];
  }
}