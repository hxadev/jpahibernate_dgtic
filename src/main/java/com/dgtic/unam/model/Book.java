package com.dgtic.unam.model;

/**
 * Modelo de datos para un libro en la librería.
 * POJO con atributos isbn, bookName y publisherCode.
 */
public class Book {
    private String isbn;
    private String bookName;
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
