package com.hosteliq.controller;

import com.hosteliq.dto.JwtResponse;
import com.hosteliq.dto.LoginRequest;
import com.hosteliq.dto.MessageResponse;
import com.hosteliq.dto.SignupRequest;
import com.hosteliq.entity.Role;
import com.hosteliq.entity.Student;
import com.hosteliq.entity.User;
import com.hosteliq.repository.RoleRepository;
import com.hosteliq.repository.StudentRepository;
import com.hosteliq.repository.UserRepository;
import com.hosteliq.security.JwtUtils;
import com.hosteliq.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Validate selected role if provided
        if (loginRequest.getRole() != null && !loginRequest.getRole().trim().isEmpty()) {
            String requiredRole = loginRequest.getRole().trim();
            boolean hasRequiredRole = roles.contains(requiredRole);

            // Special case: ROLE_ADMIN has access to Warden portal
            if (requiredRole.equals("ROLE_WARDEN") && roles.contains("ROLE_ADMIN")) {
                hasRequiredRole = true;
            }

            if (!hasRequiredRole) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Unauthorized role for this portal. Please select the correct portal tab."));
            }
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getFullName(),
                userDetails.getPhone(),
                userDetails.getAvatarUrl(),
                roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .fullName(signUpRequest.getFullName())
                .phone(signUpRequest.getPhone())
                .avatarUrl(signUpRequest.getAvatarUrl())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName("ROLE_STUDENT")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                    case "ROLE_ADMIN":
                        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "warden":
                    case "ROLE_WARDEN":
                        Role wardenRole = roleRepository.findByName("ROLE_WARDEN")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(wardenRole);
                        break;
                    case "parent":
                    case "ROLE_PARENT":
                        Role parentRole = roleRepository.findByName("ROLE_PARENT")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(parentRole);
                        break;
                    case "security":
                    case "ROLE_SECURITY":
                        Role secRole = roleRepository.findByName("ROLE_SECURITY")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(secRole);
                        break;
                    default:
                        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(studentRole);
                }
            });
        }

        user.setRoles(roles);

        // Save User
        User savedUser = userRepository.save(user);

        // If Student role, also save Student entity
        boolean isStudent = roles.stream().anyMatch(r -> r.getName().equals("ROLE_STUDENT"));
        if (isStudent) {
            Student student = Student.builder()
                    .user(savedUser)
                    .enrollmentNo(signUpRequest.getEnrollmentNo() != null ? signUpRequest.getEnrollmentNo() : "STU-" + System.currentTimeMillis())
                    .course(signUpRequest.getCourse())
                    .year(signUpRequest.getYear())
                    .department(signUpRequest.getDepartment())
                    .gender(signUpRequest.getGender())
                    .emergencyContact(signUpRequest.getEmergencyContact())
                    .parentName(signUpRequest.getParentName())
                    .parentPhone(signUpRequest.getParentPhone())
                    .parentEmail(signUpRequest.getParentEmail())
                    .address(signUpRequest.getAddress())
                    .createdAt(LocalDateTime.now())
                    .build();
            studentRepository.save(student);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
