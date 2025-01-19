import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import * as XLSX from 'xlsx';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

const client = generateClient<Schema>();

@Component({
  selector: 'app-mediaowners',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule, MatMenuModule, MatSelectModule],
  templateUrl: './mediaowners.component.html',
  styleUrl: './mediaowners.component.css'
})
export class MediaownersComponent implements OnInit {
  mediaowners: any[] = [];
  filteredMediaowners: any[] = []; // Array to hold filtered results
  selectedFile: File | null = null; // Property to store the selected file
  selectedTeam: "East" | "Stagwell" | "West" | "Havas" | "Nashville" | null = null; 

  ngOnInit(): void {
    this.listMediaowners();
  }

  listMediaowners() {
    client.models.Mediaowner.observeQuery().subscribe({
        next: ({ items }) => {
            this.mediaowners = items; // Store all media owners
            this.sortMediaowners(); // Sort media owners by name
            this.filterMediaowners(); // Filter media owners based on the selected team
        },
        error: (error) => {
            console.error('Error fetching mediaowners', error);
        }
    });
}

sortMediaowners() {
  this.mediaowners.sort((a, b) => {
      if (a.mediaownername < b.mediaownername) return -1;
      if (a.mediaownername > b.mediaownername) return 1;
      return 0;
  });
}

  toggleTeam(team: "East" | "Stagwell" | "West" | "Havas" | "Nashville") {
    this.selectedTeam = team; // Set the selected team
    console.log(`Selected team: ${this.selectedTeam}`);
    this.filterMediaowners(); // Filter media owners based on the selected team
  }
  
  filterMediaowners() {
    if (this.selectedTeam) {
        this.filteredMediaowners = this.mediaowners.filter(mediaowner => mediaowner.team === this.selectedTeam);
        this.sortFilteredMediaowners(); // Sort filtered media owners
    } else {
        this.filteredMediaowners = []; // Show none if no team is selected
    }
}

sortFilteredMediaowners() {
    this.filteredMediaowners.sort((a, b) => {
        if (a.mediaownername < b.mediaownername) return -1;
        if (a.mediaownername > b.mediaownername) return 1;
        return 0;
    });
}

  async createMediaowner() {
    try {
      const mediaownerName = window.prompt('Enter mediaowner name:');
      if (!mediaownerName) {
        console.warn('No mediaowner name provided');
        return; // Exit if no name is provided
      }

      if (!this.selectedTeam) {
        console.warn('No team selected. Please select a team first.');
        return; // Exit if no team is selected
      }

      await client.models.Mediaowner.create({
        mediaownername: mediaownerName,
        team: this.selectedTeam, // Include the selected team
      });

      console.log('Mediaowner created successfully for team:', this.selectedTeam);
      this.listMediaowners(); // Refresh the list of mediaowners
    } catch (error) {
      console.error('Error creating mediaowner:', error);
    }
  }

  showAllMediaowners() {
    this.selectedTeam = null; // Reset selected team
    this.filteredMediaowners = this.mediaowners; // Reset the filtered array to show all media owners
  }
    
  deleteMediaowner(id: string) {
    const confirmDelete = window.confirm('Are you sure you want to delete this media owner?');

    if (confirmDelete) {
        client.models.Mediaowner.delete({ id })
            .then(() => {
                console.log('Mediaowner deleted successfully');
                this.listMediaowners(); // Refresh the list after deletion
            })
            .catch(error => {
                console.error('Error deleting mediaowner', error);
            });
    } else {
        console.log('Deletion canceled');
    }
}

  updateMediaowner(mediaowner: any) {
    const { id, ...data } = mediaowner; // Destructure to get id and the rest of the properties
    client.models.Mediaowner.update({ id, ...data }) // Pass id and the rest of the properties directly
      .then(() => {
        console.log('Mediaowner updated successfully');
      })
      .catch(error => {
        console.error('Error updating mediaowner', error);
      });
  }

  ExcelData:any;
  
  onFileSelected(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
          this.selectedFile = fileInput.files[0]; // Store the selected file
          console.log('Selected file:', this.selectedFile);
      }
  }

  importExcel() {
    // Check if a team is selected and a file is selected
    if (!this.selectedTeam) {
        window.alert('Please select a team before importing.'); // Alert if no team is selected
    } else if (!this.selectedFile) {
        window.alert('Please select a file before importing.'); // Alert if no file is selected
    } else {
        this.ReadExcelMediaowner(this.selectedFile); // Call the function with the selected file
    }
}

  ReadExcelMediaowner(file: File) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);

      fileReader.onload = (e) => {
          console.log('File loaded successfully');
          var workBook = XLSX.read(fileReader.result, { type: 'binary' });
          var sheetNames = workBook.SheetNames;
          const excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);

          // Create TODO items from the Excel data
          for (let item of excelData) {
              this.createMediaownerFromExcel(item);
              console.log(item);
          }
      };
  }

  createMediaownerFromExcel(item: any) {
      if (item['Media Vendor']) {
          try {
              client.models.Mediaowner.create({
                  mediaownername: item['Media Vendor'],
                  contact1name: item['Media Vendor Contact Name 1'],
                  contact1email: item['Media Vendor Contact Email 1'],
                  contact2name: item['Media Vendor Contact Name 2'],
                  contact2email: item['Media Vendor Contact Email 1'],
                  team: this.selectedTeam,
              });
              this.listMediaowners(); // Refresh the list
          } catch (error) {
              console.error('Error creating mediaowner from Excel', error);
          }
      }
  }

  exportToExcel() {
    // Prepare data for Excel export
    const jsonData = this.mediaowners.map(mediaowner => ({ 
      'Media Vendor': mediaowner.mediaownername,
      'Media Vendor Contact Name 1': mediaowner.contact1name,
      'Media Vendor Contact Email 1': mediaowner.contact1email,
      'Media Vendor Contact Name 2': mediaowner.contact2name,
      'Media Vendor Contact Email 2': mediaowner.contact2email, 
    }));
    
    // Convert the data to a worksheet
    const ws = XLSX.utils.json_to_sheet(jsonData);
    
    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Media Vendors');
    
    // Generate a file download
    XLSX.writeFile(wb, 'media_vendors.xlsx');
  }
}


