package com.airbnb.clone.User.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airbnb.clone.User.UserException;
import com.airbnb.clone.User.Entity.User;
import com.airbnb.clone.User.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service

public class UserServiceImp implements UserService {

	
	

	private UserRepository Repo;


	@Override
	public User Register(User user) throws UserException {

		if (user == null) {
			throw new UserException("No Data Present");
		}

		if (Repo.existsByEmail(user.getEmail())) {
			throw new UserException("Email Already Existed");
		}

		return Repo.save(user);
	}

	@Override
	public User Login(User User) {
		return null;
	}
	

	@Override
	public boolean DeleteUser(Long Id) {
		User user = Repo.findById(Id).orElse(null);
		if (user == null) {
			return false;
		}
		Repo.delete(user);
		return true;
	}

	@Override
	public User Update(Long Id, User updatedUser) throws UserException {

		User user = Repo.findById(Id).orElseThrow(() -> new RuntimeException("No User Found"));

		user = User.builder().Id(Id)
				.Email(updatedUser.getEmail())
				.Password(updatedUser.getPassword())
				.Contact(updatedUser.getContact())
				.Role(updatedUser.getRole())
				.build();

		return Repo.save(user);

	}

	@Override
	public User getUserByEmail(String Email) {

		return Repo.findByEmail(Email);
	}

	@Override
	public User getUserById(Long Id) throws UserException {
		return Repo.findById(Id).orElseThrow(() -> new RuntimeException("Not User Found with Id: " + Id));
	}

}
