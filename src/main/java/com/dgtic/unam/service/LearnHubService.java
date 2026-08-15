package com.dgtic.unam.service;

import com.dgtic.unam.dao.LearnHubDao;
import com.dgtic.unam.entity.Course;

import java.util.List;

/**
 * Cliente para interactuar con la librería a través del DAO.
 */
public class LearnHubService {
    private LearnHubDao learnHubDao;

    public LearnHubService(LearnHubDao learnHubDao) {
        this.learnHubDao = learnHubDao;
    }

    public Course findCourseById(Integer id) {
        return learnHubDao.findById(id);
    }

    public List<Course> findAllCourses() {
        return learnHubDao.findAll();
    }

    public void insertCourse(Course course) {
        learnHubDao.insert(course);
        System.out.println("Course inserted: " + course.getTitle());
    }
}
