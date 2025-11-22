package com.dgtic.unam.entities;

import jakarta.persistence.*;

import java.io.Serializable;

/**
 * POJO
 * Clase Entidad - Pojo Entidad
 */
@Entity
@Table(name="CHAPTER")
public class Chapter implements Serializable {
    // Attributes private
    @ManyToOne
    @JoinColumn(name = "BOOK_ISBN")
    private Book book;
    @Column(name="CHAPTER_NUM")
    private int chapterNum;
    @Id
    private String title;

    // Constructor
    public Chapter(){

    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getChapterNum() {
        return chapterNum;
    }

    public void setChapterNum(int chapterNum) {
        this.chapterNum = chapterNum;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
