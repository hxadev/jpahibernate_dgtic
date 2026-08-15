package com.dgtic.unam.utils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

/**
 * Utility class that builds a single EntityManagerFactory from the
 * persistence unit defined in META-INF/persistence.xml and exposes
 * convenience methods to obtain EntityManager instances and to close
 * the factory on application shutdown.
 */
public final class HibernateUtil {
    private static final String PERSISTENCE_UNIT_NAME = "learnhub-pu";

    private static final EntityManagerFactory emf = buildEntityManagerFactory();

    private HibernateUtil() {
        // utility class
    }

    private static EntityManagerFactory buildEntityManagerFactory() {
        try {
            return Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ExceptionInInitializerError("Initial EntityManagerFactory creation failed: " + ex);
        }
    }

    public static EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public static void close() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}

