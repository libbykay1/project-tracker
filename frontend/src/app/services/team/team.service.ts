import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { Project } from 'src/app/shared/models';
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  //Retrieves all projects for a user in a team.
  //Creates a new project for a user in a team.
  //Updates a project for a user in a team.
  //Retrieves a single project for a user in a team.
  private baseUrl = 'http://localhost:8080';

  private dataSubjectId = new BehaviorSubject<any>(null);
  dataId$ = this.dataSubjectId.asObservable();

  private dataSubjectName = new BehaviorSubject<any>(null);
  dataName$ = this.dataSubjectName.asObservable();

  constructor(private http: HttpClient) {}

  setTeamName(data:string){
    this.dataSubjectName.next(data)
  }

  setData(data: number) {
    this.dataSubjectId.next(data);
  } 

  getUserProjects(userId: number, teamId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/users/${userId}/${teamId}/projects`).pipe(
      catchError(error => {
        console.error('Error fetching user projects:', error);
        throw error;
      })
    );
  }

  createUserProject(userId: number, teamId: number, projectData: any): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/${teamId}/projects`, projectData).pipe(
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


}
