package org.example.spring_boot_rest.controller;


import org.example.spring_boot_rest.model.Role;
import org.example.spring_boot_rest.model.User;
import org.example.spring_boot_rest.service.RoleService;
import org.example.spring_boot_rest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;
import java.util.Set;


@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;


    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping("")
    public String getAdminPage(Model model) {
        User currentUser = userService.getAuthenticatedUser();
        model.addAttribute("currentUser", currentUser);
        return "admin-page";
    }

    @GetMapping("")
    public String users(Model model) {
        User currentUser = userService.getAuthenticatedUser();
        model.addAttribute("currentUser", currentUser);

        Set<Role> roles = roleService.findAll();
        model.addAttribute("roles", roles);

        List<User> users = userService.listUsers();
        model.addAttribute("users", users);

        model.addAttribute("user", new User());
        return "admin-page";
    }

    @GetMapping("/user-form-add")
    public String showUserForm(Model model) {
        User currentUser = userService.getAuthenticatedUser();
        model.addAttribute("currentUser", currentUser);

        if (!model.containsAttribute("user")) {
           model.addAttribute("user", new User());
       }
        model.addAttribute("roles", roleService.findAll());
        model.addAttribute("action", "add");
        model.addAttribute("buttonText", "Add new user");
        return "user-form";
    }

    @PostMapping("/add")
    public String addUser(@ModelAttribute("user") User user, @RequestParam(name = "roles1", required = false) List<String> roles, RedirectAttributes redirectAttributes) {
        try {
            userService.registerUser(user, roles);
            return "redirect:/admin";
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            redirectAttributes.addFlashAttribute("user", user);
            return "redirect:/admin/user-form-add";
        }
    }

    @PostMapping("/user-form-update")
    public String showUserFormUpdate(@RequestParam("userId") Long userId, Model model) {
        model.addAttribute("user", userService.findById(userId));
        model.addAttribute("roles", roleService.findAll());
        model.addAttribute("action", "update");
        return "user-form";
    }

    @PostMapping("/update")
    public String updateUser(@ModelAttribute("user") User user,@RequestParam(name = "roles1", required = false) List<String> roles, Model model) {
        try {
            userService.update(user,roles);
            return "redirect:/admin";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("user", user);
            model.addAttribute("roles", roleService.findAll());
            model.addAttribute("action", "update");
            return "user-form";
        }
    }

    @PostMapping("/delete")
    public String deleteUser(@RequestParam("userId") Long userId) {
        userService.delete(userId);
        return "redirect:/admin";
    }


}
