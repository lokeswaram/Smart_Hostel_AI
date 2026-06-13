-- ============================================================
-- HOSTELIQ – Seed Data
-- Passwords are BCrypt hashed → plain text in comments
-- ============================================================

-- ──────────────────────────────────────────────
-- USERS  (password = BCrypt of values shown)
-- admin@hosteliq.com     → Admin@123
-- warden@hosteliq.com    → Warden@123
-- student@hosteliq.com   → Student@123
-- parent@hosteliq.com    → Parent@123
-- ──────────────────────────────────────────────
INSERT INTO users (email, password, role, full_name, phone) VALUES
('admin@hosteliq.com',   '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK', 'ROLE_ADMIN',   'Admin User',       '9000000001'),
('warden@hosteliq.com',  '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK', 'ROLE_WARDEN',  'Dr. Ramesh Sharma','9000000002'),
('student@hosteliq.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_STUDENT', 'Arjun Mehta',      '9000000003'),
('parent@hosteliq.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_PARENT',  'Suresh Mehta',     '9000000004'),
('student2@hosteliq.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_STUDENT', 'Priya Singh',      '9000000005'),
('warden2@hosteliq.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK', 'ROLE_WARDEN',  'Ms. Kavita Rao',   '9000000006');

-- ──────────────────────────────────────────────
-- HOSTELS
-- ──────────────────────────────────────────────
INSERT INTO hostels (name, code, type, total_rooms, warden_id, address) VALUES
('Vivekananda Boys Hostel',  'VBH', 'BOYS',  120, 2, 'Block A, MUJ Campus, Jaipur'),
('Saraswati Girls Hostel',   'SGH', 'GIRLS', 100, 6, 'Block B, MUJ Campus, Jaipur');

-- ──────────────────────────────────────────────
-- ROOMS
-- ──────────────────────────────────────────────
INSERT INTO rooms (hostel_id, room_number, block, floor, capacity, occupied, room_type, status) VALUES
(1, 'A-101', 'A', 1, 2, 2, 'DOUBLE', 'FULL'),
(1, 'A-102', 'A', 1, 2, 1, 'DOUBLE', 'AVAILABLE'),
(1, 'A-103', 'A', 1, 2, 0, 'DOUBLE', 'AVAILABLE'),
(1, 'A-201', 'A', 2, 2, 2, 'DOUBLE', 'FULL'),
(1, 'A-202', 'A', 2, 2, 1, 'DOUBLE', 'AVAILABLE'),
(1, 'B-101', 'B', 1, 3, 3, 'TRIPLE', 'FULL'),
(1, 'B-102', 'B', 1, 3, 2, 'TRIPLE', 'AVAILABLE'),
(1, 'C-101', 'C', 1, 1, 0, 'SINGLE', 'AVAILABLE'),
(2, 'G-101', 'G', 1, 2, 2, 'DOUBLE', 'FULL'),
(2, 'G-102', 'G', 1, 2, 0, 'DOUBLE', 'AVAILABLE');

-- ──────────────────────────────────────────────
-- STUDENTS
-- ──────────────────────────────────────────────
INSERT INTO students (user_id, enrollment_no, course, year, department, gender, parent_name, parent_phone, parent_email) VALUES
(3, '210101001', 'B.Tech CSE', 3, 'Computer Science', 'MALE',   'Suresh Mehta',  '9000000004', 'parent@hosteliq.com'),
(5, '210101002', 'B.Tech ECE', 2, 'Electronics',      'FEMALE', 'Anita Singh',   '9000000007', 'anitasingh@gmail.com');

-- ──────────────────────────────────────────────
-- PARENTS
-- ──────────────────────────────────────────────
INSERT INTO parents (user_id, student_id, relation) VALUES
(4, 1, 'FATHER');

-- ──────────────────────────────────────────────
-- ROOM ASSIGNMENTS
-- ──────────────────────────────────────────────
INSERT INTO room_assignments (student_id, room_id, is_active) VALUES
(1, 1, TRUE),
(2, 9, TRUE);

-- ──────────────────────────────────────────────
-- COMPLAINTS
-- ──────────────────────────────────────────────
INSERT INTO complaints (student_id, room_id, title, description, category, priority, status, ai_category, ai_priority, ai_eta_hours, ai_confidence) VALUES
(1, 1, 'Fan not working',       'The ceiling fan in room A-101 has stopped working since last night.',      'ELECTRICAL', 'HIGH',   'IN_PROGRESS', 'ELECTRICAL', 'HIGH',   4,  0.95),
(1, 1, 'Room needs cleaning',   'The common bathroom on floor 1 has not been cleaned in 3 days.',           'CLEANING',   'MEDIUM', 'OPEN',        'CLEANING',   'MEDIUM', 12, 0.91),
(1, 1, 'WiFi is very slow',     'Internet speed drops drastically after 8 PM making it hard to study.',     'WIFI',       'HIGH',   'OPEN',        'WIFI',       'HIGH',   6,  0.88),
(2, 9, 'Food quality is poor',  'The dinner served was undercooked and smelled bad on Tuesday.',             'FOOD',       'HIGH',   'OPEN',        'FOOD',       'HIGH',   8,  0.93),
(1, 1, 'Water leakage',         'There is a water leak in the bathroom pipe causing the floor to be wet.',  'PLUMBING',   'URGENT', 'RESOLVED',    'PLUMBING',   'URGENT', 2,  0.97);

-- ──────────────────────────────────────────────
-- LEAVE REQUESTS
-- ──────────────────────────────────────────────
INSERT INTO leave_requests (student_id, reason, leave_from, leave_to, destination, contact_during_leave, status, parent_notified) VALUES
(1, 'Going home for Diwali vacation',     '2026-06-20', '2026-06-25', 'Jaipur, Rajasthan', '9000000003', 'APPROVED', TRUE),
(1, 'Medical appointment with dentist',   '2026-06-15', '2026-06-15', 'City Hospital, Jaipur', '9000000003', 'PENDING', FALSE),
(2, 'Family function - sister marriage',  '2026-06-18', '2026-06-22', 'Udaipur, Rajasthan', '9000000005', 'APPROVED', TRUE);

-- ──────────────────────────────────────────────
-- MESS SCHEDULE
-- ──────────────────────────────────────────────
INSERT INTO mess_schedule (hostel_id, day_of_week, meal_type, menu, timing) VALUES
(1, 'MONDAY',    'BREAKFAST', 'Poha, Chai, Banana',              '7:00 AM – 9:00 AM'),
(1, 'MONDAY',    'LUNCH',     'Dal Makhani, Rice, Roti, Salad',  '12:00 PM – 2:00 PM'),
(1, 'MONDAY',    'SNACKS',    'Samosa, Chai',                    '4:30 PM – 5:30 PM'),
(1, 'MONDAY',    'DINNER',    'Paneer Butter Masala, Roti, Rice','7:30 PM – 9:30 PM'),
(1, 'TUESDAY',   'BREAKFAST', 'Upma, Idli, Sambhar, Chai',       '7:00 AM – 9:00 AM'),
(1, 'TUESDAY',   'LUNCH',     'Chole, Rice, Roti, Raita',        '12:00 PM – 2:00 PM'),
(1, 'TUESDAY',   'SNACKS',    'Bread Pakora, Coffee',            '4:30 PM – 5:30 PM'),
(1, 'TUESDAY',   'DINNER',    'Mix Veg, Dal, Roti, Rice',        '7:30 PM – 9:30 PM'),
(1, 'WEDNESDAY', 'BREAKFAST', 'Paratha, Curd, Pickle, Chai',     '7:00 AM – 9:00 AM'),
(1, 'WEDNESDAY', 'LUNCH',     'Rajma, Rice, Roti, Salad',        '12:00 PM – 2:00 PM'),
(1, 'WEDNESDAY', 'SNACKS',    'Maggi, Chai',                     '4:30 PM – 5:30 PM'),
(1, 'WEDNESDAY', 'DINNER',    'Aloo Matar, Roti, Dal, Rice',     '7:30 PM – 9:30 PM'),
(1, 'THURSDAY',  'BREAKFAST', 'Dosa, Sambhar, Chutney, Chai',    '7:00 AM – 9:00 AM'),
(1, 'THURSDAY',  'LUNCH',     'Kadhi, Rice, Roti, Papad',        '12:00 PM – 2:00 PM'),
(1, 'THURSDAY',  'SNACKS',    'Vada Pav, Chai',                  '4:30 PM – 5:30 PM'),
(1, 'THURSDAY',  'DINNER',    'Shahi Paneer, Roti, Rice, Dal',   '7:30 PM – 9:30 PM'),
(1, 'FRIDAY',    'BREAKFAST', 'Poori, Aloo Sabji, Chai',         '7:00 AM – 9:00 AM'),
(1, 'FRIDAY',    'LUNCH',     'Dal Tadka, Rice, Roti, Salad',    '12:00 PM – 2:00 PM'),
(1, 'FRIDAY',    'SNACKS',    'Pakora, Tea',                     '4:30 PM – 5:30 PM'),
(1, 'FRIDAY',    'DINNER',    'Jeera Rice, Dal Makhani, Roti',   '7:30 PM – 9:30 PM'),
(1, 'SATURDAY',  'BREAKFAST', 'Chole Bhature, Chai',             '7:00 AM – 9:00 AM'),
(1, 'SATURDAY',  'LUNCH',     'Special Thali (Weekend)',         '12:00 PM – 2:00 PM'),
(1, 'SATURDAY',  'SNACKS',    'Pastry, Cold Coffee',             '4:30 PM – 5:30 PM'),
(1, 'SATURDAY',  'DINNER',    'Biryani, Raita, Salad',           '7:30 PM – 9:30 PM'),
(1, 'SUNDAY',    'BREAKFAST', 'Idli, Dosa, Chai',                '8:00 AM – 10:00 AM'),
(1, 'SUNDAY',    'LUNCH',     'Special Lunch (Paneer+Sweets)',    '12:30 PM – 2:30 PM'),
(1, 'SUNDAY',    'SNACKS',    'Juice, Biscuits',                 '4:30 PM – 5:30 PM'),
(1, 'SUNDAY',    'DINNER',    'Fried Rice, Manchurian, Roti',    '7:30 PM – 9:30 PM');

-- ──────────────────────────────────────────────
-- MESS FEEDBACK
-- ──────────────────────────────────────────────
INSERT INTO mess_feedback (student_id, meal_type, rating, feedback, date) VALUES
(1, 'LUNCH',   4, 'Dal makhani was great today!',   CURRENT_DATE - 1),
(1, 'DINNER',  3, 'Roti was a bit hard.',            CURRENT_DATE - 1),
(2, 'LUNCH',   2, 'Food was undercooked.',           CURRENT_DATE - 2),
(1, 'BREAKFAST', 5, 'Loved the poha today!',         CURRENT_DATE);

-- ──────────────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────────────
INSERT INTO notifications (user_id, title, message, type) VALUES
(3, 'Leave Approved',          'Your leave request for Diwali vacation has been approved!',       'SUCCESS'),
(3, 'Complaint Update',        'Your complaint about fan has been assigned to the maintenance team.','INFO'),
(4, 'Child Leave Notification','Arjun Mehta has applied for leave from Jun 20–25.',               'INFO'),
(3, 'Mess Feedback Reminder',  'Please submit your feedback for today''s meals.',                  'INFO'),
(4, 'Leave Approved',          'Arjun''s leave request for Diwali vacation has been approved!',   'SUCCESS');

-- ──────────────────────────────────────────────
-- ANALYTICS SNAPSHOT
-- ──────────────────────────────────────────────
INSERT INTO analytics (hostel_id, snapshot_date, total_students, total_rooms, occupied_rooms, open_complaints, resolved_complaints, pending_leaves, approved_leaves, mess_avg_rating) VALUES
(1, CURRENT_DATE, 1, 8, 4, 3, 1, 1, 1, 3.5),
(2, CURRENT_DATE, 1, 2, 1, 1, 0, 0, 1, 2.0);
