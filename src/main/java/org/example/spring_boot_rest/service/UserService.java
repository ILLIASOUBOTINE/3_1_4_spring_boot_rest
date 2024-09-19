package org.example.spring_boot_rest.service;


import org.example.spring_boot_rest.model.User;
import java.util.List;

public interface UserService  {
    void add(User user);
    List<User> listUsers();
    void update(User user);
    void update(User user, List<String> roles);
    void delete(Long id);
    User findById(Long id);
    User findByEmail(String email);
    void registerUser(User user, List<String> roles);
    User getAuthenticatedUser();
}
