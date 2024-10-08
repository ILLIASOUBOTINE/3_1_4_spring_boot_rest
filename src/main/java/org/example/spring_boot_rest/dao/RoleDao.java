package org.example.spring_boot_rest.dao;

import org.example.spring_boot_rest.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleDao extends JpaRepository<Role, Long> {
    Role findByName(String name);


}
