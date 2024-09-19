package org.example.spring_boot_rest.dao;

import org.example.spring_boot_rest.model.User;
import java.util.List;

public interface UserDao {
   void add(User user);
   List<User> listUsers();
   void update(User user);
   void delete(Long id);
   User findById(Long id);
   User findByEmail(String email);
}
