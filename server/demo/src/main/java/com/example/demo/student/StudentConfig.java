package com.example.demo.student;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Configuration
public class StudentConfig {

    @Bean
    CommandLineRunner commandLineRunner(StudentRepository repository){
        return args -> {

            Student mariam = new Student(
                    1L,
                    "Mariam Molamola",
                    "marimola@gmail.com",
                    LocalDate.of(2021, Month.JANUARY, 5),
                    "Student"
            );

            Student jeremy = new Student(
                    "Jeremy Jackson",
                    "jjackson@gmail.com",
                    LocalDate.of(2018, Month.OCTOBER, 5),
                    "Student"
            );

            Student alex = new Student(
                    "Alex Bolsonaro",
                    "alexbo@gmail.com",
                    LocalDate.of(2020, Month.FEBRUARY, 7),
                    "Student"
            );

            Student jessica = new Student(
                    "Jessica Jung",
                    "jung123@gmail.com",
                    LocalDate.of(2017, Month.FEBRUARY, 7),
                    "TA"
            );

            Student natalie = new Student(
                    "Natalie King",
                    "nking@gmail.com",
                    LocalDate.of(2016, Month.OCTOBER, 19),
                    "TA"
            );

            Student john = new Student(
                    "Johnny Depp",
                    "jdepp@gmail.com",
                    LocalDate.of(2012, Month.MARCH, 6),
                    "Professor"
            );

            repository.saveAll(
                    List.of(mariam, jeremy, jessica, alex, natalie, john)
            );

        };
    }
}
