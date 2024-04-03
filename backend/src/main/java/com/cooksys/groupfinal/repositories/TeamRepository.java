package com.cooksys.groupfinal.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cooksys.groupfinal.entities.Team;

import java.util.Set;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Set<Team> findByTeammatesId(Long id);



}