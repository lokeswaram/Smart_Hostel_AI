package com.hosteliq.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "enrollment_no", nullable = false, unique = true)
    private String enrollmentNo;

    private String course;
    private Integer year;
    private String department;
    private LocalDate dob;
    private String gender;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "parent_name")
    private String parentName;

    @Column(name = "parent_phone")
    private String parentPhone;

    @Column(name = "parent_email")
    private String parentEmail;

    private String address;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Student() {
    }

    public Student(Long id, User user, String enrollmentNo, String course, Integer year, String department, LocalDate dob, String gender, String emergencyContact, String parentName, String parentPhone, String parentEmail, String address, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.enrollmentNo = enrollmentNo;
        this.course = course;
        this.year = year;
        this.department = department;
        this.dob = dob;
        this.gender = gender;
        this.emergencyContact = emergencyContact;
        this.parentName = parentName;
        this.parentPhone = parentPhone;
        this.parentEmail = parentEmail;
        this.address = address;
        this.createdAt = createdAt;
    }

    public static StudentBuilder builder() {
        return new StudentBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEnrollmentNo() { return enrollmentNo; }
    public void setEnrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }
    public String getParentPhone() { return parentPhone; }
    public void setParentPhone(String parentPhone) { this.parentPhone = parentPhone; }
    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder class
    public static class StudentBuilder {
        private Long id;
        private User user;
        private String enrollmentNo;
        private String course;
        private Integer year;
        private String department;
        private LocalDate dob;
        private String gender;
        private String emergencyContact;
        private String parentName;
        private String parentPhone;
        private String parentEmail;
        private String address;
        private LocalDateTime createdAt = LocalDateTime.now();

        public StudentBuilder id(Long id) { this.id = id; return this; }
        public StudentBuilder user(User user) { this.user = user; return this; }
        public StudentBuilder enrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; return this; }
        public StudentBuilder course(String course) { this.course = course; return this; }
        public StudentBuilder year(Integer year) { this.year = year; return this; }
        public StudentBuilder department(String department) { this.department = department; return this; }
        public StudentBuilder dob(LocalDate dob) { this.dob = dob; return this; }
        public StudentBuilder gender(String gender) { this.gender = gender; return this; }
        public StudentBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public StudentBuilder parentName(String parentName) { this.parentName = parentName; return this; }
        public StudentBuilder parentPhone(String parentPhone) { this.parentPhone = parentPhone; return this; }
        public StudentBuilder parentEmail(String parentEmail) { this.parentEmail = parentEmail; return this; }
        public StudentBuilder address(String address) { this.address = address; return this; }
        public StudentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Student build() {
            return new Student(id, user, enrollmentNo, course, year, department, dob, gender, emergencyContact, parentName, parentPhone, parentEmail, address, createdAt);
        }
    }
}
