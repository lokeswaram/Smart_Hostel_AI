package com.hosteliq.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "allocations")
public class Allocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bed_id", nullable = false)
    private Bed bed;

    @Column(name = "allocated_at", updatable = false)
    private LocalDateTime allocatedAt = LocalDateTime.now();

    @Column(name = "vacated_at")
    private LocalDateTime vacatedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public Allocation() {
    }

    public Allocation(Long id, Student student, Bed bed, LocalDateTime allocatedAt, LocalDateTime vacatedAt, Boolean isActive) {
        this.id = id;
        this.student = student;
        this.bed = bed;
        this.allocatedAt = allocatedAt;
        this.vacatedAt = vacatedAt;
        this.isActive = isActive;
    }

    public static AllocationBuilder builder() {
        return new AllocationBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Bed getBed() { return bed; }
    public void setBed(Bed bed) { this.bed = bed; }
    public LocalDateTime getAllocatedAt() { return allocatedAt; }
    public void setAllocatedAt(LocalDateTime allocatedAt) { this.allocatedAt = allocatedAt; }
    public LocalDateTime getVacatedAt() { return vacatedAt; }
    public void setVacatedAt(LocalDateTime vacatedAt) { this.vacatedAt = vacatedAt; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    // Builder class
    public static class AllocationBuilder {
        private Long id;
        private Student student;
        private Bed bed;
        private LocalDateTime allocatedAt = LocalDateTime.now();
        private LocalDateTime vacatedAt;
        private Boolean isActive = true;

        public AllocationBuilder id(Long id) { this.id = id; return this; }
        public AllocationBuilder student(Student student) { this.student = student; return this; }
        public AllocationBuilder bed(Bed bed) { this.bed = bed; return this; }
        public AllocationBuilder allocatedAt(LocalDateTime allocatedAt) { this.allocatedAt = allocatedAt; return this; }
        public AllocationBuilder vacatedAt(LocalDateTime vacatedAt) { this.vacatedAt = vacatedAt; return this; }
        public AllocationBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }

        public Allocation build() {
            return new Allocation(id, student, bed, allocatedAt, vacatedAt, isActive);
        }
    }
}
