import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Project, ProjectData } from 'src/app/shared/models';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
//Retrieves all projects for a user in a team
//Creates a new project for a user in a team
//Updates a project for a user in a team
//Retrieves a single project for a user in a team
private baseUrl = 'http://localhost:8080';
private modalState = new BehaviorSubject<boolean>(false);
private modalType = new BehaviorSubject<string>('');

constructor(private http: HttpClient) {}

getAllProjects(companyId: number, teamId: number): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.baseUrl}/company/${companyId}/teams/${teamId}/projects`).pipe(
    catchError(error => {
      console.error('Error fetching user projects:', error);
      throw error;
    })
  );
}

createCompanyProject(companyId: number, teamId: number, projectData: any){
  return this.http.post(`${this.baseUrl}/company/${companyId}/teams/${teamId}/projects`, projectData).pipe(
    catchError(error => {
      console.error('Error fetching user projects:', error);
      throw error;
    })
  );
}

updateCompanyProject(companyId: number, teamId: number, projectId: number, projectData: any){
  return this.http.patch(`${this.baseUrl}/company/${companyId}/teams/${teamId}/projects/${projectId}`, projectData).pipe(
    catchError(error => {
      console.error('Error fetching user projects:', error);
      throw error;
    })
  );
}

getUserProjects(userId: number, teamId: number): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.baseUrl}/users/${userId}/${teamId}/projects`).pipe(
    catchError(error => {
      console.error('Error fetching user projects:', error);
      throw error;
    })
  );
}

createUserProject(userId: number, teamId: number, projectData: any): Observable<Project> {
  return this.http.post<Project>(`${this.baseUrl}/users/${userId}/${teamId}/projects`, projectData).pipe(
    catchError(error => {
      console.error('Error creating user project:', error);
      throw error;
    })
  );
}

updateUserProject(userId: number, teamId: number, projectId: number, projectData: any): Observable<void> {
  return this.http.patch<void>(`${this.baseUrl}/users/${userId}/${teamId}/projects/${projectId}`, projectData).pipe(
    catchError(error => {
      console.error('Error updating user project:', error);
      throw error;
    })
  );
}

getSingleProject(userId: number, teamId: number, projectId: number): Observable<Project> {
  return this.http.get<Project>(`${this.baseUrl}/users/${userId}/${teamId}/projects/${projectId}`).pipe(
    catchError(error => {
      console.error('Error fetching single project:', error);
      throw error;
    })
  );
}

  get modalState$(): Observable<boolean> {
		return this.modalState.asObservable();
	}

  get modalType$(): Observable<string> {
    return this.modalType.asObservable();
  }

  openModal(modalType: string) {
    this.modalType.next(modalType);
    this.modalState.next(true);
  }

  closeModal() {
    this.modalState.next(false);
  }
}
