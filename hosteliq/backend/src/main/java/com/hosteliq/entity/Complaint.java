package com.hosteliq.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category = "OTHER"; // ELECTRICAL, WATER, MESS, CLEANING, FURNITURE, OTHER

    @Column(nullable = false)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Column(nullable = false)
    private String status = "OPEN"; // OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED

    @Column(name = "ai_category")
    private String aiCategory;

    @Column(name = "ai_priority")
    private String aiPriority;

    @Column(name = "ai_eta_hours")
    private Integer aiEtaHours;

    @Column(name = "ai_confidence")
    private Double aiConfidence;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Complaint() {
    }

    public Complaint(Long id, Student student, Room room, String title, String description, String category, String priority, String status, String aiCategory, String aiPriority, Integer aiEtaHours, Double aiConfidence, User assignedTo, LocalDateTime resolvedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.student = student;
        this.room = room;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.aiCategory = aiCategory;
        this.aiPriority = aiPriority;
        this.aiEtaHours = aiEtaHours;
        this.aiConfidence = aiConfidence;
        this.assignedTo = assignedTo;
        this.resolvedAt = resolvedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ComplaintBuilder builder() {
        return new ComplaintBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAiCategory() { return aiCategory; }
    public void setAiCategory(String aiCategory) { this.aiCategory = aiCategory; }
    public String getAiPriority() { return aiPriority; }
    public void setAiPriority(String aiPriority) { this.aiPriority = aiPriority; }
    public Integer getAiEtaHours() { return aiEtaHours; }
    public void setAiEtaHours(Integer aiEtaHours) { this.aiEtaHours = aiEtaHours; }
    public Double getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(Double aiConfidence) { this.aiConfidence = aiConfidence; }
    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder class
    public static class ComplaintBuilder {
        private Long id;
        private Student student;
        private Room room;
        private String title;
        private String description;
        private String category = "OTHER";
        private String priority = "MEDIUM";
        private String status = "OPEN";
        private String aiCategory;
        private String aiPriority;
        private Integer aiEtaHours;
        private Double aiConfidence;
        private User assignedTo;
        private LocalDateTime resolvedAt;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        public ComplaintBuilder id(Long id) { this.id = id; return this; }
        public ComplaintBuilder student(Student student) { this.student = student; return this; }
        public ComplaintBuilder room(Room room) { this.room = room; return this; }
        public ComplaintBuilder title(String title) { this.title = title; return this; }
        public ComplaintBuilder description(String description) { this.description = description; return this; }
        public ComplaintBuilder category(String category) { this.category = category; return this; }
        public ComplaintBuilder priority(String priority) { this.priority = priority; return this; }
        public ComplaintBuilder status(String status) { this.status = status; return this; }
        public ComplaintBuilder aiCategory(String aiCategory) { this.aiCategory = aiCategory; return this; }
        public ComplaintBuilder aiPriority(String aiPriority) { this.aiPriority = aiPriority; return this; }
        public ComplaintBuilder aiEtaHours(Integer aiEtaHours) { this.aiEtaHours = aiEtaHours; return this; }
        public ComplaintBuilder aiConfidence(Double aiConfidence) { this.aiConfidence = aiConfidence; return this; }
        public ComplaintBuilder assignedTo(User assignedTo) { this.assignedTo = assignedTo; return this; }
        public ComplaintBuilder resolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; return this; }
        public ComplaintBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ComplaintBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Complaint build() {
            return new Complaint(id, student, room, title, description, category, priority, status, aiCategory, aiPriority, aiEtaHours, aiConfidence, assignedTo, resolvedAt, createdAt, updatedAt);
        }
    }
}
