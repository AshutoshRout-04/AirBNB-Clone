package com.airbnb.clone.Security;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import com.airbnb.clone.User.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

	
	private final UserRepository URepo;
	
	@Override
	public UserDetails loadUserByUsername(String Email) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return URepo.findByEmail(Email).orElseThrow(() ->
        new UsernameNotFoundException("User Not Found"));
	}

}
