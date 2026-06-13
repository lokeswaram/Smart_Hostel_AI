package com.hosteliq.service;

import com.hosteliq.entity.GatePass;
import com.hosteliq.entity.Student;
import com.hosteliq.exception.ResourceNotFoundException;
import com.hosteliq.repository.GatePassRepository;
import com.hosteliq.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GatePassService {
    @Autowired
    private GatePassRepository gatePassRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<GatePass> getAllGatePasses() {
        return gatePassRepository.findAll();
    }

    public List<GatePass> getGatePassesByStudent(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));
        return gatePassRepository.findByStudentId(student.getId());
    }

    public GatePass getGatePassById(Long id) {
        return gatePassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found with ID: " + id));
    }

    public GatePass verifyAndScanPass(String passCode) {
        GatePass gatePass = gatePassRepository.findByPassCode(passCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Gate Pass Code: " + passCode));

        LocalDateTime now = LocalDateTime.now();

        if ("EXPIRED".equals(gatePass.getStatus()) || "USED".equals(gatePass.getStatus()) || "REVOKED".equals(gatePass.getStatus())) {
            throw new RuntimeException("Gate Pass is already " + gatePass.getStatus());
        }

        if (now.isBefore(gatePass.getValidFrom())) {
            throw new RuntimeException("Gate Pass is not active yet. Valid from: " + gatePass.getValidFrom());
        }

        if (now.isAfter(gatePass.getValidUntil())) {
            gatePass.setStatus("EXPIRED");
            gatePassRepository.save(gatePass);
            throw new RuntimeException("Gate Pass has expired. Valid until: " + gatePass.getValidUntil());
        }

        if (gatePass.getExitScannedAt() == null) {
            // Scanning student out of the hostel
            gatePass.setExitScannedAt(now);
        } else if (gatePass.getEntryScannedAt() == null) {
            // Scanning student back into the hostel
            gatePass.setEntryScannedAt(now);
            gatePass.setStatus("USED");
        } else {
            throw new RuntimeException("Gate Pass has already been used for both exit and entry.");
        }

        return gatePassRepository.save(gatePass);
    }
}
