import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FullUser, Team, TeamData } from 'src/app/shared/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {
  teams: Team[] = [];
  showModal = false;
  companyId :number  |null =null;
  numberOfProjects: number |null =null
  constructor(
    private companyService: CompanyService, 
    private authService: AuthService, 
    private router: Router, 
    private announcementService: AnnouncementService,
    private teamService: TeamService
    ) {}

  ngOnInit(): void {
    this.fetchTeams();
     }
  
  fetchTeams() {
    this.companyService.getCompanyId().subscribe(companyId => {
      if (companyId) {
        this.companyId = companyId;
        this.companyService.getAllTeams(companyId).subscribe(teams => {
          this.teams = teams;
  
          this.teams.forEach(team => {
            this.companyService.getAllProjectsForTeam(companyId, team.id).subscribe(projects => {
              team.numberOfProjects = projects.length;
            });
          });
        });
      }
    });
  }

  openModal() {
    this.showModal = true;
    // TODO - move to a modal service
    this.announcementService.openModal();
  }

  closeModal() {
    this.showModal = false;
    this.announcementService.closeModal();
  }

  isAdmin(): boolean {
    return this.authService.getCurrentUser()?.admin === true;
  }

  navigateToProjects(teamId: number, teamName: string) {
    this.teamService.setData(teamId);
    this.teamService.setTeamName(teamName)
    this.router.navigate(['/projects']);
  }

  handleTeamSubmission(teamData: TeamData) {
    console.log('Submitted team data:', teamData);
    this.companyService.createTeam(this.companyId!, teamData).subscribe((newTeam) => {
      newTeam.numberOfProjects = 0
      this.teams.push(newTeam); 
      console.log('Announcement created successfully');
      this.closeModal();
    }, error => {
      console.error('Error creating team:', error);
    });
  }
}
