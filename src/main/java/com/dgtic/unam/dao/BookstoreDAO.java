package com.dgtic.unam.dao;

import com.dgtic.unam.model.Book;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Persistence;
import org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Data Access Object (DAO) for Bookstore operations.
 */
public class BookstoreDAO {
    // No Needed Connection as attribute
    //private Connection connection;

    /**
     * EntityManagerFactory and EntityManager for JPA operations.
     */
    private EntityManagerFactory emf;
    private EntityManager em;

    public BookstoreDAO(){
        /**
         * Initialize the EntityManagerFactory and EntityManager for JPA operations.
         */
        this.emf = Persistence.createEntityManagerFactory("bookstore-pu");
        this.em = emf.createEntityManager();
    }

    public void insertBook(Book book) {
        try{
            em.getTransaction().begin();
            em.persist(book);
            em.getTransaction().commit();
        }catch (RuntimeException ex){
            em.getTransaction().rollback();
        }
    }

    public List<Book> findAllBooks() {
        try{
            List<Book> books=em.createQuery("SELECT b FROM Book b", Book.class).getResultList();
            return books;
        }catch(NoResultException ex){
            return Collections.emptyList();
        }
    }

    public Book findBookByIsbn(String isbn) {
        try{
            Book book=em.find(Book.class, isbn);
            return book;
        }catch(NoResultException ex){
            return null;
        }
    }

    public void updateBook(Book book) {
        try{
            em.getTransaction().begin();
            em.merge(book);
            em.getTransaction().commit();
        }catch (RuntimeException ex){
            em.getTransaction().rollback();
        }
    }

    public void deleteBook(Book book) {
        try{
            em.getTransaction().begin();
            em.remove(em.contains(book) ? book : em.merge(book));
            em.getTransaction().commit();
        }catch (RuntimeException ex){
            em.getTransaction().rollback();
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
