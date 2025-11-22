package com.dgtic.unam.model;

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
    @Id
    @Column(name="TITLE")
    private String title;

    @Column(name="BOOK_ISBN")
    private String bookIsbn;

    @Column(name="CHAPTER_NUM")
    private int chapterNum;

    // Constructor
    public Chapter(){

    }

    public String getBookIsbn() {
        return bookIsbn;
    }

    public void setBookIsbn(String bookIsbn) {
        this.bookIsbn = bookIsbn;
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
