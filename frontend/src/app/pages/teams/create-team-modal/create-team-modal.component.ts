import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { FullUser, Team, TeamData } from 'src/app/shared/models';

@Component({
  selector: 'app-create-team-modal',
  templateUrl: './create-team-modal.component.html',
  styleUrls: ['./create-team-modal.component.css'],
})
export class CreateTeamModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submitTeam = new EventEmitter<TeamData>();

  teamForm: FormGroup;
  selectedMember: FullUser | null = null;
  availableMembers: FullUser[] = [];
  selectedMembers: FullUser[] = [];
  selectedMemberIds: number[] = [];
  companyId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyService
  ) {
    this.teamForm = this.formBuilder.group({
      teamName: ['', Validators.required],
      description: ['', Validators.required],
      selectedMember: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Fetch all users for the company
    this.companyService.getCompanyId().subscribe((companyId) => {
      if (companyId) {
        this.companyId = companyId;
        this.companyService.getAllUsers(companyId).subscribe((users) => {
          this.availableMembers = users;
        });
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  submit() {
    if (this.teamForm.valid) {
      const newTeamData: TeamData = {
        name: this.teamForm.value.teamName,
        description: this.teamForm.value.description,
        teammateIds: this.selectedMemberIds,
      };

      this.submitTeam.emit(newTeamData);
      this.closeModal();
    } else {
      this.teamForm.markAllAsTouched();
    }
  }

  addMember() {
    const selectedMember: FullUser = this.teamForm.get('selectedMember')?.value;
    if (selectedMember && selectedMember.id !== undefined) {
      this.selectedMembers.push(selectedMember);
      this.selectedMemberIds.push(selectedMember.id);
      this.availableMembers = this.availableMembers.filter(
        (member) => member.id !== selectedMember.id
      );
    }
  }

  removeMember(memberId: number) {
    this.selectedMembers = this.selectedMembers.filter(
      (member) => member.id !== memberId
    );
    this.selectedMemberIds = this.selectedMemberIds.filter(
      (id) => id !== memberId
    );
  }
}
