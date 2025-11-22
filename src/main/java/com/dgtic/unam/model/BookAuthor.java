package com.dgtic.unam.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "BOOK_AUTHOR")
public class BookAuthor {
    @EmbeddedId
    private BookAuthorId id;

    @MapsId("isbnBook")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ISBN_BOOK", nullable = false)
    private Book isbnBook;

    public BookAuthorId getId() {
        return id;
    }

    public void setId(BookAuthorId id) {
        this.id = id;
    }

    public Book getIsbnBook() {
        return isbnBook;
    }

    public void setIsbnBook(Book isbnBook) {
        this.isbnBook = isbnBook;
    }

}