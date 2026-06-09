package com.airbnb.clone.JwtToken;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.airbnb.clone.User.Entity.User;
import com.airbnb.clone.User.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthUtilFilter extends OncePerRequestFilter {

	private final UserRepository URepo;
	private final AuthUtil authUtil; 
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		final String requestTokenHeader=request.getHeader("Authorization");
		
		if(requestTokenHeader==null || !requestTokenHeader.startsWith("Bearer")) {
			filterChain.doFilter(request, response);
			return;
		}
		
		String token=requestTokenHeader.split("Bearer ")[1];
		String email = null;
		try {
			email = authUtil.getEmailFromToken(token);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		if( email !=null && SecurityContextHolder.getContext().getAuthentication()==null) {
			User user=URepo.findByEmail(email).orElseThrow();
			
			UsernamePasswordAuthenticationToken Token= new  UsernamePasswordAuthenticationToken(user, null,user.getAuthorities());
			
			SecurityContextHolder.getContext().setAuthentication(Token);
		}
		filterChain.doFilter(request, response);
		
	}

}
