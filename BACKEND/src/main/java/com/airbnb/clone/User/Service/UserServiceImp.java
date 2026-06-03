package com.airbnb.clone.User.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import com.airbnb.clone.User.UserException;
import com.airbnb.clone.User.Entity.User;
import com.airbnb.clone.User.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
	
	@Autowired
	private final UserRepository Repo;
	@Override
	public User Register(User user) throws UserException {
		
		
		if(user==null) {
			throw new UserException("No Data Present");
		}
		
		if(Repo.ExistedbyEmail(user.getEmail())) {
			throw new UserException("Email Already Existed");
		}
		
		return Repo.save(user);
	}

	@Override
	public User Login(User User) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean DeleteUser(String Id) {
		// TODO Auto-generated method stub
		User user =getUserById(Id);
		if(user==null) {
			return false;
		}
		Repo.deleteById(user.getId());
		return true;
	}

	@Override
	public User Update(String Id,User updatedUser) throws UserException {
		// TODO Auto-generated method stub
		
		User user=Repo.findById(Id).orElseThrow(()->new RuntimeException("No User Found"));
		
		
		user=User.builder().Id(Id)
					.Email(updatedUser.getEmail())
					.Password(updatedUser.getPassword())
					.Contact(updatedUser.getContact())
					.build();
		
		return Repo.save(user);

	}

	@Override
	public User getUserByEmail(String Email) {
		// TODO Auto-generated method stub
		return Repo.findByEmail(Email);
	}

	@Override
	public User getUserById(String Id) {
		// TODO Auto-generated method stub
		return Repo.findById(Id).orElseThrow(()-> new RuntimeException("Not User Found with Id: "+ Id));
	}

	
}
