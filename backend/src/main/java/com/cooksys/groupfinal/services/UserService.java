package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.*;

import java.util.Set;

public interface UserService {

	FullUserDto login(CredentialsDto credentialsDto);

	FullUserDto createUser(UserRequestDto userRequestDto);

    Set<AnnouncementDto> getAllAnnouncements(Long id);

	Set<ProjectDto> getAllProjects(Long id);

    ProjectDto getSingleProject(Long userId, Long teamId, Long projectId);

    ProjectDto createProject(Long userId, Long teamId, ProjectRequestDto projectRequestDto);

	ProjectDto updateProject(Long userId, Long teamId, Long projectId, ProjectRequestDto projectRequestDto);
}
