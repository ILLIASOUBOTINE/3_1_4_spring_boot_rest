package org.example.spring_boot_rest.service;

import org.example.spring_boot_rest.dao.RoleDao;
import org.example.spring_boot_rest.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleDao roleDao;

    @Autowired
    public RoleServiceImpl(RoleDao roleDao) {
       this.roleDao = roleDao;
    }

    @Override
    public Role findByName(String name) {
        return roleDao.findByName(name);
    }

    @Override
    public Set<Role> findAll() {
        return roleDao.findAll().stream().collect(Collectors.toSet());
    }
}
