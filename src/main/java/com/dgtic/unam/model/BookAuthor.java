package com.dgtic.unam.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "BOOK_AUTHOR")
public class BookAuthor {

    @Column(name = "ISBN_BOOK", nullable = false, length = 13)
    private String isbnBook;
    @Column(name = "AUTHOR_ID", nullable = false)
    private Long authorId;
    @Id
    private Long id;

    public BookAuthor() {
    }

    public String getIsbnBook() {
        return isbnBook;
    }

    public void setIsbnBook(String isbnBook) {
        this.isbnBook = isbnBook;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}