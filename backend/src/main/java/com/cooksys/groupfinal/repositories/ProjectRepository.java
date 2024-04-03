package com.cooksys.groupfinal.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cooksys.groupfinal.entities.Project;

import java.util.Optional;
import java.util.Set;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByTeamId(Long id);

    Optional<Project> findByIdAndTeamId(Long id, Long teamId);

}