package com.dgtic.unam.dao;

import com.dgtic.unam.entity.Course;
import com.dgtic.unam.utils.HibernateUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

/**
 * DAO implementation using JPA EntityManager obtained from the
 * {@link com.dgtic.unam.utils.HibernateUtil} singleton.
 */
public class LearnHubDao {
    public LearnHubDao() {
        // No-op: HibernateUtil holds the EntityManagerFactory singleton
    }

    public Course findById(Integer id) {
        EntityManager em = HibernateUtil.getEntityManager();
        try {
            return em.find(Course.class, id);
        } finally {
            if (em.isOpen()) em.close();
        }
    }

    public List<Course> findAll() {
        EntityManager em = HibernateUtil.getEntityManager();
        try {
            TypedQuery<Course> query = em.createQuery("SELECT c FROM Course c", Course.class);
            return query.getResultList();
        } finally {
            if (em.isOpen()) em.close();
        }
    }

    public void insert(Course course) {
        EntityManager em = HibernateUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(course);
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            if (em.isOpen()) em.close();
        }
    }

}
