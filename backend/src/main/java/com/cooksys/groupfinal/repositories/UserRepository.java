package com.cooksys.groupfinal.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cooksys.groupfinal.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	Optional<User> findByCredentialsUsernameAndActiveTrue(String username);

	Optional<User> findByProfileEmail(String username);

	Optional<User> findById(Long id);
	
	Optional<User> findByIdAndActiveTrue(Long id);

	Optional<User> findByIdAndActiveTrueAndAdminTrue(Long id);

}