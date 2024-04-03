import { Component } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { Observable, Subscription } from 'rxjs';
import { Announcement, AnnouncementData } from 'src/app/shared/models';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
})
export class AnnouncementsComponent {
  announcements: Announcement[] = [];
  userAnnoucements: Announcement[] = [];
  showModal = false;
  companyId: number = 0;
  userId: number = 0;
  // admin: boolean = false;
  private companyIdSubscription: Subscription | undefined;
  private userIdSubscription: Subscription | undefined;

  private subscriptions = new Subscription();
  constructor(
    private announcementService: AnnouncementService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private companyService: CompanyService
    
  ) {
    // this.observeChanges()
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.announcementService.announcements$.subscribe((announcements) => {
        this.announcements = announcements || [];
      })
    );

    this.userIdSubscription = this.authService.getUserData().subscribe(user => {
      if (user !== null) {
        this.userId = user.id;
      } 
    });

    this.companyIdSubscription = this.companyService.getCompanyId().subscribe(id => {
      if(id != null){
        this.companyId = id;
      }
    });

      //Getting all teams
      const observableAnnoucements: Observable<Announcement[]> = this.announcementService.getAllUserAnnoucements(this.userId);

      //Changing the observable into an object
      observableAnnoucements.subscribe((announcement: Announcement []) => { 
  
        announcement.forEach((announcement: Announcement) =>{
          this.userAnnoucements.push(announcement);
        })
      }, (error) => {
        // Handle errors if any
        console.error('Error:', error);
      }); 
  }

  isAdmin(): boolean {
    return this.authService.getCurrentUser()?.admin === true;
  }
  openModal() {
    this.showModal = true;
    this.announcementService.openModal();
  }

  closeModal() {
    this.showModal = false;
    this.announcementService.closeModal();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleAnnoucementSubmission(announcementData: AnnouncementData) {
    console.log('Submitted annoucement data:', announcementData);
    this.announcementService.createAnnouncement(this.companyId, this.userId, announcementData).subscribe( (newAnnouncement) =>{
      //unshift => suppose to put the new object in front
      this.announcements.unshift(newAnnouncement); //Refresh announcements after creating a new team
      this.sortAnnouncementsById();
    }, error => {
      console.error('Error creating team:', error);
      // Handle error appropriately (e.g., display error message)
    });
  }
  
  sortAnnouncementsById() {
    this.announcements.sort((a, b) => b.id - a.id);
  }
  
}
