package com.dgtic.unam.model;

/**
 * Modelo de datos para un libro en la librería.
 * POJO Entity con atributos isbn, bookName y publisherCode.
 */

import jakarta.persistence.*;

/**
 * Entity class representing a Book in the bookstore.
 */
@Entity
@Table(name = "BOOK")
@NamedQuery(query="SELECT b FROM Book b WHERE b.publisherCode=:publisherCode", name = "findBookByPublisherCode")
public class Book {
    @Id
    @Column(name = "ISBN")
    private String isbn;
    @Column(name = "BOOK_NAME")
    private String bookName;
    @Column(name = "PUBLISHER_CODE")
    private String publisherCode;
    public Book() {
    }
    public Book(String isbn, String bookName, String publisherCode) {
        this.isbn = isbn;
        this.bookName = bookName;
        this.publisherCode = publisherCode;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getPublisherCode() {
        return publisherCode;
    }

    public void setPublisherCode(String publisherCode) {
        this.publisherCode = publisherCode;
    }
}
