package com.airbnb.clone.User.Service;



import com.airbnb.clone.User.UserException;
import com.airbnb.clone.User.Entity.User;


public interface UserService {

	User Register(User User) throws UserException;
	User Login(User User);
	boolean DeleteUser(Long Id);
	User Update(Long Id,User User) throws UserException;
	User getUserByEmail(String Email);
	User getUserById(Long Id) throws UserException;
	User becomeHost(Long userId) throws UserException;
}
