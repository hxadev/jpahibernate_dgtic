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

    /**
     * Many Chapters to One Book
     * ChapterEntity is the owning side of the relationship since it contains the foreign key (BOOK_ISBN)
     * For that reason, we use @ManyToOne with @JoinColumn to specify the foreign key column.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOOK_ISBN")
    private Book book;

    @Column(name="CHAPTER_NUM")
    private int chapterNum;

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

    @Override
    public String toString() {
        return "Chapter{" +
                "title='" + title + '\'' +
                ", book=" + book +
                ", chapterNum=" + chapterNum +
                '}';
    }
}
