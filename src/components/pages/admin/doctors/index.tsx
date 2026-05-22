"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────
type DoctorRole = "VERIFIED_DOCTOR" | "PENDING" | "REVOKED";

interface Doctor {
  id: string;
  name: string;
  hospital: string;
  hospitalCode: string;
  str: string;
  sip: string;
  nik: string;
  specialization: string;
  role: DoctorRole;
  since: string;
  ebgCount: number;
  lastActive: string;
}

// ── Mock Data ────────────────────────────────────────────
const INITIAL_DOCTORS: Doctor[] = [
  { id: "DOC-0001", name: "dr. Ahmad Fauzi", hospital: "Puskesmas Rajabasa", hospitalCode: "PKM-C", str: "503/001/STR/2023", sip: "SIP/001/DINKES/2024", nik: "3271••••••••0001", specialization: "Dokter Umum", role: "VERIFIED_DOCTOR", since: "2024-01-10", ebgCount: 2, lastActive: "2024-05-18" },
  { id: "DOC-0002", name: "dr. Rina Susanti", hospital: "Praktik dr. Rina", hospitalCode: "PRK-A", str: "503/002/STR/2023", sip: "SIP/002/DINKES/2024", nik: "3271••••••••0002", specialization: "Dokter Umum", role: "VERIFIED_DOCTOR", since: "2024-02-05", ebgCount: 0, lastActive: "2024-05-17" },
  { id: "DOC-0003", name: "dr. Bambang Wicaksono", hospital: "RSUD Abdul Moeloek", hospitalCode: "RSUD-B", str: "503/003/STR/2022", sip: "SIP/003/DINKES/2023", nik: "3271••••••••0003", specialization: "Emergency Medicine", role: "VERIFIED_DOCTOR", since: "2024-01-22", ebgCount: 5, lastActive: "2024-05-19" },
  { id: "DOC-0004", name: "dr. Laila Fitri", hospital: "Klinik Medika Utama", hospitalCode: "KMU-D", str: "503/004/STR/2024", sip: "SIP/004/DINKES/2024", nik: "3271••••••••0004", specialization: "Dokter Umum", role: "PENDING", since: "2024-05-18", ebgCount: 0, lastActive: "-" },
  { id: "DOC-0005", name: "dr. Hendra Putra", hospital: "RSUD Abdul Moeloek", hospitalCode: "RSUD-B", str: "503/005/STR/2023", sip: "SIP/005/DINKES/2023", nik: "3271••••••••0005", specialization: "Kardiologi", role: "PENDING", since: "2024-05-19", ebgCount: 0, lastActive: "-" },
  { id: "DOC-0006", name: "dr. Sari Dewanti", hospital: "Puskesmas Kedaton", hospitalCode: "PKM-E", str: "503/006/STR/2023", sip: "SIP/006/DINKES/2023", nik: "3271••••••••0006", specialization: "Dokter Umum", role: "REVOKED", since: "2024-03-10", ebgCount: 1, lastActive: "2024-04-01" },
];

const HOSPITALS = ["Semua RS", "Puskesmas Rajabasa", "Praktik dr. Rina", "RSUD Abdul Moeloek", "Klinik Medika Utama", "Puskesmas Kedaton"];

const NAV = [
  { icon: "⬡", label: "Overview", href: "/admin/dashboard" },
  { icon: "👨‍⚕️", label: "Dokter", href: "/admin/dashboard/doctors", active: true },
  { icon: "🚨", label: "EBG Logs", href: "/admin/dashboard/ebg" },
  { icon: "💰", label: "Fee Manager", href: "/admin/dashboard/fees" },
  { icon: "📊", label: "Revenue", href: "/admin/dashboard/revenue" },
];

// ── Shared Sidebar ───────────────────────────────────────
function AdminSidebar({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div style={{ padding: "20px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>SuiMedis</p>
            <p style={{ color: "#FF6B6B", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>Admin Panel</p>
          </div>
        </div>
        {onClose && <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#ffffff50", fontSize: 18, cursor: "pointer" }}>✕</button>}
      </div>
      <nav style={{ flex: 1, padding: "4px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map((item) => (
          <a key={item.href} href={item.href} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, borderLeft: item.active ? "2px solid #AAFF00" : "2px solid transparent", background: item.active ? "#1a2a1a" : "transparent", cursor: "pointer" }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? "#AAFF00" : "#ffffff60" }}>{item.label}</span>
            </div>
          </a>
        ))}
      </nav>
      <div style={{ margin: "0 10px 14px", padding: "10px 12px", borderRadius: 12, background: "#FF6B6B12", border: "1px solid #FF6B6B25" }}>
        <p style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Super Admin</p>
        <p style={{ color: "#ffffff40", fontSize: 10 }}>ADM-0001 · Full Access</p>
      </div>
    </>
  );
}

// ── Role Badge ───────────────────────────────────────────
function RoleBadge({ role }: { role: DoctorRole }) {
  const map = {
    VERIFIED_DOCTOR: { bg: "#AAFF0018", color: "#AAFF00", border: "#AAFF0035", label: "✓ Verified" },
    PENDING: { bg: "#FFD93D18", color: "#FFD93D", border: "#FFD93D35", label: "⏳ Pending" },
    REVOKED: { bg: "#ffffff0d", color: "#ffffff40", border: "#ffffff18", label: "✕ Revoked" },
  };
  const s = map[role];
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{s.label}</span>;
}

// ── Doctor Detail Modal ──────────────────────────────────
function DoctorModal({ doctor, onClose, onVerify, onRevoke }: { doctor: Doctor; onClose: () => void; onVerify: (id: string) => void; onRevoke: (id: string) => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#111118", border: "1px solid #ffffff12", borderRadius: 20, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #ffffff0d", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#AAFF0015", border: "1px solid #AAFF0030", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🩺</div>
            <div>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{doctor.name}</h3>
              <p style={{ color: "#ffffff40", fontSize: 12, marginTop: 2 }}>{doctor.id} · {doctor.specialization}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#ffffff40", fontSize: 20, cursor: "pointer", flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
            <span style={{ color: "#ffffff50", fontSize: 13 }}>Status Verifikasi</span>
            <RoleBadge role={doctor.role} />
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Rumah Sakit", value: doctor.hospital },
              { label: "Spesialisasi", value: doctor.specialization },
              { label: "No. STR", value: doctor.str },
              { label: "No. SIP", value: doctor.sip },
              { label: "NIK", value: doctor.nik },
              { label: "Terdaftar", value: doctor.since },
              { label: "EBG Digunakan", value: `${doctor.ebgCount}x` },
              { label: "Terakhir Aktif", value: doctor.lastActive },
            ].map((item) => (
              <div key={item.label} style={{ padding: "10px 12px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
                <p style={{ color: "#ffffff35", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 500, fontFamily: item.label.includes("No.") || item.label === "NIK" ? "'DM Mono', monospace" : "inherit" }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Blockchain hash */}
          <div style={{ padding: "10px 14px", borderRadius: 10, background: "#AAFF0008", border: "1px solid #AAFF0018", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>⛓</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#AAFF0070", fontSize: 10 }}>On-chain Registry TX</p>
              <p style={{ color: "#AAFF00", fontSize: 11, fontFamily: "'DM Mono', monospace", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                0x{doctor.id.replace("DOC-", "")}f8e9d2a4b1c3...sui_mainnet
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {doctor.role === "PENDING" && (
              <button onClick={() => { onVerify(doctor.id); onClose(); }}
                style={{ flex: 1, padding: "12px", background: "#AAFF00", border: "none", borderRadius: 10, color: "#0A0A0F", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ✓ Verifikasi Dokter
              </button>
            )}
            {doctor.role === "VERIFIED_DOCTOR" && (
              <>
                <button onClick={() => { onRevoke(doctor.id); onClose(); }}
                  style={{ flex: 1, padding: "12px", background: "#FF6B6B15", border: "1px solid #FF6B6B35", borderRadius: 10, color: "#FF6B6B", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Cabut Akses
                </button>
                <button style={{ flex: 1, padding: "12px", background: "#ffffff08", border: "1px solid #ffffff12", borderRadius: 10, color: "#ffffff60", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Lihat EBG Log
                </button>
              </>
            )}
            {doctor.role === "REVOKED" && (
              <button onClick={() => { onVerify(doctor.id); onClose(); }}
                style={{ flex: 1, padding: "12px", background: "#AAFF0015", border: "1px solid #AAFF0030", borderRadius: 10, color: "#AAFF00", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Aktifkan Kembali
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────
export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [filterRole, setFilterRole] = useState<"ALL" | DoctorRole>("ALL");
  const [filterHospital, setFilterHospital] = useState("Semua RS");
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);

  const showToast = (msg: string, color: string) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const verifyDoctor = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, role: "VERIFIED_DOCTOR" } : d));
    showToast("Dokter berhasil diverifikasi ✓", "#AAFF00");
  };

  const revokeDoctor = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, role: "REVOKED" } : d));
    showToast("Akses dokter dicabut", "#FF6B6B");
  };

  const filtered = doctors.filter(d => {
    const matchRole = filterRole === "ALL" || d.role === filterRole;
    const matchHospital = filterHospital === "Semua RS" || d.hospital === filterHospital;
    const matchSearch = search === "" || d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()) || d.str.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchHospital && matchSearch;
  });

  const counts = {
    ALL: doctors.length,
    VERIFIED_DOCTOR: doctors.filter(d => d.role === "VERIFIED_DOCTOR").length,
    PENDING: doctors.filter(d => d.role === "PENDING").length,
    REVOKED: doctors.filter(d => d.role === "REVOKED").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 2px; }
        .table-row { border-bottom: 1px solid #ffffff08; transition: background 0.12s; cursor: pointer; }
        .table-row:hover { background: #1a1a26; }
        .table-row:last-child { border-bottom: none; }
        .filter-btn { cursor: pointer; border: none; border-radius: 999px; font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 12px; padding: 6px 14px; transition: all 0.15s; }
        .hospital-select { background: #111118; border: 1px solid #ffffff12; border-radius: 10px; color: #ffffff70; font-family: 'DM Sans',sans-serif; font-size: 12px; padding: 7px 12px; outline: none; cursor: pointer; }
        .hospital-select:focus { border-color: #AAFF0040; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 40; }
        .drawer { position: fixed; top: 0; left: 0; height: 100vh; width: 240px; background: #111118; border-right: 1px solid #ffffff0d; z-index: 50; transform: translateX(-100%); transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; }
        .drawer-open { transform: translateX(0) !important; }
        .desktop-sidebar { display: flex; }
        .hamburger { display: none !important; }
        .bottom-nav { display: none !important; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .toast { animation: toastIn 0.3s ease; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .hamburger { display: flex !important; }
          .bottom-nav { display: flex !important; }
          .content-pad { padding: 14px 12px 80px !important; }
          .hide-mobile { display: none !important; }
          .table-row-grid { grid-template-columns: 1fr !important; }
          .filter-row { flex-wrap: wrap; gap: 8px !important; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1a1a24", border: `1px solid ${toast.color}40`, borderRadius: 12, padding: "12px 20px", zIndex: 200, display: "flex", alignItems: "center", gap: 10, boxShadow: `0 8px 32px ${toast.color}20` }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: toast.color, flexShrink: 0 }} />
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{toast.msg}</span>
        </div>
      )}

      {selectedDoctor && (
        <DoctorModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} onVerify={verifyDoctor} onRevoke={revokeDoctor} />
      )}

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{ width: 220, background: "#111118", borderRight: "1px solid #ffffff0d", flexDirection: "column", flexShrink: 0 }}>
        <AdminSidebar />
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && <div className="drawer-overlay" onClick={() => setSidebarOpen(false)} />}
      <div className={`drawer ${sidebarOpen ? "drawer-open" : ""}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{ height: 56, borderBottom: "1px solid #ffffff0d", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}
              style={{ width: 36, height: 36, borderRadius: 8, background: "#ffffff0d", border: "1px solid #ffffff0d", display: "none", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}>
              {[0,1,2].map(i => <span key={i} style={{ display: "block", width: i===2?12:16, height: 1.5, background: "#fff", borderRadius: 2 }} />)}
            </button>
            <div>
              <h1 style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Manajemen Dokter</h1>
              <p style={{ color: "#ffffff30", fontSize: 11 }}>Verifikasi & kelola akses dokter</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {counts.PENDING > 0 && (
              <div style={{ padding: "5px 12px", borderRadius: 999, background: "#FFD93D15", border: "1px solid #FFD93D30", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD93D" }} />
                <span style={{ color: "#FFD93D", fontSize: 11, fontWeight: 600 }}>{counts.PENDING} Pending</span>
              </div>
            )}
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF6B6B22", border: "1px solid #FF6B6B44", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 700 }}>SA</span>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div className="content-pad" style={{ padding: "20px 24px" }}>

            {/* Stat pills */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {[
                { role: "ALL" as const, label: "Semua Dokter", count: counts.ALL, color: "#ffffff60" },
                { role: "VERIFIED_DOCTOR" as const, label: "Verified", count: counts.VERIFIED_DOCTOR, color: "#AAFF00" },
                { role: "PENDING" as const, label: "Pending", count: counts.PENDING, color: "#FFD93D" },
                { role: "REVOKED" as const, label: "Revoked", count: counts.REVOKED, color: "#FF6B6B" },
              ].map(f => (
                <button key={f.role} className="filter-btn" onClick={() => setFilterRole(f.role)}
                  style={{ background: filterRole === f.role ? f.color + "20" : "#111118", color: filterRole === f.role ? f.color : "#ffffff40", border: `1px solid ${filterRole === f.role ? f.color + "40" : "#ffffff0d"}` }}>
                  {f.label} <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{f.count}</span>
                </button>
              ))}
            </div>

            {/* Filter + Search row */}
            <div className="filter-row" style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
              <select className="hospital-select" value={filterHospital} onChange={e => setFilterHospital(e.target.value)}>
                {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#ffffff30", fontSize: 13 }}>🔍</span>
                <input
                  placeholder="Cari nama, ID, atau STR..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{ width: "100%", background: "#111118", border: `1px solid ${searchFocused ? "#AAFF0040" : "#ffffff0d"}`, borderRadius: 10, padding: "8px 12px 8px 36px", color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxShadow: searchFocused ? "0 0 0 3px #AAFF0010" : "none", transition: "all 0.2s" }}
                />
              </div>
              <span style={{ color: "#ffffff30", fontSize: 12, whiteSpace: "nowrap" }}>{filtered.length} dokter</span>
            </div>

            {/* Pending banner */}
            {filterRole === "ALL" && counts.PENDING > 0 && (
              <div style={{ background: "#FFD93D08", border: "1px solid #FFD93D25", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>⏳</span>
                <p style={{ color: "#FFD93D", fontSize: 13, fontWeight: 500 }}>
                  Ada <strong>{counts.PENDING} dokter</strong> menunggu verifikasi. Klik baris untuk melihat detail dan memverifikasi.
                </p>
              </div>
            )}

            {/* Table */}
            <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
              {/* Table header - desktop */}
              <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "44px 1fr 1.1fr 1.3fr 1.1fr 90px 80px", gap: 10, padding: "10px 18px", borderBottom: "1px solid #ffffff0d" }}>
                {["", "Dokter", "Rumah Sakit", "No. STR / SIP", "Spesialisasi", "EBG", "Status"].map(h => (
                  <span key={h} style={{ color: "#ffffff25", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{ padding: "40px 18px", textAlign: "center" }}>
                  <p style={{ color: "#ffffff30", fontSize: 14 }}>Tidak ada dokter yang sesuai filter</p>
                </div>
              ) : filtered.map((doc) => (
                <div key={doc.id} className="table-row" onClick={() => setSelectedDoctor(doc)} style={{ padding: "14px 18px" }}>
                  {/* Desktop row */}
                  <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "44px 1fr 1.1fr 1.3fr 1.1fr 90px 80px", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: doc.role === "VERIFIED_DOCTOR" ? "#AAFF0015" : doc.role === "PENDING" ? "#FFD93D15" : "#ffffff0d", border: `1px solid ${doc.role === "VERIFIED_DOCTOR" ? "#AAFF0025" : doc.role === "PENDING" ? "#FFD93D25" : "#ffffff12"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      🩺
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{doc.name}</p>
                      <p style={{ color: "#ffffff35", fontSize: 10, fontFamily: "'DM Mono',monospace", marginTop: 1 }}>{doc.id}</p>
                    </div>
                    <div>
                      <p style={{ color: "#ffffff70", fontSize: 12 }}>{doc.hospital}</p>
                      <p style={{ color: "#ffffff30", fontSize: 10, marginTop: 1 }}>{doc.hospitalCode}</p>
                    </div>
                    <div>
                      <p style={{ color: "#ffffff50", fontSize: 11, fontFamily: "'DM Mono',monospace" }}>{doc.str}</p>
                      <p style={{ color: "#ffffff25", fontSize: 10, fontFamily: "'DM Mono',monospace", marginTop: 1 }}>{doc.sip}</p>
                    </div>
                    <p style={{ color: "#ffffff50", fontSize: 12 }}>{doc.specialization}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {doc.ebgCount > 0
                        ? <span style={{ background: "#FF6B6B18", color: "#FF6B6B", border: "1px solid #FF6B6B30", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{doc.ebgCount}x</span>
                        : <span style={{ color: "#ffffff25", fontSize: 12 }}>—</span>
                      }
                    </div>
                    <RoleBadge role={doc.role} />
                  </div>

                  {/* Mobile row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: doc.role === "VERIFIED_DOCTOR" ? "#AAFF0015" : doc.role === "PENDING" ? "#FFD93D15" : "#ffffff0d", border: `1px solid ${doc.role === "VERIFIED_DOCTOR" ? "#AAFF0025" : "#ffffff12"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      🩺
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{doc.name}</p>
                      <p style={{ color: "#ffffff40", fontSize: 11, marginTop: 1 }}>{doc.hospital} · {doc.specialization}</p>
                      <p style={{ color: "#ffffff25", fontSize: 10, fontFamily: "'DM Mono',monospace", marginTop: 1 }}>{doc.str}</p>
                    </div>
                    <RoleBadge role={doc.role} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Nav mobile */}
        <nav className="bottom-nav" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: "#111118", borderTop: "1px solid #ffffff0d", padding: "6px 0", zIndex: 30, justifyContent: "space-around" }}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 10px" }}>
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              <span style={{ fontSize: 9, fontWeight: item.active ? 700 : 400, color: item.active ? "#AAFF00" : "#ffffff30", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</span>
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
}