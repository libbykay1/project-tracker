import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { Announcement, Company, FullUser } from 'src/app/shared/models';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.css'],
})
export class SelectCompanyComponent implements OnInit {
  companies: Company[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private announcementService: AnnouncementService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    // Fetch users companies when the component initializes
    this.authService.getUserData().subscribe((data: FullUser | null) => {
      if (data) {
        this.companies = data.companies;
      } else {
        console.log('Error fetching user data from UserService');
      }
    });
  }

  // Fetch the announcements from company selected from dropdown
  async onCompanySelected(event: Event): Promise<void> {
    const companyIdString = (event.target as HTMLSelectElement)?.value;
    const companyId = parseInt(companyIdString, 10);
    if (companyId !== null) {
      try {
        await this.announcementService
          .fetchAnnouncements(companyId)
          .toPromise();
        this.companyService.setCompanyId(companyId);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    } else {
    }
  }
}
