package com.hosteliq.controller;

import com.hosteliq.entity.Allocation;
import com.hosteliq.entity.ElectricityUsage;
import com.hosteliq.entity.Student;
import com.hosteliq.exception.ResourceNotFoundException;
import com.hosteliq.repository.AllocationRepository;
import com.hosteliq.repository.ElectricityUsageRepository;
import com.hosteliq.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private ElectricityUsageRepository electricityUsageRepository;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getStudentProfileByUserId(@PathVariable Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + userId));
        return ResponseEntity.ok(student);
    }

    @GetMapping("/allocation/{userId}")
    public ResponseEntity<?> getStudentAllocation(@PathVariable Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + userId));

        Allocation allocation = allocationRepository.findByStudentIdAndIsActive(student.getId(), true)
                .orElseThrow(() -> new ResourceNotFoundException("Active room allocation not found for student"));

        Map<String, Object> response = new HashMap<>();
        response.put("allocationId", allocation.getId());
        response.put("allocatedAt", allocation.getAllocatedAt());
        response.put("bedNumber", allocation.getBed().getBedNumber());
        response.put("roomNumber", allocation.getBed().getRoom().getRoomNumber());
        response.put("floor", allocation.getBed().getRoom().getFloor());
        response.put("roomType", allocation.getBed().getRoom().getRoomType());
        response.put("blockName", allocation.getBed().getRoom().getBlock().getName());
        response.put("hostelName", allocation.getBed().getRoom().getBlock().getHostel().getName());
        response.put("hostelCode", allocation.getBed().getRoom().getBlock().getHostel().getCode());

        // Fetch electricity billing history
        List<ElectricityUsage> utilityUsage = electricityUsageRepository.findByRoomId(allocation.getBed().getRoom().getId());
        response.put("electricityHistory", utilityUsage);

        return ResponseEntity.ok(response);
    }
}
