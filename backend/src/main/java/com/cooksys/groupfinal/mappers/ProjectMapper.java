package com.cooksys.groupfinal.mappers;

import java.util.Set;

import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import org.mapstruct.Mapper;

import com.cooksys.groupfinal.dtos.ProjectDto;
import com.cooksys.groupfinal.entities.Project;

@Mapper(componentModel = "spring", uses = { TeamMapper.class })
public interface ProjectMapper {
	
	ProjectDto entityToDto(Project project);

    Set<ProjectDto> entitiesToDtos(Set<Project> projects);
    
    Project requestDtoToEntity(ProjectRequestDto projectRequestDto);

}
