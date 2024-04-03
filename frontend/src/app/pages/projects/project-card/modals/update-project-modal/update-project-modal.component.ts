import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project, ProjectData} from 'src/app/shared/models';

@Component({
  selector: 'app-update-project-modal',
  templateUrl: './update-project-modal.component.html',
  styleUrls: ['./update-project-modal.component.css']
})
export class UpdateProjectModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() updatedProjectSubmitted: EventEmitter<ProjectData> = new EventEmitter();
  @Input() updateName:string='';
  @Input() updateDescription:string='';
  
  name = '';
  description = '';

  updateProject: ProjectData = {
    name: "",
    description:""
  }
  
  closeModal() {
    this.close.emit();
  }

  submitProject() {
    this.updateProject.name = this.name;
    this.updateProject.description = this.description;
    this.updatedProjectSubmitted.emit(this.updateProject);
    console.log({
      name: this.name,
      description: this.description,
    });
    this.closeModal();
  }
}
