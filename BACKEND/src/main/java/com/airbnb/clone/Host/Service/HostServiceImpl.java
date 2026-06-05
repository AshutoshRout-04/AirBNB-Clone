package com.airbnb.clone.Host.Service;



import java.util.List;

import org.springframework.stereotype.Service;

import com.airbnb.clone.Host.Entity.Host;
import com.airbnb.clone.Host.Repository.HostRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostServiceImpl implements HostService {

    private final HostRepository hostRepository;

    @Override
    public Host createHost(Host host) {
    	
    	if(hostRepository.findById(host.getId())!=null){
    		throw new RuntimeException("Host already existed");
    	}
    	
        return hostRepository.save(host);
    }

    @Override
    public Host getHostById(Long id) {

        return hostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Host Not Found"));
    }

    @Override
    public List<Host> getAllHosts() {

        return hostRepository.findAll();
    }

    @Override
    public Host updateHost(Long id, Host updatedHost) {

        Host host = hostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Host Not Found"));

      
        host.setProfileImage(updatedHost.getProfileImage());
        host.setAbout(updatedHost.getAbout());
        host.setVerified(updatedHost.getVerified());

        return hostRepository.save(host);
    }

    @Override
    public void deleteHost(Long id) {

        Host host = hostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Host Not Found"));

        hostRepository.delete(host);
    }
}
