"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────
type EbgStatus = "COMPLETED" | "EXPIRED" | "INITIATED" | "FAILED";
type EmergencyType = "LIFE_THREATENING" | "UNCONSCIOUS" | "CRITICAL_SURGERY";

interface EbgLog {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorStr: string;
  hospital: string;
  hospitalCode: string;
  patientNikHash: string;
  patientNameHint: string;
  emergencyType: EmergencyType;
  justificationHash: string;
  justification: string;
  status: EbgStatus;
  initiatedAt: string;
  completedAt: string;
  durationSeconds: number;
  recordsAccessed: string[];
  sessionId: string;
  txInitiated: string;
  txCompleted: string;
}

// ── Mock Data ────────────────────────────────────────────
const EBG_LOGS: EbgLog[] = [
  {
    id: "EBG-2024-001", doctorId: "DOC-0003", doctorName: "dr. Bambang Wicaksono", doctorStr: "503/003/STR/2022",
    hospital: "RSUD Abdul Moeloek", hospitalCode: "RSUD-B",
    patientNikHash: "0x7a3f8b2c4d5e6f...", patientNameHint: "Budi S.",
    emergencyType: "LIFE_THREATENING",
    justificationHash: "0x9f2a1b3c...",
    justification: "Pasien tidak sadarkan diri, masuk IGD dengan kondisi kritis post-kecelakaan lalu lintas. Perlu riwayat alergi dan penyakit kronis sebelum tindakan operasi darurat. Tidak ada keluarga yang bisa dihubungi.",
    status: "COMPLETED", initiatedAt: "2024-05-19 02:47:12", completedAt: "2024-05-19 02:55:34",
    durationSeconds: 502, recordsAccessed: ["REC-2024-0001", "REC-2024-0002", "REC-2024-0003", "REC-2024-0004"],
    sessionId: "EBG-SESSION-a1b2c3d4", txInitiated: "0xABC123def...", txCompleted: "0xDEF456abc...",
  },
  {
    id: "EBG-2024-002", doctorId: "DOC-0001", doctorName: "dr. Ahmad Fauzi", doctorStr: "503/001/STR/2023",
    hospital: "Puskesmas Rajabasa", hospitalCode: "PKM-C",
    patientNikHash: "0x3c1b9f2e5a7d8...", patientNameHint: "Ahmad S.",
    emergencyType: "UNCONSCIOUS",
    justificationHash: "0x4e5f6a7b...",
    justification: "Pasien ditemukan tidak sadar di jalan, dibawa ke IGD puskesmas. Butuh riwayat penyakit dan obat-obatan rutin untuk tindakan pertolongan pertama.",
    status: "COMPLETED", initiatedAt: "2024-05-17 11:03:45", completedAt: "2024-05-17 11:15:46",
    durationSeconds: 721, recordsAccessed: ["REC-2024-0010", "REC-2024-0011"],
    sessionId: "EBG-SESSION-e5f6g7h8", txInitiated: "0x123ABCdef...", txCompleted: "0x456DEFabc...",
  },
  {
    id: "EBG-2024-003", doctorId: "DOC-0002", doctorName: "dr. Rina Susanti", doctorStr: "503/002/STR/2023",
    hospital: "Praktik dr. Rina", hospitalCode: "PRK-A",
    patientNikHash: "0x8d2e4a1f7c9b0...", patientNameHint: "Dewi L.",
    emergencyType: "CRITICAL_SURGERY",
    justificationHash: "0x7c8d9e0f...",
    justification: "Pasien memerlukan operasi darurat appendektomi. Perlu riwayat operasi sebelumnya dan riwayat alergi anestesi.",
    status: "EXPIRED", initiatedAt: "2024-05-15 08:30:00", completedAt: "2024-05-15 08:45:00",
    durationSeconds: 900, recordsAccessed: [],
    sessionId: "EBG-SESSION-i9j0k1l2", txInitiated: "0x789GHIjkl...", txCompleted: "",
  },
  {
    id: "EBG-2024-004", doctorId: "DOC-0003", doctorName: "dr. Bambang Wicaksono", doctorStr: "503/003/STR/2022",
    hospital: "RSUD Abdul Moeloek", hospitalCode: "RSUD-B",
    patientNikHash: "0x2b4d6f8a0c2e4...", patientNameHint: "Siti R.",
    emergencyType: "LIFE_THREATENING",
    justificationHash: "0x1a2b3c4d...",
    justification: "Pasien serangan jantung masuk IGD, tidak sadar. Butuh riwayat kardiovaskular dan obat rutin sebelum tindakan resusitasi.",
    status: "COMPLETED", initiatedAt: "2024-05-12 03:15:22", completedAt: "2024-05-12 03:22:10",
    durationSeconds: 408, recordsAccessed: ["REC-2024-0020", "REC-2024-0021", "REC-2024-0022"],
    sessionId: "EBG-SESSION-m3n4o5p6", txInitiated: "0xMNO123pqr...", txCompleted: "0xPQR456mno...",
  },
  {
    id: "EBG-2024-005", doctorId: "DOC-0001", doctorName: "dr. Ahmad Fauzi", doctorStr: "503/001/STR/2023",
    hospital: "Puskesmas Rajabasa", hospitalCode: "PKM-C",
    patientNikHash: "0x5e7g9i1k3m5o7...", patientNameHint: "Hendra P.",
    emergencyType: "UNCONSCIOUS",
    justificationHash: "0x5e6f7g8h...",
    justification: "Pasien lansia ditemukan pingsan di rumah, dibawa keluarga ke IGD. Keluarga tidak mengetahui riwayat penyakit pasien.",
    status: "FAILED", initiatedAt: "2024-05-10 16:44:00", completedAt: "",
    durationSeconds: 0, recordsAccessed: [],
    sessionId: "EBG-SESSION-q7r8s9t0", txInitiated: "0xSTU789vwx...", txCompleted: "",
  },
];

const NAV = [
  { icon: "⬡", label: "Overview", href: "/admin/dashboard" },
  { icon: "👨‍⚕️", label: "Dokter", href: "/admin/dashboard/doctors" },
  { icon: "🚨", label: "EBG Logs", href: "/admin/dashboard/ebg", active: true },
  { icon: "💰", label: "Fee Manager", href: "/admin/dashboard/fees" },
  { icon: "📊", label: "Revenue", href: "/admin/dashboard/revenue" },
];

// ── Helpers ──────────────────────────────────────────────
function StatusBadge({ status }: { status: EbgStatus }) {
  const map = {
    COMPLETED: { bg: "#AAFF0018", color: "#AAFF00", border: "#AAFF0035", label: "✓ Selesai" },
    EXPIRED: { bg: "#ffffff0d", color: "#ffffff40", border: "#ffffff18", label: "⏱ Expired" },
    INITIATED: { bg: "#00E5FF18", color: "#00E5FF", border: "#00E5FF35", label: "● Aktif" },
    FAILED: { bg: "#FF6B6B18", color: "#FF6B6B", border: "#FF6B6B35", label: "✕ Gagal" },
  };
  const s = map[status];
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{s.label}</span>;
}

function EmergencyTypeBadge({ type }: { type: EmergencyType }) {
  const map = {
    LIFE_THREATENING: { color: "#FF6B6B", label: "Life Threatening" },
    UNCONSCIOUS: { color: "#FFD93D", label: "Unconscious" },
    CRITICAL_SURGERY: { color: "#00E5FF", label: "Critical Surgery" },
  };
  const s = map[type];
  return <span style={{ background: s.color + "18", color: s.color, border: `1px solid ${s.color}30`, padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{s.label}</span>;
}

function formatDuration(s: number) {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

// ── Sidebar ──────────────────────────────────────────────
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
        {NAV.map(item => (
          <a key={item.href} href={item.href} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, borderLeft: item.active ? "2px solid #AAFF00" : "2px solid transparent", background: item.active ? "#1a2a1a" : "transparent" }}>
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

// ── EBG Detail Panel ─────────────────────────────────────
function EbgDetailPanel({ log, onClose }: { log: EbgLog; onClose: () => void }) {
  const [showJustification, setShowJustification] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#111118", border: "1px solid #ffffff12", borderRadius: 20, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #ffffff0d", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ background: "#FF6B6B18", color: "#FF6B6B", border: "1px solid #FF6B6B30", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{log.id}</span>
              <StatusBadge status={log.status} />
            </div>
            <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Detail Akses Darurat</h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#ffffff40", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Emergency type */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, background: "#FF6B6B08", border: "1px solid #FF6B6B20" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🚨</span>
              <span style={{ color: "#FF6B6B", fontSize: 13, fontWeight: 600 }}>Tipe Darurat</span>
            </div>
            <EmergencyTypeBadge type={log.emergencyType} />
          </div>

          {/* Doctor & Hospital */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
              <p style={{ color: "#ffffff35", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 6 }}>Dokter</p>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{log.doctorName}</p>
              <p style={{ color: "#ffffff40", fontSize: 10, fontFamily: "'DM Mono',monospace" }}>{log.doctorId}</p>
              <p style={{ color: "#ffffff30", fontSize: 10, fontFamily: "'DM Mono',monospace", marginTop: 2 }}>{log.doctorStr}</p>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
              <p style={{ color: "#ffffff35", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 6 }}>Rumah Sakit</p>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{log.hospital}</p>
              <p style={{ color: "#ffffff40", fontSize: 10, fontFamily: "'DM Mono',monospace" }}>{log.hospitalCode}</p>
            </div>
          </div>

          {/* Patient + Session */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
              <p style={{ color: "#ffffff35", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 6 }}>Pasien</p>
              <p style={{ color: "#fff", fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{log.patientNameHint}</p>
              <p style={{ color: "#ffffff30", fontSize: 10, fontFamily: "'DM Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.patientNikHash}</p>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
              <p style={{ color: "#ffffff35", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 6 }}>Durasi Sesi</p>
              <p style={{ color: log.durationSeconds > 0 ? "#FFD93D" : "#ffffff30", fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{formatDuration(log.durationSeconds)}</p>
              <p style={{ color: "#ffffff25", fontSize: 10, marginTop: 2 }}>Maks 15 menit</p>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ padding: "14px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
            <p style={{ color: "#ffffff35", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 10 }}>Timeline</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#AAFF00", flexShrink: 0, marginTop: 4 }} />
                <div>
                  <p style={{ color: "#ffffff60", fontSize: 11, fontWeight: 600 }}>Akses Dimulai</p>
                  <p style={{ color: "#ffffff30", fontSize: 10, fontFamily: "'DM Mono',monospace" }}>{log.initiatedAt}</p>
                </div>
              </div>
              {log.completedAt && (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: log.status === "COMPLETED" ? "#AAFF00" : "#ffffff30", flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <p style={{ color: "#ffffff60", fontSize: 11, fontWeight: 600 }}>Sesi {log.status === "COMPLETED" ? "Selesai" : "Berakhir"}</p>
                    <p style={{ color: "#ffffff30", fontSize: 10, fontFamily: "'DM Mono',monospace" }}>{log.completedAt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Records accessed */}
          {log.recordsAccessed.length > 0 && (
            <div style={{ padding: "14px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
              <p style={{ color: "#ffffff35", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 10 }}>
                Rekam Medis Diakses ({log.recordsAccessed.length})
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {log.recordsAccessed.map(r => (
                  <span key={r} style={{ background: "#AAFF0012", color: "#AAFF00", border: "1px solid #AAFF0025", padding: "3px 8px", borderRadius: 6, fontSize: 10, fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{r}</span>
                ))}
              </div>
            </div>
          )}

          {/* Justification */}
          <div style={{ padding: "14px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #ffffff0a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ color: "#ffffff35", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 }}>Justifikasi Darurat</p>
              <button onClick={() => setShowJustification(!showJustification)}
                style={{ background: "#ffffff0d", border: "1px solid #ffffff12", borderRadius: 6, padding: "3px 10px", color: "#ffffff50", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                {showJustification ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
            {showJustification ? (
              <p style={{ color: "#ffffff70", fontSize: 12, lineHeight: 1.65 }}>{log.justification}</p>
            ) : (
              <div>
                <p style={{ color: "#ffffff25", fontSize: 11, marginBottom: 4 }}>Hash (on-chain):</p>
                <p style={{ color: "#AAFF00", fontSize: 11, fontFamily: "'DM Mono',monospace" }}>{log.justificationHash}</p>
              </div>
            )}
          </div>

          {/* Blockchain TXs */}
          <div style={{ padding: "14px", borderRadius: 10, background: "#AAFF0008", border: "1px solid #AAFF0018" }}>
            <p style={{ color: "#AAFF0070", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span>⛓</span> Blockchain Transactions
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: "#ffffff30", fontSize: 10, whiteSpace: "nowrap" }}>INITIATED</span>
                <p style={{ color: "#AAFF00", fontSize: 11, fontFamily: "'DM Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.txInitiated}</p>
              </div>
              {log.txCompleted && (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "#ffffff30", fontSize: 10, whiteSpace: "nowrap" }}>COMPLETED</span>
                  <p style={{ color: "#AAFF00", fontSize: 11, fontFamily: "'DM Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.txCompleted}</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FF6B6B08", border: "1px solid #FF6B6B18", display: "flex", gap: 8 }}>
            <span style={{ fontSize: 13, flexShrink: 0 }}>🔒</span>
            <p style={{ color: "#FF6B6B70", fontSize: 11, lineHeight: 1.5 }}>Log ini dicatat permanen di Sui blockchain dan tidak dapat dihapus atau dimodifikasi oleh siapapun.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────
export default function AdminEbgLogs() {
  const [selectedLog, setSelectedLog] = useState<EbgLog | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | EbgStatus>("ALL");
  const [filterType, setFilterType] = useState<"ALL" | EmergencyType>("ALL");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = EBG_LOGS.filter(l => {
    const matchStatus = filterStatus === "ALL" || l.status === filterStatus;
    const matchType = filterType === "ALL" || l.emergencyType === filterType;
    const matchSearch = search === "" ||
      l.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      l.hospital.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.patientNameHint.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const counts = {
    ALL: EBG_LOGS.length,
    COMPLETED: EBG_LOGS.filter(l => l.status === "COMPLETED").length,
    EXPIRED: EBG_LOGS.filter(l => l.status === "EXPIRED").length,
    FAILED: EBG_LOGS.filter(l => l.status === "FAILED").length,
    INITIATED: EBG_LOGS.filter(l => l.status === "INITIATED").length,
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
        .filter-btn { cursor: pointer; border: none; border-radius: 999px; font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 12px; padding: 6px 14px; transition: all 0.15s; white-space: nowrap; }
        .type-btn { cursor: pointer; border-radius: 8px; font-family: 'DM Sans',sans-serif; font-weight: 500; font-size: 11px; padding: 5px 12px; transition: all 0.15s; white-space: nowrap; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 40; }
        .drawer { position: fixed; top: 0; left: 0; height: 100vh; width: 240px; background: #111118; border-right: 1px solid #ffffff0d; z-index: 50; transform: translateX(-100%); transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; }
        .drawer-open { transform: translateX(0) !important; }
        .desktop-sidebar { display: flex; }
        .hamburger { display: none !important; }
        .bottom-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .hamburger { display: flex !important; }
          .bottom-nav { display: flex !important; }
          .content-pad { padding: 14px 12px 80px !important; }
          .hide-mobile { display: none !important; }
          .filter-row { flex-wrap: wrap; }
          .stats-row { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
        }
      `}</style>

      {selectedLog && <EbgDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />}

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
              <h1 style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>EBG Logs</h1>
              <p style={{ color: "#ffffff30", fontSize: 11 }}>Audit trail immutable · Sui blockchain</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: "5px 12px", borderRadius: 999, background: "#FF6B6B15", border: "1px solid #FF6B6B30", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B6B" }} />
              <span style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 600 }}>{EBG_LOGS.length} Total EBG</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF6B6B22", border: "1px solid #FF6B6B44", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 700 }}>SA</span>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div className="content-pad" style={{ padding: "20px 24px" }}>

            {/* Stats row */}
            <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Total EBG", value: counts.ALL, accent: "#ffffff60" },
                { label: "Selesai", value: counts.COMPLETED, accent: "#AAFF00" },
                { label: "Expired", value: counts.EXPIRED, accent: "#ffffff40" },
                { label: "Gagal", value: counts.FAILED, accent: "#FF6B6B" },
              ].map(s => (
                <div key={s.label} style={{ borderRadius: 14, padding: "14px 16px", background: "#111118", border: "1px solid #ffffff0d" }}>
                  <p style={{ color: "#ffffff35", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{s.label}</p>
                  <p style={{ color: s.accent, fontSize: 26, fontWeight: 700, fontFamily: "'DM Mono',monospace", letterSpacing: "-1px" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Blockchain notice */}
            <div style={{ background: "#AAFF0008", border: "1px solid #AAFF0018", borderRadius: 12, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 16 }}>⛓</span>
              <p style={{ color: "#AAFF0070", fontSize: 12 }}>
                Semua log EBG tercatat <strong style={{ color: "#AAFF00" }}>immutable</strong> di Sui blockchain. Tidak ada data yang bisa dihapus atau dimodifikasi — termasuk oleh admin sistem.
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {/* Status filters */}
              <div className="filter-row" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {[
                  { val: "ALL" as const, label: "Semua", count: counts.ALL, color: "#ffffff60" },
                  { val: "COMPLETED" as const, label: "Selesai", count: counts.COMPLETED, color: "#AAFF00" },
                  { val: "EXPIRED" as const, label: "Expired", count: counts.EXPIRED, color: "#ffffff40" },
                  { val: "FAILED" as const, label: "Gagal", count: counts.FAILED, color: "#FF6B6B" },
                ].map(f => (
                  <button key={f.val} className="filter-btn" onClick={() => setFilterStatus(f.val)}
                    style={{ background: filterStatus === f.val ? f.color + "20" : "#111118", color: filterStatus === f.val ? f.color : "#ffffff35", border: `1px solid ${filterStatus === f.val ? f.color + "40" : "#ffffff0d"}` }}>
                    {f.label} <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10 }}>{f.count}</span>
                  </button>
                ))}

                <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#ffffff30", fontSize: 12 }}>🔍</span>
                  <input placeholder="Cari dokter, RS, ID..." value={search} onChange={e => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                    style={{ width: "100%", background: "#111118", border: `1px solid ${searchFocused ? "#AAFF0040" : "#ffffff0d"}`, borderRadius: 10, padding: "7px 12px 7px 32px", color: "#fff", fontSize: 12, fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color 0.2s" }} />
                </div>
              </div>

              {/* Type filters */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ color: "#ffffff30", fontSize: 11, alignSelf: "center", marginRight: 2 }}>Tipe:</span>
                {[
                  { val: "ALL" as const, label: "Semua Tipe", color: "#ffffff40" },
                  { val: "LIFE_THREATENING" as const, label: "Life Threatening", color: "#FF6B6B" },
                  { val: "UNCONSCIOUS" as const, label: "Unconscious", color: "#FFD93D" },
                  { val: "CRITICAL_SURGERY" as const, label: "Critical Surgery", color: "#00E5FF" },
                ].map(f => (
                  <button key={f.val} className="type-btn" onClick={() => setFilterType(f.val)}
                    style={{ background: filterType === f.val ? f.color + "20" : "#ffffff08", color: filterType === f.val ? f.color : "#ffffff35", border: `1px solid ${filterType === f.val ? f.color + "35" : "transparent"}` }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ borderRadius: 16, background: "#111118", border: "1px solid #ffffff0d", overflow: "hidden" }}>
              {/* Desktop header */}
              <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 130px 90px 80px 80px", gap: 10, padding: "10px 18px", borderBottom: "1px solid #ffffff0d" }}>
                {["EBG ID", "Dokter", "Rumah Sakit", "Tipe Darurat", "Pasien", "Durasi", "Status"].map(h => (
                  <span key={h} style={{ color: "#ffffff25", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <p style={{ color: "#ffffff30", fontSize: 14 }}>Tidak ada log yang sesuai filter</p>
                </div>
              ) : filtered.map(log => (
                <div key={log.id} className="table-row" onClick={() => setSelectedLog(log)} style={{ padding: "14px 18px" }}>
                  {/* Desktop */}
                  <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 130px 90px 80px 80px", gap: 10, alignItems: "center" }}>
                    <span style={{ color: "#FF6B6B", fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{log.id}</span>
                    <div>
                      <p style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{log.doctorName}</p>
                      <p style={{ color: "#ffffff30", fontSize: 10, fontFamily: "'DM Mono',monospace", marginTop: 1 }}>{log.doctorId}</p>
                    </div>
                    <div>
                      <p style={{ color: "#ffffff60", fontSize: 12 }}>{log.hospital}</p>
                      <p style={{ color: "#ffffff25", fontSize: 10, marginTop: 1 }}>{log.initiatedAt}</p>
                    </div>
                    <EmergencyTypeBadge type={log.emergencyType} />
                    <p style={{ color: "#ffffff40", fontSize: 11, fontFamily: "'DM Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.patientNameHint}</p>
                    <p style={{ color: log.durationSeconds > 0 ? "#FFD93D" : "#ffffff25", fontSize: 12, fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{formatDuration(log.durationSeconds)}</p>
                    <StatusBadge status={log.status} />
                  </div>

                  {/* Mobile */}
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FF6B6B15", border: "1px solid #FF6B6B25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🚨</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                        <p style={{ color: "#FF6B6B", fontSize: 10, fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{log.id}</p>
                        <StatusBadge status={log.status} />
                      </div>
                      <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{log.doctorName}</p>
                      <p style={{ color: "#ffffff40", fontSize: 11, marginTop: 2 }}>{log.hospital} · {log.initiatedAt}</p>
                      <div style={{ marginTop: 6 }}>
                        <EmergencyTypeBadge type={log.emergencyType} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ color: "#ffffff20", fontSize: 11, textAlign: "center", marginTop: 14 }}>
              Klik baris untuk melihat detail lengkap termasuk justifikasi dan blockchain TX
            </p>
          </div>
        </div>

        {/* Bottom Nav mobile */}
        <nav className="bottom-nav" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: "#111118", borderTop: "1px solid #ffffff0d", padding: "6px 0", zIndex: 30, justifyContent: "space-around" }}>
          {NAV.map(item => (
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