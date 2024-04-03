
export interface Credentials {
    username: string;
    password: string;
  }
  
  export interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
  
  export interface BasicUser {
    id: number; 
    profile: Profile;
    admin: boolean;
    active: boolean;
    status: string;
  }
  
  export interface FullUser {
    id: number;
    profile: Profile;
    admin: boolean;
    active: boolean;
    status: string;
    companies: Company[];
    teams: Team[];
  }
  
  export interface UserRequest {
    credentials: Credentials;
    profile: Profile;
    admin: boolean;
  }
  
  export interface Team {
    id: number;
    name: string;
    description: string;
    teammates: BasicUser[];
    numberOfProjects: number;
  }

  export interface TeamData {
    name: string;
    description: string;
    teammateIds: number[];
  }
  
  export interface Company {
    id: number;
    name: string;
    description: string;
    teams: Team[];
    users: BasicUser[];
  }
  
  export interface Announcement {
    id: number;
    date: string; 
    title: string;
    message: string;
    author: FullUser;
  }
  
  export interface AnnouncementData {
    title: string;
    message: string;
  }
  
  export interface Project {
    id: number;
    name: string;
    description: string;
    active: boolean;
    team_id: number;
  }

  export interface ProjectData{
    name: string;
    description: string;
  }
  