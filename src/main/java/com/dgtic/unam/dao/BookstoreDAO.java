package com.dgtic.unam.dao;

import com.dgtic.unam.model.Book;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Persistence;
import jakarta.persistence.TypedQuery;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class BookstoreDAO {

    private final EntityManagerFactory emf;
    private final EntityManager em;

    public BookstoreDAO() {
        this.emf = Persistence.createEntityManagerFactory("bookstore-pu");
        this.em = emf.createEntityManager();
    }

    // Insert a book
    public void insertBook(Book book) {
        try {
            em.getTransaction().begin();
            em.persist(book);
            em.getTransaction().commit();
        } catch (RuntimeException ex) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
        }
    }

    // Find all books
    public List<Book> findAllBooks() {
        try {
            return em.createQuery("SELECT b FROM Book b", Book.class).getResultList();
        } catch (NoResultException ex) {
            return Collections.emptyList();
        }
    }

    // Find books where publisherCode starts with prefix
    public List<Book> findAllBooksStartsWith(String startsWith) {
        return em.createQuery(
                        "SELECT b FROM Book b WHERE b.publisherCode LIKE :prefix",
                        Book.class
                ).setParameter("prefix", startsWith + "%")
                .getResultList();
    }

    // Pattern match on bookName (case-insensitive)
    public List<Book> findByBookNamePattern(String pattern) {
        return em.createQuery(
                        "SELECT b FROM Book b WHERE LOWER(b.bookName) LIKE LOWER(:p)",
                        Book.class
                ).setParameter("p", pattern + "%")
                .getResultList();
    }

    // Find by publisherCode exact
    public List<Book> findByPublisherCode(String publisherCode) {
        return em.createQuery(
                        "SELECT b FROM Book b WHERE b.publisherCode = :code",
                        Book.class
                ).setParameter("code", publisherCode)
                .getResultList();
    }

    // Find by list of ISBNs (IN clause)
    public List<Book> findByIsbnList(List<String> isbns) {
        if (isbns == null || isbns.isEmpty()) return Collections.emptyList();
        return em.createQuery(
                        "SELECT b FROM Book b WHERE b.isbn IN :ids",
                        Book.class
                ).setParameter("ids", isbns)
                .getResultList();
    }

    // Count all books
    public long countBooks() {
        return em.createQuery("SELECT COUNT(b) FROM Book b", Long.class)
                .getSingleResult();
    }

    // Distinct publisher codes
    public List<String> findDistinctPublisherCodes() {
        return em.createQuery(
                "SELECT DISTINCT b.publisherCode FROM Book b ORDER BY b.publisherCode",
                String.class
        ).getResultList();
    }

    // Pagination ordered by bookName
    public List<Book> findPage(int page, int size) {
        TypedQuery<Book> q = em.createQuery(
                "SELECT b FROM Book b ORDER BY b.bookName",
                Book.class
        );
        return q.setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();
    }

    // Grouping: count books per publisherCode
    public List<Object[]> groupCountByPublisherCode() {
        return em.createQuery(
                "SELECT b.publisherCode, COUNT(b) FROM Book b GROUP BY b.publisherCode ORDER BY COUNT(b) DESC",
                Object[].class
        ).getResultList();
    }

    // Optional single result by exact bookName
    public Optional<Book> findExactBookName(String bookName) {
        List<Book> list = em.createQuery(
                        "SELECT b FROM Book b WHERE b.bookName = :name",
                        Book.class
                ).setParameter("name", bookName)
                .setMaxResults(1)
                .getResultList();
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    // Dynamic criteria (null-safe)
    public List<Book> searchByCriteria(String isbn, String bookName, String publisherCode) {
        StringBuilder jpql = new StringBuilder("SELECT b FROM Book b WHERE 1=1");
        if (isbn != null && !isbn.isEmpty()) jpql.append(" AND b.isbn = :isbn");
        if (bookName != null && !bookName.isEmpty()) jpql.append(" AND LOWER(b.bookName) LIKE LOWER(:bname)");
        if (publisherCode != null && !publisherCode.isEmpty()) jpql.append(" AND b.publisherCode = :pub");
        var query = em.createQuery(jpql.toString(), Book.class);
        if (isbn != null && !isbn.isEmpty()) query.setParameter("isbn", isbn);
        if (bookName != null && !bookName.isEmpty()) query.setParameter("bname", bookName + "%");
        if (publisherCode != null && !publisherCode.isEmpty()) query.setParameter("pub", publisherCode);
        return query.getResultList();
    }

    // Bulk update publisherCode
    public int updatePublisherCode(String oldCode, String newCode) {
        em.getTransaction().begin();
        int updated = em.createQuery(
                        "UPDATE Book b SET b.publisherCode = :newCode WHERE b.publisherCode = :oldCode"
                ).setParameter("newCode", newCode)
                .setParameter("oldCode", oldCode)
                .executeUpdate();
        em.getTransaction().commit();
        return updated;
    }

    // Bulk delete by publisherCode
    public int deleteByPublisherCode(String code) {
        em.getTransaction().begin();
        int deleted = em.createQuery(
                        "DELETE FROM Book b WHERE b.publisherCode = :code"
                ).setParameter("code", code)
                .executeUpdate();
        em.getTransaction().commit();
        return deleted;
    }

    // Find by ISBN (primary key)
    public Book findBookByIsbn(String isbn) {
        return em.find(Book.class, isbn);
    }

    // Close resources
    public void close() {
        if (em.isOpen()) em.close();
        if (emf.isOpen()) emf.close();
    }
}
