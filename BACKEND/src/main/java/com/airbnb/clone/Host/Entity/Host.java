package com.airbnb.clone.Host.Entity;

import java.util.List;


import jakarta.persistence.Id;

import com.airbnb.clone.User.Entity.User;
import com.airbnb.clone.property_listing.entity.Property;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.OneToMany;
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
public class Host {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String profileImage;

    private String about;

    private Boolean verified;

    @OneToOne
    @JoinColumn(name="User_id")
   private User user;
    
    @OneToMany(mappedBy = "Host_Id")
    private List<Property> properties;
    
}