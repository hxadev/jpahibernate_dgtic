package com.dgtic.unam.controller;

import com.dgtic.unam.dao.LearnHubDao;
import com.dgtic.unam.entity.Course;
import com.dgtic.unam.service.LearnHubService;
import com.dgtic.unam.utils.ConnectionUtils;

import java.sql.SQLException;
import java.util.List;
/**
 * Main Class to execute Program.
 */
public class Main {
    public static void main(String[] args) throws SQLException {
        LearnHubDao dao = new LearnHubDao();
        LearnHubService service = new LearnHubService(dao);

        // Step Get all courses
        List<Course> courses= service.findAllCourses();
        for (Course course : courses) {
            System.out.println("Course: " + course.getTitle() + ", Description: " + course.getDescription() + ", Price: " + course.getPrice());
        }

        // Step Find a Course by ISBN
        Integer searchCourse = 1;
        Course foundCourse = service.findCourseById(searchCourse); // Assuming you have a method to find a course by ID
        if (foundCourse != null) {
            System.out.println("Found Course: " + foundCourse.getTitle() + ", ID: " + foundCourse.getId() + ", Title : " + foundCourse.getTitle());
        } else {
            System.out.println("Course with ID " + searchCourse + " not found.");
        }

    }
}