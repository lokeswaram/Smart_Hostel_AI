"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Home,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Zap,
  UserCheck,
  TrendingUp,
  Activity,
  LogOut
} from "lucide-react";

export default function WardenDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Metrics State
  const [metrics, setMetrics] = useState<any>({
    totalStudents: 100,
    totalBeds: 35,
    occupiedBeds: 30,
    occupancyRate: 85.7,
    openComplaints: 4,
    resolvedComplaints: 28,
    pendingLeaves: 1,
    approvedLeaves: 2,
    revenueCollected: 1800000,
    pendingRevenue: 60000
  });

  // Database lists
  const [complaints, setComplaints] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [wardenName, setWardenName] = useState("Dr. Ramesh Sharma");
  const [wardenUserId, setWardenUserId] = useState("3");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedWardenName = localStorage.getItem("fullName") || "Dr. Ramesh Sharma";
    const storedWardenId = localStorage.getItem("userId") || "3";
    
    setWardenName(storedWardenName);
    setWardenUserId(storedWardenId);

    if (!token) {
      router.push("/login");
      return;
    }

    fetchWardenData();
  }, []);

  const fetchWardenData = async () => {
    try {
      // 1. Live metrics
      const metricsRes = await fetch("http://localhost:8080/api/v1/analytics/live", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (metricsRes.ok) {
        const mData = await metricsRes.json();
        setMetrics(mData);
      }

      // 2. All complaints
      const complaintsRes = await fetch("http://localhost:8080/api/v1/complaints", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (complaintsRes.ok) {
        const cData = await complaintsRes.json();
        setComplaints(cData);
      }

      // 3. All leaves
      const leavesRes = await fetch("http://localhost:8080/api/v1/leaves", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (leavesRes.ok) {
        const lData = await leavesRes.json();
        setLeaves(lData);
      }
    } catch (err) {
      console.warn("Backend offline, seeding mock Warden logs...", err);
      // Seeding mock lists
      setComplaints([
        { id: 1, student: { user: { fullName: "Arjun Mehta" } }, room: { roomNumber: "A-101" }, title: "Water heater in Block A bathroom not working", description: "Geyser is cold for two days now.", category: "WATER", priority: "HIGH", status: "IN_PROGRESS", aiCategory: "WATER", aiPriority: "HIGH", aiEtaHours: 12, aiConfidence: 0.96 },
        { id: 2, student: { user: { fullName: "Rahul Sharma" } }, room: { roomNumber: "A-102" }, title: "Fan makes rattling noise", description: "Spinning slow and clicks.", category: "ELECTRICAL", priority: "MEDIUM", status: "OPEN", aiCategory: "ELECTRICAL", aiPriority: "MEDIUM", aiEtaHours: 24, aiConfidence: 0.92 },
        { id: 3, student: { user: { fullName: "Sneha Gupta" } }, room: { roomNumber: "G-101" }, title: "Mess food is completely uncooked", description: "Chole was raw.", category: "MESS", priority: "HIGH", status: "OPEN", aiCategory: "MESS", aiPriority: "HIGH", aiEtaHours: 4, aiConfidence: 0.94 }
      ]);
      setLeaves([
        { id: 3, student: { user: { fullName: "Sneha Gupta" }, enrollmentNo: "210101003" }, reason: "Weekend outing to local mall", leaveFrom: "2026-06-14", leaveTo: "2026-06-14", destination: "Jaipur City Mall", status: "PENDING" },
        { id: 1, student: { user: { fullName: "Arjun Mehta" }, enrollmentNo: "210101001" }, reason: "End of term vacation", leaveFrom: "2026-06-18", leaveTo: "2026-06-28", destination: "Delhi", status: "APPROVED" }
      ]);
      setRooms([
        { id: 101, roomNumber: "A-101", floor: 1, roomType: "DOUBLE", status: "FULL", block: { name: "Block A" } },
        { id: 102, roomNumber: "A-102", floor: 1, roomType: "DOUBLE", status: "AVAILABLE", block: { name: "Block A" } },
        { id: 103, roomNumber: "B-201", floor: 2, roomType: "SINGLE", status: "FULL", block: { name: "Block B" } },
        { id: 104, roomNumber: "G-101", floor: 1, roomType: "DOUBLE", status: "AVAILABLE", block: { name: "Block G" } }
      ]);
    }
  };

  const handleApproveLeave = async (id: number) => {
    const remarks = prompt("Enter approval remarks (optional):") || "Approved by Warden";
    try {
      const res = await fetch(`http://localhost:8080/api/v1/leaves/${id}/status?status=APPROVED&remarks=${encodeURIComponent(remarks)}&wardenUserId=${wardenUserId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Leave approved and gate pass generated!");
        fetchWardenData();
      } else {
        throw new Error();
      }
    } catch {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: "APPROVED" } : l));
      alert("Mock Action: Leave approved and pass generated successfully.");
    }
  };

  const handleRejectLeave = async (id: number) => {
    const remarks = prompt("Enter rejection remarks:") || "Rejected by Warden";
    try {
      const res = await fetch(`http://localhost:8080/api/v1/leaves/${id}/status?status=REJECTED&remarks=${encodeURIComponent(remarks)}&wardenUserId=${wardenUserId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Leave request rejected.");
        fetchWardenData();
      } else {
        throw new Error();
      }
    } catch {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: "REJECTED" } : l));
      alert("Mock Action: Leave request rejected.");
    }
  };

  const handleUpdateComplaintStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/complaints/${id}/status?status=${status}&wardenUserId=${wardenUserId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Complaint ticket updated!");
        fetchWardenData();
      } else {
        throw new Error();
      }
    } catch {
      setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));
      alert(`Mock Action: Ticket marked as ${status}.`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#030303] text-gray-100 font-sans">
      {/* Sidebar Navigation */}
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
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "leaves", label: "Leave Requests", icon: FileText },
              { id: "complaints", label: "Complaints Hub", icon: MessageSquare },
              { id: "rooms", label: "Rooms & Beds", icon: Home },
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

        {/* User Card */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
              {wardenName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-white truncate max-w-[120px]">{wardenName}</div>
              <div className="text-xs text-gray-500">Warden Portal</div>
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

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* TAB 1: DASHBOARD METRICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Warden Operations</h1>
              <p className="text-sm text-gray-400">Live operational stats, alerts, and occupancy indicators.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10">
                <div className="text-xs text-gray-400 font-semibold uppercase">Total Students</div>
                <div className="text-2xl font-extrabold text-white mt-1">{metrics.totalStudents}</div>
                <div className="text-3xs text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp size={10} /> Active registrations
                </div>
              </div>

              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10">
                <div className="text-xs text-gray-400 font-semibold uppercase">Occupancy Rate</div>
                <div className="text-2xl font-extrabold text-white mt-1">{metrics.occupancyRate}%</div>
                <div className="text-3xs text-gray-500 mt-2">
                  {metrics.occupiedBeds} / {metrics.totalBeds} Beds Filled
                </div>
              </div>

              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10">
                <div className="text-xs text-gray-400 font-semibold uppercase">Open Tickets</div>
                <div className="text-2xl font-extrabold text-violet-400 mt-1">{metrics.openComplaints}</div>
                <div className="text-3xs text-violet-400 mt-2 cursor-pointer hover:underline" onClick={() => setActiveTab("complaints")}>
                  Manage tickets →
                </div>
              </div>

              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10">
                <div className="text-xs text-gray-400 font-semibold uppercase">Pending Leaves</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">{metrics.pendingLeaves}</div>
                <div className="text-3xs text-amber-400 mt-2 cursor-pointer hover:underline" onClick={() => setActiveTab("leaves")}>
                  Review approvals →
                </div>
              </div>
            </div>

            {/* Quick Actions / Alerts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Leaves Requiring Attention</h3>
                <div className="space-y-3">
                  {leaves.filter(l => l.status === "PENDING").map((l) => (
                    <div key={l.id} className="p-3.5 rounded-xl bg-white/5 border border-white/[0.02] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{l.student?.user?.fullName} <span className="text-3xs text-gray-500">({l.student?.enrollmentNo})</span></div>
                        <div className="text-gray-500 text-3xs">{l.reason} ({l.leaveFrom}) | Room: {l.roomNumber || "N/A"}</div>
                      </div>
                      <button
                        onClick={() => setActiveTab("leaves")}
                        className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-3xs font-semibold rounded-lg text-white transition-all"
                      >
                        Action
                      </button>
                    </div>
                  ))}
                  {leaves.filter(l => l.status === "PENDING").length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-4">No pending leave requests.</p>
                  )}
                </div>
              </div>

              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent System Alerts</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex gap-2">
                    <AlertTriangle size={16} className="shrink-0" />
                    <div>
                      <div className="font-semibold">Unresolved High Priority Complaint</div>
                      <p className="text-3xs opacity-80 mt-0.5">Water heater malfunction has been open for &gt;12 hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEAVE REQUESTS */}
        {activeTab === "leaves" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Leave Approval Hub</h1>
              <p className="text-sm text-gray-400">Review student vacation, trip, and holiday leave requests.</p>
            </div>

            <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Leave Application Logs</h3>
              <div className="space-y-4">
                {leaves.map((l) => (
                  <div key={l.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{l.student?.user?.fullName}</span>
                        <span className="text-3xs text-gray-500">({l.student?.enrollmentNo})</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-3xs text-gray-400">Room: {l.roomNumber || "N/A"}</span>
                      </div>
                      <p className="text-xs text-gray-400">Reason: {l.reason} | Destination: {l.destination}</p>
                      <div className="text-2xs text-gray-500 flex items-center gap-1.5">
                        <Clock size={12} /> {l.leaveFrom} to {l.leaveTo}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {l.status === "PENDING" ? (
                        <>
                          <button
                            onClick={() => handleApproveLeave(l.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold rounded-xl text-white flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectLeave(l.id)}
                            className="px-4 py-2 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      ) : (
                        <span className={`text-3xs font-bold px-3 py-1 rounded-full ${
                          l.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>{l.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPLAINTS HUB */}
        {activeTab === "complaints" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Complaint Dispatcher</h1>
              <p className="text-sm text-gray-400">Review ticket classifications and route resources to resolve issues.</p>
            </div>

            <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tickets Queue</h3>
              <div className="space-y-4">
                {complaints.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-white">{c.title}</h4>
                        <div className="text-3xs text-gray-500">
                          Student: {c.student?.user?.fullName} (ID: {c.student?.enrollmentNo}) | Room: {c.room?.roomNumber || "N/A"} | Category: {c.category} | Filed: {c.createdAt ? new Date(c.createdAt).toLocaleString() : "N/A"}
                        </div>
                      </div>
                      <span className={`text-3xs font-semibold px-2 py-0.5 rounded-full ${
                        c.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/10 text-violet-400"
                      }`}>{c.status}</span>
                    </div>

                    <p className="text-xs text-gray-400">{c.description}</p>

                    {/* AI details & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/5 text-3xs">
                      <div className="flex flex-wrap gap-2 font-medium">
                        <span className="px-2.5 py-1 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          AI Cat: {c.aiCategory}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          AI Priority: {c.aiPriority}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                          <Clock size={10} /> ETA: {c.aiEtaHours} hours
                        </span>
                        <span className="px-2.5 py-1 rounded bg-white/5 text-gray-400">
                          Conf: {Math.round(c.aiConfidence * 100)}%
                        </span>
                      </div>

                      {c.status !== "RESOLVED" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateComplaintStatus(c.id, "IN_PROGRESS")}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 font-semibold cursor-pointer"
                          >
                            Assign Progress
                          </button>
                          <button
                            onClick={() => handleUpdateComplaintStatus(c.id, "RESOLVED")}
                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle size={10} /> Resolve Ticket
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ROOMS & BEDS */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Rooms and Occupancy</h1>
              <p className="text-sm text-gray-400">View layouts, single/double/triple bed assignments, and occupancy.</p>
            </div>

            <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Inventory Log</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {rooms.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{r.roomNumber} ({r.block?.name})</span>
                      <span className={`text-4xs font-semibold px-2 py-0.5 rounded-full ${
                        r.status === "FULL" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>{r.status}</span>
                    </div>

                    <div className="text-3xs text-gray-400 space-y-1">
                      <div>Type: {r.roomType} Room</div>
                      <div>Floor: {r.floor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
