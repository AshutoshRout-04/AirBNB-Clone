package com.airbnb.clone.User.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airbnb.clone.Guest.Entity.Guest;
import com.airbnb.clone.Guest.Repository.GuestRepository;
import com.airbnb.clone.Host.Entity.Host;
import com.airbnb.clone.Host.Repository.HostRepository;
import com.airbnb.clone.User.UserException;
import com.airbnb.clone.User.Entity.Role;
import com.airbnb.clone.User.Entity.User;
import com.airbnb.clone.User.repository.UserRepository;


@Service

public class UserServiceImp implements UserService {

	@Autowired
	private UserRepository Repo;
	@Autowired
	private GuestRepository Grepo;
	@Autowired
	private HostRepository Hrepo;


	@Override
	public User Register(User user) throws UserException {

		if (user == null) {
			throw new UserException("No Data Present");
		}

		if (Repo.findByEmail(user.getEmail()) != null) {
			throw new UserException("Email Already Existed");
		}
		
		  User savedUser = Repo.save(user);

		    if(savedUser.getRole() == Role.GUEST) {

		        Guest guest = new Guest();
		        guest.setUser(savedUser);
		        guest.setTotalBookings(0);
		        guest.setAverageRating(0.0);

		        Grepo.save(guest);
		    }
		    
		    if(savedUser.getRole() == Role.HOST) {

		        Host host = new Host();
		        host.setUser(savedUser);
		        host.setVerified(false);
		        
		        Hrepo.save(host);
		    }
		    return savedUser;

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

		user = User.builder().id(Id)
				.fullname(updatedUser.getFullname())
				.email(updatedUser.getEmail())
				.password(updatedUser.getPassword())
				.contact(updatedUser.getContact())
				.role(updatedUser.getRole())
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
