"use client";

import { useState } from "react";

const mockRecords = [
  { id: "REC-2024-0001", hospital: "Puskesmas Rajabasa", hospitalCode: "PKM-C", date: "2024-05-01", diagnosis: "Hipertensi Grade II", doctor: "dr. Ahmad Fauzi", status: "complete" },
  { id: "REC-2024-0002", hospital: "Praktik dr. Rina", hospitalCode: "PRK-A", date: "2024-05-05", diagnosis: "Diabetes Tipe 2 — kontrol rutin", doctor: "dr. Rina Susanti", status: "complete" },
  { id: "REC-2024-0003", hospital: "RSUD Abdul Moeloek", hospitalCode: "RSUD-B", date: "2024-05-10", diagnosis: "Konsultasi Kardiologi", doctor: "dr. Bambang Wicaksono", status: "complete" },
  { id: "REC-2024-0004", hospital: "Klinik Medika Utama", hospitalCode: "KMU-D", date: "2024-05-18", diagnosis: "Pemeriksaan Umum & Vaksinasi", doctor: "dr. Laila Fitri", status: "pending" },
];

const mockAuditLogs = [
  { id: "ACC-001", hospital: "RSUD Abdul Moeloek", type: "normal", timestamp: "2024-05-10 14:32", records: 2 },
  { id: "ACC-002", hospital: "Klinik Medika Utama", type: "normal", timestamp: "2024-05-18 09:15", records: 3 },
  { id: "EBG-2024-001", hospital: "RSUD Abdul Moeloek", type: "emergency", timestamp: "2024-05-19 02:47", records: 4 },
];

const hospitalColors: Record<string, string> = {
  "PKM-C": "#AAFF00", "PRK-A": "#00E5FF", "RSUD-B": "#FF6B6B", "KMU-D": "#FFD93D",
};

function Avatar({ code, color }: { code: string; color: string }) {
  return (
    <div style={{ backgroundColor: color + "22", border: `1px solid ${color}44`, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ color, fontSize: 9, fontWeight: 700 }}>{code}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return status === "complete" ? (
    <span style={{ background: "#AAFF0022", color: "#AAFF00", border: "1px solid #AAFF0044", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Selesai</span>
  ) : (
    <span style={{ background: "#FFD93D22", color: "#FFD93D", border: "1px solid #FFD93D44", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Pending</span>
  );
}

const navItems = [
  { icon: "⬡", label: "Dashboard" },
  { icon: "📋", label: "Rekam Medis" },
  { icon: "📤", label: "Export PDF" },
  { icon: "🔍", label: "Audit Log" },
  { icon: "💰", label: "Dompet SGT" },
];

const bottomNavItems = [
  { icon: "⬡", label: "Home" },
  { icon: "📋", label: "Rekam" },
  { icon: "📤", label: "Export" },
  { icon: "🔍", label: "Audit" },
  { icon: "💰", label: "SGT" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"semua" | "darurat">("semua");
  const [selectedRecord, setSelectedRecord] = useState(mockRecords[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(0);

  const filteredLogs = activeTab === "darurat" ? mockAuditLogs.filter((l) => l.type === "emergency") : mockAuditLogs;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0A0A0F", fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111118; }
        ::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 2px; }
        .record-row { transition: background 0.15s; cursor: pointer; }
        .record-row:hover { background: #1e1e2a !important; }
        .record-row-active { background: #1a2a1a !important; border-left: 2px solid #AAFF00 !important; }
        .tab-btn { transition: all 0.15s; cursor: pointer; border: none; }
        .nav-link:hover { color: #AAFF00 !important; }
        .export-btn { transition: all 0.2s; }
        .export-btn:hover { background: #AAFF00 !important; color: #0A0A0F !important; }
        .audit-row:hover { background: #1a1a24 !important; }
        .sidebar-item { transition: all 0.15s; cursor: pointer; }
        .sidebar-item:hover { background: #1a1a24 !important; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 40; backdrop-filter: blur(2px); }
        .drawer { position: fixed; top: 0; left: 0; height: 100vh; width: 260px; background: #111118; border-right: 1px solid #ffffff0d; z-index: 50; transform: translateX(-100%); transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; }
        .drawer-open { transform: translateX(0) !important; }
        .bottom-nav { display: none; }
        .hamburger-btn { display: none; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .bottom-nav { display: flex !important; }
          .main-content-pad { padding: 16px 14px 80px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .main-two-col { grid-template-columns: 1fr !important; }
          .detail-three-col { grid-template-columns: 1fr 1fr !important; }
          .header-nav-links { display: none !important; }
          .page-title { font-size: 20px !important; }
          .stat-value { font-size: 22px !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .detail-three-col { grid-template-columns: 1fr !important; }
        }
        .btn-base { cursor: pointer; font-family: inherit; }
        .icon-btn { background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── Desktop Sidebar ── */}
        <aside className="desktop-sidebar" style={{ width: 220, background: "#111118", borderRight: "1px solid #ffffff0d", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 20px 16px" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>SuiMedis</span>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 12px", flex: 1 }}>
            {navItems.map((item, i) => (
              <div key={item.label} className="sidebar-item" onClick={() => setActiveNav(i)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, borderLeft: activeNav === i ? "2px solid #AAFF00" : "2px solid transparent", background: activeNav === i ? "#1a2a1a" : "transparent" }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: activeNav === i ? 600 : 400, color: activeNav === i ? "#AAFF00" : "#ffffff80" }}>{item.label}</span>
              </div>
            ))}
          </nav>

          <div style={{ margin: "0 12px 16px", padding: 12, borderRadius: 14, background: "#1a1a24", border: "1px solid #ffffff0d" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#AAFF0022", border: "1px solid #AAFF0044", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#AAFF00", fontSize: 11, fontWeight: 700 }}>BS</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>Budi Santoso</p>
                <p style={{ color: "#ffffff50", fontSize: 10, lineHeight: 1.3 }}>PAT-0001</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile Drawer Overlay ── */}
        {sidebarOpen && <div className="drawer-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ── Mobile Drawer ── */}
        <div className={`drawer ${sidebarOpen ? "drawer-open" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
              </div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>SuiMedis</span>
            </div>
            <button className="icon-btn" onClick={() => setSidebarOpen(false)} style={{ color: "#ffffff60", fontSize: 20, width: 32, height: 32 }}>✕</button>
          </div>

          {/* Drawer Profile */}
          <div style={{ margin: "0 12px 16px", padding: 12, borderRadius: 14, background: "#1a1a24", border: "1px solid #ffffff0d" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#AAFF0022", border: "1px solid #AAFF0044", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#AAFF00", fontSize: 12, fontWeight: 700 }}>BS</span>
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Budi Santoso</p>
                <p style={{ color: "#ffffff50", fontSize: 11 }}>PAT-0001 · 24.5 SGT</p>
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 12px", flex: 1 }}>
            {navItems.map((item, i) => (
              <div key={item.label} className="sidebar-item" onClick={() => { setActiveNav(i); setSidebarOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, borderLeft: activeNav === i ? "2px solid #AAFF00" : "2px solid transparent", background: activeNav === i ? "#1a2a1a" : "transparent" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 14, fontWeight: activeNav === i ? 600 : 400, color: activeNav === i ? "#AAFF00" : "#ffffff80" }}>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0A0A0F" }}>

          {/* Top Header */}
          <header style={{ height: 56, borderBottom: "1px solid #ffffff0d", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Hamburger — mobile only */}
              <button className="hamburger-btn icon-btn btn-base" onClick={() => setSidebarOpen(true)}
                style={{ width: 36, height: 36, borderRadius: 8, background: "#ffffff0d", border: "1px solid #ffffff0d", display: "none", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <span style={{ display: "block", width: 16, height: 1.5, background: "#fff", borderRadius: 2 }} />
                <span style={{ display: "block", width: 16, height: 1.5, background: "#fff", borderRadius: 2 }} />
                <span style={{ display: "block", width: 12, height: 1.5, background: "#fff", borderRadius: 2 }} />
              </button>

              <div className="header-nav-links" style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {["Dashboard", "Rekam Medis", "Export", "Riwayat"].map((item, i) => (
                  <span key={item} className="nav-link" style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#AAFF00" : "#ffffff50", cursor: "pointer" }}>{item}</span>
                ))}
              </div>

              {/* Mobile title */}
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, display: "none" }} className="mobile-title">Dashboard</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: "6px 12px", borderRadius: 999, background: "#AAFF0015", border: "1px solid #AAFF0030", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#AAFF00" }} />
                <span style={{ color: "#AAFF00", fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>24.5 SGT</span>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#AAFF0022", border: "1px solid #AAFF0044", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#AAFF00", fontSize: 11, fontWeight: 700 }}>BS</span>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div className="main-content-pad" style={{ padding: "24px" }}>

              {/* Page Title */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
                <div>
                  <h1 className="page-title" style={{ color: "#fff", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>Dashboard</h1>
                  <p style={{ color: "#ffffff50", fontSize: 12, marginTop: 2 }}>Selamat datang, Budi — NIK ••••••7890123</p>
                </div>
                <button className="export-btn btn-base" style={{ background: "transparent", border: "1px solid #AAFF0060", color: "#AAFF00", fontSize: 12, fontWeight: 600, padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap", flexShrink: 0 }}>
                  ↓ Export PDF
                </button>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Rekam Medis", value: "4", sub: "Dari 4 faskes", accent: "#AAFF00" },
                  { label: "Faskes Terhubung", value: "4", sub: "Multi-hospital", accent: "#00E5FF" },
                  { label: "Saldo SGT", value: "24.5", sub: "Token tersisa", accent: "#FFD93D" },
                  { label: "Akses Darurat", value: "1", sub: "EBG tercatat", accent: "#FF6B6B" },
                ].map((stat) => (
                  <div key={stat.label} style={{ borderRadius: 16, padding: "14px 16px", background: "#111118", border: "1px solid #ffffff0d" }}>
                    <p style={{ color: "#ffffff50", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{stat.label}</p>
                    <p className="stat-value" style={{ color: stat.accent, fontSize: 26, fontWeight: 700, fontFamily: "'DM Mono', monospace", letterSpacing: "-1px", marginBottom: 2 }}>{stat.value}</p>
                    <p style={{ color: "#ffffff30", fontSize: 10 }}>{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Main Two-Col */}
              <div className="main-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>

                {/* Left Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Records Panel */}
                  <div style={{ borderRadius: 16, overflow: "hidden", background: "#111118", border: "1px solid #ffffff0d" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #ffffff0d" }}>
                      <h2 style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Rekam Medis</h2>
                      <div style={{ display: "flex", gap: 6 }}>
                        {["Semua", "Draft", "Selesai"].map((tab, i) => (
                          <button key={tab} className="tab-btn btn-base" style={{ background: i === 0 ? "#AAFF00" : "#ffffff0d", color: i === 0 ? "#0A0A0F" : "#ffffff60", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>

                    {mockRecords.map((rec) => (
                      <div key={rec.id} className={`record-row ${selectedRecord.id === rec.id ? "record-row-active" : ""}`}
                        onClick={() => setSelectedRecord(rec)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderLeft: selectedRecord.id === rec.id ? "2px solid #AAFF00" : "2px solid transparent", borderBottom: "1px solid #ffffff08" }}>
                        <Avatar code={rec.hospitalCode} color={hospitalColors[rec.hospitalCode] || "#AAFF00"} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rec.diagnosis}</p>
                          <p style={{ color: "#ffffff40", fontSize: 11, marginTop: 1 }}>{rec.hospital} · {rec.date}</p>
                        </div>
                        <StatusBadge status={rec.status} />
                      </div>
                    ))}
                  </div>

                  {/* Record Detail */}
                  <div style={{ borderRadius: 16, padding: 18, background: "#111118", border: "1px solid #ffffff0d" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 10 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ background: "#AAFF0015", color: "#AAFF00", fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: "'DM Mono', monospace" }}>{selectedRecord.id}</span>
                          <StatusBadge status={selectedRecord.status} />
                        </div>
                        <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>{selectedRecord.diagnosis}</h3>
                      </div>
                      <button className="export-btn btn-base" style={{ background: "transparent", border: "1px solid #AAFF0040", color: "#AAFF00", fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 8, whiteSpace: "nowrap", flexShrink: 0 }}>
                        Detail →
                      </button>
                    </div>

                    <div className="detail-three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {[
                        { label: "Rumah Sakit", value: selectedRecord.hospital },
                        { label: "Dokter", value: selectedRecord.doctor },
                        { label: "Tanggal", value: selectedRecord.date },
                      ].map((item) => (
                        <div key={item.label} style={{ padding: 12, borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
                          <p style={{ color: "#ffffff40", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500, marginBottom: 4 }}>{item.label}</p>
                          <p style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: "#0A0A0F", border: "1px solid #AAFF0015", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#AAFF0020", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10 }}>⛓</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#ffffff60", fontSize: 10 }}>IPFS Ref</p>
                        <p style={{ color: "#AAFF00", fontSize: 11, fontFamily: "'DM Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>QmABCD1234XyzFake9876Demo...</p>
                      </div>
                      <span style={{ color: "#ffffff30", fontSize: 11, flexShrink: 0 }}>✓ Verified</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* SGT Wallet */}
                  <div style={{ borderRadius: 16, padding: 18, background: "linear-gradient(135deg, #1a2a1a 0%, #0f1f0f 100%)", border: "1px solid #AAFF0030", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, borderRadius: "50%", background: "#AAFF00", opacity: 0.08, transform: "translate(30%, -30%)" }} />
                    <p style={{ color: "#AAFF0080", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Saldo SGT</p>
                    <p style={{ color: "#AAFF00", fontSize: 34, fontWeight: 700, fontFamily: "'DM Mono', monospace", letterSpacing: "-2px", marginBottom: 2 }}>24.5</p>
                    <p style={{ color: "#AAFF0060", fontSize: 12, marginBottom: 14 }}>SuiGovToken</p>
                    <div style={{ borderRadius: 10, padding: 10, background: "rgba(10,10,15,0.6)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ color: "#ffffff40", fontSize: 10 }}>Wallet</p>
                        <p style={{ color: "#ffffff90", fontSize: 11, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>0x5c2e...9a8b</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: "#ffffff40", fontSize: 10 }}>Network</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 2 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#AAFF00" }} />
                          <span style={{ color: "#AAFF00", fontSize: 11 }}>Mainnet</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audit Log */}
                  <div style={{ borderRadius: 16, overflow: "hidden", background: "#111118", border: "1px solid #ffffff0d", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #ffffff0d" }}>
                      <h2 style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Riwayat Akses</h2>
                      <div style={{ display: "flex", gap: 6 }}>
                        {(["semua", "darurat"] as const).map((tab) => (
                          <button key={tab} className="tab-btn btn-base" onClick={() => setActiveTab(tab)}
                            style={{ background: activeTab === tab ? (tab === "darurat" ? "#FF6B6B" : "#AAFF00") : "#ffffff0d", color: activeTab === tab ? "#0A0A0F" : "#ffffff60", fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>
                            {tab === "semua" ? "Semua" : "⚠ Darurat"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredLogs.map((log) => (
                      <div key={log.id} className="audit-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderBottom: "1px solid #ffffff08", cursor: "pointer" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: log.type === "emergency" ? "#FF6B6B22" : "#AAFF0015", border: `1px solid ${log.type === "emergency" ? "#FF6B6B40" : "#AAFF0025"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 12 }}>{log.type === "emergency" ? "🚨" : "🔍"}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: "#fff", fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.hospital}</p>
                          <p style={{ color: "#ffffff40", fontSize: 10, marginTop: 1 }}>{log.timestamp} · {log.records} rekam</p>
                        </div>
                        {log.type === "emergency" && (
                          <span style={{ background: "#FF6B6B22", color: "#FF6B6B", border: "1px solid #FF6B6B44", padding: "2px 6px", borderRadius: 999, fontSize: 9, fontWeight: 700, flexShrink: 0 }}>EBG</span>
                        )}
                      </div>
                    ))}

                    <div style={{ padding: "10px 18px" }}>
                      <button className="btn-base" style={{ width: "100%", padding: "10px", borderRadius: 10, background: "#ffffff08", border: "1px solid #ffffff0d", color: "#ffffff50", fontSize: 12, fontWeight: 500 }}>
                        Lihat Semua Log Blockchain →
                      </button>
                    </div>
                  </div>

                  {/* SGT Activity */}
                  <div style={{ borderRadius: 16, padding: 16, background: "#111118", border: "1px solid #ffffff0d" }}>
                    <p style={{ color: "#ffffff50", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Aktivitas Biaya SGT</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { label: "Dibuat", value: "4 SGT", color: "#FF6B6B" },
                        { label: "Export", value: "2.8 SGT", color: "#FFD93D" },
                        { label: "Tersisa", value: "24.5 SGT", color: "#AAFF00" },
                      ].map((item) => (
                        <div key={item.label} style={{ flex: 1, borderRadius: 10, padding: 10, background: "#0A0A0F", border: "1px solid #ffffff0a", textAlign: "center" }}>
                          <p style={{ color: item.color, fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>{item.value}</p>
                          <p style={{ color: "#ffffff30", fontSize: 10 }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Nav (mobile only) ── */}
          <nav className="bottom-nav" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: "#111118", borderTop: "1px solid #ffffff0d", padding: "8px 0", zIndex: 30, justifyContent: "space-around", alignItems: "center" }}>
            {bottomNavItems.map((item, i) => (
              <button key={item.label} className="icon-btn btn-base" onClick={() => setActiveNav(i)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 12px", borderRadius: 8, background: "transparent", border: "none" }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: 9, fontWeight: activeNav === i ? 700 : 400, color: activeNav === i ? "#AAFF00" : "#ffffff40" }}>{item.label}</span>
              </button>
            ))}
          </nav>
        </main>
      </div>
    </div>
  );
}