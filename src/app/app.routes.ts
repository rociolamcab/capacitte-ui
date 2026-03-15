import { Routes } from '@angular/router';
import { JobListComponent } from './components/job-list/job-list.component';

export const routes: Routes = [
  { 
    path: '', 
    component: JobListComponent,
    title: 'Capacitte - Inicio' 
  },
  { 
    path: 'jobs', 
    component: JobListComponent 
  },
  // Aquí es donde en el futuro pondrás:
  // { path: 'job/:id', component: JobDetailComponent }
];