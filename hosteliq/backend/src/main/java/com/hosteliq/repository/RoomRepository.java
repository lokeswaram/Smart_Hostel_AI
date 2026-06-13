package com.hosteliq.repository;

import com.hosteliq.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByBlockId(Long blockId);
    List<Room> findByStatus(String status);
}
