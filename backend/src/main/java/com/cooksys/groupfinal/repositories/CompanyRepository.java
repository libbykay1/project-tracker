package com.cooksys.groupfinal.repositories;

import com.cooksys.groupfinal.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cooksys.groupfinal.entities.Company;

import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByEmployeesId(Long userId);


}