"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  CreditCard,
  QrCode,
  User,
  LogOut,
  Send,
  Zap,
  Clock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Student Profile / Allocation State
  const [student, setStudent] = useState<any>(null);
  const [allocation, setAllocation] = useState<any>(null);
  
  // Bills & Payments State
  const [invoices, setInvoices] = useState<any[]>([]);
  
  // Complaints State
  const [complaints, setComplaints] = useState<any[]>([]);
  const [newComplaintTitle, setNewComplaintTitle] = useState("");
  const [newComplaintDesc, setNewComplaintDesc] = useState("");
  const [creatingComplaint, setCreatingComplaint] = useState(false);
  
  // Leaves & Gate Pass State
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveDest, setLeaveDest] = useState("");
  const [gatePasses, setGatePasses] = useState<any[]>([]);
  
  // AI Assistant State
  const [chatMessages, setChatMessages] = useState<any[]>([
    { text: "Hello Arjun! I am your HostelIQ Smart Assistant. How can I help you today?", isBot: true }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Mess Crowd State
  const [messCrowd, setMessCrowd] = useState<any>(null);

  // Mock state when backend is offline
  const [userId, setUserId] = useState("8");
  const [userName, setUserName] = useState("Arjun Mehta");

  useEffect(() => {
    // Read session
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId") || "8";
    const name = localStorage.getItem("fullName") || "Arjun Mehta";
    
    setUserId(storedUserId);
    setUserName(name);

    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch initial data
    fetchStudentData(storedUserId);
    fetchMessCrowd();
  }, []);

  const fetchStudentData = async (uid: string) => {
    try {
      // 1. Profile
      const profRes = await fetch(`http://localhost:8080/api/v1/students/profile/${uid}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (profRes.ok) {
        const pData = await profRes.json();
        setStudent(pData);
      }

      // 2. Allocation
      const allocRes = await fetch(`http://localhost:8080/api/v1/students/allocation/${uid}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (allocRes.ok) {
        const aData = await allocRes.json();
        setAllocation(aData);
      }

      // 3. Invoices
      const invRes = await fetch(`http://localhost:8080/api/v1/payments/invoices/${uid}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (invRes.ok) {
        const iData = await invRes.json();
        setInvoices(iData);
      }

      // 4. Complaints
      const compRes = await fetch(`http://localhost:8080/api/v1/complaints/student/${uid}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (compRes.ok) {
        const cData = await compRes.json();
        setComplaints(cData);
      }

      // 5. Leaves
      const leaveRes = await fetch(`http://localhost:8080/api/v1/leaves/student/${uid}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (leaveRes.ok) {
        const lData = await leaveRes.json();
        setLeaves(lData);
      }

      // 6. Gate Passes
      const passRes = await fetch(`http://localhost:8080/api/v1/gatepasses/student/${uid}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (passRes.ok) {
        const gpData = await passRes.json();
        setGatePasses(gpData);
      }
    } catch (err) {
      console.warn("Backend endpoints offline. Seeding local mock data for client-side demo...", err);
      // Fallback Seed mock details locally
      setStudent({
        enrollmentNo: "210101001",
        course: "B.Tech CSE",
        year: 3,
        department: "Computer Science",
        gender: "MALE",
        emergencyContact: "9000000100",
        parentName: "Suresh Mehta",
        parentPhone: "9000000200",
        parentEmail: "parent@hosteliq.com",
        address: "Block A-101, MUJ Campus, Jaipur"
      });
      setAllocation({
        roomNumber: "A-101",
        floor: 1,
        roomType: "DOUBLE",
        blockName: "Block A",
        hostelName: "Vivekananda Boys Hostel",
        hostelCode: "VBH",
        electricityHistory: [
          { month: "May", year: 2026, unitsConsumed: 120.5, billAmount: 1205.00, isBilled: true },
          { month: "April", year: 2026, unitsConsumed: 110.2, billAmount: 1102.00, isBilled: true }
        ]
      });
      setInvoices([
        { id: 101, title: "Hostel Term Fee - Autumn 2026", amount: 60000.00, dueDate: "2026-07-15", status: "PENDING" },
        { id: 102, title: "Electricity Bill - May 2026", amount: 1205.00, dueDate: "2026-06-20", status: "PENDING" }
      ]);
      setComplaints([
        { id: 1, title: "Water heater in Block A bathroom not working", description: "Geyser is cold for two days now.", category: "WATER", priority: "HIGH", status: "IN_PROGRESS", aiCategory: "WATER", aiPriority: "HIGH", aiEtaHours: 12, aiConfidence: 0.96 },
        { id: 2, title: "Fan makes rattling noise", description: "Spinning slow and clicks.", category: "ELECTRICAL", priority: "MEDIUM", status: "OPEN", aiCategory: "ELECTRICAL", aiPriority: "MEDIUM", aiEtaHours: 24, aiConfidence: 0.92 }
      ]);
      setLeaves([
        { id: 1, reason: "End of term vacation", leaveFrom: "2026-06-18", leaveTo: "2026-06-28", destination: "Delhi", status: "APPROVED" }
      ]);
      setGatePasses([
        { id: 1, passCode: "GP-VBH-CSE-001", qrData: "HOSTELIQ-PASS:GP-VBH-CSE-001", validFrom: "2026-06-18T00:00:00", validUntil: "2026-06-28T23:59:59", status: "ACTIVE", exitScannedAt: null, entryScannedAt: null }
      ]);
    }
  };

  const fetchMessCrowd = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/ai/mess-crowd-alert");
      if (res.ok) {
        const data = await res.json();
        setMessCrowd(data);
      }
    } catch {
      setMessCrowd({
        status: "HIGHLY_CROWDED",
        crowd_density_percentage: 85,
        advice: "Lunch peak hours. Long wait lines (>15 mins). Best to visit after 1:30 PM."
      });
    }
  };

  const handlePayInvoice = async (invoiceId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/payments/pay/${invoiceId}?studentUserId=${userId}&paymentMethod=UPI`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Payment Processed Successfully!");
        fetchStudentData(userId);
      } else {
        throw new Error();
      }
    } catch {
      // Mock payment fallback
      setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: "PAID" } : inv));
      alert("Mock Payment Success! Invoice marked as paid.");
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingComplaint(true);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/complaints/student/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: newComplaintTitle,
          description: newComplaintDesc
        })
      });

      if (res.ok) {
        setNewComplaintTitle("");
        setNewComplaintDesc("");
        fetchStudentData(userId);
        alert("Complaint filed and parsed by AI Classifier!");
      } else {
        throw new Error();
      }
    } catch {
      // Offline fallback: simulate AI classification rules
      let category = "OTHER";
      let priority = "MEDIUM";
      let eta = 24;

      const titleLower = newComplaintTitle.toLowerCase();
      if (titleLower.includes("water") || titleLower.includes("leak") || titleLower.includes("tap")) {
        category = "WATER";
        priority = "HIGH";
        eta = 6;
      } else if (titleLower.includes("light") || titleLower.includes("fan") || titleLower.includes("power")) {
        category = "ELECTRICAL";
        priority = "HIGH";
        eta = 4;
      }

      const mockNew = {
        id: complaints.length + 1,
        title: newComplaintTitle,
        description: newComplaintDesc,
        category,
        priority,
        status: "OPEN",
        aiCategory: category,
        aiPriority: priority,
        aiEtaHours: eta,
        aiConfidence: 0.94
      };

      setComplaints([mockNew, ...complaints]);
      setNewComplaintTitle("");
      setNewComplaintDesc("");
      alert("Offline Mode: Complaint saved locally and processed by mock classifier!");
    } finally {
      setCreatingComplaint(false);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();

    const todayStr = new Date().toISOString().split("T")[0];
    
    // Rule 2: Past dates check
    if (leaveFrom < todayStr) {
      alert("Past dates are not allowed.");
      return;
    }

    // Rule 1: To Date must be >= From Date
    if (leaveTo < leaveFrom) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/leaves/student/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          reason: leaveReason,
          leaveFrom: leaveFrom,
          leaveTo: leaveTo,
          destination: leaveDest
        })
      });
      if (res.ok) {
        setLeaveReason("");
        setLeaveDest("");
        setLeaveFrom("");
        setLeaveTo("");
        fetchStudentData(userId);
        alert("Leave Request Submitted!");
      } else {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to submit leave request.");
      }
    } catch (err: any) {
      console.warn("Backend leave submission offline or failed, trying fallback...", err);
      if (err.message && (err.message.includes("date") || err.message.includes("allowed"))) {
        alert(err.message);
        return;
      }

      const mockNew = {
        id: leaves.length + 1,
        reason: leaveReason,
        leaveFrom,
        leaveTo,
        destination: leaveDest,
        status: "PENDING"
      };
      setLeaves([mockNew, ...leaves]);
      setLeaveReason("");
      setLeaveDest("");
      setLeaveFrom("");
      setLeaveTo("");
      alert("Offline Mode: Leave Request saved locally (Pending status).");
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { text: chatInput, isBot: false };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/ai/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, userId })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch {
      // Mock chat bot offline response fallback
      let response = "I'm offline right now, but feel free to ask about curfews, leave passes, wifi connections, or dining hall hours!";
      const text = userMsg.text.toLowerCase();
      if (text.includes("curfew") || text.includes("time")) {
        response = "Hostel IQ Curfew Check: Boys curfew is 10:30 PM. Girls curfew is 9:30 PM. Outings require a valid gate pass approved by your Warden.";
      } else if (text.includes("leave") || text.includes("pass")) {
        response = "Apply for leave using the 'Leave Requests' tab. Once Warden approves, your dashboard will generate a QR pass for scanning at the gate.";
      } else if (text.includes("wifi")) {
        response = "Student Wifi: Connect to 'MUJ-Secure' using your portal credentials.";
      }
      setChatMessages(prev => [...prev, { text: response, isBot: true }]);
    } finally {
      setChatLoading(false);
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
              { id: "complaints", label: "AI Complaints", icon: MessageSquare },
              { id: "leaves", label: "Leave Requests", icon: FileText },
              { id: "billing", label: "Billing & Bills", icon: CreditCard },
              { id: "gatepass", label: "Gate Passes", icon: QrCode },
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
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{userName}</div>
              <div className="text-xs text-gray-500">Student Portal</div>
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
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {userName}. Here is your room status.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Allocation Active
              </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Room details */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10">
                <div className="text-xs text-gray-400 font-medium uppercase">Active Room</div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {allocation ? allocation.roomNumber : "A-101"}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {allocation ? allocation.blockName : "Block A"} | {allocation ? allocation.hostelName : "Vivekananda Boys Hostel"}
                </div>
              </div>

              {/* Outstanding dues */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10">
                <div className="text-xs text-gray-400 font-medium uppercase">Outstanding Bills</div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  ₹{invoices.filter(i => i.status !== "PAID").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </div>
                <div className="text-xs text-violet-400 mt-2 hover:underline cursor-pointer" onClick={() => setActiveTab("billing")}>
                  View billing details →
                </div>
              </div>

              {/* Active gate pass */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10">
                <div className="text-xs text-gray-400 font-medium uppercase">Active Gate Pass</div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {gatePasses.filter(g => g.status === "ACTIVE").length > 0 ? "1 Active Pass" : "No Active Passes"}
                </div>
                <div className="text-xs text-indigo-400 mt-2 hover:underline cursor-pointer" onClick={() => setActiveTab("gatepass")}>
                  View passes →
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Mess Crowd forecast */}
              <div className="md:col-span-2 glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Dining Hall Crowds</h3>
                  <span className="px-2 py-0.5 text-2xs font-semibold rounded-full bg-violet-500/10 text-violet-400">AI Powered</span>
                </div>
                
                {messCrowd && (
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/[0.03]">
                    <div className="flex flex-col items-center justify-center p-4 rounded-full bg-violet-600/10 border border-violet-500/20 w-24 h-24">
                      <div className="text-2xl font-black text-violet-400">{messCrowd.crowd_density_percentage}%</div>
                      <div className="text-3xs text-gray-400 font-semibold uppercase">Density</div>
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1">
                        Status: <span className={messCrowd.status === "LOW_CROWD" ? "text-emerald-400" : "text-violet-400"}>{messCrowd.status.replace("_", " ")}</span>
                      </div>
                      <p className="text-xs text-gray-400 max-w-sm">{messCrowd.advice}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Complaint Tracking */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Complaint Tickets</h3>
                <div className="space-y-3">
                  {complaints.slice(0, 2).map((c) => (
                    <div key={c.id} className="p-3 rounded-lg bg-white/5 border border-white/[0.02] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">{c.title}</span>
                        <span className={`text-3xs font-semibold px-2 py-0.5 rounded-full ${
                          c.status === "RESOLVED" || c.status === "CLOSED" ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/10 text-violet-400"
                        }`}>{c.status}</span>
                      </div>
                      <div className="text-3xs text-gray-500">AI Category: {c.aiCategory} | ETA: {c.aiEtaHours} hours</div>
                    </div>
                  ))}
                  {complaints.length === 0 && <p className="text-xs text-gray-500 text-center">No complaints registered.</p>}
                </div>
              </div>
            </div>

            {/* AI FAQ Chat Panel */}
            <div className="glow-card p-6 bg-zinc-950/70 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Ask HostelIQ AI</h3>
                    <p className="text-4xs text-gray-500">Curfews, FAQs, and regulations assistant</p>
                  </div>
                </div>
              </div>

              {/* Messages viewport */}
              <div className="h-44 overflow-y-auto space-y-3 pr-2 text-xs">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                    <div className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                      msg.isBot ? "bg-white/5 border border-white/[0.02] text-gray-300" : "bg-violet-600 text-white"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-xl bg-white/5 text-gray-500 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask curfew details, leave passes, wifi password..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
                <button type="submit" className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white flex items-center justify-center cursor-pointer">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: AI COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Complaint Desk</h1>
              <p className="text-sm text-gray-400">File issues and watch our TF-IDF model categorize and dispatch tickets instantly.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column: Form */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">File a Complaint</h3>
                <form onSubmit={handleCreateComplaint} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bathroom light bulb fused"
                      value={newComplaintTitle}
                      onChange={(e) => setNewComplaintTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Details</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Give details about block/room or specific issue..."
                      value={newComplaintDesc}
                      onChange={(e) => setNewComplaintDesc(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creatingComplaint}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 text-xs"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              {/* Right Column: Ticket Log */}
              <div className="md:col-span-2 glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ticket Logs</h3>
                <div className="space-y-4">
                  {complaints.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{c.title}</h4>
                        <span className={`text-3xs font-semibold px-2 py-0.5 rounded-full ${
                          c.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/10 text-violet-400"
                        }`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-gray-400">{c.description}</p>
                      
                      {/* AI Meta tags */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 text-3xs font-medium">
                        <span className="px-2.5 py-1 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          AI Cat: {c.aiCategory}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          AI Priority: {c.aiPriority}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          ETA: {c.aiEtaHours} hours
                        </span>
                        <span className="px-2.5 py-1 rounded bg-white/5 text-gray-400 ml-auto">
                          Confidence: {Math.round(c.aiConfidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {complaints.length === 0 && <p className="text-xs text-gray-500 text-center py-8">No complaints filed.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEAVE REQUESTS */}
        {activeTab === "leaves" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Leave Approvals</h1>
              <p className="text-sm text-gray-400">Request permission for weekend trips or vacations. Approved leaves automatically unlock gate passes.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Leave Form */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Apply for Leave</h3>
                <form onSubmit={handleApplyLeave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Reason</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Family wedding"
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Destination</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={leaveDest}
                      onChange={(e) => setLeaveDest(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">From</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={leaveFrom}
                        onChange={(e) => setLeaveFrom(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">To</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={leaveTo}
                        onChange={(e) => setLeaveTo(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs cursor-pointer transition-all">
                    Submit Leave Request
                  </button>
                </form>
              </div>

              {/* Leave Logs */}
              <div className="md:col-span-2 glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Leave Status Log</h3>
                <div className="space-y-4">
                  {leaves.map((l) => (
                    <div key={l.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">{l.reason}</div>
                        <div className="text-xs text-gray-400">Destination: {l.destination}</div>
                        <div className="text-2xs text-gray-500 flex items-center gap-1.5">
                          <Clock size={12} /> {l.leaveFrom} to {l.leaveTo}
                        </div>
                      </div>
                      <span className={`text-3xs font-semibold px-2.5 py-1 rounded-full ${
                        l.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>{l.status}</span>
                    </div>
                  ))}
                  {leaves.length === 0 && <p className="text-xs text-gray-500 text-center py-8">No leave logs recorded.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BILLING */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Billing & Payments</h1>
              <p className="text-sm text-gray-400">View hostel term fees, utility utility invoices, and execute sandbox transactions.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Dues */}
              <div className="md:col-span-2 glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pending Invoices</h3>
                <div className="space-y-4">
                  {invoices.filter(i => i.status !== "PAID").map((i) => (
                    <div key={i.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">{i.title}</div>
                        <div className="text-xs text-red-400">Due date: {i.dueDate}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-white">₹{i.amount.toLocaleString()}</span>
                        <button
                          onClick={() => handlePayInvoice(i.id)}
                          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-semibold text-white cursor-pointer transition-all"
                        >
                          Pay Now (UPI)
                        </button>
                      </div>
                    </div>
                  ))}
                  {invoices.filter(i => i.status !== "PAID").length === 0 && (
                    <div className="p-8 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center text-xs text-emerald-400 flex flex-col items-center justify-center gap-2">
                      <CheckCircle size={32} />
                      All clear! No pending dues.
                    </div>
                  )}
                </div>

                {/* Paid history */}
                <h3 className="text-sm font-bold text-white uppercase tracking-wider pt-6">Receipt History</h3>
                <div className="space-y-3">
                  {invoices.filter(i => i.status === "PAID").map((i) => (
                    <div key={i.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.02] flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white">{i.title}</div>
                        <div className="text-gray-500">Paid on: 2026-06-13</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-emerald-400">₹{i.amount.toLocaleString()}</span>
                        <span className="text-3xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">PAID</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Electricity usage history */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Electricity Usage History</h3>
                {allocation && allocation.electricityHistory ? (
                  <div className="space-y-4">
                    {allocation.electricityHistory.map((h: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/[0.02] text-xs space-y-1">
                        <div className="flex justify-between font-bold text-white">
                          <span>{h.month} {h.year}</span>
                          <span>₹{h.billAmount}</span>
                        </div>
                        <div className="text-gray-500 flex justify-between text-3xs">
                          <span>Units: {h.unitsConsumed} kWh</span>
                          <span className="text-emerald-400">Billed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center">No utility records found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GATE PASS */}
        {activeTab === "gatepass" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Digital Gate Pass</h1>
              <p className="text-sm text-gray-400">Present this QR code to the gate security guard upon leaving or entering the hostel.</p>
            </div>

            <div className="flex flex-col items-center justify-center max-w-md mx-auto">
              {gatePasses.filter(gp => gp.status === "ACTIVE").map((gp) => (
                <div key={gp.id} className="glow-card p-8 bg-zinc-950/80 border border-white/10 w-full flex flex-col items-center gap-6 text-center">
                  <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Active Leave QR</div>
                  
                  {/* QR Mock graphic */}
                  <div className="w-48 h-48 bg-white p-4 rounded-2xl flex items-center justify-center shadow-2xl relative">
                    {/* SVG barcode mockup */}
                    <svg className="w-full h-full text-black" viewBox="0 0 100 100">
                      <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                      <rect x="30" y="10" width="10" height="10" fill="currentColor" />
                      <rect x="50" y="10" width="40" height="10" fill="currentColor" />
                      
                      <rect x="10" y="30" width="30" height="20" fill="currentColor" />
                      <rect x="50" y="30" width="10" height="40" fill="currentColor" />
                      <rect x="70" y="30" width="20" height="20" fill="currentColor" />
                      
                      <rect x="10" y="60" width="20" height="10" fill="currentColor" />
                      <rect x="40" y="60" width="20" height="30" fill="currentColor" />
                      <rect x="70" y="60" width="10" height="10" fill="currentColor" />
                      
                      <rect x="10" y="80" width="20" height="10" fill="currentColor" />
                      <rect x="70" y="80" width="20" height="10" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="space-y-1">
                    <div className="text-base font-black text-white tracking-widest">{gp.passCode}</div>
                    <div className="text-3xs text-gray-500">Valid: {gp.validFrom} to {gp.validUntil}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full text-left pt-4 border-t border-white/5 text-3xs text-gray-400">
                    <div>
                      <div>Exit Scanned:</div>
                      <div className="font-bold text-white mt-0.5">{gp.exitScannedAt ? gp.exitScannedAt : "Pending exit"}</div>
                    </div>
                    <div>
                      <div>Entry Scanned:</div>
                      <div className="font-bold text-white mt-0.5">{gp.entryScannedAt ? gp.entryScannedAt : "Pending return"}</div>
                    </div>
                  </div>
                </div>
              ))}

              {gatePasses.filter(gp => gp.status === "ACTIVE").length === 0 && (
                <div className="glow-card p-12 bg-zinc-950/60 border border-white/10 text-center text-xs text-gray-500 w-full flex flex-col items-center justify-center gap-3">
                  <AlertTriangle size={32} className="text-amber-500" />
                  <div>
                    <div className="font-semibold text-white mb-1">No Active Gate Pass</div>
                    Apply for leave under the "Leave Requests" tab. Once approved by the Warden, your gate pass will automatically appear here.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
