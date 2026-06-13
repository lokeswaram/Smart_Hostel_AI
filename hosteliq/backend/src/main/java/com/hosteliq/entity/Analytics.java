package com.hosteliq.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics")
public class Analytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hostel_id")
    private Hostel hostel;

    @Column(name = "snapshot_date")
    private LocalDate snapshotDate = LocalDate.now();

    @Column(name = "total_students")
    private Integer totalStudents = 0;

    @Column(name = "total_rooms")
    private Integer totalRooms = 0;

    @Column(name = "occupied_rooms")
    private Integer occupiedRooms = 0;

    @Column(name = "open_complaints")
    private Integer openComplaints = 0;

    @Column(name = "resolved_complaints")
    private Integer resolvedComplaints = 0;

    @Column(name = "pending_leaves")
    private Integer pendingLeaves = 0;

    @Column(name = "approved_leaves")
    private Integer approvedLeaves = 0;

    @Column(name = "revenue_collected")
    private BigDecimal revenueCollected = BigDecimal.ZERO;

    @Column(name = "pending_revenue")
    private BigDecimal pendingRevenue = BigDecimal.ZERO;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Analytics() {
    }

    public Analytics(Long id, Hostel hostel, LocalDate snapshotDate, Integer totalStudents, Integer totalRooms, Integer occupiedRooms, Integer openComplaints, Integer resolvedComplaints, Integer pendingLeaves, Integer approvedLeaves, BigDecimal revenueCollected, BigDecimal pendingRevenue, LocalDateTime createdAt) {
        this.id = id;
        this.hostel = hostel;
        this.snapshotDate = snapshotDate;
        this.totalStudents = totalStudents;
        this.totalRooms = totalRooms;
        this.occupiedRooms = occupiedRooms;
        this.openComplaints = openComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.pendingLeaves = pendingLeaves;
        this.approvedLeaves = approvedLeaves;
        this.revenueCollected = revenueCollected;
        this.pendingRevenue = pendingRevenue;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Hostel getHostel() { return hostel; }
    public void setHostel(Hostel hostel) { this.hostel = hostel; }
    public LocalDate getSnapshotDate() { return snapshotDate; }
    public void setSnapshotDate(LocalDate snapshotDate) { this.snapshotDate = snapshotDate; }
    public Integer getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Integer totalStudents) { this.totalStudents = totalStudents; }
    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }
    public Integer getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(Integer occupiedRooms) { this.occupiedRooms = occupiedRooms; }
    public Integer getOpenComplaints() { return openComplaints; }
    public void setOpenComplaints(Integer openComplaints) { this.openComplaints = openComplaints; }
    public Integer getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(Integer resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }
    public Integer getPendingLeaves() { return pendingLeaves; }
    public void setPendingLeaves(Integer pendingLeaves) { this.pendingLeaves = pendingLeaves; }
    public Integer getApprovedLeaves() { return approvedLeaves; }
    public void setApprovedLeaves(Integer approvedLeaves) { this.approvedLeaves = approvedLeaves; }
    public BigDecimal getRevenueCollected() { return revenueCollected; }
    public void setRevenueCollected(BigDecimal revenueCollected) { this.revenueCollected = revenueCollected; }
    public BigDecimal getPendingRevenue() { return pendingRevenue; }
    public void setPendingRevenue(BigDecimal pendingRevenue) { this.pendingRevenue = pendingRevenue; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
