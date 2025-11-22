package com.dgtic.unam.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name="PUBLISHER")
public class Publisher implements Serializable {
    // Private attributes
    @Id
    @Column(name="CODE")
    private String code;
    @Column(name="PUBLISHER_NAME")
    private String publisherName;

    // Constructor
    public Publisher(){

    }

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPublisherName() {
        return publisherName;
    }

    public void setPublisherName(String publisherName) {
        this.publisherName = publisherName;
    }

    @Override
    public String toString() {
        return "Publisher{" +
                "code='" + code + '\'' +
                ", publisherName='" + publisherName + '\'' +
                '}';
    }
}
