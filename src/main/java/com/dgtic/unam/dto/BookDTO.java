package com.dgtic.unam.dto;

import java.util.Date;
import java.util.UUID;

public class BookDTO {
    private String bookCode;
    private String bookName;
    private String bookAuthor;
    private Date registrationDate;
    private UUID userUuid;

    public BookDTO(String bookCode, String bookName, String bookAuthor, Date registrationDate, UUID userUuid) {
        this.bookCode = bookCode;
        this.bookName = bookName;
        this.bookAuthor = bookAuthor;
        this.registrationDate = registrationDate;
        this.userUuid = userUuid;
    }

    public String getBookCode() {
        return bookCode;
    }

    public void setBookCode(String bookCode) {
        this.bookCode = bookCode;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getBookAuthor() {
        return bookAuthor;
    }

    public void setBookAuthor(String bookAuthor) {
        this.bookAuthor = bookAuthor;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public UUID getUserUuid() {
        return userUuid;
    }

    public void setUserUuid(UUID userUuid) {
        this.userUuid = userUuid;
    }
}
