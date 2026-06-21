package com.airbnb.clone.Admin.Service;

import java.util.List;


import org.springframework.stereotype.Service;

import com.airbnb.clone.Admin.Entity.Admin;
import com.airbnb.clone.Admin.Exception.AdminException;
import com.airbnb.clone.Admin.Repository.AdminRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    
    private final AdminRepository adminRepository;

    
    
    @Override
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new AdminException("Admin not found with id: " + id));
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new AdminException("Admin not found with id: " + id));

        if (updatedAdmin.getEmployeeCode() != null) {
            admin.setEmployeeCode(updatedAdmin.getEmployeeCode());
        }

        if (updatedAdmin.getDepartment() != null) {
            admin.setDepartment(updatedAdmin.getDepartment());
        }

        return adminRepository.save(admin);
    }

    @Override
    public void deleteAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new AdminException("Admin not found with id: " + id));

        adminRepository.delete(admin);
    }
}