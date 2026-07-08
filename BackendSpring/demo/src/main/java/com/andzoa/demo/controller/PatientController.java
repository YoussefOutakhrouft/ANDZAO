package com.andzoa.demo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PatientController {

    private static final Logger log = LoggerFactory.getLogger(PatientController.class);

    @GetMapping("/print-name")
    public void printPatientName(){
        System.out.println("Hemmmmmm");
        log("hello");

    }

}
