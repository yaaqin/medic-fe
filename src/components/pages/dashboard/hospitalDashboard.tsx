"use client";

import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────
const mockPatients = [
  { nik: "••••7890123", name: "Budi Santoso", lastVisit: "2024-05-18", records: 4, status: "active" },
  { nik: "••••4561234", name: "Siti Rahayu", lastVisit: "2024-05-15", records: 2, status: "active" },
  { nik: "••••8902345", name: "Ahmad Subagjo", lastVisit: "2024-05-10", records: 6, status: "active" },
  { nik: "••••2345678", name: "Dewi Lestari", lastVisit: "2024-05-05", records: 1, status: "inactive" },
];

const mockRecords = [
  { id: "REC-2024-0041", patient: "Budi Santoso", doctor: "dr. Ahmad Fauzi", diagnosis: "Hipertensi Grade II", date: "2024-05-18", fee: 1, txHash: "0x5f8e...9d" },
  { id: "REC-2024-0040", patient: "Siti Rahayu", doctor: "dr. Ahmad Fauzi", diagnosis: "ISPA ringan", date: "2024-05-15", fee: 1, txHash: "0x4c7d...2a" },
  { id: "REC-2024-0039", patient: "Ahmad Subagjo", doctor: "dr. Rina Susanti", diagnosis: "Diabetes Tipe 2 — kontrol", date: "2024-05-10", fee: 1, txHash: "0x3b6c...1f" },
  { id: "REC-2024-0038", patient: "Budi Santoso", doctor: "dr. Bambang W.", diagnosis: "Konsultasi Kardiologi", date: "2024-05-05", fee: 1, txHash: "0x2a5b...8e" },
];

const mockAccessLogs = [
  { hospital: "RSUD Abdul Moeloek", patient: "Budi Santoso", records: 3, time: "2024-05-18 14:32", type: "normal" },
  { hospital: "Praktik dr. Rina", patient: "Ahmad Subagjo", records: 2, time: "2024-05-17 09:10", type: "normal" },
  { hospital: "Klinik Medika Utama", patient: "Siti Rahayu", records: 1, time: "2024-05-16 16:45", type: "normal" },
];

const NAV = [
  { icon: "⬡", label: "Overview", id: "overview" },
  { icon: "👤", label: "Pasien", id: "patients" },
  { icon: "📋", label: "Rekam Medis", id: "records" },
  { icon: "🔍", label: "Akses Log", id: "logs" },
  { icon: "💰", label: "Saldo SGT", id: "wallet" },
];

// ── Form for creating a new record ────────────────────────
function CreateRecordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ nik: "", ibu: "", diagnosis: "", treatment: "", doctor: "", notes: "" });
  const [nikFocused, setNikFocused] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [loading, setLoading] = useState(false);

  const formatNik = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("done"); }, 2000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backdropFilter: "blur(3px)" }}>
      <div style={{ background: "#111118", border: "1px solid #ffffff12", borderRadius: 20, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #ffffff0d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Buat Rekam Medis Baru</h3>
            <p style={{ color: "#ffffff40", fontSize: 12, marginTop: 2 }}>Biaya: 1 SGT per rekam medis</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#ffffff40", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ padding: "20px 22px" }}>
          {step === "done" ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#AAFF0015", border: "2px solid #AAFF0040", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>✓</div>
              <h4 style={{ color: "#AAFF00", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Rekam Medis Tersimpan!</h4>
              <p style={{ color: "#ffffff40", fontSize: 13, marginBottom: 16 }}>Data berhasil dienkripsi & dicatat di Sui blockchain.</p>
              <div style={{ background: "#0A0A0F", border: "1px solid #AAFF0015", borderRadius: 10, padding: "10px 14px", marginBottom: 20, textAlign: "left" }}>
                <p style={{ color: "#ffffff30", fontSize: 10, marginBottom: 4 }}>Blockchain TX</p>
                <p style={{ color: "#AAFF00", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>0x{Math.random().toString(16).slice(2, 14)}...</p>
              </div>
              <button onClick={onClose} style={{ width: "100%", padding: "12px", background: "#AAFF00", border: "none", borderRadius: 10, color: "#0A0A0F", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Selesai</button>
            </div>
          ) : step === "confirm" ? (
            <div>
              <div style={{ background: "#0A0A0F", border: "1px solid #ffffff0a", borderRadius: 12, padding: "4px 14px", marginBottom: 16 }}>
                {[
                  { label: "NIK Pasien", value: form.nik },
                  { label: "Diagnosis", value: form.diagnosis },
                  { label: "Treatment", value: form.treatment },
                  { label: "Dokter", value: form.doctor },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #ffffff08" }}>
                    <span style={{ color: "#ffffff40", fontSize: 12 }}>{row.label}</span>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 500, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#FFD93D08", border: "1px solid #FFD93D25", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 8 }}>
                <span style={{ fontSize: 14 }}>💰</span>
                <p style={{ color: "#FFD93D", fontSize: 12 }}>1 SGT akan dikurangi dari saldo rumah sakit Anda.</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep("form")} style={{ flex: "0 0 auto", padding: "12px 16px", background: "transparent", border: "1px solid #ffffff0d", borderRadius: 10, color: "#ffffff50", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Edit</button>
                <button onClick={submit} disabled={loading} style={{ flex: 1, padding: "12px", background: "#AAFF00", border: "none", borderRadius: 10, color: "#0A0A0F", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Menyimpan ke blockchain..." : "Konfirmasi & Simpan"}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "nik", label: "NIK Pasien", placeholder: "3271 0000 0000 0000", mono: true, type: "text" },
                { key: "ibu", label: "Nama Ibu Kandung", placeholder: "Untuk verifikasi pasien", mono: false, type: "password" },
                { key: "diagnosis", label: "Diagnosis", placeholder: "Diagnosis utama", mono: false, type: "text" },
                { key: "treatment", label: "Tindakan / Treatment", placeholder: "Tindakan medis yang diberikan", mono: false, type: "text" },
                { key: "doctor", label: "Nama Dokter", placeholder: "dr. Nama Dokter", mono: false, type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 7 }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: field.key === "nik" ? formatNik(e.target.value) : e.target.value }))}
                    style={{ width: "100%", background: "#0A0A0F", border: `1px solid ${nikFocused && field.key === "nik" ? "#AAFF0050" : "#ffffff0d"}`, borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: field.mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif", outline: "none" }}
                    onFocus={() => setNikFocused(true)}
                    onBlur={() => setNikFocused(false)}
                    autoComplete="off"
                  />
                </div>
              ))}
              <div>
                <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 7 }}>Catatan Dokter</label>
                <textarea
                  placeholder="Catatan tambahan (opsional)"
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  style={{ width: "100%", background: "#0A0A0F", border: "1px solid #ffffff0d", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical" }}
                />
              </div>
              <button onClick={() => setStep("confirm")} disabled={!form.nik || !form.diagnosis || !form.doctor}
                style={{ padding: "13px", background: "#AAFF00", border: "none", borderRadius: 10, color: "#0A0A0F", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", opacity: (!form.nik || !form.diagnosis || !form.doctor) ? 0.4 : 1, transition: "opacity 0.2s" }}>
                Review Data →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function HospitalDashboard() {
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 2px; }
        .nav-item { cursor: pointer; transition: all 0.15s; border-radius: 10px; display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
        .nav-item:hover { background: #1a1a24; }
        .nav-item-active { background: #1a2a1a !important; }
        .table-row { border-bottom: 1px solid #ffffff08; transition: background 0.12s; }
        .table-row:hover { background: #1a1a24; }
        .table-row:last-child { border-bottom: none; }
        .btn-primary { background: #AAFF00; color: #0A0A0F; border: none; border-radius: 10px; padding: 9px 16px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .btn-primary:hover { background: #C8FF40; }
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
          .content-pad { padding: 14px 12px 80px !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {showCreateModal && <CreateRecordModal onClose={() => setShowCreateModal(false)} />}

      {/* ── Desktop Sidebar ── */}
      <aside className="desktop-sidebar" style={{ width: 220, background: "#111118", borderRight: "1px solid #ffffff0d", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>SuiMedis</p>
            <p style={{ color: "#00E5FF", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>Hospital Portal</p>
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

        <div style={{ margin: "0 10px 14px", padding: "10px 12px", borderRadius: 12, background: "#00E5FF0d", border: "1px solid #00E5FF20" }}>
          <p style={{ color: "#00E5FF", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>Puskesmas Rajabasa</p>
          <p style={{ color: "#ffffff40", fontSize: 10 }}>PKM-C · Lampung</p>
          <p style={{ color: "#AAFF00", fontSize: 11, fontWeight: 600, marginTop: 6, fontFamily: "'DM Mono', monospace" }}>128.5 SGT</p>
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
              <p style={{ color: "#00E5FF", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>Hospital Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "#ffffff50", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ margin: "0 10px 12px", padding: "10px 12px", borderRadius: 10, background: "#00E5FF0d", border: "1px solid #00E5FF20" }}>
          <p style={{ color: "#00E5FF", fontSize: 12, fontWeight: 700 }}>Puskesmas Rajabasa</p>
          <p style={{ color: "#AAFF00", fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace", marginTop: 4 }}>128.5 SGT</p>
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
            <h1 style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>
              {NAV.find(n => n.id === activeNav)?.label}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              + Rekam Medis
            </button>
            <div style={{ padding: "5px 12px", borderRadius: 999, background: "#00E5FF12", border: "1px solid #00E5FF25", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5FF" }} />
              <span style={{ color: "#00E5FF", fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>128.5 SGT</span>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div className="content-pad" style={{ padding: "22px 24px" }}>

            {/* ── OVERVIEW ── */}
            {activeNav === "overview" && (
              <div>
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Total Pasien", value: "4", sub: "Terdaftar", accent: "#AAFF00" },
                    { label: "Rekam Medis", value: "41", sub: "Dibuat RS ini", accent: "#00E5FF" },
                    { label: "Saldo SGT", value: "128.5", sub: "Tersisa", accent: "#FFD93D" },
                    { label: "SGT Terpakai", value: "41", sub: "Biaya recording", accent: "#FF6B6B" },
                  ].map((s) => (
                    <div key={s.label} style={{ borderRadius: 16, padding: "14px 16px", background: "#111118", border: "1px solid #ffffff0d" }}>
                      <p style={{ color: "#ffffff40", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{s.label}</p>
                      <p style={{ color: s.accent, fontSize: 26, fontWeight: 700, fontFamily: "'DM Mono', monospace", letterSpacing: "-1px", marginBottom: 2 }}>{s.value}</p>
                      <p style={{ color: "#ffffff30", fontSize: 11 }}>{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Recent records */}
                  <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid #ffffff0d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Rekam Medis Terbaru</h3>
                      <button className="btn-primary" style={{ fontSize: 11, padding: "5px 12px" }} onClick={() => setShowCreateModal(true)}>+ Baru</button>
                    </div>
                    {mockRecords.slice(0, 3).map((rec) => (
                      <div key={rec.id} className="table-row" style={{ padding: "12px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#AAFF0015", border: "1px solid #AAFF0025", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>📋</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: "#fff", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rec.patient}</p>
                          <p style={{ color: "#ffffff35", fontSize: 10, marginTop: 1 }}>{rec.diagnosis}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ color: "#FFD93D", fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>-{rec.fee} SGT</p>
                          <p style={{ color: "#ffffff30", fontSize: 10, marginTop: 1 }}>{rec.date}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: "10px 18px" }}>
                      <button onClick={() => setActiveNav("records")} style={{ width: "100%", padding: "9px", borderRadius: 10, background: "#ffffff08", border: "1px solid #ffffff0d", color: "#ffffff40", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        Lihat Semua →
                      </button>
                    </div>
                  </div>

                  {/* Access log */}
                  <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid #ffffff0d" }}>
                      <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Data Diakses RS Lain</h3>
                    </div>
                    {mockAccessLogs.map((log, i) => (
                      <div key={i} className="table-row" style={{ padding: "12px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#00E5FF12", border: "1px solid #00E5FF25", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13 }}>🔍</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: "#fff", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{log.hospital}</p>
                          <p style={{ color: "#ffffff35", fontSize: 10, marginTop: 1 }}>Pasien: {log.patient} · {log.records} rekam</p>
                        </div>
                        <p style={{ color: "#ffffff30", fontSize: 10, flexShrink: 0 }}>{log.time.split(" ")[1]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── PATIENTS ── */}
            {activeNav === "patients" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Data Pasien</h2>
                    <p style={{ color: "#ffffff40", fontSize: 13, marginTop: 2 }}>Pasien yang pernah berkunjung ke faskes ini</p>
                  </div>
                </div>
                <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
                  <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 100px 80px", gap: 10, padding: "10px 18px", borderBottom: "1px solid #ffffff0d" }}>
                    {["NIK", "Nama Pasien", "Kunjungan Terakhir", "Total Rekam", "Status"].map(h => (
                      <span key={h} style={{ color: "#ffffff30", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                    ))}
                  </div>
                  {mockPatients.map((p, i) => (
                    <div key={i} className="table-row" style={{ padding: "14px 18px" }}>
                      <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 100px 80px", gap: 10, alignItems: "center" }}>
                        <p style={{ color: "#ffffff50", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{p.nik}</p>
                        <p style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{p.name}</p>
                        <p style={{ color: "#ffffff50", fontSize: 12 }}>{p.lastVisit}</p>
                        <p style={{ color: "#00E5FF", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{p.records}</p>
                        <span style={{ background: p.status === "active" ? "#AAFF0018" : "#ffffff0d", color: p.status === "active" ? "#AAFF00" : "#ffffff40", border: `1px solid ${p.status === "active" ? "#AAFF0030" : "#ffffff15"}`, padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
                          {p.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </div>
                      {/* Mobile */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{p.name}</p>
                          <p style={{ color: "#ffffff40", fontSize: 11, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{p.nik}</p>
                          <p style={{ color: "#ffffff30", fontSize: 10, marginTop: 1 }}>Kunjungan terakhir: {p.lastVisit}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: "#00E5FF", fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{p.records}</p>
                          <p style={{ color: "#ffffff30", fontSize: 10 }}>rekam</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── RECORDS ── */}
            {activeNav === "records" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Rekam Medis</h2>
                    <p style={{ color: "#ffffff40", fontSize: 13, marginTop: 2 }}>Semua rekam medis yang dibuat oleh faskes ini</p>
                  </div>
                  <button className="btn-primary" onClick={() => setShowCreateModal(true)}>+ Rekam Medis Baru</button>
                </div>
                <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
                  <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1.2fr 100px 90px", gap: 10, padding: "10px 18px", borderBottom: "1px solid #ffffff0d" }}>
                    {["ID", "Pasien", "Dokter", "Diagnosis", "Tanggal", "Fee"].map(h => (
                      <span key={h} style={{ color: "#ffffff30", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                    ))}
                  </div>
                  {mockRecords.map((rec) => (
                    <div key={rec.id} className="table-row" style={{ padding: "13px 18px" }}>
                      <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1.2fr 100px 90px", gap: 10, alignItems: "center" }}>
                        <span style={{ color: "#AAFF00", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{rec.id}</span>
                        <p style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{rec.patient}</p>
                        <p style={{ color: "#ffffff50", fontSize: 12 }}>{rec.doctor}</p>
                        <p style={{ color: "#ffffff60", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rec.diagnosis}</p>
                        <p style={{ color: "#ffffff40", fontSize: 11 }}>{rec.date}</p>
                        <span style={{ background: "#FFD93D12", color: "#FFD93D", border: "1px solid #FFD93D25", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{rec.fee} SGT</span>
                      </div>
                      {/* Mobile */}
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ color: "#AAFF00", fontSize: 10, fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>{rec.id}</p>
                          <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{rec.patient}</p>
                          <p style={{ color: "#ffffff40", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rec.diagnosis}</p>
                          <p style={{ color: "#ffffff30", fontSize: 10, marginTop: 2 }}>{rec.doctor} · {rec.date}</p>
                        </div>
                        <span style={{ background: "#FFD93D12", color: "#FFD93D", border: "1px solid #FFD93D25", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, flexShrink: 0, height: "fit-content" }}>{rec.fee} SGT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ACCESS LOGS ── */}
            {activeNav === "logs" && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Log Akses Data</h2>
                  <p style={{ color: "#ffffff40", fontSize: 13, marginTop: 2 }}>Rekam medis dari faskes ini yang diakses RS lain</p>
                </div>
                <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
                  {mockAccessLogs.map((log, i) => (
                    <div key={i} className="table-row" style={{ padding: "14px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#00E5FF12", border: "1px solid #00E5FF25", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>🔍</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{log.hospital}</p>
                        <p style={{ color: "#ffffff40", fontSize: 11, marginTop: 2 }}>Pasien: {log.patient} · {log.records} rekam diakses</p>
                        <p style={{ color: "#ffffff25", fontSize: 10, marginTop: 1 }}>{log.time}</p>
                      </div>
                      <span style={{ background: "#AAFF0012", color: "#AAFF00", border: "1px solid #AAFF0025", padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>On-Chain ✓</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── WALLET ── */}
            {activeNav === "wallet" && (
              <div>
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Saldo SGT</h2>
                  <p style={{ color: "#ffffff40", fontSize: 13, marginTop: 2 }}>Wallet rumah sakit untuk biaya transaksi</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="two-col">
                  {/* Wallet card */}
                  <div style={{ borderRadius: 18, padding: 22, background: "linear-gradient(135deg, #1a2a1a 0%, #0f1f0f 100%)", border: "1px solid #AAFF0030", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 140, height: 140, borderRadius: "50%", background: "#AAFF00", opacity: 0.07, transform: "translate(35%, -35%)" }} />
                    <p style={{ color: "#AAFF0070", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Saldo Tersedia</p>
                    <p style={{ color: "#AAFF00", fontSize: 42, fontWeight: 700, fontFamily: "'DM Mono', monospace", letterSpacing: "-2px", marginBottom: 4 }}>128.5</p>
                    <p style={{ color: "#AAFF0060", fontSize: 13, marginBottom: 20 }}>SuiGovToken</p>
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(10,10,15,0.5)", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ color: "#ffffff30", fontSize: 10 }}>Wallet RS</p>
                        <p style={{ color: "#ffffff80", fontSize: 11, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>0x9f3c...2b7d</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color: "#ffffff30", fontSize: 10 }}>Network</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#AAFF00" }} />
                          <span style={{ color: "#AAFF00", fontSize: 11 }}>Sui Mainnet</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SGT summary */}
                  <div style={{ borderRadius: 18, padding: 22, background: "#111118", border: "1px solid #ffffff0d" }}>
                    <p style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>Ringkasan Pengeluaran</p>
                    {[
                      { label: "Rekam Medis (41 records)", value: "41 SGT", color: "#FF6B6B" },
                      { label: "Export PDF (3x)", value: "4.2 SGT", color: "#FFD93D" },
                      { label: "Cross-Hospital Query", value: "0 SGT", color: "#00E5FF" },
                      { label: "Total Terpakai", value: "45.2 SGT", color: "#ffffff60" },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #ffffff08" }}>
                        <span style={{ color: "#ffffff50", fontSize: 12 }}>{item.label}</span>
                        <span style={{ color: item.color, fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{item.value}</span>
                      </div>
                    ))}
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