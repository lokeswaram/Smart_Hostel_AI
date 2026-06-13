"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Users,
  UserCheck,
  Shield,
  Activity,
  LogOut,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
  Scan,
  UserPlus
} from "lucide-react";

export default function SecurityDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("scan");

  // Scan state
  const [passCodeInput, setPassCodeInput] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState("");
  const [scanLoading, setScanLoading] = useState(false);

  // Visitors State
  const [visitors, setVisitors] = useState<any[]>([]);
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorRelation, setVisitorRelation] = useState("");
  const [visitorPurpose, setVisitorPurpose] = useState("");
  const [targetStudentId, setTargetStudentId] = useState("1"); // Default Arjun
  const [securityUserId, setSecurityUserId] = useState("2");
  const [securityName, setSecurityName] = useState("Main Gate Security");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("fullName") || "Main Gate Security";
    const storedId = localStorage.getItem("userId") || "2";

    setSecurityName(storedName);
    setSecurityUserId(storedId);

    if (!token) {
      router.push("/login");
      return;
    }

    fetchVisitorLogs();
  }, []);

  const fetchVisitorLogs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/visitors", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVisitors(data);
      }
    } catch (err) {
      console.warn("Backend offline, seeding mock visitor logs...", err);
      setVisitors([
        { id: 1, student: { user: { fullName: "Arjun Mehta" } }, visitorName: "Suresh Mehta", visitorPhone: "9000000200", relation: "FATHER", purpose: "Delivering books", checkInTime: "2026-06-13T10:00:00", checkOutTime: null, status: "CHECKED_IN" }
      ]);
    }
  };

  const handleScanPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passCodeInput.trim()) return;

    setScanLoading(true);
    setScanResult(null);
    setScanError("");

    try {
      const res = await fetch(`http://localhost:8080/api/v1/gatepasses/scan/${passCodeInput.toUpperCase()}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid or Expired pass.");
      }

      const data = await res.json();
      setScanResult(data);
      setPassCodeInput("");
    } catch (err: any) {
      console.warn("Backend scanning offline. Running client mock scanning response...", err);
      // Mock scanner simulation
      const code = passCodeInput.toUpperCase().trim();
      if (code === "GP-VBH-CSE-001") {
        setScanResult({
          passCode: "GP-VBH-CSE-001",
          student: { user: { fullName: "Arjun Mehta" } },
          status: "ACTIVE",
          validFrom: "2026-06-18T00:00:00",
          validUntil: "2026-06-28T23:59:59",
          exitScannedAt: "2026-06-13T15:15:00",
          entryScannedAt: null
        });
      } else {
        setScanError("Pass not found or expired in mock database. Hint: Try GP-VBH-CSE-001");
      }
    } finally {
      setScanLoading(false);
    }
  };

  const handleVisitorCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/v1/visitors/check-in/${targetStudentId}?securityUserId=${securityUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          visitorName,
          visitorPhone,
          relation: visitorRelation,
          purpose: visitorPurpose
        })
      });
      if (res.ok) {
        alert("Visitor Checked In!");
        setVisitorName("");
        setVisitorPhone("");
        setVisitorRelation("");
        setVisitorPurpose("");
        fetchVisitorLogs();
      } else {
        throw new Error();
      }
    } catch {
      const mockNew = {
        id: visitors.length + 1,
        student: { user: { fullName: "Arjun Mehta" } },
        visitorName,
        visitorPhone,
        relation: visitorRelation,
        purpose: visitorPurpose,
        checkInTime: new Date().toISOString(),
        checkOutTime: null,
        status: "CHECKED_IN"
      };
      setVisitors([mockNew, ...visitors]);
      setVisitorName("");
      setVisitorPhone("");
      setVisitorRelation("");
      setVisitorPurpose("");
      alert("Mock Action: Visitor logged (Checked In).");
    }
  };

  const handleVisitorCheckOut = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/visitors/check-out/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Visitor Checked Out!");
        fetchVisitorLogs();
      } else {
        throw new Error();
      }
    } catch {
      setVisitors(visitors.map(v => v.id === id ? { ...v, status: "CHECKED_OUT", checkOutTime: new Date().toISOString() } : v));
      alert("Mock Action: Visitor marked Checked Out.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#030303] text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-white/5 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white">
              HΩ
            </div>
            <span className="font-bold tracking-tight text-white">
              HOSTEL<span className="text-violet-500">IQ</span>
            </span>
          </div>

          <nav className="space-y-1">
            {[
              { id: "scan", label: "Gate Scanner", icon: Scan },
              { id: "visitors", label: "Visitor Desk", icon: UserPlus },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
              SG
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{securityName}</div>
              <div className="text-xs text-gray-500">Gate Security</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 rounded-xl text-sm font-medium text-gray-400 transition-all cursor-pointer"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* TAB 1: GATE SCANNER */}
        {activeTab === "scan" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Smart Gate Scanner</h1>
              <p className="text-sm text-gray-400">Scan student leave QR codes to log check-outs and check-ins automatically.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Scan form */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pass Code Input</h3>
                <form onSubmit={handleScanPass} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. GP-VBH-CSE-001"
                      value={passCodeInput}
                      onChange={(e) => setPassCodeInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 uppercase"
                    />
                    <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      <QrCode size={20} />
                    </button>
                  </div>
                  <button type="submit" className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs cursor-pointer">
                    Verify & Scan Pass
                  </button>
                </form>

                {scanError && (
                  <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 flex items-center gap-2">
                    <AlertTriangle size={16} /> {scanError}
                  </div>
                )}
              </div>

              {/* Scan Results display */}
              {scanResult ? (
                <div className="glow-card p-6 bg-zinc-950/80 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-xs font-bold text-violet-400 uppercase">Verification Success</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 font-semibold text-2xs">Authorized</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Student:</span>
                      <span className="font-bold text-white">{scanResult.student?.user?.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pass Code:</span>
                      <span className="font-bold text-white">{scanResult.passCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Scan Status:</span>
                      <span className="font-bold text-violet-400">
                        {scanResult.exitScannedAt && !scanResult.entryScannedAt ? "EXIT RECORDED" : "ENTRY RECORDED / CLOSED"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-3xs text-gray-500 pt-3 border-t border-white/5">
                    <div>
                      <div>Exit Scan:</div>
                      <div className="text-white font-bold mt-0.5">{scanResult.exitScannedAt || "Pending"}</div>
                    </div>
                    <div>
                      <div>Entry Scan:</div>
                      <div className="text-white font-bold mt-0.5">{scanResult.entryScannedAt || "Pending"}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 border border-dashed border-white/10 rounded-xl text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-2">
                  <Scan size={32} />
                  Waiting to scan a pass. Use mock pass: GP-VBH-CSE-001
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: VISITOR DESK */}
        {activeTab === "visitors" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Visitor Registry</h1>
              <p className="text-sm text-gray-400">Log hostlers' guardians and guests upon check-in and check-out.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Check in Form */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log Check In</h3>
                <form onSubmit={handleVisitorCheckIn} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Visitor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh Mehta"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9000000200"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Relation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Father"
                      value={visitorRelation}
                      onChange={(e) => setVisitorRelation(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Purpose</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Deliving items"
                      value={visitorPurpose}
                      onChange={(e) => setVisitorPurpose(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs cursor-pointer transition-all">
                    Register Check In
                  </button>
                </form>
              </div>

              {/* Logs registry list */}
              <div className="md:col-span-2 glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Visitors</h3>
                <div className="space-y-3">
                  {visitors.map((v) => (
                    <div key={v.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] flex items-center justify-between">
                      <div className="space-y-1.5 text-xs">
                        <div className="font-bold text-white">{v.visitorName} ({v.relation})</div>
                        <div className="text-gray-400">Visiting Student: {v.student?.user?.fullName}</div>
                        <div className="text-3xs text-gray-500 flex items-center gap-1.5">
                          <Clock size={12} /> In: {v.checkInTime} {v.checkOutTime ? `| Out: ${v.checkOutTime}` : ""}
                        </div>
                      </div>

                      {v.status === "CHECKED_IN" ? (
                        <button
                          onClick={() => handleVisitorCheckOut(v.id)}
                          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-3xs font-semibold rounded-lg text-white cursor-pointer"
                        >
                          Check Out
                        </button>
                      ) : (
                        <span className="text-4xs font-bold px-2 py-0.5 rounded bg-gray-500/10 text-gray-400">CLOSED</span>
                      )}
                    </div>
                  ))}
                  {visitors.length === 0 && <p className="text-xs text-gray-500 text-center py-6">No visitor records active.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
