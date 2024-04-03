import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { AnnouncementData, FullUser } from 'src/app/shared/models';

@Component({
  selector: 'app-create-announcements-modal',
  templateUrl: './create-announcements-modal.component.html',
  styleUrls: ['./create-announcements-modal.component.css'],
})
export class CreateAnnouncementsModalComponent implements OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() submitAnnouncement = new EventEmitter<AnnouncementData>();
  announcementTitle = '';
  announcementMessage = '';
  companyId: number | null = null;
  private companyIdSubscription: Subscription | undefined;
  user: FullUser | null = null;
  userId: number = 0;
  private userSubscription: Subscription | undefined;
  private userIdSubscription: Subscription | undefined;

  constructor(
    private announcementService: AnnouncementService,
    private companyService: CompanyService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getUserData().subscribe(user => {
      this.user = user;
    });

    this.userIdSubscription = this.authService.getUserData().subscribe(user => {
      if (user !== null) {
        this.userId = user.id;
      } 
    });

    this.companyIdSubscription = this.companyService.getCompanyId().subscribe(id => {
      this.companyId = id;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.companyIdSubscription) {
      this.companyIdSubscription.unsubscribe();
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  submit(): void {
    if (!this.companyId) {
      console.error('Company ID is not available.');
      return;
    }
    console.log('companyId', this.companyId);
  
    const announcementData: AnnouncementData = {
      title: this.announcementTitle,
      message: this.announcementMessage,
    };
    
    this.submitAnnouncement.emit(announcementData);
    this.closeModal();

  }
}
