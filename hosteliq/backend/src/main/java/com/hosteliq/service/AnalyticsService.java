package com.hosteliq.service;

import com.hosteliq.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Map<String, Object> getLiveMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        long totalStudents = studentRepository.count();
        long totalBeds = bedRepository.count();
        long occupiedBeds = bedRepository.findAll().stream().filter(b -> Boolean.TRUE.equals(b.getIsOccupied())).count();
        double occupancyRate = totalBeds > 0 ? ((double) occupiedBeds / totalBeds) * 100 : 0.0;

        long openComplaints = complaintRepository.findAll().stream()
                .filter(c -> "OPEN".equals(c.getStatus()) || "ASSIGNED".equals(c.getStatus()) || "IN_PROGRESS".equals(c.getStatus()))
                .count();

        long resolvedComplaints = complaintRepository.findAll().stream()
                .filter(c -> "RESOLVED".equals(c.getStatus()) || "CLOSED".equals(c.getStatus()))
                .count();

        long pendingLeaves = leaveRequestRepository.findAll().stream()
                .filter(l -> "PENDING".equals(l.getStatus()))
                .count();

        long approvedLeaves = leaveRequestRepository.findAll().stream()
                .filter(l -> "APPROVED".equals(l.getStatus()))
                .count();

        BigDecimal revenueCollected = paymentRepository.findAll().stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .map(p -> p.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingRevenue = invoiceRepository.findAll().stream()
                .filter(i -> "PENDING".equals(i.getStatus()))
                .map(i -> i.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        metrics.put("totalStudents", totalStudents);
        metrics.put("totalBeds", totalBeds);
        metrics.put("occupiedBeds", occupiedBeds);
        metrics.put("occupancyRate", Math.round(occupancyRate * 10.0) / 10.0);
        metrics.put("openComplaints", openComplaints);
        metrics.put("resolvedComplaints", resolvedComplaints);
        metrics.put("pendingLeaves", pendingLeaves);
        metrics.put("approvedLeaves", approvedLeaves);
        metrics.put("revenueCollected", revenueCollected);
        metrics.put("pendingRevenue", pendingRevenue);

        return metrics;
    }
}
