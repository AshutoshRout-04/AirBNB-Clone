package com.airbnb.clone.User.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airbnb.clone.User.UserException;
import com.airbnb.clone.User.Entity.User;
import com.airbnb.clone.User.Service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService Service;
	
	@PostMapping("/register")
	public ResponseEntity<User> Register(@RequestBody User User) throws UserException  {
		return ResponseEntity.ok(Service.Register(User));
	}
	
	@GetMapping("/getUser/{Id}")
	public ResponseEntity<User> GetUser(@PathVariable Long Id) throws UserException  {
		return ResponseEntity.ok(Service.getUserById(Id));
	}
	
	@DeleteMapping("/deleteUser/{Id}")
	public String DeleteUser(@PathVariable Long Id)   {
		 if(Service.DeleteUser(Id)) {
			 return "Deleted";
		 }
		 return "User not Found";
	}
	
	@PutMapping("/updateUser/{Id}")
	public ResponseEntity<User> UpdateUser(@PathVariable Long Id,@RequestBody User User) throws UserException {
		return ResponseEntity.ok(Service.Update(Id, User));
	}
	
}
