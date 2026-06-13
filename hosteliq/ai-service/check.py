import bcrypt

hash_val = b"$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK"
candidates = ["Admin@123", "Warden@123", "Security@123", "password", "admin", "warden", "security"]

for c in candidates:
    try:
        match = bcrypt.checkpw(c.encode("utf-8"), hash_val)
        print(f"{c}: {match}")
    except Exception as e:
        print(f"{c} Error: {e}")
