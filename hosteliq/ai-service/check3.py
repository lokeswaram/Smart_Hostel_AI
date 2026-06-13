import bcrypt

hash_val = b"$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK"

candidates = [
    "Admin123", "Warden123", "Security123", "Student123", "Parent123",
    "admin123", "warden123", "security123", "student123", "parent123",
    "Admin", "Warden", "Security", "Student", "Parent",
    "admin", "warden", "security", "student", "parent",
    "Admin@123", "Warden@123", "Security@123", "Student@123", "Parent@123",
    "admin@123", "warden@123", "security@123", "student@123", "parent@123",
    "Admin@1234", "Warden@1234", "Security@1234", "Student@1234", "Parent@1234",
    "admin@1234", "warden@1234", "security@1234", "student@1234", "parent@1234",
    "hosteliq", "HostelIQ", "HostelIq", "hosteliq123", "HostelIQ@123",
    "Admin User", "Dr. Ramesh Sharma", "warden1@hosteliq.com", "admin@hosteliq.com",
    "123456", "12345678", "12345", "1234", "123"
]

for c in candidates:
    if bcrypt.checkpw(c.encode("utf-8"), hash_val):
        print(f"MATCH: {c}")
        break
else:
    print("NO MATCH FOUND IN LIST")
