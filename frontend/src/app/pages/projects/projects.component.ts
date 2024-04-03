import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project/project.service';
import { Project, ProjectData} from 'src/app/shared/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit{

  showModal = false;
  modalType:string="";
  private subscriptions = new Subscription();
  allProjects: Project[] = [];
  name:string = "";
  description:string = "";
  teamName:string = "";

  newProject: Project = {
    id:0,
    name:"",
    description:"",
    active:true,
    team_id:0
  };

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private teamService: TeamService
    ){
    this.observeStateChanges();
    this.observeTypeChanges();
  }
  ngOnInit(): void {
    //Getting the team id from Teams Component with it clicked on navigateTo() aka Team name hyperlink
    this.teamService.dataName$.subscribe(data => {
      this.teamName = data;
    });
    
  }

  private observeStateChanges() {
    this.subscriptions.add(
      this.projectService.modalState$.subscribe((modalState) => {
        this.showModal = modalState;
      })
    );
  }

  private observeTypeChanges() {
    this.subscriptions.add(
      this.projectService.modalType$.subscribe((modalType) => {
        this.modalType = modalType;
      })
    );
  }

  openModal(modalType:string) {
    this.showModal = true;
    this.projectService.openModal(modalType);
    this.modalType = modalType;
  }

  closeModal() {
    this.showModal = false;
    this.projectService.closeModal();
  }

  handleProjectSubmitted(projectData: { name: string, description: string }) {
    // Handle the submitted project data here
    console.log('Submitted project:', projectData);
    this.name = projectData.name;
    this.description = projectData.description;
    this.createNewProject();
  }

  createNewProject(): void {
    // Create a new project

    const project ={
      id:0,
      name: this.name,
      active: true,
      description: this.description,
      team_id: 0
    }

    // Assign the new project to newProject
    this.newProject = project;
  }
  
  isAdmin(): boolean {
    return this.authService.getCurrentUser()?.admin === true;
  }
  
}
