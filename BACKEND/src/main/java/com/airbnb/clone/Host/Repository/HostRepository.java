package com.airbnb.clone.Host.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.airbnb.clone.Host.Entity.Host;

public interface HostRepository extends JpaRepository<Host, Long>{

}