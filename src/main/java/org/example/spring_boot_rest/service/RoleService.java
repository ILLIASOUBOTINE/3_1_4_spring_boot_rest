package org.example.spring_boot_rest.service;


import org.example.spring_boot_rest.model.Role;
import java.util.Set;

public interface RoleService   {
    Role findByName(String name);
    Set<Role> findAll();
}
