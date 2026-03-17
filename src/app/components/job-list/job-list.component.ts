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
  const jornadaSelect = document.getElementById('jornada') as HTMLSelectElement; // <-- Nuevo

  const isRemote = remoteCheck?.checked || false;
  const isPresencial = presencialCheck?.checked || false;
  const jornadaFilter = jornadaSelect?.value || 'all'; // <-- Nuevo

  this.filteredJobs = this.jobs.filter(job => {

    const matchesSearch = !this.searchTerm || 
                          job.title.toLowerCase().includes(this.searchTerm) || 
                          job.company.toLowerCase().includes(this.searchTerm);

    let matchesModalidad = true;
    if (isRemote || isPresencial) {
      const jobIsRemote = job.location.toLowerCase().includes('remoto');
      matchesModalidad = (isRemote && jobIsRemote) || (isPresencial && !jobIsRemote);
    }

    const matchesJornada = jornadaFilter === 'all' || job.type === jornadaFilter;

    return matchesSearch && matchesModalidad && matchesJornada;
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

  onSortChange(event: Event): void {
  const sortBy = (event.target as HTMLSelectElement).value;

  if (sortBy === 'recent') {
    this.filteredJobs.sort((a, b) => 
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );
  } else if (sortBy === 'salary') {
    this.filteredJobs.sort((a, b) => b.salary - a.salary);
  }
}
}