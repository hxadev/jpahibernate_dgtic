package com.dgtic.unam;

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
        LearnHubDao dao = new LearnHubDao(ConnectionUtils.buildConnection());
        LearnHubService service = new LearnHubService(dao);

        // Step Get all courses
        List<Course> courses= service.findAllCourses();
        for (Course course : courses) {
            System.out.println("Course: " + course.title() + ", Description: " + course.description() + ", Price: " + course.price());
        }

        // Step Find a Course by ISBN
        Integer searchCourse = 1;
        Course foundCourse = service.findCourseById(searchCourse); // Assuming you have a method to find a course by ID
        if (foundCourse != null) {
            System.out.println("Found Course: " + foundCourse.title() + ", ID: " + foundCourse.id() + ", Title : " + foundCourse.title());
        } else {
            System.out.println("Course with ID " + searchCourse + " not found.");
        }

    }
}