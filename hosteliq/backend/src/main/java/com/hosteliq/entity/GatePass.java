package com.hosteliq.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gate_pass")
public class GatePass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "leave_request_id")
    private LeaveRequest leaveRequest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "pass_code", nullable = false, unique = true)
    private String passCode;

    @Column(name = "qr_data", nullable = false, columnDefinition = "TEXT")
    private String qrData;

    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @Column(name = "valid_until", nullable = false)
    private LocalDateTime validUntil;

    @Column(name = "exit_scanned_at")
    private LocalDateTime exitScannedAt;

    @Column(name = "entry_scanned_at")
    private LocalDateTime entryScannedAt;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, USED, EXPIRED, REVOKED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public GatePass() {
    }

    public GatePass(Long id, LeaveRequest leaveRequest, Student student, String passCode, String qrData, LocalDateTime validFrom, LocalDateTime validUntil, LocalDateTime exitScannedAt, LocalDateTime entryScannedAt, String status, LocalDateTime createdAt) {
        this.id = id;
        this.leaveRequest = leaveRequest;
        this.student = student;
        this.passCode = passCode;
        this.qrData = qrData;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.exitScannedAt = exitScannedAt;
        this.entryScannedAt = entryScannedAt;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static GatePassBuilder builder() {
        return new GatePassBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LeaveRequest getLeaveRequest() { return leaveRequest; }
    public void setLeaveRequest(LeaveRequest leaveRequest) { this.leaveRequest = leaveRequest; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getPassCode() { return passCode; }
    public void setPassCode(String passCode) { this.passCode = passCode; }
    public String getQrData() { return qrData; }
    public void setQrData(String qrData) { this.qrData = qrData; }
    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }
    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
    public LocalDateTime getExitScannedAt() { return exitScannedAt; }
    public void setExitScannedAt(LocalDateTime exitScannedAt) { this.exitScannedAt = exitScannedAt; }
    public LocalDateTime getEntryScannedAt() { return entryScannedAt; }
    public void setEntryScannedAt(LocalDateTime entryScannedAt) { this.entryScannedAt = entryScannedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder class
    public static class GatePassBuilder {
        private Long id;
        private LeaveRequest leaveRequest;
        private Student student;
        private String passCode;
        private String qrData;
        private LocalDateTime validFrom;
        private LocalDateTime validUntil;
        private LocalDateTime exitScannedAt;
        private LocalDateTime entryScannedAt;
        private String status = "ACTIVE";
        private LocalDateTime createdAt = LocalDateTime.now();

        public GatePassBuilder id(Long id) { this.id = id; return this; }
        public GatePassBuilder leaveRequest(LeaveRequest leaveRequest) { this.leaveRequest = leaveRequest; return this; }
        public GatePassBuilder student(Student student) { this.student = student; return this; }
        public GatePassBuilder passCode(String passCode) { this.passCode = passCode; return this; }
        public GatePassBuilder qrData(String qrData) { this.qrData = qrData; return this; }
        public GatePassBuilder validFrom(LocalDateTime validFrom) { this.validFrom = validFrom; return this; }
        public GatePassBuilder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }
        public GatePassBuilder exitScannedAt(LocalDateTime exitScannedAt) { this.exitScannedAt = exitScannedAt; return this; }
        public GatePassBuilder entryScannedAt(LocalDateTime entryScannedAt) { this.entryScannedAt = entryScannedAt; return this; }
        public GatePassBuilder status(String status) { this.status = status; return this; }
        public GatePassBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public GatePass build() {
            return new GatePass(id, leaveRequest, student, passCode, qrData, validFrom, validUntil, exitScannedAt, entryScannedAt, status, createdAt);
        }
    }
}
