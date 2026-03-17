import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Job } from '../../models/job';
import { JobCardComponent } from '../job-card/job-card.component';
import { HeroComponent } from '../hero/hero.component';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, JobCardComponent, HeroComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  
  private searchTerm: string = '';
  
  private dataService = inject(DataService);

ngOnInit(): void {
  this.dataService.getJobs().subscribe({
    next: (data) => {
      console.log('Datos cargados:', data);
      this.jobs = data;
      this.filteredJobs = [...data]; 
      this.loading = false;
    },
    error: (err) => {
      this.errorMessage = 'Error al cargar los empleos. Revisa la consola.';
      this.loading = false;
      console.error('Error de DataService:', err);
    }
  });
}

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase().trim();
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

private applyFilters(): void {
  const remoteCheck = document.getElementById('remote') as HTMLInputElement;
  const presencialCheck = document.getElementById('presencial') as HTMLInputElement;

  const isRemote = remoteCheck?.checked || false;
  const isPresencial = presencialCheck?.checked || false;

  this.filteredJobs = this.jobs.filter(job => {
    const matchesSearch = !this.searchTerm || 
                          job.title.toLowerCase().includes(this.searchTerm) || 
                          job.company.toLowerCase().includes(this.searchTerm);
                          
    if (!isRemote && !isPresencial) return matchesSearch;

    const jobIsRemote = job.location.toLowerCase().includes('remoto');
    const matchesModalidad = (isRemote && jobIsRemote) || (isPresencial && !jobIsRemote);

    return matchesSearch && matchesModalidad;
  });
}

  clearFilters(): void {
    this.searchTerm = '';
    const remoteCheck = document.getElementById('remote') as HTMLInputElement;
    const presencialCheck = document.getElementById('presencial') as HTMLInputElement;
    
    if (remoteCheck) remoteCheck.checked = false;
    if (presencialCheck) presencialCheck.checked = false;

    this.filteredJobs = [...this.jobs];
  }
}