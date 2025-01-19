import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import * as XLSX from 'xlsx';

const client = generateClient<Schema>();

// Define the Todo interface
interface Todo {
  id: string; // Assuming you have an ID for each todo
  content: string;
  isCrossedOut: boolean;
  importance: 'low' | 'medium' | 'high'; // Enum-like string values
  dueDate?: Date; // Optional due date
}

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})

export class TodosComponent implements OnInit {
  todos: any[] = [];

  // New todo properties
  newTodoContent: string = '';
  newTodoImportance: 'low' | 'medium' | 'high' = 'medium'; // Default value
  newTodoDueDate: Date | null = null; // Default value

   // Sorting state
  sortColumn: string = 'content'; // Default sort column
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sort direction

  ngOnInit(): void {
    this.listTodos();
  }

  listTodos() {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items }) => {
          this.todos = items.map(todo => ({
            ...todo,
            dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : null // Convert to string
          }));
          this.sortTodos(); // Sort todos after fetching
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }
  sortTodos() {
    this.todos.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      // If the same column is clicked, toggle the direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column and default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortTodos(); // Sort the todos after changing the sort state
  }


  createTodo() {
    try {
      // Convert dueDate to string format if it's a Date object
      const dueDateString = this.newTodoDueDate ? this.newTodoDueDate.toISOString().split('T')[0] : null;

      const newTodo = {
        content: this.newTodoContent, // Use the new content
        isCrossedOut: false, // Default value
        importance: this.newTodoImportance, // Use the new importance
        dueDate: dueDateString // Use the formatted due date
      };

      client.models.Todo.create(newTodo)
        .then(() => {
          // Clear the input fields after creation
          this.newTodoContent = '';
          this.newTodoImportance = 'medium'; // Reset to default
          this.newTodoDueDate = null; // Reset to default
          // Refresh the list of todos
          this.listTodos();
        })
        .catch(error => {
          console.error('Error creating todos:', error);
        });
    } catch (error) {
      console.error('Error creating todos:', error);
    }
  }

    
  deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  ExcelData:any;
  
  updateContent(todo: Todo) {
    // Logic to update the content of the todo item
    client.models.Todo.update({ id: todo.id, content: todo.content })
        .then(() => {
            console.log('Content updated successfully'); // Log success
            // Optionally refresh the list of todos after the update
            this.listTodos();
        })
        .catch(error => {
            console.error('Error updating content:', error);
        });
}

  toggleCrossOut(todo: Todo) {
    todo.isCrossedOut = !todo.isCrossedOut; // Toggle the crossed out state
  }

  updateImportance(todo: Todo) {
    // Logic to update the importance of the todo item
    client.models.Todo.update({ id: todo.id, importance: todo.importance });
  }

  updateDueDate(todo: Todo) {
    // Ensure dueDate is a Date object
    let dueDateString: string | null = null;

    if (todo.dueDate) {
        // Check if dueDate is already a Date object
        if (typeof todo.dueDate === 'string') {
            // Convert string to Date object
            const parsedDate = new Date(todo.dueDate);
            // Check if the parsed date is valid
            if (!isNaN(parsedDate.getTime())) {
                dueDateString = parsedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
            }
        } else if (todo.dueDate instanceof Date) {
            dueDateString = todo.dueDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
        }
    }

    console.log('Updating due date for todo:', todo.id, 'to', dueDateString); // Log the update

    // Logic to update the due date of the todo item
    client.models.Todo.update({ id: todo.id, dueDate: dueDateString })
        .then(() => {
            console.log('Due date updated successfully'); // Log success
            // Optionally refresh the list of todos after the update
            this.listTodos();
        })
        .catch(error => {
            console.error('Error updating due date:', error);
        });
  }
  formatDate(date: Date | null): string | null {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return null; // Return null if no date is set or if it's not a valid Date object
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
}

onDateChange(event: string, todo: Todo) {
    const newDate = new Date(event); // Convert the string back to a Date object
    todo.dueDate = newDate; // Update the todo's dueDate
    this.updateDueDate(todo); // Call the update method
}
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
