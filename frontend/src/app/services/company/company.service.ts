import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import {
  BasicUser,
  Company,
  FullUser,
  Team,
  TeamData,
} from 'src/app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  //Retrieves all users in a company
  //Creates a new team for a company
  //Retrieves all teams in a company
  private baseUrl = 'http://localhost:8080/company';

  private companiesSubject = new BehaviorSubject<Company[] | null>(null);
  private selectedCompanyIdSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[] | null> {
    return this.companiesSubject.asObservable();
  }

  setCompanies(companies: Company[]): void {
    this.companiesSubject.next(companies);
  }

  // Method to set the selected company ID
  setCompanyId(companyId: number): void {
    console.log('company set in company service ', companyId);
    this.selectedCompanyIdSubject.next(companyId);
  }

  // Method to get the selected company ID
  getCompanyId(): Observable<number | null> {
    return this.selectedCompanyIdSubject.asObservable();
  }

  getAllUsers(companyId: number): Observable<FullUser[]> {
    return this.http.get<FullUser[]>(`${this.baseUrl}/${companyId}/users`).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }

  createTeam(companyId: number, teamData: TeamData): Observable<Team> {
    return this.http
      .post<Team>(`${this.baseUrl}/${companyId}/teams`, teamData)
      .pipe(
        catchError((error) => {
          console.error('Error creating team:', error);
          throw error;
        })
      );
  }

  getAllProjectsForTeam(companyId: number, teamId: number): Observable<any> {
    return this.http
      .get<Team[]>(`${this.baseUrl}/${companyId}/teams/${teamId}/projects`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching teams:', error);
          throw error;
        })
      );
  }

  getAllTeams(companyId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseUrl}/${companyId}/teams`).pipe(
      catchError((error) => {
        console.error('Error fetching teams:', error);
        throw error;
      })
    );
  }
}
