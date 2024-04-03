import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { Announcement, AnnouncementData } from 'src/app/shared/models';
import { CompanyService } from '../company/company.service';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  //Retrieves all announcements for a company
  //Creates a new announcement for a company
  private baseUrl = 'http://localhost:8080/company';
  private baseUrlUser =  'http://localhost:8080/users'

  private announcements = new BehaviorSubject<Announcement[]>([]);
  private modalState = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private companyService: CompanyService
  ) {}

  get announcements$(): Observable<Announcement[] | null> {
    return this.announcements.asObservable();
  }

  setAnnouncements(data: Announcement[]): void {
    this.announcements.next(data);
  }

  getAllUserAnnoucements(userId: number): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseUrlUser}/${userId}/announcements`).pipe(
      catchError(error => {
        console.error('Error fetching user projects:', error);
        throw error;
      })
    );
  }

  fetchAnnouncements(companyId: number): Observable<Announcement[]> {
    return this.http
      .get<Announcement[]>(`${this.baseUrl}/${companyId}/announcements`)
      .pipe(
        tap((response) => {
          console.log('companyId',companyId)
          console.log(
            'fetching announcements from announcement service',
            response
          );
          this.setAnnouncements(response);
        }),
        catchError((error) => {
          console.error('error fetching announcements', error);
          return throwError(error);
        })
      );
  }

  // not yet working with the backend
  createAnnouncement(companyId: number, userId: number, announcementData: AnnouncementData): Observable<any> {
    console.log('Company ID:', companyId);
    // Make the HTTP request using the provided companyId
    return this.http.post(
      `${this.baseUrl}/${companyId}/${userId}/announcements`,
      { ...announcementData } // Pass announcementData as an object
    ).pipe(
      catchError((error) => {
        console.error('Error creating announcement:', error);
        return throwError(error);
      })
    );
  }

  get modalState$(): Observable<boolean> {
    return this.modalState.asObservable();
  }

  openModal() {
    this.modalState.next(true);
  }

  closeModal() {
    this.modalState.next(false);
  }
}
