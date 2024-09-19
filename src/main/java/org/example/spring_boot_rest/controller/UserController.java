package org.example.spring_boot_rest.controller;


import org.example.spring_boot_rest.model.User;
import org.example.spring_boot_rest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String userPage(Model model) {
        User currentUser = userService.getAuthenticatedUser();
        model.addAttribute("currentUser", currentUser);
        return "user-page";
    }
}
