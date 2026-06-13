"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Activity,
  LogOut,
  Clock,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Home
} from "lucide-react";

export default function ParentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Parent profile / linked student state
  const [parentName, setParentName] = useState("Suresh Mehta");
  const [parentUserId, setParentUserId] = useState("9");
  
  const [student, setStudent] = useState<any>({
    fullName: "Arjun Mehta",
    enrollmentNo: "210101001",
    course: "B.Tech CSE",
    year: 3,
    department: "Computer Science",
    gender: "MALE",
    address: "Block A-101, MUJ Campus, Jaipur"
  });

  const [allocation, setAllocation] = useState<any>({
    roomNumber: "A-101",
    floor: 1,
    roomType: "DOUBLE",
    blockName: "Block A",
    hostelName: "Vivekananda Boys Hostel",
    hostelCode: "VBH"
  });

  const [invoices, setInvoices] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("fullName") || "Suresh Mehta";
    const storedId = localStorage.getItem("userId") || "9";

    setParentName(storedName);
    setParentUserId(storedId);

    if (!token) {
      router.push("/login");
      return;
    }

    fetchParentLogs();
  }, []);

  const fetchParentLogs = async () => {
    try {
      // Fetch details of student linked to parent (Arjun is student_id = 1)
      const invRes = await fetch("http://localhost:8080/api/v1/payments/invoices/8", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (invRes.ok) {
        const iData = await invRes.json();
        setInvoices(iData);
      }

      const leaveRes = await fetch("http://localhost:8080/api/v1/leaves/student/8", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (leaveRes.ok) {
        const lData = await leaveRes.json();
        setLeaves(lData);
      }
    } catch (err) {
      console.warn("Backend offline, loading mock Parent details...", err);
      setInvoices([
        { id: 101, title: "Hostel Term Fee - Autumn 2026", amount: 60000.00, dueDate: "2026-07-15", status: "PENDING" },
        { id: 102, title: "Electricity Bill - May 2026", amount: 1205.00, dueDate: "2026-06-20", status: "PENDING" }
      ]);
      setLeaves([
        { id: 1, reason: "End of term vacation", leaveFrom: "2026-06-18", leaveTo: "2026-06-28", destination: "Delhi", status: "APPROVED" }
      ]);
    }
  };

  const handlePayInvoice = async (invoiceId: number) => {
    try {
      // Pay on behalf of student (userId = 8)
      const res = await fetch(`http://localhost:8080/api/v1/payments/pay/${invoiceId}?studentUserId=8&paymentMethod=CARD`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Payment processed successfully on behalf of child!");
        fetchParentLogs();
      } else {
        throw new Error();
      }
    } catch {
      setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: "PAID" } : inv));
      alert("Mock Payment Success! Invoice marked as paid on behalf of your child.");
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
              { id: "dashboard", label: "Child Profile", icon: LayoutDashboard },
              { id: "billing", label: "Fees & Invoices", icon: CreditCard },
              { id: "leaves", label: "Leave Passes", icon: FileText },
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
              SM
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{parentName}</div>
              <div className="text-xs text-gray-500">Parent Portal</div>
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
        
        {/* TAB 1: CHILD PROFILE */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Linked Ward Profile</h1>
              <p className="text-sm text-gray-400">View room allotments, course registration, and emergency contacts.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Profile Card */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                    AM
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{student.fullName}</h3>
                    <p className="text-xs text-gray-500">Enrollment No: {student.enrollmentNo}</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Course:</span>
                    <span className="font-bold text-white">{student.course} ({student.year}rd Year)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Department:</span>
                    <span className="font-bold text-white">{student.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gender:</span>
                    <span className="font-bold text-white">{student.gender}</span>
                  </div>
                </div>
              </div>

              {/* Room Card */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Home size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Allotted Accommodation</h3>
                    <p className="text-xs text-gray-500">Active Room allocation details</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hostel Name:</span>
                    <span className="font-bold text-white">{allocation.hostelName} ({allocation.hostelCode})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Block Name:</span>
                    <span className="font-bold text-white">{allocation.blockName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Room Number:</span>
                    <span className="font-bold text-white">Room {allocation.roomNumber} ({allocation.roomType})</span>
                  </div>
                </div>
              </div>

              {/* Warden Contact Card */}
              <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hostel Administration</h3>
                <div className="p-3 rounded-lg bg-white/5 border border-white/[0.02] space-y-3 text-xs">
                  <div className="font-semibold text-white">Dr. Ramesh Sharma</div>
                  <div className="space-y-1 text-gray-400">
                    <div className="flex items-center gap-2"><Phone size={12} /> Ext: 201</div>
                    <div className="flex items-center gap-2"><Mail size={12} /> ramesh.sharma@muj.edu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BILLS & FEES */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Fee Invoices</h1>
              <p className="text-sm text-gray-400">Review outstanding hostel term fee balances and clear dues directly on behalf of your ward.</p>
            </div>

            <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pending Dues</h3>
              <div className="space-y-4">
                {invoices.filter(i => i.status !== "PAID").map((i) => (
                  <div key={i.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white">{i.title}</div>
                      <div className="text-xs text-red-400">Due: {i.dueDate}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-white">₹{i.amount.toLocaleString()}</span>
                      <button
                        onClick={() => handlePayInvoice(i.id)}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-semibold text-white cursor-pointer transition-all"
                      >
                        Authorize & Pay
                      </button>
                    </div>
                  </div>
                ))}

                {invoices.filter(i => i.status !== "PAID").length === 0 && (
                  <div className="p-8 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center text-xs text-emerald-400 flex flex-col items-center justify-center gap-2">
                    <CheckCircle size={32} />
                    All outstanding dues cleared.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LEAVE PASSES */}
        {activeTab === "leaves" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Student Outings & Leaves</h1>
              <p className="text-sm text-gray-400">Monitor leave durations, destinations, and gate scan timestamps for safety tracking.</p>
            </div>

            <div className="glow-card p-6 bg-zinc-950/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Historical Logs</h3>
              <div className="space-y-4">
                {leaves.map((l) => (
                  <div key={l.id} className="p-4 rounded-xl bg-white/5 border border-white/[0.03] flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white">{l.reason}</div>
                      <div className="text-xs text-gray-400">Destination: {l.destination}</div>
                      <div className="text-2xs text-gray-500 flex items-center gap-1.5">
                        <Clock size={12} /> Duration: {l.leaveFrom} to {l.leaveTo}
                      </div>
                    </div>
                    <span className="text-3xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{l.status}</span>
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
