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
import java.util.Set;

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

    /**
     * One book can have many chapters.
     * The Book entity is the inverse side of the relationship since it does not contain the foreign key.
     * We use mappedBy attribute to indicate that the Chapter entity owns the relationship.
     */
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY)
    private List<Chapter> chapters;

    /**
     * Many books can have many authors.
     * We use @ManyToMany annotation to define the relationship.
     * We use @JoinTable to specify the join table and the join columns.
     */
    @ManyToMany
    @JoinTable(
            name = "BOOK_AUTHOR", // Join table name
            joinColumns = @JoinColumn(name = "ISBN_BOOK"), // Foreign key column in the join table for this entity
            inverseJoinColumns = @JoinColumn(name = "AUTHOR_ID") // Foreign key column in the join table for the other entity
    )
    private Set<Author> authors;



    public Book() {
    }

    public Set<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
    }

    public List<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
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
