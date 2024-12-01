import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaownersComponent } from './mediaowners/mediaowners.component';
import { TodosComponent } from './todos/todos.component';
import { TeamsComponent } from './teams/teams.component';
import { ExportContactsComponent } from './export-contacts/export-contacts.component';

export const routes: Routes = [
  { path: '', component: TodosComponent  },
  { path: 'mediaowners', component: MediaownersComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'export-contacts', component: ExportContactsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }