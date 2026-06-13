import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBCrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnqK";
        String[] passwords = {
            "Admin@123", "Warden@123", "Security@123", "password", 
            "Student@123", "Parent@123", "admin", "warden", "security"
        };
        for (String p : passwords) {
            if (encoder.matches(p, hash)) {
                System.out.println("MATCH FOUND: " + p);
                return;
            }
        }
        System.out.println("NO MATCH FOUND");
    }
}
