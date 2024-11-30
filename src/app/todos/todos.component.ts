import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import * as XLSX from 'xlsx';
const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  todos: any[] = [];

  ngOnInit(): void {
    this.listTodos();
  }

  listTodos() {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createTodo() {
    try {
      client.models.Todo.create({
        content: window.prompt('Todo content'),
      });
      this.listTodos();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

    
  deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  ExcelData:any;
  
  ReadExcel(event: any) {
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
        this.createTodoFromExcel(item);
        console.log(item);
      }
    }
  }
  
  createTodoFromExcel(item: any) {
    if (item.content) {
      try {
        client.models.Todo.create({
          content: item.content,
        });
        this.listTodos(); // Refresh the list
      } catch (error) {
        console.error('error creating todos from Excel', error);
      }
    }
  }

  exportToExcel() {
    // Prepare data for Excel export
    const jsonData = this.todos.map(todo => ({ Content: todo.content }));
    
    // Convert the data to a worksheet
    const ws = XLSX.utils.json_to_sheet(jsonData);
    
    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TODO List');
    
    // Generate a file download
    XLSX.writeFile(wb, 'todo_list.xlsx');
  }
}
