package com.cooksys.groupfinal.controllers;

import java.util.Set;

import com.cooksys.groupfinal.dtos.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.TeamRequestDto;
import com.cooksys.groupfinal.services.CompanyService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {
	
	private final CompanyService companyService;
	
	@GetMapping("/{id}/users")
    public Set<FullUserDto> getAllUsers(@PathVariable Long id) {
        return companyService.getAllUsers(id);
    }
	
	@GetMapping("/{id}/announcements")
    public Set<AnnouncementDto> getAllAnnouncements(@PathVariable Long id) {
        return companyService.getAllAnnouncements(id);
    }
	
	@GetMapping("/{id}/teams")
    public Set<TeamDto> getAllTeams(@PathVariable Long id) {
        return companyService.getAllTeams(id);
    }
	
	@GetMapping("/{companyId}/teams/{teamId}/projects") 
	public Set<ProjectDto> getAllProjects(@PathVariable Long companyId, @PathVariable Long teamId) {
		return companyService.getAllProjects(companyId, teamId);
	}
	
	@PostMapping("/{companyId}/teams/{teamId}/projects")
	public ProjectDto createProject(@PathVariable Long companyId, @PathVariable Long teamId, @RequestBody ProjectRequestDto projectRequestDto) {
		return companyService.createProject(companyId, teamId, projectRequestDto);
	}

	@PatchMapping("/{companyId}/teams/{teamId}/projects/{projectId}")
	public ProjectDto updateProject(@PathVariable Long companyId, @PathVariable Long teamId, @PathVariable Long projectId, @RequestBody ProjectRequestDto projectRequestDto) {
		return companyService.updateProject(companyId, teamId, projectId, projectRequestDto);
	}
	
	@PostMapping("/{companyId}/teams")
	public TeamDto createTeam(@PathVariable Long companyId, @RequestBody TeamRequestDto teamRequestDto) {
		return companyService.createTeam(companyId, teamRequestDto);
	}

	@PostMapping("/{companyId}/{userId}/announcements")
	public AnnouncementDto createAnnouncements(@PathVariable Long companyId, @PathVariable Long userId, @RequestBody AnnouncementRequestDto announcementRequestDto){
		return companyService.createAnnouncements(companyId, userId, announcementRequestDto);
	}
}
