package com.giant.demo.controllers;


import com.giant.demo.entities.BatchSummary;
import com.giant.demo.entities.User;
import com.giant.demo.services.BatchService;
import com.giant.demo.services.SecurityService;
import com.giant.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;


@RestController
public class HomeController {
    @Autowired
    private UserService userService;
    @Autowired
    private SecurityService securityService;

    private BatchService batchService;

    /*/login POST controller is provided by Spring Security*/
    @GetMapping("/login")
    public ModelAndView login(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("login");
        return modelAndView;
    }

    @GetMapping("/")
    public ModelAndView index(){
        //return new ModelAndView("index");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index");
        return modelAndView;
    }

    @GetMapping()
    public BatchSummary getBatchResult(){
        return batchService.getBatchSummary();
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody User newUser, HttpServletRequest httpServletRequest){
        User user = userService.save(newUser);
        if (user != null) {
            securityService.autoLogin(newUser.getUsername(), newUser.getPassword(), httpServletRequest);
        }

        return "single-batch"; //show single batch.
    }

    /*
    @GetMapping("/error")
    public String error(){
        return "redirect:/ This is an error";
    }*/



}
