package com.dgtic.unam.dao;

import com.dgtic.unam.config.HibernateConfiguration;
import com.dgtic.unam.model.Book;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Persistence;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.cfg.Configuration;
import org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Data Access Object (DAO) for Bookstore operations Hibernate and JPA.
 */
public class BookstoreDAO {
    // No Needed Connection as attribute
    //private Connection connection;

    private SessionFactory sessionFactory;

    public BookstoreDAO() {
        /**
         * Initialize the SessionFactory for Hibernate operations.
         */
        this.sessionFactory = HibernateConfiguration.buildSessionFactory();
    }

    public void insertBook(Book book) {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            session.save(book);
            session.getTransaction().commit();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public List<Book> findAllBooks() {
        try (Session session = sessionFactory.openSession()) {
            List<Book> books = session.createQuery("FROM Book", Book.class).list();
            session.close();
            return books;
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    public Book findBookByIsbn(String isbn) {
        try (Session session = sessionFactory.openSession()) {
            Book book = session.get(Book.class, isbn);
            session.close();
            return book;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    /**
     *  Not needed method to build connection
     * private Connection buildConnection() throws SQLException {
     String DBNAME = "bookstore";
     String URL = "jdbc:mariadb://localhost:3307/"+DBNAME;
     String USER = "dgtic";
     String PASS = "dgtic1234";
     return java.sql.DriverManager.getConnection(URL, USER, PASS);
     }**/

}
