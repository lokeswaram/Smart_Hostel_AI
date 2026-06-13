package com.hosteliq.repository;

import com.hosteliq.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByRoomId(Long roomId);
    List<Bed> findByRoomIdAndIsOccupied(Long roomId, Boolean isOccupied);
}
