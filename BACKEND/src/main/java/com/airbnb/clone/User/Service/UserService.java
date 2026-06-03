package com.airbnb.clone.User.Service;



import com.airbnb.clone.User.UserException;
import com.airbnb.clone.User.Entity.User;


public interface UserService {

	public User Register(User User) throws UserException;
	public User Login(User User);
	public boolean DeleteUser(String Id);
	public User Update(String Id,User User) throws UserException;
	public User getUserByEmail(String Email);
	public User getUserById(String Id) throws UserException;
	
}
