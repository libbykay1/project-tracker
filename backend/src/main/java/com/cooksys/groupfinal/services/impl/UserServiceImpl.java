package com.cooksys.groupfinal.services.impl;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import com.cooksys.groupfinal.dtos.*;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.entities.*;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.repositories.*;
import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotAuthorizedException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final FullUserMapper fullUserMapper;
	private final CredentialsMapper credentialsMapper;

	private final AnnouncementMapper announcementMapper;

	private final AnnouncementRepository announcementRepository;

	private final CompanyRepository companyRepository;

	private final TeamRepository teamRepository;

	private final ProjectRepository projectRepository;

	private final ProjectMapper projectMapper;

	private User findUser(String username) {
		Optional<User> user = userRepository.findByCredentialsUsernameAndActiveTrue(username);
		if (user.isEmpty()) {
			throw new NotFoundException("The username provided does not belong to an active user.");
		}
		return user.get();
	}

	private User findUserById(Long id){
		Optional<User> user = userRepository.findById(id);
		if(user.isEmpty()){
			throw new NotFoundException("The username provided does not belong to an active user.");
		}
		return user.get();
	}
	
	private Team findTeam(Long id) {
        Optional<Team> team = teamRepository.findById(id);
        if (team.isEmpty()) {
            throw new NotFoundException("A team with the provided id does not exist.");
        }
        return team.get();
    }
	
	private Project findProject(Long id) {
        Optional<Project> project = projectRepository.findById(id);
        if (project.isEmpty()) {
            throw new NotFoundException("A project with the provided id does not exist.");
        }
        return project.get();
    }

	@Override
	public FullUserDto login(CredentialsDto credentialsDto) {
		if (credentialsDto == null || credentialsDto.getUsername() == null || credentialsDto.getPassword() == null) {
			throw new BadRequestException("A username and password are required.");
		}
		Credentials credentialsToValidate = credentialsMapper.dtoToEntity(credentialsDto);
		User userToValidate = findUser(credentialsDto.getUsername());
		if (!userToValidate.getCredentials().equals(credentialsToValidate)) {
			throw new NotAuthorizedException("The provided credentials are invalid.");
		}
		if (userToValidate.getStatus().equals("PENDING")) {
			userToValidate.setStatus("JOINED");
			userRepository.saveAndFlush(userToValidate);
		}
		return fullUserMapper.entityToFullUserDto(userToValidate);
	}

	@Override
	public FullUserDto createUser(UserRequestDto userRequestDto) {
		
		
		if (userRequestDto == null 
				|| userRequestDto.getCredentials() == null 
				|| userRequestDto.getProfile() == null 
				|| userRequestDto.getProfile().getEmail() == null 
				|| userRequestDto.getProfile().getFirstName() == null 
				|| userRequestDto.getProfile().getLastName() == null
				|| userRequestDto.getCredentials().getPassword() == null) {
			throw new BadRequestException("All fields are required.");
		}
		String email = userRequestDto.getProfile().getEmail();
		Optional<User> existingUserOptional = userRepository.findByProfileEmail(email);
		if (existingUserOptional.isPresent()) {
			User existingUser = existingUserOptional.get(); 
			if (existingUser.isActive()) {
				throw new BadRequestException("An active user already exists with that email.");
			} else {
				existingUser.setActive(true);
				return fullUserMapper.entityToFullUserDto(userRepository.saveAndFlush(existingUser));
			}
		}
		
		User newUser = fullUserMapper.requestDtoToEntity(userRequestDto);
		Credentials newUserCredentials = newUser.getCredentials();
		newUserCredentials.setUsername(email);
		return fullUserMapper.entityToFullUserDto(userRepository.saveAndFlush(newUser));
	}

	@Override
	public Set<AnnouncementDto> getAllAnnouncements(Long id) {
		//TODO: If user doesn't exist then it will throw an error. Endpoint is called after they are logged in. Doesn't make sense in catching the error.
		Optional<Company> company = companyRepository.findByEmployeesId(id);
		Long companyId = companyRepository.findByEmployeesId(id).get().getId();
		return announcementMapper.entitiesToDtos(announcementRepository.findByCompanyId(companyId));
	}

	@Override
	public Set<ProjectDto> getAllProjects(Long id) {
		Set<Team> allTeams = teamRepository.findByTeammatesId(id);
		Set<Project> allProjects = new HashSet<>();
		for(Team team: allTeams){
			Optional<Project> project = projectRepository.findByTeamId(team.getId());
			project.ifPresent(allProjects::add);
		}
		return projectMapper.entitiesToDtos(allProjects);
	}

	@Override
	public ProjectDto getSingleProject(Long userId, Long teamId, Long projectId) {
		Set<Team> allTeams = teamRepository.findByTeammatesId(userId);
		Set<Long> allTeamsNumbers = new HashSet<>();
		for(Team team : allTeams){
			allTeamsNumbers.add(team.getId());
		}
		Optional<Project> singleProject = projectRepository.findByIdAndTeamId(projectId,teamId);
		if(singleProject.isEmpty()){
			throw new BadRequestException("Project doesn't exist or invalid project id");

		}
		return projectMapper.entityToDto(singleProject.get());
	}
	
	@Override
	public ProjectDto createProject(Long userId, Long teamId, ProjectRequestDto projectRequestDto) {
		User user = findUserById(userId);
		Team team = findTeam(teamId);
		if (!user.getTeams().contains(team)) {
			throw new BadRequestException("User with id " + userId + " does not belong to team with id " + teamId + ".");
		}
		if (projectRequestDto == null
				|| projectRequestDto.getName() == null
				|| projectRequestDto.getDescription() == null) {
			throw new BadRequestException("All fields are required.");
		}
		Project newProject = projectMapper.requestDtoToEntity(projectRequestDto);
		newProject.setTeam(team);
		return projectMapper.entityToDto(projectRepository.saveAndFlush(newProject));

	}

	@Override
	public ProjectDto updateProject(Long userId, Long teamId, Long projectsId, ProjectRequestDto projectRequestDto) {
		User user = findUserById(userId);
		Team team = findTeam(teamId);
		Project project = findProject(projectsId);
		if (!user.getTeams().contains(team)) {
			throw new BadRequestException("User with id " + userId + " does not belong to team with id " + teamId + ".");
		}
		if (!team.getProjects().contains(project)) {
			throw new BadRequestException("A project with id " + projectsId + " does not exist for team with id " + teamId + ".");
		}
		if (projectRequestDto == null) {
			throw new BadRequestException("Request is empty.");
		}
		if (!(projectRequestDto.getName() == null)) {
			project.setName(projectRequestDto.getName());
		}
		if (!(projectRequestDto.getDescription() == null)) {
			project.setDescription(projectRequestDto.getDescription());
		}
		return projectMapper.entityToDto(projectRepository.saveAndFlush(project));
	}

}