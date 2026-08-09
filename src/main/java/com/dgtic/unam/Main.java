package com.dgtic.unam;

import com.dgtic.unam.service.Course;
import com.dgtic.unam.service.LearnHubService;

import java.util.List;
/**
 * Main Class to execute Program.
 */
public class Main {
    public static void main(String[] args) {
        LearnHubService service = new LearnHubService();

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