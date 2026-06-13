package com.hosteliq.service;

import com.hosteliq.entity.Complaint;
import com.hosteliq.entity.Student;
import com.hosteliq.entity.User;
import com.hosteliq.exception.ResourceNotFoundException;
import com.hosteliq.repository.ComplaintRepository;
import com.hosteliq.repository.StudentRepository;
import com.hosteliq.repository.UserRepository;
import com.hosteliq.repository.AllocationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComplaintService {
    private static final Logger logger = LoggerFactory.getLogger(ComplaintService.class);

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private NotificationService notificationService;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByStudent(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));
        return complaintRepository.findByStudentId(student.getId());
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));
    }

    public Complaint createComplaint(Long studentUserId, Complaint complaint) {
        try {
            Student student = studentRepository.findByUserId(studentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + studentUserId));

            complaint.setStudent(student);
            complaint.setStatus("OPEN");
            complaint.setCreatedAt(LocalDateTime.now());
            complaint.setUpdatedAt(LocalDateTime.now());

            // Try to set the room based on student's active allocation
            allocationRepository.findByStudentIdAndIsActive(student.getId(), true).ifPresent(allocation -> {
                if (allocation.getBed() != null && allocation.getBed().getRoom() != null) {
                    complaint.setRoom(allocation.getBed().getRoom());
                }
            });

            // Perform AI Classification by calling the FastAPI AI service
            try {
                String aiServiceUrl = "http://localhost:8000/api/v1/ai/classify";
                Map<String, String> request = new HashMap<>();
                request.put("title", complaint.getTitle());
                request.put("description", complaint.getDescription());

                ResponseEntity<Map> response = restTemplate.postForEntity(aiServiceUrl, request, Map.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map<String, Object> body = response.getBody();
                    complaint.setAiCategory((String) body.get("category"));
                    complaint.setAiPriority((String) body.get("priority"));
                    complaint.setAiEtaHours((Integer) body.get("eta_hours"));
                    complaint.setAiConfidence(((Number) body.get("confidence")).doubleValue());
                    complaint.setCategory((String) body.get("category"));
                    complaint.setPriority((String) body.get("priority"));
                }
            } catch (Exception e) {
                logger.warn("FastAPI AI Service call failed or timed out. Falling back to local rules.", e);
                // Local fallback rule-based classification for robustness
                String titleLower = complaint.getTitle().toLowerCase();
                String descLower = complaint.getDescription().toLowerCase();

                if (titleLower.contains("light") || titleLower.contains("fan") || titleLower.contains("power") || titleLower.contains("electricity")) {
                    complaint.setAiCategory("ELECTRICAL");
                    complaint.setAiPriority("HIGH");
                    complaint.setAiEtaHours(4);
                } else if (titleLower.contains("water") || titleLower.contains("leak") || titleLower.contains("tap") || titleLower.contains("shower")) {
                    complaint.setAiCategory("WATER");
                    complaint.setAiPriority("HIGH");
                    complaint.setAiEtaHours(6);
                } else if (titleLower.contains("mess") || titleLower.contains("food") || titleLower.contains("meal") || titleLower.contains("lunch")) {
                    complaint.setAiCategory("MESS");
                    complaint.setAiPriority("MEDIUM");
                    complaint.setAiEtaHours(12);
                } else if (titleLower.contains("clean") || titleLower.contains("sweep") || titleLower.contains("dustbin") || titleLower.contains("washroom")) {
                    complaint.setAiCategory("CLEANING");
                    complaint.setAiPriority("LOW");
                    complaint.setAiEtaHours(24);
                } else if (titleLower.contains("bed") || titleLower.contains("chair") || titleLower.contains("table") || titleLower.contains("cupboard")) {
                    complaint.setAiCategory("FURNITURE");
                    complaint.setAiPriority("LOW");
                    complaint.setAiEtaHours(48);
                } else {
                    complaint.setAiCategory("OTHER");
                    complaint.setAiPriority("MEDIUM");
                    complaint.setAiEtaHours(24);
                }
                complaint.setAiConfidence(0.95);
                complaint.setCategory(complaint.getAiCategory());
                complaint.setPriority(complaint.getAiPriority());
            }

            Complaint saved = complaintRepository.save(complaint);
            
            // Create notification
            try {
                notificationService.createNotification(studentUserId, "Complaint Submitted", 
                    "Your complaint '" + saved.getTitle() + "' has been submitted successfully.", 
                    "COMPLAINT", "COMPLAINT", saved.getId());
            } catch (Exception ne) {
                logger.error("Failed to create student notification for complaint: {}", ne.getMessage());
            }

            logger.info("[HOSTELIQ LOG] Timestamp: {} | User ID: {} | Action: Complaint creation | Status: SUCCESS", 
                LocalDateTime.now(), studentUserId);
            return saved;
        } catch (Exception e) {
            logger.error("[HOSTELIQ LOG] Timestamp: {} | User ID: {} | Action: Complaint creation | Status: FAILURE - {}", 
                LocalDateTime.now(), studentUserId, e.getMessage());
            throw e;
        }
    }

    public Complaint updateComplaintStatus(Long id, String status, Long wardenUserId) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(status);
        complaint.setUpdatedAt(LocalDateTime.now());

        if ("RESOLVED".equals(status) || "CLOSED".equals(status)) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        if (wardenUserId != null) {
            User warden = userRepository.findById(wardenUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Warden not found with ID: " + wardenUserId));
            complaint.setAssignedTo(warden);
        }

        return complaintRepository.save(complaint);
    }
}
