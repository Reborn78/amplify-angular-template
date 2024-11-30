import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaownersComponent } from './mediaowners/mediaowners.component';
import { TodosComponent } from './todos/todos.component';

export const routes: Routes = [
  { path: '', component: TodosComponent  },
  { path: 'mediaowners', component: MediaownersComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }