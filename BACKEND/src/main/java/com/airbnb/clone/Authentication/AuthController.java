package com.airbnb.clone.Authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	
	private final AuthService authService;
	
	@PostMapping("/login")
	public ResponseEntity<ResponseDTO> login(@RequestBody RequestDTO Rdto) throws Exception{
		 System.out.println("CONTROLLER HIT");
		return ResponseEntity.ok(authService.login(Rdto));
	}
}
