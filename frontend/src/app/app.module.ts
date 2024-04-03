import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { UserRegistryComponent } from './pages/user-registry/user-registry.component';
import { SelectCompanyComponent } from './pages/select-company/select-company.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CreateAnnouncementsModalComponent } from './pages/announcements/create-announcements-modal/create-announcements-modal.component';
import { DatePipe } from '@angular/common';
import { ProjectCardComponent } from './pages/projects/project-card/project-card.component';
import { CreateProjectModalComponent } from './pages/projects/project-card/modals/create-project-modal/create-project-modal.component';
import { UpdateProjectModalComponent } from './pages/projects/project-card/modals/update-project-modal/update-project-modal.component';

import { CreateTeamModalComponent } from './pages/teams/create-team-modal/create-team-modal.component';
import { AddUserModalComponent } from './pages/user-registry/add-user-modal/add-user-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserRegistryComponent,
    AnnouncementsComponent,
    SelectCompanyComponent,
    LayoutComponent,
    TeamsComponent,
    ProjectsComponent,
    NavbarComponent,
    CreateAnnouncementsModalComponent,
    ProjectCardComponent,
    CreateProjectModalComponent,
    CreateTeamModalComponent,
    UpdateProjectModalComponent,
    AddUserModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
