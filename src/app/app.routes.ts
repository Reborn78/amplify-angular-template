import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaownersComponent } from './mediaowners/mediaowners.component';

import { ExportContactsComponent } from './export-contacts/export-contacts.component';





export const routes: Routes = [
 

  { path: 'mediaowners', component: MediaownersComponent },
  { path: '', component: ExportContactsComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }