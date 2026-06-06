package com.airbnb.clone.JwtToken;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.airbnb.clone.User.Entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class AuthUtil {

	@Value("${jwt.secretKey}")
	private String jwtSecretkey;
	
	private SecretKey getSecretKey() {
		return Keys.hmacShaKeyFor(jwtSecretkey.getBytes(StandardCharsets.UTF_8));
	}
	
	public String generateAcessTokenKey(User user) throws Exception {
		return Jwts.builder()
					.subject(user.getEmail())
					.claim("userid",user.getId())
					.issuedAt(new Date())
					.expiration(new Date(System.currentTimeMillis()+1000*60*10))
					.signWith(getSecretKey())
					.compact();
	}

	public String getEmailFromToken(String token) throws Exception {
		// TODO Auto-generated method stub
		Claims claims=Jwts.parser()
				.verifyWith(getSecretKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
		
		return claims.getSubject();
				
	}
}
