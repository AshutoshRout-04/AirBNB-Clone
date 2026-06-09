package com.airbnb.clone.Admin.Service;

import java.util.List;

import com.airbnb.clone.Admin.Entity.Admin;

public interface AdminService {

    Admin createAdmin(Admin admin);

    Admin getAdminById(Long id);

    List<Admin> getAllAdmins();

    Admin updateAdmin(Long id, Admin updatedAdmin);

    void deleteAdmin(Long id);
}