package com.airbnb.clone.Host.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airbnb.clone.Host.Entity.Host;
import com.airbnb.clone.Host.Service.HostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/Host")
@RequiredArgsConstructor
public class HostController {

    private final HostService hostService;

    @PostMapping("/add")
    public ResponseEntity<Host> createHost(
            @RequestBody Host host) {

        return new ResponseEntity<>(
                hostService.createHost(host),
                HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Host> getHostById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                hostService.getHostById(id));
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Host>> getAllHosts() {

        return ResponseEntity.ok(
                hostService.getAllHosts());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Host> updateHost(
            @PathVariable Long id,
            @RequestBody Host host) {

        return ResponseEntity.ok(
                hostService.updateHost(id, host));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteHost(
            @PathVariable Long id) {

        hostService.deleteHost(id);

        return ResponseEntity.ok(
                "Host Deleted Successfully");
    }
}