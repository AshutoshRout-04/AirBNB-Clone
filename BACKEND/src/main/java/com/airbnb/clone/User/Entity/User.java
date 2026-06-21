package com.airbnb.clone.User.Entity;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.airbnb.clone.Guest.Entity.Guest;
import com.airbnb.clone.Host.Entity.Host;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class User implements UserDetails  {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullname;
    private String email;
    private String password;
    
    @Enumerated(EnumType.STRING)
    @jakarta.persistence.Column(columnDefinition = "varchar(255)")
    private Role role;
    private String contact;

    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String avatar;

    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String bio;

    private String school;
    private String work;
    private String wantedToGo;
    private String pets;
    private String decadeBorn;
    private String uselessSkill;
    private String song;
    private String funFact;
    private String timeSpend;
    private String bioTitle;
    private String languages;
    private String obsessedWith;
    private String live;
    
    @OneToOne(mappedBy = "user")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Host host;
    
    @OneToOne(mappedBy = "user")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Guest guest;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		 return List.of(
		            new SimpleGrantedAuthority("ROLE_" + role.name())
		    );
	}

	@Override
	public String getUsername() {
		// Spring Security uses this as the principal identifier — must match what loadUserByUsername() uses (email)
		return email;
	}

	



    
	
    
    

}
