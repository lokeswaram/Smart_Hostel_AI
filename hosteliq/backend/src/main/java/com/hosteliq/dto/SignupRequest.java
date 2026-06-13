package com.hosteliq.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class SignupRequest {
    @NotBlank
    @Size(max = 255)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(max = 255)
    private String fullName;

    private String phone;
    private String avatarUrl;
    private Set<String> role;

    // Student fields if registering as student
    private String enrollmentNo;
    private String course;
    private Integer year;
    private String department;
    private String gender;
    private String emergencyContact;
    private String parentName;
    private String parentPhone;
    private String parentEmail;
    private String address;

    public SignupRequest() {
    }

    public SignupRequest(String email, String password, String fullName, String phone, String avatarUrl, Set<String> role, String enrollmentNo, String course, Integer year, String department, String gender, String emergencyContact, String parentName, String parentPhone, String parentEmail, String address) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.enrollmentNo = enrollmentNo;
        this.course = course;
        this.year = year;
        this.department = department;
        this.gender = gender;
        this.emergencyContact = emergencyContact;
        this.parentName = parentName;
        this.parentPhone = parentPhone;
        this.parentEmail = parentEmail;
        this.address = address;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public Set<String> getRole() { return role; }
    public void setRole(Set<String> role) { this.role = role; }
    public String getEnrollmentNo() { return enrollmentNo; }
    public void setEnrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
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
}
