package com.example.demo.student;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.Period;


//so all of these is how you map student class to a table in db
@Entity
@Table
public class Student {

    //so all of these is how you map student class to a table in db
    @Id
    @SequenceGenerator(
            name = "student_sequence",
            sequenceName = "student_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "student_sequence"
    )

    private Long id;
    private String name;
    private String email;
    private LocalDate joinYear;
    private Integer currentYear;

    private String role;



    public Student() {

    }

    public Student(String name,
                   String email,
                   LocalDate joinYear,
                   String role) {
        this.name = name;
        this.email = email;
        this.joinYear = joinYear;
        this.role = role;
    }

    public Student(Long id,
                   String name,
                   String email,
                   LocalDate joinYear,
                   String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.joinYear = joinYear;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getJoinYear() {
        return joinYear;
    }

    public void setJoinYear(LocalDate joinYear) {
        this.joinYear = joinYear;
    }

    public Integer getCurrentYear() {
        return Period.between( this.joinYear, LocalDate.now() ).getYears();
    }

    public void setCurrentYear(Integer currentYear) {
        this.currentYear = currentYear;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }






    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", joinYear=" + joinYear +
                ", currentYear=" + currentYear +
                ", role=" + role +
                '}';
    }
}
