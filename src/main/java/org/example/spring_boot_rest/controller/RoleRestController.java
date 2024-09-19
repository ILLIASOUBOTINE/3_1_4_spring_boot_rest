package org.example.spring_boot_rest.controller;


import org.example.spring_boot_rest.model.Role;
import org.example.spring_boot_rest.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class RoleRestController {

    private final RoleService roleService;

    @Autowired
    public RoleRestController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/roles")
    public Set<Role> getRoles() {
        return roleService.findAll();
    }
}
