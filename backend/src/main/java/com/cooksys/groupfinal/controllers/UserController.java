package com.cooksys.groupfinal.controllers;

import com.cooksys.groupfinal.dtos.*;
import org.springframework.web.bind.annotation.*;

import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

import java.util.Set;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService userService;
	
	@PostMapping("/login")
	@CrossOrigin(origins="*")
    public FullUserDto login(@RequestBody CredentialsDto credentialsDto) {
        return userService.login(credentialsDto);
    }
	
	@PostMapping
	public FullUserDto createUser(@RequestBody UserRequestDto userRequestDto) {
		return userService.createUser(userRequestDto);
	}

	@GetMapping("/{id}/announcements")
	public Set<AnnouncementDto> getAllAnnouncements(@PathVariable Long id){
		return userService.getAllAnnouncements(id);
	}

	@GetMapping("/{id}/projects")
	public Set<ProjectDto> getAllProjects(@PathVariable Long id){
		return userService.getAllProjects(id);
	}

	@GetMapping("/{userId}/{teamId}/projects/{projectId}")
	public ProjectDto getSingleProject(@PathVariable Long userId, @PathVariable Long teamId, @PathVariable Long projectId){
		return userService.getSingleProject(userId,teamId,projectId);
	}
	
	@PostMapping("/{userId}/{teamId}/projects")
	public ProjectDto createProject(@PathVariable Long userId, @PathVariable Long teamId, @RequestBody ProjectRequestDto projectRequestDto) {
		return userService.createProject(userId, teamId, projectRequestDto);
	}

	@PatchMapping("/{userId}/{teamId}/projects/{projectId}")
	public ProjectDto updateProject(@PathVariable Long userId, @PathVariable Long teamId, @PathVariable Long projectId, @RequestBody ProjectRequestDto projectRequestDto) {
		return userService.updateProject(userId, teamId, projectId, projectRequestDto);
	}
}
