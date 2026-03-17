import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  
  private apiUrl = 'assets/data/jobs.json'; 

  constructor(private http: HttpClient) { }

  getJobs(): Observable<Job[]> {

    return this.http.get<Job[]>(this.apiUrl);
  }
}