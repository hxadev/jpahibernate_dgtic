package com.dgtic.unam.dao;

import com.dgtic.unam.entity.Course;
import com.dgtic.unam.utils.ConnectionUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class LearnHubDao {
    private Connection connection;

    public LearnHubDao(Connection connection) {
        this.connection = connection;
    }

    public Course findById(Integer id) {
        // Implementation for retrieving a course by its id from the database
        Course course = null;
        try {
            Class.forName("org.mariadb.jdbc.Driver");

            var sql = "SELECT * FROM courses WHERE id = ?";
            try (PreparedStatement stmt = connection.prepareStatement(sql)) {
                stmt.setInt(1, id);
                ResultSet rs = stmt.executeQuery();

                if (rs.next()) {

                    String title = rs.getString("title");
                    String description = rs.getString("description");
                    double price = rs.getDouble("price");
                    int duration = rs.getInt("duration");
                    boolean active = rs.getBoolean("active");
                    Timestamp createdAt = rs.getTimestamp("created_at");
                    Timestamp updatedAt = rs.getTimestamp("updated_at");
                    short ranking = rs.getShort("ranking");
                    int level_id = rs.getInt("level_id");
                    int category_id = rs.getInt("category_id");

                    course = new Course(id, title, description, price, duration, active, createdAt, updatedAt, ranking, level_id, category_id);
                }
            }
            return course;

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return course;
    }

    public List<Course> findAll() {
        // Implementation for retrieving all courses from the database
        List<Course> courses = new ArrayList<Course>();
        try {
            // 1. Load Driver
            Class.forName("org.mariadb.jdbc.Driver");


            // 3. Create Statement(Query)
            var sql = "SELECT *  FROM courses";
            try (PreparedStatement stmt = connection.prepareStatement(sql)) {
                // 4. Execute Statement(Query)
                ResultSet rs = stmt.executeQuery();

                // 5. Process ResultSet
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String title = rs.getString("title");
                    String description = rs.getString("description");
                    double price = rs.getDouble("price");
                    int duration = rs.getInt("duration");
                    boolean active = rs.getBoolean("active");
                    Timestamp createdAt = rs.getTimestamp("created_at");
                    Timestamp updatedAt = rs.getTimestamp("updated_at");
                    short ranking = rs.getShort("ranking");
                    int level_id = rs.getInt("level_id");
                    int category_id = rs.getInt("category_id");

                    courses.add(new Course(id, title, description, price, duration, active, createdAt, updatedAt, ranking, level_id, category_id));
                }
            } // 6. Close Statement


            return courses;

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return courses;
    }

    public void insert(Course course) {
        try {
            Class.forName("org.mariadb.jdbc.Driver");


            // 3. Create Statement
            PreparedStatement stmt = connection.prepareStatement("INSERT INTO courses (title, description, price, duration, active, created_at, updated_at, ranking, level_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            stmt.setString(1, course.title());
            stmt.setString(2, course.description());
            stmt.setDouble(3, course.price());
            stmt.setDouble(4, course.duration());
            stmt.setBoolean(5, course.active());
            stmt.setTimestamp(6, new java.sql.Timestamp(course.createdAt().getTime()));
            stmt.setTimestamp(7, new java.sql.Timestamp(course.updatedAt().getTime()));
            stmt.setInt(8, course.ranking());
            stmt.setInt(9, course.level_id());
            stmt.setInt(10, course.category_id());

            // 4. Execute Statement(Query)
            stmt.executeUpdate();

            // 5. Close Statement
            stmt.close();

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

}
