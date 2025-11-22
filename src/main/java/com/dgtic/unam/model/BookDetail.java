package com.dgtic.unam.model;

import jakarta.persistence.*;

@Entity
@Table(name = "BOOK_DETAIL")
public class BookDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Integer id;

     /* The entity BookDetail contains the FK,
        then we use @OneToOne with @JoinColumn to specify the foreign key column
     */
    @OneToOne
    @JoinColumn(name="ISBN")
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

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
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

    @Override
    public String toString() {
        return "BookDetail{" +
                "id=" + id +
                ", book=" + book +
                ", summary='" + summary + '\'' +
                ", yearPublication=" + yearPublication +
                '}';
    }
}