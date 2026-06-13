package com.hosteliq.service;

import com.hosteliq.entity.Student;
import com.hosteliq.entity.User;
import com.hosteliq.entity.VisitorLog;
import com.hosteliq.exception.ResourceNotFoundException;
import com.hosteliq.repository.StudentRepository;
import com.hosteliq.repository.UserRepository;
import com.hosteliq.repository.VisitorLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VisitorLogService {
    @Autowired
    private VisitorLogRepository visitorLogRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<VisitorLog> getAllVisitorLogs() {
        return visitorLogRepository.findAll();
    }

    public List<VisitorLog> getVisitorLogsByStudent(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));
        return visitorLogRepository.findByStudentId(student.getId());
    }

    public VisitorLog checkInVisitor(Long studentId, VisitorLog log, Long securityUserId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        User securityUser = userRepository.findById(securityUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Security user not found with ID: " + securityUserId));

        log.setStudent(student);
        log.setApprovedBy(securityUser);
        log.setCheckInTime(LocalDateTime.now());
        log.setStatus("CHECKED_IN");
        log.setCreatedAt(LocalDateTime.now());

        return visitorLogRepository.save(log);
    }

    public VisitorLog checkOutVisitor(Long id) {
        VisitorLog log = visitorLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor log not found with ID: " + id));

        if (!"CHECKED_IN".equals(log.getStatus())) {
            throw new RuntimeException("Visitor is not checked in. Current status: " + log.getStatus());
        }

        log.setCheckOutTime(LocalDateTime.now());
        log.setStatus("CHECKED_OUT");

        return visitorLogRepository.save(log);
    }
}
