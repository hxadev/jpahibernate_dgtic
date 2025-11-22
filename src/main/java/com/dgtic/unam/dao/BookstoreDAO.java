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
            // Why do we need left join fetch here?
            //
            return session.createQuery("from Book b left join fetch b.publisher left join fetch b.detail left join fetch b.chapters " , Book.class).list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    public List<Book> findBooksByPublisherCode(String publisherCode) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Book b where b.publisher.code = :code", Book.class)
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

    // HQL bulk update book name by ISBN
    public int updateBookNameHQL(String isbn, String newName) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            int updated = session.createQuery(
                            "update Book b set b.bookName = :name where b.isbn = :isbn")
                    .setParameter("name", newName)
                    .setParameter("isbn", isbn)
                    .executeUpdate();
            tx.commit();
            session.clear();
            return updated;
        } catch (Exception ex) {
            ex.printStackTrace();
            return 0;
        }
    }

    // HQL bulk update publisher code for matching old code
    public int updatePublisherCodeHQL(String oldCode, String newCode) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            int updated = session.createQuery(
                            "update Book b set b.publisher.code = :newCode where b.publisher.code = :oldCode")
                    .setParameter("newCode", newCode)
                    .setParameter("oldCode", oldCode)
                    .executeUpdate();
            tx.commit();
            session.clear();
            return updated;
        } catch (Exception ex) {
            ex.printStackTrace();
            return 0;
        }
    }

    // HQL bulk delete by ISBN
    public int deleteBookByIsbnHQL(String isbn) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            int deleted = session.createQuery(
                            "delete from Book b where b.isbn = :isbn")
                    .setParameter("isbn", isbn)
                    .executeUpdate();
            tx.commit();
            session.clear();
            return deleted;
        } catch (Exception ex) {
            ex.printStackTrace();
            return 0;
        }
    }

    // HQL bulk delete by publisher code
    public int deleteBooksByPublisherCodeHQL(String publisherCode) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            int deleted = session.createQuery(
                            "delete from Book b where b.publisher.code = :code")
                    .setParameter("code", publisherCode)
                    .executeUpdate();
            tx.commit();
            session.clear();
            return deleted;
        } catch (Exception ex) {
            ex.printStackTrace();
            return 0;
        }
    }

    // Count books
    public long countBooksHQL() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("select count(b) from Book b", Long.class)
                    .uniqueResult();
        } catch (Exception ex) {
            ex.printStackTrace();
            return 0L;
        }
    }

    // Distinct publisher codes
    public List<String> findDistinctPublisherCodesHQL() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                            "select distinct b.publisher.code from Book b", String.class)
                    .list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    // LIKE pattern search
    public List<Book> findBooksByNamePatternHQL(String pattern) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                            "from Book b where b.bookName like :pattern", Book.class)
                    .setParameter("pattern", pattern)
                    .list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    // Pagination
    public List<Book> findBooksPageHQL(int pageNumber, int pageSize) {
        int firstResult = Math.max(0, (pageNumber - 1) * pageSize);
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Book b order by b.bookName", Book.class)
                    .setFirstResult(firstResult)
                    .setMaxResults(pageSize)
                    .list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }

    // Exists by ISBN
    public boolean existsByIsbnHQL(String isbn) {
        try (Session session = sessionFactory.openSession()) {
            Long count = session.createQuery(
                            "select count(b) from Book b where b.isbn = :isbn", Long.class)
                    .setParameter("isbn", isbn)
                    .uniqueResult();
            return count != null && count > 0;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    // Projection: ISBN and name only
    public List<Object[]> findIsbnAndNameHQL() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                            "select b.isbn, b.bookName from Book b", Object[].class)
                    .list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Collections.emptyList();
        }
    }


}
