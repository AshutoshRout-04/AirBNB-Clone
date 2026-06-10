package com.airbnb.clone.Authentication;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.airbnb.clone.JwtToken.AuthUtil;
import com.airbnb.clone.User.Entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	
	private final AuthenticationManager AuthManager;
	
	private final AuthUtil authutil;
	
	public ResponseDTO login(RequestDTO Rdto) throws Exception {
		
		System.out.print(Rdto.getPassword());try {

		    Authentication authentication = AuthManager.authenticate(
		            new UsernamePasswordAuthenticationToken(
		                    Rdto.getEmail(),
		                    Rdto.getPassword()
		            ));

		    System.out.println("SERVICE HIT");

		    User user = (User) authentication.getPrincipal();

		    String token = authutil.generateAcessTokenKey(user);

		    return new ResponseDTO(token, user.getId());

		} catch (Exception e) {

		    e.printStackTrace();

		    throw e;
		}
	
	}
}
