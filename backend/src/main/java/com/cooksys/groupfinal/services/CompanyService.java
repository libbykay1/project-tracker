package com.cooksys.groupfinal.services;

import java.util.Set;


import com.cooksys.groupfinal.dtos.*;
import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.TeamRequestDto;

public interface CompanyService {

	Set<FullUserDto> getAllUsers(Long id);

	Set<AnnouncementDto> getAllAnnouncements(Long id);

	Set<TeamDto> getAllTeams(Long id);

	Set<ProjectDto> getAllProjects(Long companyId, Long teamId);
	
	ProjectDto createProject(Long companyId, Long teamId, ProjectRequestDto projectRequestDto);

	ProjectDto updateProject(Long companyId, Long teamId, Long projectId, ProjectRequestDto projectRequestDto);
	
	TeamDto createTeam(Long companyId, TeamRequestDto teamRequestDto);

    AnnouncementDto createAnnouncements(Long companyId, Long userId, AnnouncementRequestDto announcementRequestDto);
}
