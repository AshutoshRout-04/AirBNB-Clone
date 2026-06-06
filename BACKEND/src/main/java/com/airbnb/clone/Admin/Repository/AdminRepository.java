package com.airbnb.clone.Admin.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airbnb.clone.Admin.Entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

}