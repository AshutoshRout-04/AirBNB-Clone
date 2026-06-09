package com.airbnb.clone.Host.Service;

import java.util.List;

import com.airbnb.clone.Host.Entity.Host;

public interface HostService {

    Host createHost(Host host);

    Host getHostById(Long id);

    List<Host> getAllHosts();

    Host updateHost(Long id, Host updatedHost);

    void deleteHost(Long id);
}