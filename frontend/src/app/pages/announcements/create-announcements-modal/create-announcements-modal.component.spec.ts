import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnnouncementsModalComponent } from './create-announcements-modal.component';

describe('CreateAnnouncementsModalComponent', () => {
  let component: CreateAnnouncementsModalComponent;
  let fixture: ComponentFixture<CreateAnnouncementsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAnnouncementsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAnnouncementsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
