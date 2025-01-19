import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import * as XLSX from 'xlsx';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

const client = generateClient<Schema>();

@Component({
  selector: 'app-export-contacts',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSelectModule],
  templateUrl: './export-contacts.component.html',
  styleUrl: './export-contacts.component.css'
})
export class ExportContactsComponent {
  mediaowners: any[] = [];
  filteredMediaowners: any[] = []; // Array to hold filtered results
  currentTeam: string = ''; // Track the current team filter
  selectedFile: File | null = null;
  isTeamSelected: boolean = false; // Track if a team is selected
  
  ngOnInit(): void {
    this.listMediaowners();
  }

  listMediaowners() {
    client.models.Mediaowner.observeQuery().subscribe({
      next: ({ items }) => {
        this.mediaowners = items;
        this.filteredMediaowners = items; // Initialize filtered array with all mediaowners
      },
      error: (error) => {
        console.error('Error fetching mediaowners', error);
      }
    });
  }

  toggleTeam(selectedTeam: string) {
    this.currentTeam = selectedTeam; // Update the current team
    this.isTeamSelected = !!selectedTeam; // Set isTeamSelected to true if a team is selected

    // Filter the media owners by the selected team
    this.filteredMediaowners = this.mediaowners.filter(mediaowner => mediaowner.team === selectedTeam);
}

  showAllMediaowners() {
    this.filteredMediaowners = this.mediaowners; // Reset the filtered array to show all media owners
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
        this.selectedFile = fileInput.files[0]; // Store the selected file
        console.log('Selected file:', this.selectedFile);
    }
  }

  importExcel() {
    if (this.selectedFile) {
        this.exportToExcel(this.selectedFile); // Call the function with the selected file
    } else {
        console.error('No file selected');
    }
  }

  exportToExcel(file: File) {
    console.log('Media Owners:', this.mediaowners); // Log the mediaowners array

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
        console.log('File loaded successfully');
        const workBook = XLSX.read(fileReader.result, { type: 'binary' });
        const sheetNames = workBook.SheetNames;
        const excelData: any[] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { header: 1 }); // Read as an array of arrays

        // Extract headers from the first row
        const headers = excelData[0] as string[]; // Assuming the first row contains headers

        // Filter media owners by the selected team
        const filteredMediaowners = this.mediaowners.filter(mediaowner => mediaowner.team === this.currentTeam);

        // Prepare data for export
        const jsonData = excelData.slice(1).map(item => {
            const newRow: any = {};
            headers.forEach((header, index) => {
                newRow[header] = item[index] || ''; // Fill with existing data or empty string
            });

            const matchedMediaOwner = filteredMediaowners.find(mediaowner => 
              mediaowner.mediaownername.toLowerCase() === newRow['Media Vendor']?.toLowerCase()
            );

            newRow['Media Vendor Contact Name 1'] = matchedMediaOwner ? matchedMediaOwner.contact1name : '';
            newRow['Media Vendor Contact Email 1'] = matchedMediaOwner ? matchedMediaOwner.contact1email : '';
            newRow['Media Vendor Contact Name 2'] = matchedMediaOwner ? matchedMediaOwner.contact2name : '';
            newRow['Media Vendor Contact Email 2'] = matchedMediaOwner ? matchedMediaOwner.contact2email : '';

            return newRow; // Return the new row object
        }).filter(row => Object.values(row).some(value => value)); // Filter out empty rows

        console.log('JSON Data for Excel:', jsonData); // Log the JSON data

        // Check if jsonData is empty
        if (jsonData.length === 0) {
            console.warn('No data available for export');
            return; // Exit the function if there's no data
        }

        // Create a new worksheet with all relevant columns
        const ws = XLSX.utils.json_to_sheet(jsonData);

        // Set default column width for all columns
        const defaultWidth = 20; // Set your desired default width here
        const columnCount = headers.length; // Get the number of columns
        ws['!cols'] = Array(columnCount).fill({ wch: defaultWidth }); // Apply the same width to all columns

        // Create a workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Updated Media Vendors');
        
        // Generate a file download using the original file name
        if (this.selectedFile) { // Check if selectedFile is not null
            const fileName = this.selectedFile.name.replace(/\.[^/.]+$/, "") + "_updated.xlsx"; // Append "_updated" to the original file name
            XLSX.writeFile(wb, fileName);
        } else {
            console.error('No file selected for export');
        }
    };

    fileReader.onerror = (error) => {
        console.error('Error reading file:', error);
    };
}
}





