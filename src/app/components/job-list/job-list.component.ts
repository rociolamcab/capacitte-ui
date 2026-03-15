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
  
  // Guardamos el término de búsqueda para combinarlo con los filtros laterales
  private searchTerm: string = '';
  
  private dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.filteredJobs = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo conectar con la base de datos.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Se ejecuta cuando el Hero emite un término
  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase().trim();
    this.applyFilters();
  }

  // Se ejecuta cuando cambian los checkboxes o el select del HTML
  onFilterChange(): void {
    this.applyFilters();
  }

  // Método centralizado de filtrado (Lógica profesional)
  private applyFilters(): void {
    // 1. Capturamos el estado de los filtros directamente desde el DOM
    const isRemote = (document.getElementById('remote') as HTMLInputElement)?.checked;
    const isPresencial = (document.getElementById('presencial') as HTMLInputElement)?.checked;

    this.filteredJobs = this.jobs.filter(job => {
      // Filtro de Texto (Buscador)
      const matchesSearch = !this.searchTerm || 
                            job.title.toLowerCase().includes(this.searchTerm) || 
                            job.company.toLowerCase().includes(this.searchTerm);

      // Filtro de Modalidad (Checkbox)
      let matchesModalidad = true;
      if (isRemote || isPresencial) {
        // Ejemplo: si es remoto buscamos la palabra "Remoto" en la localización
        const jobIsRemote = job.location.toLowerCase().includes('remoto');
        matchesModalidad = (isRemote && jobIsRemote) || (isPresencial && !jobIsRemote);
      }

      return matchesSearch && matchesModalidad;
    });
  }

  // Método para el botón "Limpiar filtros"
  clearFilters(): void {
    this.searchTerm = '';
    const remoteCheck = document.getElementById('remote') as HTMLInputElement;
    const presencialCheck = document.getElementById('presencial') as HTMLInputElement;
    
    if (remoteCheck) remoteCheck.checked = false;
    if (presencialCheck) presencialCheck.checked = false;

    this.filteredJobs = [...this.jobs];
  }
}