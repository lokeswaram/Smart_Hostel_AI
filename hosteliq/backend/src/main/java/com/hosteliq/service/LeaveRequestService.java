package com.hosteliq.service;

import com.hosteliq.entity.GatePass;
import com.hosteliq.entity.LeaveRequest;
import com.hosteliq.entity.Student;
import com.hosteliq.entity.User;
import com.hosteliq.exception.ResourceNotFoundException;
import com.hosteliq.repository.GatePassRepository;
import com.hosteliq.repository.LeaveRequestRepository;
import com.hosteliq.repository.StudentRepository;
import com.hosteliq.repository.UserRepository;
import com.hosteliq.repository.AllocationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class LeaveRequestService {
    private static final Logger logger = LoggerFactory.getLogger(LeaveRequestService.class);

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GatePassRepository gatePassRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    private void populateRoomNumber(LeaveRequest leaveRequest) {
        if (leaveRequest != null && leaveRequest.getStudent() != null) {
            allocationRepository.findByStudentIdAndIsActive(leaveRequest.getStudent().getId(), true)
                .ifPresent(alloc -> {
                    if (alloc.getBed() != null && alloc.getBed().getRoom() != null) {
                        leaveRequest.setRoomNumber(alloc.getBed().getRoom().getRoomNumber());
                    }
                });
        }
    }

    private void populateRoomNumbers(List<LeaveRequest> requests) {
        if (requests != null) {
            requests.forEach(this::populateRoomNumber);
        }
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        List<LeaveRequest> list = leaveRequestRepository.findAll();
        populateRoomNumbers(list);
        return list;
    }

    public List<LeaveRequest> getLeaveRequestsByStudent(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));
        List<LeaveRequest> list = leaveRequestRepository.findByStudentId(student.getId());
        populateRoomNumbers(list);
        return list;
    }

    public LeaveRequest getLeaveRequestById(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + id));
        populateRoomNumber(leaveRequest);
        return leaveRequest;
    }

    public LeaveRequest createLeaveRequest(Long studentUserId, LeaveRequest leaveRequest) {
        try {
            Student student = studentRepository.findByUserId(studentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));

            // Backend Date Validation Rules
            LocalDate today = LocalDate.now();
            if (leaveRequest.getLeaveFrom() == null || leaveRequest.getLeaveTo() == null) {
                throw new IllegalArgumentException("Leave dates cannot be null.");
            }
            if (leaveRequest.getLeaveFrom().isBefore(today)) {
                throw new IllegalArgumentException("Past dates are not allowed.");
            }
            if (leaveRequest.getLeaveTo().isBefore(leaveRequest.getLeaveFrom())) {
                throw new IllegalArgumentException("End date cannot be earlier than start date.");
            }

            leaveRequest.setStudent(student);
            leaveRequest.setStatus("PENDING");
            leaveRequest.setCreatedAt(LocalDateTime.now());
            leaveRequest.setUpdatedAt(LocalDateTime.now());

            LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
            populateRoomNumber(saved);

            logger.info("[HOSTELIQ LOG] Timestamp: {} | User ID: {} | Action: Leave request creation | Status: SUCCESS", 
                LocalDateTime.now(), studentUserId);
            return saved;
        } catch (Exception e) {
            logger.error("[HOSTELIQ LOG] Timestamp: {} | User ID: {} | Action: Leave request creation | Status: FAILURE - {}", 
                LocalDateTime.now(), studentUserId, e.getMessage());
            throw e;
        }
    }

    @Transactional
    public LeaveRequest approveOrRejectLeaveRequest(Long id, String status, String remarks, Long wardenUserId) {
        try {
            LeaveRequest leaveRequest = getLeaveRequestById(id);
            User warden = userRepository.findById(wardenUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Warden not found with ID: " + wardenUserId));

            leaveRequest.setStatus(status);
            leaveRequest.setRemarks(remarks);
            leaveRequest.setApprovedBy(warden);
            leaveRequest.setApprovedAt(LocalDateTime.now());
            leaveRequest.setUpdatedAt(LocalDateTime.now());

            LeaveRequest updatedRequest = leaveRequestRepository.save(leaveRequest);
            populateRoomNumber(updatedRequest);

            // If APPROVED, auto-generate a gate pass
            if ("APPROVED".equals(status)) {
                String passCode = "GP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                GatePass gatePass = GatePass.builder()
                        .leaveRequest(updatedRequest)
                        .student(updatedRequest.getStudent())
                        .passCode(passCode)
                        .qrData("HOSTELIQ-PASS:" + passCode)
                        .validFrom(LocalDateTime.of(updatedRequest.getLeaveFrom(), LocalTime.MIN))
                        .validUntil(LocalDateTime.of(updatedRequest.getLeaveTo(), LocalTime.MAX))
                        .status("ACTIVE")
                        .createdAt(LocalDateTime.now())
                        .build();
                gatePassRepository.save(gatePass);
            }

            logger.info("[HOSTELIQ LOG] Timestamp: {} | User ID: {} | Action: Leave {} | Status: SUCCESS", 
                LocalDateTime.now(), wardenUserId, status.toLowerCase());
            return updatedRequest;
        } catch (Exception e) {
            logger.error("[HOSTELIQ LOG] Timestamp: {} | User ID: {} | Action: Leave approval/rejection | Status: FAILURE - {}", 
                LocalDateTime.now(), wardenUserId, e.getMessage());
            throw e;
        }
    }
}
