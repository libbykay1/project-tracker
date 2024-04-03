// userService.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { Announcement, FullUser, Project } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //Retrieves all announcements for a user
  //Retrieves all projects for a user
  //Creates a new project for a user
  //Updates a project for a user
  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}


  getAllAnnouncements(userId: string): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseUrl}/users/${userId}/announcements`).pipe(
      catchError(error => {
        console.error('Error fetching announcements:', error);
        throw error;
      })
    );
  }

  getAllProjects(userId: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/users/${userId}/projects`).pipe(
      catchError(error => {
        console.error('Error fetching projects:', error);
        throw error;
      })
    );
  }

  createProject(userId: string, projectData: any) {
    return this.http.post(`${this.baseUrl}/users/${userId}/projects`, projectData).pipe(
      catchError(error => {
        console.error('Error creating project:', error);
        throw error;
      })
    );
  }

  updateProject(userId: string, projectId: string, projectData: any) {
    return this.http.patch(`${this.baseUrl}/users/${userId}/projects/${projectId}`, projectData).pipe(
      catchError(error => {
        console.error('Error updating project:', error);
        throw error;
      })
    );
  }
}
