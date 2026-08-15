package com.dgtic.unam.dao;

import com.dgtic.unam.entity.Course;
import com.dgtic.unam.utils.ConnectionUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LearnHubDao {
    // No Connection class needed
    //private Connection connection;

    /**
     * EntityManagerFactory and EntityManager for JPA operations.
     */
    private EntityManagerFactory emf;
    private EntityManager em;

    public LearnHubDao() {
        /**
         * Initialize the EntityManagerFactory and EntityManager for JPA operations.
         */
        this.emf = Persistence.createEntityManagerFactory("learnhub-pu");
        this.em = emf.createEntityManager();
    }

    public Course findById(Integer id) {
        // Implementation for retrieving a course by its id from the database
        Course course = null;
        course=em.find(Course.class,id);
        return course;
    }

    public List<Course> findAll() {
        // Implementation for retrieving all courses from the database
        List<Course> courses = new ArrayList<Course>();
        courses=em.createQuery("SELECT c FROM Course c", Course.class).getResultList();
        return courses;
    }

    public void insert(Course course) {
        try{
            em.persist(course);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

}
