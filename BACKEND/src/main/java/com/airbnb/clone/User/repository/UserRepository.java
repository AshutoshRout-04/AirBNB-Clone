package com.airbnb.clone.User.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airbnb.clone.User.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
boolean ExistedbyEmail(String Email);

User findByEmail(String Email);
Optional<User> findById(String Id);


}
