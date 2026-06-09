package com.airbnb.clone.User.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.airbnb.clone.User.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	    Optional<User> findByEmail(String Email);


}
