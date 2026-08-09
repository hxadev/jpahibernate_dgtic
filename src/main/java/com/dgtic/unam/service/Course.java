package com.dgtic.unam.service;

import java.util.Date;

/**
 *
 */
public record Course(
    Integer id,
    String title,
    String description,
    Double price,
    Integer duration,
    Boolean active,
    Date createdAt,
    Date updatedAt,
    Short ranking,
    Integer level_id,
    Integer category_id
){

}
