package com.hosteliq.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_logs")
public class VisitorLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "visitor_name", nullable = false)
    private String visitorName;

    @Column(name = "visitor_phone")
    private String visitorPhone;

    private String relation;

    @Column(columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime = LocalDateTime.now();

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(nullable = false)
    private String status = "CHECKED_IN"; // CHECKED_IN, CHECKED_OUT, REJECTED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public VisitorLog() {
    }

    public VisitorLog(Long id, Student student, String visitorName, String visitorPhone, String relation, String purpose, LocalDateTime checkInTime, LocalDateTime checkOutTime, User approvedBy, String status, LocalDateTime createdAt) {
        this.id = id;
        this.student = student;
        this.visitorName = visitorName;
        this.visitorPhone = visitorPhone;
        this.relation = relation;
        this.purpose = purpose;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.approvedBy = approvedBy;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getVisitorName() { return visitorName; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }
    public String getVisitorPhone() { return visitorPhone; }
    public void setVisitorPhone(String visitorPhone) { this.visitorPhone = visitorPhone; }
    public String getRelation() { return relation; }
    public void setRelation(String relation) { this.relation = relation; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }
    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
