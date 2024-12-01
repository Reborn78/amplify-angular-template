import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import * as XLSX from 'xlsx';
import { MatButtonModule } from '@angular/material/button';

const client = generateClient<Schema>();

@Component({
  selector: 'app-mediaowners',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './mediaowners.component.html',
  styleUrl: './mediaowners.component.css'
})
export class MediaownersComponent implements OnInit {
  mediaowners: any[] = [];
  filteredMediaowners: any[] = []; // Array to hold filtered results
  currentTeam: string = ''; // Track the current team filter

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

  createMediaowner() {
    try {
      client.models.Mediaowner.create({
        mediaownername: window.prompt('mediaowner content'),
        
      });
      console.log('Fetched mediaowners: blahgh');
      this.listMediaowners();
    } catch (error) {
      console.error('error creating mediaowners', error);
    }
  }
  toggleTeam(selectedTeam: string) {
    this.currentTeam = selectedTeam; // Update the current team

    // Filter the media owners by the selected team
    this.filteredMediaowners = this.mediaowners.filter(mediaowner => mediaowner.team === selectedTeam);
  }
  showAllMediaowners() {
    this.filteredMediaowners = this.mediaowners; // Reset the filtered array to show all media owners
}
    
  deleteMediaowner(id: string) {
    client.models.Mediaowner.delete({ id })
  }
  ExcelData:any;
  
  ReadExcelMediaowner(event: any) {
    let file = event.target.files[0];
  
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
  
    fileReader.onload = (e) => {
      console.log('File loaded successfully');
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      const excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
  
      // console.log(excelData);

      // Create TODO items from the Excel data
      for (let item of excelData) {
        this.createMediaownerFromExcel(item);
        console.log(item);
      }
    }
  }
  
  createMediaownerFromExcel(item: any) {
    // Assuming your headers in the Excel are:
    // "Media Vender", "Contact 1 Name", "Contact 1 Email", etc.
    
    if (item['Media Vendor']) {
        try {
            client.models.Mediaowner.create({
                mediaownername: item['Media Vendor'], // Correct usage
                contact1name: item['Media Vendor Contact Name 1'], // Adjust based on your actual headers
                contact1email: item['Media Vendor Contact Email 1'],
                contact2name: item['Media Vendor Contact Name 2'],
                contact2email: item['Media Vendor Contact Email 1'],
                team: item['Team'],
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
