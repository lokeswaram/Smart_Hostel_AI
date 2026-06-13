package com.hosteliq.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "electricity_usage", uniqueConstraints = {@UniqueConstraint(columnNames = {"room_id", "month", "year"})})
public class ElectricityUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "units_consumed", nullable = false)
    private BigDecimal unitsConsumed;

    @Column(name = "bill_amount", nullable = false)
    private BigDecimal billAmount;

    @Column(name = "is_billed")
    private Boolean isBilled = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ElectricityUsage() {
    }

    public ElectricityUsage(Long id, Room room, String month, Integer year, BigDecimal unitsConsumed, BigDecimal billAmount, Boolean isBilled, LocalDateTime createdAt) {
        this.id = id;
        this.room = room;
        this.month = month;
        this.year = year;
        this.unitsConsumed = unitsConsumed;
        this.billAmount = billAmount;
        this.isBilled = isBilled;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public BigDecimal getUnitsConsumed() { return unitsConsumed; }
    public void setUnitsConsumed(BigDecimal unitsConsumed) { this.unitsConsumed = unitsConsumed; }
    public BigDecimal getBillAmount() { return billAmount; }
    public void setBillAmount(BigDecimal billAmount) { this.billAmount = billAmount; }
    public Boolean getIsBilled() { return isBilled; }
    public void setIsBilled(Boolean isBilled) { this.isBilled = isBilled; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
