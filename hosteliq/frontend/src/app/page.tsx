"use client";

import Link from "next/link";
import { Shield, Brain, Zap, Key, CreditCard, ChevronRight, Activity, Users, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 overflow-hidden font-sans">
      {/* Background Glow Elements */}
      <div className="bg-glow-indigo top-[-100px] left-[-50px]"></div>
      <div className="bg-glow-violet top-[400px] right-[-100px]"></div>
      <div className="bg-glow-indigo bottom-[-100px] left-[20%]"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-violet-500/20">
            HΩ
          </div>
          <span className="text-xl font-bold tracking-tight text-white bg-clip-text">
            HOSTEL<span className="text-violet-500">IQ</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg shadow-lg shadow-violet-600/20 flex items-center gap-1 transition-all duration-300 hover:scale-105"
          >
            Launch Portals <ChevronRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold tracking-wide text-violet-400">
            <SparkleIcon className="w-3.5 h-3.5 animate-pulse" /> MUJ Hackathon Prototype
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-white">
            AI-Powered Smart <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Hostel Operating System
            </span>
          </h1>
          <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-400 leading-relaxed">
            Revolutionizing student accommodation. Automate room allocation, parse unstructured complaints with TF-IDF classification, approve digital gate passes instantly, and monitor live room occupancy.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
            >
              Get Started <ArrowUpRight size={18} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Banner Mockup / Preview */}
        <div className="mt-16 lg:mt-0 lg:col-span-5 relative flex justify-center">
          <div className="glow-card w-full max-w-md p-6 bg-zinc-950/70 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-600/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <span className="text-xs font-semibold text-violet-400 tracking-widest uppercase">Live System Activity</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live
              </span>
            </div>
            
            <div className="space-y-4 text-left">
              {/* Row 1: Occupancy */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/[0.03]">
                <div className="flex items-center gap-3">
                  <Activity className="text-violet-400" size={18} />
                  <div>
                    <div className="text-xs text-gray-400">Occupancy Rate</div>
                    <div className="text-sm font-bold text-white">96.8% (312/320 Beds)</div>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-semibold">+4.2%</span>
              </div>

              {/* Row 2: AI Dispatcher */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/[0.03]">
                <div className="flex items-center gap-3">
                  <Brain className="text-cyan-400" size={18} />
                  <div>
                    <div className="text-xs text-gray-400">AI Complaint Routing</div>
                    <div className="text-sm font-bold text-white">TF-IDF Dispatcher</div>
                  </div>
                </div>
                <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full font-semibold">0.96 Conf</span>
              </div>

              {/* Row 3: Live Scan */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/[0.03]">
                <div className="flex items-center gap-3">
                  <Shield className="text-indigo-400" size={18} />
                  <div>
                    <div className="text-xs text-gray-400">Digital Gate Pass Scanning</div>
                    <div className="text-sm font-bold text-white">Student QR Entry Scan</div>
                  </div>
                </div>
                <span className="text-xs text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full font-semibold">12s ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Designed for Modern Campuses</h2>
          <p className="text-gray-400">
            A secure, unified solution connecting students, parents, wardens, and gate security with instant synchronisation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glow-card p-8 bg-zinc-950/60 border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">AI Complaint Sorting</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No more manual sorting. Our embedded TF-IDF engine categorizes student complaints, predicts resolution times (ETA), and routes tasks instantly to wardens.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glow-card p-8 bg-zinc-950/60 border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Digital Gate Passes</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Seamless leave approvals. Once approved by the warden, students get a cryptographically secure QR code. Security simply scans to log exits and entries.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glow-card p-8 bg-zinc-950/60 border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Payments & Bills</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Pay hostel fees, room rents, and metered electricity consumption in one click. Receive PDF payment receipts instantly via student and parent dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-b border-white/5 bg-white/[0.01]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white">100+</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-violet-400">20</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Digital Rooms</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-400">&lt; 1hr</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest">AI Dispatch Time</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-cyan-400">100%</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Paperless Approvals</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center text-xs text-gray-500">
        <p>© 2026 HostelIQ. Built for Manipal University Jaipur Hackathon. Powered by Advanced Agentic AI.</p>
      </footer>
    </div>
  );
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
