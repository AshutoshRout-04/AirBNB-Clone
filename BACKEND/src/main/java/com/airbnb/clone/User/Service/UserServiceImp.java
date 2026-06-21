package com.airbnb.clone.User.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public User Register(User user) throws UserException {

		if (user == null) {
			throw new UserException("No Data Present");
		}

		if (Repo.findByEmail(user.getEmail()).isPresent()) {
			throw new UserException("Email Already Existed");
		}
			String pass=user.getPassword();
		user.setPassword(passwordEncoder.encode(pass));
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

		if (updatedUser.getFullname() != null) user.setFullname(updatedUser.getFullname());
		if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
		if (updatedUser.getContact() != null) user.setContact(updatedUser.getContact());
		if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());
		
		if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty() && !updatedUser.getPassword().startsWith("$2a$")) {
			user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
		}

		user.setAvatar(updatedUser.getAvatar());
		user.setBio(updatedUser.getBio());
		user.setSchool(updatedUser.getSchool());
		user.setWork(updatedUser.getWork());
		user.setWantedToGo(updatedUser.getWantedToGo());
		user.setPets(updatedUser.getPets());
		user.setDecadeBorn(updatedUser.getDecadeBorn());
		user.setUselessSkill(updatedUser.getUselessSkill());
		user.setSong(updatedUser.getSong());
		user.setFunFact(updatedUser.getFunFact());
		user.setTimeSpend(updatedUser.getTimeSpend());
		user.setBioTitle(updatedUser.getBioTitle());
		user.setLanguages(updatedUser.getLanguages());
		user.setObsessedWith(updatedUser.getObsessedWith());
		user.setLive(updatedUser.getLive());

		return Repo.save(user);

	}

	@Override
	public User getUserByEmail(String Email) {

		return Repo.findByEmail(Email).orElseThrow();
	}

	@Override
	public User getUserById(Long Id) throws UserException {
		return Repo.findById(Id).orElseThrow(() -> new RuntimeException("Not User Found with Id: " + Id));
	}

	@Override
	public User becomeHost(Long userId) throws UserException {
		User user = Repo.findById(userId).orElseThrow(() -> new UserException("User not found with id: " + userId));
		
		// If not already HOST or HOST_GUEST, change to HOST_GUEST
		if (user.getRole() != Role.HOST && user.getRole() != Role.HOST_GUEST) {
			user.setRole(Role.HOST_GUEST);
		}

		// Save user first so we have updated role
		user = Repo.save(user);

		// Check if host profile already exists
		java.util.Optional<Host> existingHost = Hrepo.findAll().stream()
				.filter(h -> h.getUser() != null && h.getUser().getId().equals(userId))
				.findFirst();

		if (existingHost.isEmpty()) {
			Host host = new Host();
			host.setUser(user);
			host.setVerified(true); // Auto-verify for clone convenience

			// Find guest profile to link guest id if exists
			java.util.Optional<Guest> guestOpt = Grepo.findAll().stream()
					.filter(g -> g.getUser() != null && g.getUser().getId().equals(userId))
					.findFirst();

			if (guestOpt.isPresent()) {
				host.setGuest(guestOpt.get());
			}

			Hrepo.save(host);
		}

		return user;
	}

}
