import bcrypt

print("Hashed Admin@123: ", bcrypt.hashpw(b"Admin@123", b"$2a$10$xn3LI/AjqicFYZFruSwve."))
print("Hashed Warden@123: ", bcrypt.hashpw(b"Warden@123", b"$2a$10$xn3LI/AjqicFYZFruSwve."))
print("Hashed Security@123: ", bcrypt.hashpw(b"Security@123", b"$2a$10$xn3LI/AjqicFYZFruSwve."))
print("Hashed Student@123: ", bcrypt.hashpw(b"Student@123", b"$2a$10$xn3LI/AjqicFYZFruSwve."))
print("Hashed admin123: ", bcrypt.hashpw(b"admin123", b"$2a$10$xn3LI/AjqicFYZFruSwve."))
print("Hashed warden123: ", bcrypt.hashpw(b"warden123", b"$2a$10$xn3LI/AjqicFYZFruSwve."))
