import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { FullUser, UserRequest } from 'src/app/shared/models';

@Component({
  selector: 'app-user-registry',
  templateUrl: './user-registry.component.html',
  styleUrls: ['./user-registry.component.css'],
})
export class UserRegistryComponent implements OnInit {
  users: FullUser[] = [];
  showModal = false;
  errorMessage = '';
  constructor(
    private companyService: CompanyService,
    private announcementService: AnnouncementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Fetch all users for the company
    this.companyService.getCompanyId().subscribe((companyId) => {
      if (companyId) {
        this.companyService.getAllUsers(companyId).subscribe((users) => {
          this.users = users;
        });
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.announcementService.closeModal();
  }

  openModal() {
    this.showModal = true;
    this.errorMessage = '';
    // TODO - move to a modal service?
    this.announcementService.openModal();
  }

  handleCreateUser(userRequest: UserRequest) {
    console.log('Submitted user data:', userRequest);
    this.authService.createUser(userRequest).subscribe(
      (user: any) => {
        this.users.push(user); 
        this.closeModal();
      },
      (error) => {
        console.error('Error creating team:', error);
        this.errorMessage = error.error.message;
      
      }
    );
  }
}
