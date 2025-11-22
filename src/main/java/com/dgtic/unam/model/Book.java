package com.dgtic.unam.model;

/**
 * Modelo de datos para un libro en la librería.
 * POJO con atributos isbn, bookName y publisherCode.
 * <p>
 * Entidad => Una clase que representa una tabla en la base de datos.
 */

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.List;

// POJO de entidad
@Entity
@Table(name = "BOOK")
public class Book implements Serializable {
    @Id
    @Column(name = "ISBN")
    private String isbn;

    @Column(name = "BOOK_NAME")
    private String bookName;

    /**
     * Many books can be published by one publisher.
     * Book entity is the owner of the relationship since it contains the foreign key (PUBLISHER_CODE).
     * For that reason, we use @ManyToOne with @JoinColumn to specify the foreign key column.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PUBLISHER_CODE")
    private Publisher publisher;

    /**
     * the Book entity does not contains the FK, but we can still map the relationship
     * using mappedBy attribute to indicate that the BookDetail entity owns the relationship.
     * This is the inverse side of the relationship.
     */
    @OneToOne(mappedBy = "book", fetch = FetchType.LAZY)
    private BookDetail detail;


    public Book() {
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



    public BookDetail getDetail() {
        return detail;
    }

    public void setDetail(BookDetail detail) {
        this.detail = detail;
    }

    public Publisher getPublisher() {
        return publisher;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }

    @Override
    public String toString() {
        return "Book{" +
                "isbn='" + isbn + '\'' +
                ", bookName='" + bookName + '\'' +
                ", publisher=" + publisher +
                '}';
    }
}
