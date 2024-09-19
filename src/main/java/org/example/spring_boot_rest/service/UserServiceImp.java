package org.example.spring_boot_rest.service;


import org.example.spring_boot_rest.dao.UserDao;
import org.example.spring_boot_rest.model.Role;
import org.example.spring_boot_rest.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImp implements UserService{

   private final UserDao userDao;
   private final RoleService roleService;
   private final PasswordEncoder passwordEncoder;

   @Autowired
   public UserServiceImp(UserDao userDao, RoleService roleService, PasswordEncoder passwordEncoder) {
      this.userDao = userDao;
       this.roleService = roleService;
       this.passwordEncoder = passwordEncoder;
   }

   @Override
   public void add(User user) {
      if (userDao.findByEmail(user.getEmail()) != null) {
         throw new IllegalArgumentException("User with this email already exists.");
      }
      user.setPassword(passwordEncoder.encode(user.getPassword()));
      userDao.add(user);
   }

   @Override
   public List<User> listUsers() {
      return userDao.listUsers();
   }

   @Override
   public void update(User user) {
      User existingUser = findById(user.getId());

      if (!existingUser.getEmail().equals(user.getEmail()) && findByEmail(user.getEmail()) != null) {
         throw new IllegalArgumentException("User with this email already exists.");
      }
      if (user.getPassword() == null || user.getPassword().isEmpty()) {
         user.setPassword(existingUser.getPassword());
      } else {
         user.setPassword(passwordEncoder.encode(user.getPassword()));
      }
      userDao.update(user);
   }

   @Override
   public void update(User user, List<String> roles) {
      User existingUser = findById(user.getId());

      if (!existingUser.getEmail().equals(user.getEmail()) && findByEmail(user.getEmail()) != null) {
         throw new IllegalArgumentException("User with this email already exists.");
      }

      // Преобразование строковых ролей в объекты Role
      Set<Role> userRoles = roles.stream()
              .map(roleService::findByName)
              .filter(Objects::nonNull)
              .collect(Collectors.toSet());

      // Устанавливаем роли
      user.setRoles(userRoles);

      if (user.getPassword() == null || user.getPassword().isEmpty()) {
         user.setPassword(existingUser.getPassword());
      } else {
         user.setPassword(passwordEncoder.encode(user.getPassword()));
      }
      userDao.update(user);
   }

   @Override
   public void delete(Long id) {
      userDao.delete(id);
   }

   @Override
   public User findById(Long id) {
      return userDao.findById(id);
   }

   @Override
   public User findByEmail(String email) {
      return userDao.findByEmail(email);
   }

   @Override
   public void registerUser(User user, List<String> roles) {
      // Проверка существования пользователя
      if (userDao.findByEmail(user.getEmail()) != null) {
         throw new IllegalArgumentException("User with this email already exists.");
      }

      // Преобразование строковых ролей в объекты Role
      Set<Role> userRoles = roles.stream()
              .map(roleService::findByName)
              .filter(Objects::nonNull)
              .collect(Collectors.toSet());

      // Устанавливаем роли и шифруем пароль
      user.setRoles(userRoles);
      user.setPassword(passwordEncoder.encode(user.getPassword()));

      // Сохраняем пользователя
      userDao.add(user);
   }

   @Override
   public User getAuthenticatedUser() {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      return (User) auth.getPrincipal();
   }

}
