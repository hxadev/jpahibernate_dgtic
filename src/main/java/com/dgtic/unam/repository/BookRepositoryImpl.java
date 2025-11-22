// src/main/java/com/dgtic/unam/repository/BookRepositoryImpl.java
package com.dgtic.unam.repository;

import com.dgtic.unam.model.Author;
import com.dgtic.unam.model.Book;
import com.dgtic.unam.model.BookDetail;
import com.dgtic.unam.model.Chapter;
import com.dgtic.unam.model.Publisher;
import jakarta.persistence.criteria.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import java.util.ArrayList;
import java.util.List;

public class BookRepositoryImpl implements BookRepository {

    private final SessionFactory sessionFactory;

    public BookRepositoryImpl() {
        this.sessionFactory = new Configuration()
                .configure("hibernate.cfg.xml")
                .buildSessionFactory();
    }


    /**
     * Find all books with their publishers and details (eager fetch)
     * @return
     */
    @Override
    public List<Book> findAll() {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);
            root.fetch("publisher", JoinType.LEFT);
            root.fetch("detail", JoinType.LEFT);
            cq.select(root).distinct(true);
            return session.createQuery(cq).getResultList();
        }
    }

    /**
     * Find book by ISBN
     * @param isbn
     * @return
     */
    @Override
    public Book findByIsbn(String isbn) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);
            cq.select(root).where(cb.equal(root.get("isbn"), isbn));
            return session.createQuery(cq).uniqueResult();
        }
    }

    /**
     * Find book by name
     * @param name
     * @return
     */
    @Override
    public Book findByName(String name) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);
            cq.select(root).where(cb.equal(root.get("bookName"), name));
            return session.createQuery(cq).uniqueResult();
        }
    }

    /**
     * Find books by publisher code
     * @param code
     * @return
     */
    public List<Book> findByPublisherCode(String code) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);
            // Fetch instead of plain join to initialize the proxy
            root.fetch("publisher", JoinType.INNER);
            cq.select(root)
                    .where(cb.equal(root.get("publisher").get("code"), code))
                    .distinct(true);
            return session.createQuery(cq).getResultList();
        }
    }

    /**
     * Find books where name matches pattern
     * @param pattern
     * @return
     */
    public List<Book> findByNamePattern(String pattern) {
        if (pattern == null || pattern.isBlank()) {
            return List.of();
        }
        String likePattern = "%" + pattern.trim().toLowerCase() + "%";
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);
            // Fetch to avoid LazyInitializationException later
            root.fetch("publisher", JoinType.LEFT);
            root.fetch("detail", JoinType.LEFT);
            cq.select(root)
                    .where(cb.like(cb.lower(root.get("bookName")), likePattern))
                    .distinct(true);
            return session.createQuery(cq).getResultList();
        }
    }

    /**
     * Find books published within a year range
     * @param startYear
     * @param endYear
     * @return
     */
    public List<Book> findByPublicationYearRange(int startYear, int endYear) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);
            root.fetch("publisher", JoinType.LEFT);
            root.fetch("detail", JoinType.LEFT);
            Predicate between = cb.between(root.get("yearPublication"), startYear, endYear);
            cq.select(root).where(between);
            return session.createQuery(cq).getResultList();
        }
    }

    // Books that have at least one author from a given country
    public List<Book> findByAuthorCountry(String country) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);
            Join<Book, Author> authorJoin = root.join("authors", JoinType.INNER);
            cq.select(root)
                    .where(cb.equal(authorJoin.get("country"), country))
                    .distinct(true);
            return session.createQuery(cq).getResultList();
        }
    }

    // Books with chapter count greater than given number (subquery + count)
    public List<Book> findBooksWithChapterCountGreaterThan(int minCount) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);

            // Subquery counting chapters per book
            Subquery<Long> sub = cq.subquery(Long.class);
            Root<Chapter> chapterRoot = sub.from(Chapter.class);
            sub.select(cb.count(chapterRoot));
            sub.where(cb.equal(chapterRoot.get("book"), root));

            cq.select(root).where(cb.gt(sub, minCount));
            return session.createQuery(cq).getResultList();
        }
    }

    // Dynamic filter: optional params
    public List<Book> findDynamic(String isbn,
                                  String nameContains,
                                  String publisherCode,
                                  Integer yearFrom,
                                  Integer yearTo,
                                  String authorCountry) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);

            List<Predicate> predicates = new ArrayList<>();

            if (isbn != null) {
                predicates.add(cb.equal(root.get("isbn"), isbn));
            }
            if (nameContains != null) {
                predicates.add(cb.like(cb.lower(root.get("bookName")), "%" + nameContains.toLowerCase() + "%"));
            }
            if (publisherCode != null) {
                Join<Book, Publisher> pubJoin = root.join("publisher", JoinType.INNER);
                predicates.add(cb.equal(pubJoin.get("code"), publisherCode));
            }
            if (yearFrom != null || yearTo != null) {
                Join<Book, BookDetail> detailJoin = root.join("detail", JoinType.LEFT);
                if (yearFrom != null) {
                    predicates.add(cb.greaterThanOrEqualTo(detailJoin.get("yearPublication"), yearFrom));
                }
                if (yearTo != null) {
                    predicates.add(cb.lessThanOrEqualTo(detailJoin.get("yearPublication"), yearTo));
                }
            }
            if (authorCountry != null) {
                Join<Book, Author> authorJoin = root.join("authors", JoinType.INNER);
                predicates.add(cb.equal(authorJoin.get("country"), authorCountry));
            }

            cq.select(root).where(predicates.toArray(new Predicate[0])).distinct(true);
            return session.createQuery(cq).getResultList();
        }
    }
}
