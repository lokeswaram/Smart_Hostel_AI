package com.hosteliq.controller;

import com.hosteliq.entity.Invoice;
import com.hosteliq.entity.Payment;
import com.hosteliq.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping("/invoices/{userId}")
    public ResponseEntity<List<Invoice>> getInvoicesByStudent(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getInvoicesByStudent(userId));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsByStudent(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByStudent(userId));
    }

    @PostMapping("/pay/{invoiceId}")
    public ResponseEntity<Payment> processPayment(
            @PathVariable Long invoiceId,
            @RequestParam Long studentUserId,
            @RequestParam String paymentMethod) {
        return ResponseEntity.ok(paymentService.processPayment(studentUserId, invoiceId, paymentMethod));
    }
}
