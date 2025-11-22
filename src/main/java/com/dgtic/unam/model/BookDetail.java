package com.dgtic.unam.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "BOOK_DETAIL")
public class BookDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Integer id;

    @OneToOne(mappedBy = "bookDetail")
    private Book book;

    @Lob
    @Column(name = "SUMMARY")
    private String summary;

    @Column(name = "YEAR_PUBLICATION")
    private Integer yearPublication;



    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Book getIsbn() {
        return book;
    }

    public void setIsbn(Book isbn) {
        this.book = isbn;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getYearPublication() {
        return yearPublication;
    }

    public void setYearPublication(Integer yearPublication) {
        this.yearPublication = yearPublication;
    }

}