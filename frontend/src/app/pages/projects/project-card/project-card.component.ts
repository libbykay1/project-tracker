import { Component,Input, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { Observable } from 'rxjs';
import { Project, ProjectData, Team } from 'src/app/shared/models';
import { CompanyService } from 'src/app/services/company/company.service';
import { TeamService } from 'src/app/services/team/team.service';

// interface project{
//   name:string,
//   description:string,
//   lastEdited: Date
// }

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit{
  // @Input() newProject: project = {name: "", description:"",lastEdited: new Date()}; 
  @Input() newProject: ProjectData = {name: "", description:""}; 
  

  showModal = false;
  modalType:string = ""
  private subscriptions = new Subscription();
  name: string =""
  description: string =""
  date:string = ""
  allProjects: Project [] = [];
  targetDate:Date = new Date();
  targetProjectName: string = '';
  isAdmin:boolean = false;

  private teamIdSubscription: Subscription | undefined;
  private userIdSubscription: Subscription | undefined;
  private projectIdSubscription: Subscription | undefined;
  private companyIdSubscription: Subscription| undefined;
  private allTeamsSubscritption: Subscription | undefined;

  teamName:string ="";
  teamId:number = 0;
  userId:number = 0
  projectId:number = 0;
  companyId:number = 0;
  allTeams: Team[] = [];


  constructor(private projectService: ProjectService, 
    private authService: AuthService,
    private companyService: CompanyService,
    private teamService: TeamService,
    ){
    this.observeStateChanges();
    this.observeTypeChanges();

  }

  ngOnInit(): void {

    this.isAdmin = this.authService.getCurrentUser()?.admin === true;

    //Getting the team id from Teams Component with it clicked on navigateTo() aka Team name hyperlink
    this.teamService.dataId$.subscribe(data => {
      this.teamId = data;
    });

    //Getting user id
    this.userIdSubscription = this.authService.getUserData().subscribe(user => {
      if (user !== null) {
        this.userId = user.id;
      } 
    });

    //Getting company id
    this.companyIdSubscription = this.companyService.getCompanyId().subscribe(id => {
      if(id != null){
        this.companyId = id;
      }
    });

    //Getting all teams
    const observableTeams: Observable<Team[]> = this.companyService.getAllTeams(this.companyId);

    //Changing the observable into an object
    observableTeams.subscribe((teams: Team []) => { 

      teams.forEach((team: Team) =>{
        this.allTeams.push(team);
      })
    }, (error) => {
      // Handle errors if any
      console.error('Error:', error);
    });

    //Getting all projects
    const observableProjects: Observable<Project[]> = this.projectService.getAllProjects(this.companyId, this.teamId);

    //Changing the observable into an object
    observableProjects.subscribe((projects: Project[]) => {
      // Iterate through the array of projects
      projects.forEach((project: Project) => {
        this.allProjects.push(project)
      });
    }, (error) => {
      // Handle errors if any
      console.error('Error:', error);
    });
    
  }

  //WIP
  ngOnChanges(): void {
    //Triggers with new project has been created. (New Button -> Projects component)
    // Check if newProject has been provided and add it to allProjects
    if (this.newProject && this.newProject.name && this.newProject.description) {
      
      //POST -> Need to subscribe the observable in order to talk to the database. 
      //ADMIN -> Creates a project. Admin can ONLY create
      this.projectService.createCompanyProject(this.companyId, this.teamId, {name: this.newProject.name, description: this.newProject.description})
      .subscribe({
        next: (response) => {
          console.log('Project created successfully', response);
        },
        error: (error) => {
          console.error('Error creating project', error);
        }
      });

      const project ={
        id:0, //Id wil be overriden by database
        name: this.newProject.name,
        active: true,
        description: this.newProject.description,
        team_id: this.teamId
      }

      //update the projects list
      this.allProjects.push(project);
    }
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

  openModal(modalType:string, project: Project) {
    this.targetProjectName = project.name;
    this.showModal = true;
    this.projectService.openModal(modalType);
    this.modalType = modalType;
    this.name= project.name;
    this.description = project.description;
    this.projectId = project.id;
    console.log("project id is " + this.projectId)
  }

  closeModal(project: Project) {
    this.showModal = false;
    this.projectService.closeModal();
  }

  //WIP
//Updating the project from the child class (update-project-modal)
updatedProjectSubmitted(updatedProjectData: { name: string, description: string}, project: Project) {

  //WIP
  //Finding the correct project
  const foundProject = this.allProjects.find(p => p.name === this.targetProjectName);

  //Updating the frontend
  if (foundProject) {
    //TODO : Here write some logic to not accept empty strings
    this.projectId = foundProject.id;
    foundProject.name = updatedProjectData.name;
    foundProject.description = updatedProjectData.description;
    // foundProject.lastEdited = updatedProjectData.lastEdited;
  }

  //Updating the backend
  //ADMIN -> upating Company Project
  if(this.isAdmin){
    this.projectService.updateCompanyProject(this.companyId, this.teamId, this.projectId, updatedProjectData).subscribe({
      next: (response) => {
        console.log('Project updated successfully', response);
      },
      error: (error) => {
        console.error('Error updated project', error);
      }
    });
  }

  // USER -> updating project
  this.projectService.updateUserProject(this.userId, this.teamId, this.projectId, updatedProjectData).subscribe({
    next: (response) => {
      console.log('Project updated successfully', response);
    },
    error: (error) => {
      console.error('Error updated project', error);
    }
  });

  }
  //Getting the number of days
  // getDaysDifference(targetDate: Date): number {
  //   const currentDate: Date = new Date();
  //   const timeDifference: number = currentDate.getTime() - targetDate.getTime();
  //   const daysDifference: number = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  //   return daysDifference;
  // }
  //Choosing day or days
  // formatDays(days: number): string {
  //   return days === 1 ? 'day' : 'days';
  // }

  activeOrInactive(isActive:boolean): string{
    return isActive ? 'Active' : 'Inactive'
  }
  
  getColor(isActive: boolean): string {
    return isActive ? 'green' : 'red';
  }
  
}
