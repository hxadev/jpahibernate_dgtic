package com.dgtic.unam.dto;

import com.dgtic.unam.entity.Course;

import java.util.Date;
import java.util.Objects;

public class CourseDTO {
    private Integer id;
    private String title;
    private String description;
    private Double price;
    private Integer duration;
    private Boolean active;
    private Date createdAt;
    private Date updatedAt;
    private Short ranking;
    private Integer levelId;
    private Integer categoryId;

    public CourseDTO() {
    }

    public CourseDTO(Integer id, String title, String description, Double price, Integer duration, Boolean active,
                     Date createdAt, Date updatedAt, Short ranking, Integer levelId, Integer categoryId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ranking = ranking;
        this.levelId = levelId;
        this.categoryId = categoryId;
    }

    // Getters / Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public Short getRanking() { return ranking; }
    public void setRanking(Short ranking) { this.ranking = ranking; }

    public Integer getLevelId() { return levelId; }
    public void setLevelId(Integer levelId) { this.levelId = levelId; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    @Override
    public String toString() {
        return "CourseDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", duration=" + duration +
                ", active=" + active +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", ranking=" + ranking +
                ", levelId=" + levelId +
                ", categoryId=" + categoryId +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CourseDTO courseDTO = (CourseDTO) o;
        return Objects.equals(id, courseDTO.id)
                && Objects.equals(title, courseDTO.title)
                && Objects.equals(description, courseDTO.description)
                && Objects.equals(price, courseDTO.price)
                && Objects.equals(duration, courseDTO.duration)
                && Objects.equals(active, courseDTO.active)
                && Objects.equals(createdAt, courseDTO.createdAt)
                && Objects.equals(updatedAt, courseDTO.updatedAt)
                && Objects.equals(ranking, courseDTO.ranking)
                && Objects.equals(levelId, courseDTO.levelId)
                && Objects.equals(categoryId, courseDTO.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, price, duration, active, createdAt, updatedAt, ranking, levelId, categoryId);
    }
}