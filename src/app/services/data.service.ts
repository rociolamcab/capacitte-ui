import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root' // <- Esto es lo más importante
})
export class DataService {
  private mockJobs: Job[] = [
    { id: 1, title: 'Angular Developer', company: 'Capacitte', location: 'Remoto', description: 'Frontend specialist' }
  ];

  constructor(private http: HttpClient) { }

  getJobs(): Observable<Job[]> {
    // Por ahora usamos 'of' para evitar errores si la API no responde
    return of(this.mockJobs);
  }
}