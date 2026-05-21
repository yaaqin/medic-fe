"use client";

import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────
const statsCards = [
  { label: "Total Pasien", value: "1,284", delta: "+12 hari ini", accent: "#AAFF00" },
  { label: "Total Rekam Medis", value: "4,871", delta: "+34 minggu ini", accent: "#00E5FF" },
  { label: "Revenue SGT", value: "9,240", delta: "+320 bulan ini", accent: "#FFD93D" },
  { label: "Akses Darurat (EBG)", value: "7", delta: "+2 minggu ini", accent: "#FF6B6B" },
];

const mockDoctors = [
  { id: "DOC-0001", name: "dr. Ahmad Fauzi", hospital: "Puskesmas Rajabasa", str: "503/001/STR/2023", role: "VERIFIED_DOCTOR", since: "2024-01-10" },
  { id: "DOC-0002", name: "dr. Rina Susanti", hospital: "Praktik dr. Rina", str: "503/002/STR/2023", role: "VERIFIED_DOCTOR", since: "2024-02-05" },
  { id: "DOC-0003", name: "dr. Bambang W.", hospital: "RSUD Abdul Moeloek", str: "503/003/STR/2022", role: "VERIFIED_DOCTOR", since: "2024-01-22" },
  { id: "DOC-0004", name: "dr. Laila Fitri", hospital: "Klinik Medika Utama", str: "503/004/STR/2024", role: "PENDING", since: "2024-05-18" },
  { id: "DOC-0005", name: "dr. Hendra Putra", hospital: "RSUD Abdul Moeloek", str: "503/005/STR/2023", role: "PENDING", since: "2024-05-19" },
];

const mockEbgLogs = [
  { id: "EBG-2024-001", doctor: "dr. Bambang W.", hospital: "RSUD Abdul Moeloek", patient: "0x7a3f...2c", type: "LIFE_THREATENING", status: "COMPLETED", time: "2024-05-19 02:47", duration: "8m 22s" },
  { id: "EBG-2024-002", doctor: "dr. Ahmad Fauzi", hospital: "Puskesmas Rajabasa", patient: "0x3c1b...9f", type: "UNCONSCIOUS", status: "COMPLETED", time: "2024-05-17 11:03", duration: "12m 01s" },
  { id: "EBG-2024-003", doctor: "dr. Rina Susanti", hospital: "Praktik dr. Rina", patient: "0x8d2e...4a", type: "CRITICAL_SURGERY", status: "EXPIRED", time: "2024-05-15 08:30", duration: "15m 00s" },
];

const mockFees = {
  exportBase: 1,
  exportMult: 1,
  recording: 1,
  crossHospital: 0,
  ebg: 0,
};

const mockRevenue = [
  { month: "Jan", export: 320, recording: 480 },
  { month: "Feb", export: 410, recording: 520 },
  { month: "Mar", export: 380, recording: 610 },
  { month: "Apr", export: 520, recording: 740 },
  { month: "Mei", export: 610, recording: 890 },
];

const NAV = [
  { icon: "⬡", label: "Overview", id: "overview" },
  { icon: "👨‍⚕️", label: "Dokter", id: "doctors" },
  { icon: "🚨", label: "EBG Logs", id: "ebg" },
  { icon: "💰", label: "Fee Manager", id: "fees" },
  { icon: "📊", label: "Revenue", id: "revenue" },
];

// ── Helper Components ────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const verified = role === "VERIFIED_DOCTOR";
  return (
    <span style={{ background: verified ? "#AAFF0018" : "#FFD93D18", color: verified ? "#AAFF00" : "#FFD93D", border: `1px solid ${verified ? "#AAFF0035" : "#FFD93D35"}`, padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
      {verified ? "✓ Verified" : "⏳ Pending"}
    </span>
  );
}

function EbgStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    COMPLETED: { bg: "#AAFF0018", color: "#AAFF00", label: "Selesai" },
    EXPIRED: { bg: "#ffffff10", color: "#ffffff50", label: "Expired" },
    INITIATED: { bg: "#00E5FF18", color: "#00E5FF", label: "Aktif" },
  };
  const s = map[status] || map.EXPIRED;
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30`, padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{s.label}</span>;
}

// Simple bar chart
function MiniBarChart() {
  const maxVal = Math.max(...mockRevenue.map(d => d.export + d.recording));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, padding: "0 4px" }}>
      {mockRevenue.map((d) => {
        const total = d.export + d.recording;
        const exportH = (d.export / maxVal) * 72;
        const recH = (d.recording / maxVal) * 72;
        return (
          <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
              <div style={{ width: "60%", height: exportH, background: "#FFD93D", borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} />
              <div style={{ width: "60%", height: recH, background: "#AAFF00", borderRadius: "0 0 3px 3px" }} />
            </div>
            <span style={{ color: "#ffffff30", fontSize: 9 }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fees, setFees] = useState(mockFees);
  const [editingFee, setEditingFee] = useState<string | null>(null);
  const [feeInput, setFeeInput] = useState("");
  const [doctors, setDoctors] = useState(mockDoctors);

  const verifyDoctor = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, role: "VERIFIED_DOCTOR" } : d));
  };
  const revokeDoctor = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, role: "REVOKED" } : d));
  };

  const saveFee = (key: string) => {
    const val = parseFloat(feeInput);
    if (!isNaN(val) && val >= 0) setFees(prev => ({ ...prev, [key]: val }));
    setEditingFee(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 2px; }
        .nav-item { cursor: pointer; transition: all 0.15s; border-radius: 10px; display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
        .nav-item:hover { background: #1a1a24; }
        .nav-item-active { background: #1a2a1a !important; border-left: 2px solid #AAFF00 !important; }
        .table-row { border-bottom: 1px solid #ffffff08; transition: background 0.12s; }
        .table-row:hover { background: #1a1a24; }
        .table-row:last-child { border-bottom: none; }
        .btn-xs { border: none; cursor: pointer; border-radius: 7px; font-size: 11px; font-weight: 600; font-family: 'DM Sans', sans-serif; padding: 5px 10px; transition: all 0.15s; }
        .btn-verify { background: #AAFF0020; color: #AAFF00; }
        .btn-verify:hover { background: #AAFF0035; }
        .btn-revoke { background: #FF6B6B18; color: #FF6B6B; }
        .btn-revoke:hover { background: #FF6B6B30; }
        .btn-edit { background: #ffffff0d; color: #ffffff60; }
        .btn-edit:hover { background: #ffffff18; color: #fff; }
        .fee-input { background: #0A0A0F; border: 1px solid #AAFF0050; border-radius: 8px; padding: 6px 10px; color: #AAFF00; font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600; outline: none; width: 80px; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 40; }
        .drawer { position: fixed; top: 0; left: 0; height: 100vh; width: 240px; background: #111118; border-right: 1px solid #ffffff0d; z-index: 50; transform: translateX(-100%); transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; }
        .drawer-open { transform: translateX(0) !important; }
        .hamburger { display: none !important; }
        .desktop-sidebar { display: flex !important; }
        .bottom-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .hamburger { display: flex !important; }
          .bottom-nav { display: flex !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .content-pad { padding: 16px 14px 80px !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .fee-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* ── Desktop Sidebar ── */}
      <aside className="desktop-sidebar" style={{ width: 220, background: "#111118", borderRight: "1px solid #ffffff0d", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px" }}>SuiMedis</p>
            <p style={{ color: "#FF6B6B", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>Admin Panel</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "4px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => (
            <div key={item.id} className={`nav-item ${activeNav === item.id ? "nav-item-active" : ""}`}
              style={{ borderLeft: activeNav === item.id ? "2px solid #AAFF00" : "2px solid transparent" }}
              onClick={() => setActiveNav(item.id)}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: activeNav === item.id ? 600 : 400, color: activeNav === item.id ? "#AAFF00" : "#ffffff60" }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={{ margin: "0 10px 14px", padding: "10px 12px", borderRadius: 12, background: "#FF6B6B12", border: "1px solid #FF6B6B25" }}>
          <p style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Super Admin</p>
          <p style={{ color: "#ffffff40", fontSize: 10 }}>ADM-0001 · Full Access</p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && <div className="drawer-overlay" onClick={() => setSidebarOpen(false)} />}
      <div className={`drawer ${sidebarOpen ? "drawer-open" : ""}`}>
        <div style={{ padding: "18px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>SuiMedis</p>
              <p style={{ color: "#FF6B6B", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "#ffffff50", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <nav style={{ flex: 1, padding: "4px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => (
            <div key={item.id} className={`nav-item ${activeNav === item.id ? "nav-item-active" : ""}`}
              style={{ borderLeft: activeNav === item.id ? "2px solid #AAFF00" : "2px solid transparent", padding: "12px 14px" }}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: activeNav === item.id ? 600 : 400, color: activeNav === item.id ? "#AAFF00" : "#ffffff60" }}>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{ height: 56, borderBottom: "1px solid #ffffff0d", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}
              style={{ width: 36, height: 36, borderRadius: 8, background: "#ffffff0d", border: "1px solid #ffffff0d", display: "none", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}>
              {[0,1,2].map(i => <span key={i} style={{ display: "block", width: i === 2 ? 12 : 16, height: 1.5, background: "#fff", borderRadius: 2 }} />)}
            </button>
            <div>
              <h1 style={{ color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: "-0.3px" }}>
                {NAV.find(n => n.id === activeNav)?.label}
              </h1>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: "5px 12px", borderRadius: 999, background: "#FF6B6B15", border: "1px solid #FF6B6B30", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B6B" }} />
              <span style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 600 }}>Admin</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF6B6B22", border: "1px solid #FF6B6B44", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 700 }}>SA</span>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div className="content-pad" style={{ padding: "22px 24px" }}>

            {/* ── OVERVIEW ── */}
            {activeNav === "overview" && (
              <div>
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
                  {statsCards.map((s) => (
                    <div key={s.label} style={{ borderRadius: 16, padding: "16px 18px", background: "#111118", border: "1px solid #ffffff0d" }}>
                      <p style={{ color: "#ffffff40", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</p>
                      <p style={{ color: s.accent, fontSize: 28, fontWeight: 700, fontFamily: "'DM Mono', monospace", letterSpacing: "-1px", marginBottom: 4 }}>{s.value}</p>
                      <p style={{ color: "#ffffff30", fontSize: 11 }}>{s.delta}</p>
                    </div>
                  ))}
                </div>

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
                  {/* Recent EBG */}
                  <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid #ffffff0d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Akses Darurat Terbaru</h3>
                      <span style={{ background: "#FF6B6B18", color: "#FF6B6B", border: "1px solid #FF6B6B30", padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>7 total</span>
                    </div>
                    {mockEbgLogs.map((log) => (
                      <div key={log.id} className="table-row" style={{ padding: "12px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF6B6B18", border: "1px solid #FF6B6B30", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>🚨</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{log.doctor} · <span style={{ color: "#ffffff50" }}>{log.hospital}</span></p>
                          <p style={{ color: "#ffffff35", fontSize: 10, marginTop: 2 }}>{log.time} · {log.type}</p>
                        </div>
                        <EbgStatusBadge status={log.status} />
                      </div>
                    ))}
                    <div style={{ padding: "10px 18px" }}>
                      <button onClick={() => setActiveNav("ebg")} style={{ width: "100%", padding: "9px", borderRadius: 10, background: "#ffffff08", border: "1px solid #ffffff0d", color: "#ffffff40", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        Lihat Semua EBG Log →
                      </button>
                    </div>
                  </div>

                  {/* Revenue chart + pending */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Revenue SGT</h3>
                        <div style={{ display: "flex", gap: 10 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#ffffff40" }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#AAFF00", display: "inline-block" }} /> Rekam
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#ffffff40" }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#FFD93D", display: "inline-block" }} /> Export
                          </span>
                        </div>
                      </div>
                      <MiniBarChart />
                    </div>

                    <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #FFD93D25", padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <h3 style={{ color: "#FFD93D", fontSize: 13, fontWeight: 600 }}>⏳ Dokter Pending</h3>
                        <span style={{ background: "#FFD93D18", color: "#FFD93D", border: "1px solid #FFD93D30", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
                          {doctors.filter(d => d.role === "PENDING").length}
                        </span>
                      </div>
                      {doctors.filter(d => d.role === "PENDING").map(doc => (
                        <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #ffffff08" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{doc.name}</p>
                            <p style={{ color: "#ffffff35", fontSize: 10 }}>{doc.hospital}</p>
                          </div>
                          <button className="btn-xs btn-verify" onClick={() => verifyDoctor(doc.id)}>Verifikasi</button>
                        </div>
                      ))}
                      {doctors.filter(d => d.role === "PENDING").length === 0 && (
                        <p style={{ color: "#ffffff30", fontSize: 12, textAlign: "center", padding: "10px 0" }}>Semua dokter terverifikasi ✓</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── DOCTORS ── */}
            {activeNav === "doctors" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Manajemen Dokter</h2>
                    <p style={{ color: "#ffffff40", fontSize: 13, marginTop: 2 }}>Verifikasi & kelola akses dokter ke sistem</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { label: "Semua", count: doctors.length, active: true },
                      { label: "Verified", count: doctors.filter(d => d.role === "VERIFIED_DOCTOR").length, active: false },
                      { label: "Pending", count: doctors.filter(d => d.role === "PENDING").length, active: false },
                    ].map(tab => (
                      <div key={tab.label} style={{ padding: "6px 12px", borderRadius: 999, background: tab.active ? "#AAFF00" : "#ffffff0d", cursor: "pointer" }}>
                        <span style={{ color: tab.active ? "#0A0A0F" : "#ffffff50", fontSize: 12, fontWeight: 600 }}>{tab.label} {tab.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
                  {/* Table header */}
                  <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.4fr 100px 90px", gap: 12, padding: "10px 18px", borderBottom: "1px solid #ffffff0d" }}>
                    {["Dokter", "Rumah Sakit", "No. STR", "Status", "Aksi"].map(h => (
                      <span key={h} style={{ color: "#ffffff30", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                    ))}
                  </div>

                  {doctors.map((doc) => (
                    <div key={doc.id} className="table-row" style={{ padding: "14px 18px" }}>
                      {/* Mobile layout */}
                      <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.4fr 100px 90px", gap: 12, alignItems: "center" }}>
                        <div>
                          <p style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{doc.name}</p>
                          <p style={{ color: "#ffffff35", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{doc.id}</p>
                        </div>
                        <p style={{ color: "#ffffff60", fontSize: 12 }}>{doc.hospital}</p>
                        <p style={{ color: "#ffffff40", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{doc.str}</p>
                        <RoleBadge role={doc.role} />
                        <div style={{ display: "flex", gap: 6 }}>
                          {doc.role === "PENDING" && <button className="btn-xs btn-verify" onClick={() => verifyDoctor(doc.id)}>Verify</button>}
                          {doc.role === "VERIFIED_DOCTOR" && <button className="btn-xs btn-revoke" onClick={() => revokeDoctor(doc.id)}>Revoke</button>}
                        </div>
                      </div>
                      {/* Mobile fallback */}
                      <div style={{ display: "none" }} className="show-mobile">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{doc.name}</p>
                            <p style={{ color: "#ffffff40", fontSize: 11 }}>{doc.hospital}</p>
                            <p style={{ color: "#ffffff30", fontSize: 10, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{doc.str}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                            <RoleBadge role={doc.role} />
                            {doc.role === "PENDING" && <button className="btn-xs btn-verify" onClick={() => verifyDoctor(doc.id)}>Verify</button>}
                            {doc.role === "VERIFIED_DOCTOR" && <button className="btn-xs btn-revoke" onClick={() => revokeDoctor(doc.id)}>Revoke</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── EBG LOGS ── */}
            {activeNav === "ebg" && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Emergency Break Glass Logs</h2>
                  <p style={{ color: "#ffffff40", fontSize: 13, marginTop: 2 }}>Audit trail immutable — semua akses darurat tercatat di blockchain</p>
                </div>

                <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
                  <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 80px 120px 80px 80px", gap: 10, padding: "10px 18px", borderBottom: "1px solid #ffffff0d" }}>
                    {["EBG ID", "Dokter", "RS", "Pasien", "Tipe", "Durasi", "Status"].map(h => (
                      <span key={h} style={{ color: "#ffffff30", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                    ))}
                  </div>

                  {mockEbgLogs.map((log) => (
                    <div key={log.id} className="table-row" style={{ padding: "14px 18px" }}>
                      <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 80px 120px 80px 80px", gap: 10, alignItems: "center" }}>
                        <span style={{ color: "#AAFF00", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{log.id}</span>
                        <p style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{log.doctor}</p>
                        <p style={{ color: "#ffffff50", fontSize: 12 }}>{log.hospital}</p>
                        <p style={{ color: "#ffffff40", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{log.patient}</p>
                        <span style={{ background: "#FF6B6B12", color: "#FF6B6B", border: "1px solid #FF6B6B25", padding: "2px 7px", borderRadius: 999, fontSize: 9, fontWeight: 700 }}>{log.type}</span>
                        <p style={{ color: "#ffffff40", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{log.duration}</p>
                        <EbgStatusBadge status={log.status} />
                      </div>
                      {/* Mobile */}
                      <div style={{ display: "none" }} className="show-mobile">
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div>
                            <p style={{ color: "#AAFF00", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{log.id}</p>
                            <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{log.doctor}</p>
                            <p style={{ color: "#ffffff40", fontSize: 11 }}>{log.hospital} · {log.time}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                            <EbgStatusBadge status={log.status} />
                            <span style={{ color: "#ffffff30", fontSize: 10 }}>{log.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FEE MANAGER ── */}
            {activeNav === "fees" && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Fee Manager</h2>
                  <p style={{ color: "#ffffff40", fontSize: 13, marginTop: 2 }}>Atur biaya SGT untuk setiap jenis transaksi</p>
                </div>

                <div className="fee-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[
                    { key: "exportBase", label: "Export PDF (Base)", desc: "Biaya dasar tiap export ≤2MB", icon: "📤" },
                    { key: "exportMult", label: "Export Multiplier", desc: "Pengali per MB untuk file besar", icon: "✕" },
                    { key: "recording", label: "Rekam Medis Baru", desc: "Biaya per rekam medis dibuat RS", icon: "📋" },
                    { key: "crossHospital", label: "Cross-Hospital Query", desc: "Biaya akses antar RS (gratis = 0)", icon: "🔄" },
                    { key: "ebg", label: "Emergency Break Glass", desc: "Biaya EBG (selalu gratis)", icon: "🚨" },
                  ].map((fee) => (
                    <div key={fee.key} style={{ borderRadius: 16, padding: "18px 20px", background: "#111118", border: "1px solid #ffffff0d" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 20 }}>{fee.icon}</span>
                          <div>
                            <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{fee.label}</p>
                            <p style={{ color: "#ffffff35", fontSize: 11 }}>{fee.desc}</p>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {editingFee === fee.key ? (
                          <>
                            <input className="fee-input" type="number" min="0" step="0.1"
                              value={feeInput} onChange={e => setFeeInput(e.target.value)}
                              autoFocus
                            />
                            <button className="btn-xs btn-verify" onClick={() => saveFee(fee.key)}>Simpan</button>
                            <button className="btn-xs btn-edit" onClick={() => setEditingFee(null)}>Batal</button>
                          </>
                        ) : (
                          <>
                            <div style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "#0A0A0F", border: "1px solid #ffffff0a", display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ color: "#AAFF00", fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{(fees as any)[fee.key]}</span>
                              <span style={{ color: "#ffffff30", fontSize: 12 }}>SGT</span>
                            </div>
                            <button className="btn-xs btn-edit" onClick={() => { setEditingFee(fee.key); setFeeInput(String((fees as any)[fee.key])); }}>Edit</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12, background: "#AAFF0008", border: "1px solid #AAFF0018", display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 14 }}>⛓</span>
                  <p style={{ color: "#AAFF0080", fontSize: 12 }}>Setiap perubahan fee akan dicatat permanen di Sui blockchain sebagai audit trail.</p>
                </div>
              </div>
            )}

            {/* ── REVENUE ── */}
            {activeNav === "revenue" && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Revenue Stats</h2>
                  <p style={{ color: "#ffffff40", fontSize: 13, marginTop: 2 }}>Ringkasan pendapatan SGT dari semua transaksi</p>
                </div>

                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Total Revenue", value: "9,240 SGT", accent: "#AAFF00" },
                    { label: "Dari Export", value: "2,240 SGT", accent: "#FFD93D" },
                    { label: "Dari Recording", value: "7,000 SGT", accent: "#00E5FF" },
                    { label: "Avg per Hari", value: "308 SGT", accent: "#FF6B6B" },
                  ].map(s => (
                    <div key={s.label} style={{ borderRadius: 14, padding: "14px 16px", background: "#111118", border: "1px solid #ffffff0d" }}>
                      <p style={{ color: "#ffffff40", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</p>
                      <p style={{ color: s.accent, fontSize: 20, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Revenue per Bulan (SGT)</h3>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#ffffff50" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: "#AAFF00", display: "inline-block" }} /> Recording
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#ffffff50" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: "#FFD93D", display: "inline-block" }} /> Export
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
                    {mockRevenue.map((d) => {
                      const max = Math.max(...mockRevenue.map(r => r.export + r.recording));
                      const eH = (d.export / max) * 120;
                      const rH = (d.recording / max) * 120;
                      return (
                        <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <p style={{ color: "#ffffff40", fontSize: 10, marginBottom: 4 }}>{d.export + d.recording}</p>
                          <div style={{ width: "70%", display: "flex", flexDirection: "column", gap: 2 }}>
                            <div style={{ height: eH, background: "#FFD93D", borderRadius: "4px 4px 0 0" }} />
                            <div style={{ height: rH, background: "#AAFF00", borderRadius: "0 0 4px 4px" }} />
                          </div>
                          <p style={{ color: "#ffffff40", fontSize: 10, marginTop: 4 }}>{d.month}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Nav mobile */}
        <nav className="bottom-nav" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: "#111118", borderTop: "1px solid #ffffff0d", padding: "6px 0", zIndex: 30, justifyContent: "space-around" }}>
          {NAV.map((item) => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 10px", background: "transparent", border: "none", cursor: "pointer" }}>
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              <span style={{ fontSize: 9, fontWeight: activeNav === item.id ? 700 : 400, color: activeNav === item.id ? "#AAFF00" : "#ffffff30", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}