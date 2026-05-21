"use client";

import { useState } from "react";

const ROLES = [
  { id: "doctor", label: "Dokter", sub: "Akses rekam medis pasien", icon: "🩺" },
  { id: "hospital", label: "Admin RS", sub: "Kelola data rumah sakit", icon: "🏥" },
  { id: "emergency", label: "IGD / Darurat", sub: "Emergency Break Glass", icon: "🚨" },
];

const HOSPITALS = [
  "RSUD Abdul Moeloek",
  "Puskesmas Rajabasa",
  "Klinik Medika Utama",
  "Praktik dr. Rina",
  "RS Urip Sumoharjo",
];

export default function HospitalLogin() {
  const [selectedRole, setSelectedRole] = useState("doctor");
  const [hospitalId, setHospitalId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hospitalFocused, setHospitalFocused] = useState(false);
  const [doctorFocused, setDoctorFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isEmergency = selectedRole === "emergency";

  const handleSubmit = () => {
    if (!hospitalId) { setError("Pilih rumah sakit terlebih dahulu."); return; }
    if (!doctorId.trim()) { setError("ID dokter tidak boleh kosong."); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const canSubmit = !loading && !!hospitalId && doctorId.trim().length > 0 && password.length >= 6;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0A0A0F", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-field {
          width: 100%;
          background: #0A0A0F;
          border: 1px solid #ffffff0d;
          border-radius: 12px;
          padding: 13px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field::placeholder { color: #ffffff20; }
        .input-focused { border-color: #AAFF0060 !important; box-shadow: 0 0 0 3px #AAFF0012; }
        .input-focused-red { border-color: #FF6B6B60 !important; box-shadow: 0 0 0 3px #FF6B6B12; }
        .role-card {
          flex: 1;
          padding: 14px 10px;
          border-radius: 14px;
          background: #0A0A0F;
          border: 1px solid #ffffff0d;
          cursor: pointer;
          transition: all 0.18s;
          text-align: center;
        }
        .role-card:hover { border-color: #ffffff20; background: #111118; }
        .role-card-active { border-color: #AAFF0050 !important; background: #AAFF0008 !important; }
        .role-card-active-red { border-color: #FF6B6B50 !important; background: #FF6B6B08 !important; }
        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: #AAFF00;
          color: #0A0A0F;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .login-btn:hover:not(:disabled) { background: #C8FF40; transform: translateY(-1px); }
        .login-btn:disabled { background: #AAFF0035; color: #0A0A0F60; cursor: not-allowed; }
        .login-btn-red { background: #FF6B6B !important; color: #fff !important; }
        .login-btn-red:hover:not(:disabled) { background: #ff8585 !important; }
        .login-btn-red:disabled { background: #FF6B6B35 !important; color: #ffffff40 !important; }
        .patient-link { color: #ffffff40; font-size: 12px; cursor: pointer; transition: color 0.15s; text-decoration: none; display: block; text-align: center; }
        .patient-link:hover { color: #AAFF00; }
        .dropdown-item { padding: 10px 14px; cursor: pointer; font-size: 13px; color: #ffffff80; transition: all 0.12s; border-radius: 8px; margin: 2px 4px; }
        .dropdown-item:hover { background: #ffffff0d; color: #fff; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        .shake { animation: shake 0.35s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.2s ease; }
        .dot-grid { position: fixed; inset: 0; background-image: radial-gradient(circle, #ffffff05 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }

        /* Left panel — hidden on mobile */
        .left-panel { display: flex; }
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          .right-panel { padding: 24px 16px !important; }
          .card-inner { padding: 22px 18px !important; }
          .role-card { padding: 10px 8px !important; }
          .role-emoji { font-size: 20px !important; }
        }
      `}</style>

      <div className="dot-grid" />

      {/* ── Left decorative panel (desktop only) ── */}
      <div className="left-panel" style={{ width: "42%", background: "#0D0D14", borderRight: "1px solid #ffffff08", flexDirection: "column", justifyContent: "space-between", padding: "40px 44px", position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: isEmergency ? "#FF6B6B" : "#AAFF00", top: "-160px", left: "-120px", opacity: 0.07, filter: "blur(60px)", transition: "background 0.4s" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "#00E5FF", bottom: "-100px", right: "-80px", opacity: 0.05, filter: "blur(60px)" }} />

        {/* Logo */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>SuiMedis</span>
          </div>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.25, marginBottom: 12 }}>
              Portal Tenaga<br />Medis & RS
            </h2>
            <p style={{ color: "#ffffff40", fontSize: 14, lineHeight: 1.7 }}>
              Akses rekam medis pasien secara aman dan terdesentralisasi. Setiap akses tercatat permanen di blockchain Sui.
            </p>
          </div>

          {/* Feature pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "⛓", text: "Audit trail immutable on-chain" },
              { icon: "🔐", text: "Enkripsi end-to-end per pasien" },
              { icon: "🏥", text: "Multi-hospital data sharing" },
              { icon: "🚨", text: "Emergency Break Glass support" },
            ].map((f) => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "#ffffff05", border: "1px solid #ffffff08" }}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ color: "#ffffff60", fontSize: 13 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom blockchain status */}
        <div style={{ padding: "14px 16px", borderRadius: 12, background: "#ffffff05", border: "1px solid #ffffff08" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#ffffff30", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Sui Network</p>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Mainnet · Block #48,291,045</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "#AAFF0015", border: "1px solid #AAFF0030" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#AAFF00" }} />
              <span style={{ color: "#AAFF00", fontSize: 11, fontWeight: 600 }}>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="right-panel" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Mobile logo */}
          <div style={{ display: "none", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" }} className="mobile-logo">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>SuiMedis</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4 }}>
              Masuk sebagai {ROLES.find(r => r.id === selectedRole)?.label}
            </h1>
            <p style={{ color: "#ffffff40", fontSize: 13 }}>Pilih peran dan masukkan kredensial Anda</p>
          </div>

          {/* Card */}
          <div className="card-inner" style={{ background: "#111118", border: "1px solid #ffffff0d", borderRadius: 20, padding: "24px 24px" }}>

            {/* Role selector */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 10 }}>Peran</label>
              <div style={{ display: "flex", gap: 8 }}>
                {ROLES.map((role) => (
                  <div key={role.id}
                    className={`role-card ${selectedRole === role.id ? (role.id === "emergency" ? "role-card-active-red" : "role-card-active") : ""}`}
                    onClick={() => { setSelectedRole(role.id); setError(""); }}>
                    <div className="role-emoji" style={{ fontSize: 22, marginBottom: 4 }}>{role.icon}</div>
                    <p style={{ color: selectedRole === role.id ? (role.id === "emergency" ? "#FF6B6B" : "#AAFF00") : "#ffffff80", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{role.label}</p>
                    <p style={{ color: "#ffffff25", fontSize: 10, lineHeight: 1.3 }}>{role.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency warning */}
            {isEmergency && (
              <div className="fade-in" style={{ background: "#FF6B6B10", border: "1px solid #FF6B6B30", borderRadius: 10, padding: "10px 14px", marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <p style={{ color: "#FF6B6B", fontSize: 12, lineHeight: 1.5 }}>
                  Akses darurat akan dicatat <strong>permanen</strong> di blockchain. Hanya untuk kondisi mengancam jiwa. Justifikasi wajib diisi setelah login.
                </p>
              </div>
            )}

            {/* Hospital dropdown */}
            <div style={{ marginBottom: 16, position: "relative" }}>
              <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>Faskes / Rumah Sakit</label>
              <div style={{ position: "relative" }}>
                <div
                  className={`input-field ${hospitalFocused || showDropdown ? (isEmergency ? "input-focused-red" : "input-focused") : ""}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}
                  onClick={() => { setShowDropdown(!showDropdown); setHospitalFocused(true); }}
                  onBlur={() => { setTimeout(() => { setShowDropdown(false); setHospitalFocused(false); }, 150); }}
                  tabIndex={0}
                >
                  <span style={{ color: hospitalId ? "#fff" : "#ffffff20", fontSize: 14 }}>
                    {hospitalId || "Pilih rumah sakit..."}
                  </span>
                  <span style={{ color: "#ffffff30", fontSize: 12, transition: "transform 0.2s", transform: showDropdown ? "rotate(180deg)" : "none" }}>▾</span>
                </div>

                {showDropdown && (
                  <div className="fade-in" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#1a1a24", border: "1px solid #ffffff12", borderRadius: 12, zIndex: 50, overflow: "hidden", padding: 4 }}>
                    {HOSPITALS.map((h) => (
                      <div key={h} className="dropdown-item"
                        style={{ background: hospitalId === h ? "#ffffff0d" : "transparent", color: hospitalId === h ? "#fff" : "#ffffff70" }}
                        onClick={() => { setHospitalId(h); setShowDropdown(false); setError(""); }}>
                        {h}
                        {hospitalId === h && <span style={{ float: "right", color: isEmergency ? "#FF6B6B" : "#AAFF00" }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Doctor ID */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>
                {selectedRole === "hospital" ? "ID Admin" : "ID Dokter / STR"}
              </label>
              <input
                className={`input-field ${doctorFocused ? (isEmergency ? "input-focused-red" : "input-focused") : ""}`}
                type="text"
                placeholder={selectedRole === "hospital" ? "ADM-XXXX" : "DOC-XXXX"}
                value={doctorId}
                onChange={(e) => { setDoctorId(e.target.value); setError(""); }}
                onFocus={() => setDoctorFocused(true)}
                onBlur={() => setDoctorFocused(false)}
                style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px" }}
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>Password</label>
                <span style={{ color: isEmergency ? "#FF6B6B60" : "#AAFF0060", fontSize: 11, cursor: "pointer", fontWeight: 500 }}>Lupa password?</span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className={`input-field ${passFocused ? (isEmergency ? "input-focused-red" : "input-focused") : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", fontSize: 15, color: showPass ? (isEmergency ? "#FF6B6B" : "#AAFF00") : "#ffffff30", transition: "color 0.15s" }}>
                  {showPass ? "👁" : "🙈"}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                  {[1, 2, 3, 4].map((i) => {
                    const strength = password.length >= 12 ? 4 : password.length >= 8 ? 3 : password.length >= 6 ? 2 : 1;
                    const active = i <= strength;
                    const color = strength <= 1 ? "#FF6B6B" : strength === 2 ? "#FFD93D" : strength === 3 ? "#00E5FF" : "#AAFF00";
                    return <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: active ? color : "#ffffff0d", transition: "background 0.2s" }} />;
                  })}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="shake" style={{ background: "#FF6B6B15", border: "1px solid #FF6B6B40", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13 }}>⚠</span>
                <p style={{ color: "#FF6B6B", fontSize: 13 }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button className={`login-btn ${isEmergency ? "login-btn-red" : ""}`} onClick={handleSubmit} disabled={!canSubmit}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg className="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke={isEmergency ? "#fff" : "#0A0A0F"} strokeWidth="2" strokeDasharray="20 18" />
                  </svg>
                  {isEmergency ? "Membuka Akses Darurat..." : "Memverifikasi..."}
                </span>
              ) : (
                isEmergency ? "🚨 Buka Akses Darurat" : "Masuk →"
              )}
            </button>
          </div>

          {/* Patient login link */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <a href="/login" className="patient-link">← Login sebagai pasien</a>
          </div>

          {/* Security note */}
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 11 }}>🔒</span>
            <p style={{ color: "#ffffff18", fontSize: 11 }}>Semua akses dicatat immutable di Sui blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
}