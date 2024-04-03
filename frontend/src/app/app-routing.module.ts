import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SelectCompanyComponent } from './pages/select-company/select-company.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { UserRegistryComponent } from './pages/user-registry/user-registry.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'select-company',
    canActivate: [AdminGuard, AuthGuard],
    component: SelectCompanyComponent,
  },
  {
    path: '',
    component: LayoutComponent, // these components below layout will have navbar
    children: [
      {
        path: 'home',
        canActivate: [ AuthGuard],
        component: AnnouncementsComponent,
      },
      {
        path: 'teams',
        canActivate: [AuthGuard],
        component: TeamsComponent,
      },
      {
        path: 'projects',
        canActivate: [ AuthGuard],
        component: ProjectsComponent,
      },
      {
        path: 'users-registry',
        canActivate: [AdminGuard, AuthGuard],
        component: UserRegistryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
