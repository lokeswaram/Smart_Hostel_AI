package com.hosteliq.controller;

import com.hosteliq.entity.LeaveRequest;
import com.hosteliq.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/leaves")
public class LeaveRequestController {
    @Autowired
    private LeaveRequestService leaveRequestService;

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByStudent(@PathVariable Long userId) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByStudent(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestById(id));
    }

    @PostMapping("/student/{userId}")
    public ResponseEntity<LeaveRequest> createLeaveRequest(@PathVariable Long userId, @RequestBody LeaveRequest leaveRequest) {
        return ResponseEntity.ok(leaveRequestService.createLeaveRequest(userId, leaveRequest));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> approveOrRejectLeaveRequest(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String remarks,
            @RequestParam Long wardenUserId) {
        return ResponseEntity.ok(leaveRequestService.approveOrRejectLeaveRequest(id, status, remarks, wardenUserId));
    }
}
