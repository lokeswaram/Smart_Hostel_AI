package com.hosteliq.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "block_id", nullable = false)
    private Block block;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Column(nullable = false)
    private Integer floor;

    @Column(name = "room_type")
    private String roomType; // SINGLE, DOUBLE, TRIPLE, DORMITORY

    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, FULL, MAINTENANCE

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Room() {
    }

    public Room(Long id, Block block, String roomNumber, Integer floor, String roomType, String status, LocalDateTime createdAt) {
        this.id = id;
        this.block = block;
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.roomType = roomType;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Block getBlock() { return block; }
    public void setBlock(Block block) { this.block = block; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
