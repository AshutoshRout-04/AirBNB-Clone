package com.airbnb.clone.User.Entity;

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

public class User {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullname;
    private String email;
    private String password;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    private String contact;
    
    @OneToOne(mappedBy = "user")
    private Host host;
    
    @OneToOne(mappedBy = "user")
    private Guest guest;

    
	
    
    

}
