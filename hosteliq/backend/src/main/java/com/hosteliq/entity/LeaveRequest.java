package com.hosteliq.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "leave_from", nullable = false)
    private LocalDate leaveFrom;

    @Column(name = "leave_to", nullable = false)
    private LocalDate leaveTo;

    private String destination;

    @Column(name = "contact_during_leave")
    private String contactDuringLeave;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, CANCELLED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Transient
    private String roomNumber;

    public LeaveRequest() {
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public LeaveRequest(Long id, Student student, String reason, LocalDate leaveFrom, LocalDate leaveTo, String destination, String contactDuringLeave, String status, User approvedBy, LocalDateTime approvedAt, String remarks, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.student = student;
        this.reason = reason;
        this.leaveFrom = leaveFrom;
        this.leaveTo = leaveTo;
        this.destination = destination;
        this.contactDuringLeave = contactDuringLeave;
        this.status = status;
        this.approvedBy = approvedBy;
        this.approvedAt = approvedAt;
        this.remarks = remarks;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static LeaveRequestBuilder builder() {
        return new LeaveRequestBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LocalDate getLeaveFrom() { return leaveFrom; }
    public void setLeaveFrom(LocalDate leaveFrom) { this.leaveFrom = leaveFrom; }
    public LocalDate getLeaveTo() { return leaveTo; }
    public void setLeaveTo(LocalDate leaveTo) { this.leaveTo = leaveTo; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getContactDuringLeave() { return contactDuringLeave; }
    public void setContactDuringLeave(String contactDuringLeave) { this.contactDuringLeave = contactDuringLeave; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder class
    public static class LeaveRequestBuilder {
        private Long id;
        private Student student;
        private String reason;
        private LocalDate leaveFrom;
        private LocalDate leaveTo;
        private String destination;
        private String contactDuringLeave;
        private String status = "PENDING";
        private User approvedBy;
        private LocalDateTime approvedAt;
        private String remarks;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        public LeaveRequestBuilder id(Long id) { this.id = id; return this; }
        public LeaveRequestBuilder student(Student student) { this.student = student; return this; }
        public LeaveRequestBuilder reason(String reason) { this.reason = reason; return this; }
        public LeaveRequestBuilder leaveFrom(LocalDate leaveFrom) { this.leaveFrom = leaveFrom; return this; }
        public LeaveRequestBuilder leaveTo(LocalDate leaveTo) { this.leaveTo = leaveTo; return this; }
        public LeaveRequestBuilder destination(String destination) { this.destination = destination; return this; }
        public LeaveRequestBuilder contactDuringLeave(String contactDuringLeave) { this.contactDuringLeave = contactDuringLeave; return this; }
        public LeaveRequestBuilder status(String status) { this.status = status; return this; }
        public LeaveRequestBuilder approvedBy(User approvedBy) { this.approvedBy = approvedBy; return this; }
        public LeaveRequestBuilder approvedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; return this; }
        public LeaveRequestBuilder remarks(String remarks) { this.remarks = remarks; return this; }
        public LeaveRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public LeaveRequestBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public LeaveRequest build() {
            return new LeaveRequest(id, student, reason, leaveFrom, leaveTo, destination, contactDuringLeave, status, approvedBy, approvedAt, remarks, createdAt, updatedAt);
        }
    }
}
