package com.dgtic.unam.dao;

import com.dgtic.unam.model.Book;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import java.util.Collections;
import java.util.List;

public class BookstoreDAO {

    private SessionFactory sessionFactory;

    public BookstoreDAO() {
        this.sessionFactory = new Configuration()
                .configure("hibernate.cfg.xml")
                .buildSessionFactory();
    }

    public void insertBook(Book book) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            session.save(book);
            tx.commit();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public List<Book> findAllBooks() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Book", Book.class).list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    public List<Book> findBooksByPublisherCode(String publisherCode) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Book b where b.publisherCode = :code", Book.class)
                    .setParameter("code", publisherCode)
                    .list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    public Book findBookByIsbn(String isbn) {
        try (Session session = sessionFactory.openSession()) {
            return session.get(Book.class, isbn);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }


}
