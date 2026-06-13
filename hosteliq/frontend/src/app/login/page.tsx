"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Direct call to Backend AuthController
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        let errMsg = "Invalid email, password, or server offline.";
        try {
          const errData = await response.json();
          if (errData && errData.message) {
            errMsg = errData.message;
          }
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      
      // Save user session in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id.toString());
      localStorage.setItem("email", data.email);
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("roles", JSON.stringify(data.roles));
      localStorage.setItem("avatarUrl", data.avatarUrl || "");

      // Redirect based on selected role / returned role
      const roles = data.roles || [];
      if (roles.includes("ROLE_ADMIN")) {
        router.push("/warden/dashboard"); // Route to warden for simplicity in demo
      } else if (roles.includes("ROLE_WARDEN")) {
        router.push("/warden/dashboard");
      } else if (roles.includes("ROLE_PARENT")) {
        router.push("/parent/dashboard");
      } else if (roles.includes("ROLE_SECURITY")) {
        router.push("/security/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      console.warn("Backend Login failed. Falling back to Demo Credentials for Hackathon presentation...", err);
      
      // If the error message is specifically about the unauthorized role (thrown from backend response),
      // we shouldn't bypass it with demo credentials. We should display it!
      if (err.message && err.message.includes("Unauthorized role")) {
        setError(err.message);
        setLoading(false);
        return;
      }

      // Seed fallback credentials for seamless demo presentation when offline
      const demoEmail = email.toLowerCase().trim();
      if (demoEmail === "student@hosteliq.com" && password === "Student@123") {
        if (role !== "ROLE_STUDENT") {
          setError("Error: Unauthorized role for this portal. Please select the correct portal tab.");
          setLoading(false);
          return;
        }
        localStorage.setItem("token", "mock-student-token-jwt-12345");
        localStorage.setItem("userId", "8");
        localStorage.setItem("email", "student@hosteliq.com");
        localStorage.setItem("fullName", "Arjun Mehta");
        localStorage.setItem("roles", JSON.stringify(["ROLE_STUDENT"]));
        router.push("/student/dashboard");
      } else if (demoEmail === "parent@hosteliq.com" && password === "Parent@123") {
        if (role !== "ROLE_PARENT") {
          setError("Error: Unauthorized role for this portal. Please select the correct portal tab.");
          setLoading(false);
          return;
        }
        localStorage.setItem("token", "mock-parent-token-jwt-77777");
        localStorage.setItem("userId", "9");
        localStorage.setItem("email", "parent@hosteliq.com");
        localStorage.setItem("fullName", "Suresh Mehta");
        localStorage.setItem("roles", JSON.stringify(["ROLE_PARENT"]));
        router.push("/parent/dashboard");
      } else if (demoEmail === "warden1@hosteliq.com" && password === "Warden@123") {
        if (role !== "ROLE_WARDEN") {
          setError("Error: Unauthorized role for this portal. Please select the correct portal tab.");
          setLoading(false);
          return;
        }
        localStorage.setItem("token", "mock-warden-token-jwt-54321");
        localStorage.setItem("userId", "3");
        localStorage.setItem("email", "warden1@hosteliq.com");
        localStorage.setItem("fullName", "Dr. Ramesh Sharma");
        localStorage.setItem("roles", JSON.stringify(["ROLE_WARDEN"]));
        router.push("/warden/dashboard");
      } else if (demoEmail === "security@hosteliq.com" && password === "Security@123") {
        if (role !== "ROLE_SECURITY") {
          setError("Error: Unauthorized role for this portal. Please select the correct portal tab.");
          setLoading(false);
          return;
        }
        localStorage.setItem("token", "mock-security-token-jwt-99999");
        localStorage.setItem("userId", "2");
        localStorage.setItem("email", "security@hosteliq.com");
        localStorage.setItem("fullName", "Main Gate Security");
        localStorage.setItem("roles", JSON.stringify(["ROLE_SECURITY"]));
        router.push("/security/dashboard");
      } else {
        setError(err.message || "Invalid credentials. Try student@hosteliq.com (Student@123) or warden1@hosteliq.com (Warden@123).");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col justify-center items-center p-6 font-sans">
      {/* Background glow elements */}
      <div className="bg-glow-indigo top-[10%] left-[10%]"></div>
      <div className="bg-glow-violet bottom-[10%] right-[10%]"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-xl shadow-violet-500/20">
            HΩ
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sign in to <span className="text-violet-500">HostelIQ</span>
          </h1>
          <p className="text-sm text-gray-400">AI-Powered Smart Hostel Operating System</p>
        </div>

        {/* Login Form Card */}
        <div className="glow-card p-8 bg-zinc-950/80 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
                {error}
              </div>
            )}

            {/* Role selection tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Portal Access</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "ROLE_STUDENT", label: "Student" },
                  { id: "ROLE_PARENT", label: "Parent" },
                  { id: "ROLE_WARDEN", label: "Warden" },
                  { id: "ROLE_SECURITY", label: "Security" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRole(t.id)}
                    className={`py-2 px-1 text-center text-4xs sm:text-3xs font-medium rounded-lg border transition-all ${
                      role === t.id
                        ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20"
                        : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  placeholder="student@hosteliq.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Authenticating...
                </>
              ) : (
                <>
                  Enter Portal <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick info tip for judges */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-500 space-y-1.5">
            <div className="flex items-center justify-center gap-1 text-violet-400/80 font-medium">
              <Sparkles size={12} /> Hackathon Sandbox Accounts
            </div>
            <p>Student: <span className="text-gray-400">student@hosteliq.com</span> / <span className="text-gray-400">Student@123</span></p>
            <p>Parent: <span className="text-gray-400">parent@hosteliq.com</span> / <span className="text-gray-400">Parent@123</span></p>
            <p>Warden: <span className="text-gray-400">warden1@hosteliq.com</span> / <span className="text-gray-400">Warden@123</span></p>
            <p>Security: <span className="text-gray-400">security@hosteliq.com</span> / <span className="text-gray-400">Security@123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
