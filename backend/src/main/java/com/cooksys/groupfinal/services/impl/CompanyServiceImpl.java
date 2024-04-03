package com.cooksys.groupfinal.services.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.cooksys.groupfinal.dtos.*;
import com.cooksys.groupfinal.repositories.*;
import org.springframework.stereotype.Service;


import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.TeamRequestDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.CompanyService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {
	
	private final CompanyRepository companyRepository;
	private final TeamRepository teamRepository;
	private final FullUserMapper fullUserMapper;
	private final AnnouncementMapper announcementMapper;
	private final AnnouncementRepository announcementRepository;

	private final TeamMapper teamMapper;
	private final ProjectMapper projectMapper;
	private final ProjectRepository projectRepository;
	private final UserRepository userRepository;
	
	private Company findCompany(Long id) {
        Optional<Company> company = companyRepository.findById(id);
        if (company.isEmpty()) {
            throw new NotFoundException("A company with the provided id does not exist.");
        }
        return company.get();
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
	
	private User findUser(Long id) {
        Optional<User> user = userRepository.findByIdAndActiveTrue(id);
        if (user.isEmpty()) {
            throw new NotFoundException("A user with the provided id does not exist.");
        }
        return user.get();
    }
	
	@Override
	public Set<FullUserDto> getAllUsers(Long id) {
		Company company = findCompany(id);
		Set<User> filteredUsers = new HashSet<>();
		company.getEmployees().forEach(filteredUsers::add);
		filteredUsers.removeIf(user -> !user.isActive());
		return fullUserMapper.entitiesToFullUserDtos(filteredUsers);
	}

	@Override
	public Set<AnnouncementDto> getAllAnnouncements(Long id) {
		Company company = findCompany(id);
		List<Announcement> sortedList = new ArrayList<Announcement>(company.getAnnouncements());
		sortedList.sort(Comparator.comparing(Announcement::getDate).reversed());
		Set<Announcement> sortedSet = new HashSet<Announcement>(sortedList);
		return announcementMapper.entitiesToDtos(sortedSet);
	}

	@Override
	public Set<TeamDto> getAllTeams(Long id) {
		Company company = findCompany(id);
		return teamMapper.entitiesToDtos(company.getTeams());
	}

	@Override
	public Set<ProjectDto> getAllProjects(Long companyId, Long teamId) {
		Company company = findCompany(companyId);
		Team team = findTeam(teamId);
		if (!company.getTeams().contains(team)) {
			throw new NotFoundException("A team with id " + teamId + " does not exist at company with id " + companyId + ".");
		}
		Set<Project> filteredProjects = new HashSet<>();
		team.getProjects().forEach(filteredProjects::add);
		filteredProjects.removeIf(project -> !project.isActive());
		return projectMapper.entitiesToDtos(filteredProjects);
	}

	@Override
	public ProjectDto createProject(Long companyId, Long teamId, ProjectRequestDto projectRequestDto) {
		Company company = findCompany(companyId);
		Team team = findTeam(teamId);
		if (!company.getTeams().contains(team)) {
			throw new BadRequestException("A team with id " + teamId + " does not exist at company with id " + companyId + ".");
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
	public ProjectDto updateProject(Long companyId, Long teamId, Long projectsId, ProjectRequestDto projectRequestDto) {
		Company company = findCompany(companyId);
		Team team = findTeam(teamId);
		Project project = findProject(projectsId);
		if (!company.getTeams().contains(team)) {
			throw new BadRequestException("A team with id " + teamId + " does not exist at company with id " + companyId + ".");
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
	
	@Override
	public TeamDto createTeam(Long companyId, TeamRequestDto teamRequestDto) {
		Company company = findCompany(companyId);
		if (teamRequestDto == null || teamRequestDto.getName() == null || teamRequestDto.getDescription() == null) {
			throw new BadRequestException("All fields are required.");
		}
		Team team = teamMapper.requestDtoToEntity(teamRequestDto);
		team.setCompany(company);
		teamRepository.saveAndFlush(team);
		company.getTeams().add(team);
		companyRepository.saveAndFlush(company);
		for (Long userId : teamRequestDto.getTeammateIds()) {
			User user = findUser(userId);
			user.getTeams().add(team);
			team.getTeammates().add(user);
			userRepository.saveAndFlush(user);
		}
		return teamMapper.entityToDto(teamRepository.saveAndFlush(team));
	}

	@Override
	public AnnouncementDto createAnnouncements(Long companyId, Long userId, AnnouncementRequestDto announcementRequestDto) {
		if(announcementRequestDto == null || announcementRequestDto.getTitle() == null || announcementRequestDto.getMessage() == null){
			throw new BadRequestException("Title and messages are required");
		}

		User user = findUser(userId);
		Company company = findCompany(companyId);
		Announcement newAnnouncement = announcementMapper.dtoToEntity(announcementRequestDto);
		newAnnouncement.setCompany(company);
		newAnnouncement.setAuthor(user);

		return announcementMapper.entityToDto(announcementRepository.saveAndFlush(newAnnouncement));
	}
}
