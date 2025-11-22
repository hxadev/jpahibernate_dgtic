package com.dgtic.unam.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "AUTHOR")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Long id;

    /**
     * Many-to-Many relationship with Book entity
     * (mappedBy = "authors") indicates that the Book entity owns the relationship
     * and the join table is defined there.
     */
    @ManyToMany(mappedBy = "authors")
    private List<Book> books;

    @Column(name = "COUNTRY", length = 100)
    private String country;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

}