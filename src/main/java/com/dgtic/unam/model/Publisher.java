package com.dgtic.unam.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name="PUBLISHER")
public class Publisher implements Serializable {
    // Private attributes
    @Id
    @Column(name="CODE")
    private String code;
    @Column(name="PUBLISHER_NAME")
    private String publisherName;

    /**
     * Publisher entity is the entity that owns the relationship with Book entity.
     * One publisher can publish many books.
     * This is the inverse side of the relationship.
     * For that reason we use mappedBy attribute to indicate that the Book entity owns the relationship.
     */
    @OneToMany(mappedBy = "publisher", fetch = FetchType.LAZY)
    private List<Book> books;

    // Constructor
    public Publisher(){

    }

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPublisherName() {
        return publisherName;
    }

    public void setPublisherName(String publisherName) {
        this.publisherName = publisherName;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    @Override
    public String toString() {
        return "Publisher{" +
                "code='" + code + '\'' +
                ", publisherName='" + publisherName + '\'' +
                '}';
    }
}
