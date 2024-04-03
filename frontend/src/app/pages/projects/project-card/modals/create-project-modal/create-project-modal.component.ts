import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.css']
})
export class CreateProjectModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() projectSubmitted: EventEmitter<{ name: string, description: string }> = new EventEmitter();
  name = ""
  description = ""

  closeModal() {
    this.close.emit();
  }

  submitProject() {
    if (this.name && this.description) {
      // Emit the project data to the parent component
      this.projectSubmitted.emit({ name: this.name, description: this.description });
    }
    console.log({
      name: this.name,
      description: this.description,
    });
    this.closeModal();
  }

}
