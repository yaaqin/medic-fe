"use client";

import { useState } from "react";

type Step = 1 | 2 | 3;

const STEPS = [
  { num: 1, label: "Identitas" },
  { num: 2, label: "Kontak" },
  { num: 3, label: "Konfirmasi" },
];

export default function Register() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — Identitas
  const [nik, setNik] = useState("");
  const [ibuKandung, setIbuKandung] = useState("");
  const [showIbu, setShowIbu] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState("");

  // Step 2 — Kontak
  const [noHp, setNoHp] = useState("");
  const [email, setEmail] = useState("");

  // State UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Focus states
  const [focused, setFocused] = useState<string | null>(null);

  const nikDigits = nik.replace(/\s/g, "").length;
  const nikProgress = (nikDigits / 16) * 100;

  const formatNik = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 16);
    return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 13);
    if (d.startsWith("0")) return d.replace(/(\d{4})(\d{4})(\d{0,5})/, (_, a, b, c) => c ? `${a}-${b}-${c}` : b ? `${a}-${b}` : a);
    return d;
  };

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (nikDigits !== 16) e.nik = "NIK harus 16 digit.";
    if (ibuKandung.trim().length < 3) e.ibu = "Nama ibu kandung minimal 3 karakter.";
    if (namaLengkap.trim().length < 3) e.nama = "Nama lengkap minimal 3 karakter.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e: Record<string, string> = {};
    const phone = noHp.replace(/\D/g, "");
    if (phone.length < 10) e.hp = "Nomor HP tidak valid.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format email tidak valid.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && validate1()) setStep(2);
    else if (step === 2 && validate2()) setStep(3);
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2200);
  };

  const inputStyle = (name: string) => ({
    width: "100%",
    background: "#0A0A0F",
    border: `1px solid ${errors[name] ? "#FF6B6B50" : focused === name ? "#AAFF0060" : "#ffffff0d"}`,
    borderRadius: 12,
    padding: "13px 16px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxShadow: focused === name ? "0 0 0 3px #AAFF0012" : errors[name] ? "0 0 0 3px #FF6B6B10" : "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  } as React.CSSProperties);

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #ffffff20; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .btn-primary {
          width: 100%; padding: 14px; border-radius: 12px;
          background: #AAFF00; color: #0A0A0F;
          font-size: 14px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: none; cursor: pointer; transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) { background: #C8FF40; transform: translateY(-1px); }
        .btn-primary:disabled { background: #AAFF0035; color: #0A0A0F50; cursor: not-allowed; }
        .btn-ghost {
          width: 100%; padding: 13px; border-radius: 12px;
          background: transparent; color: #ffffff50;
          font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid #ffffff0d; cursor: pointer; transition: all 0.18s;
        }
        .btn-ghost:hover { border-color: #ffffff20; color: #ffffff80; }
        .dot-grid { position: fixed; inset: 0; background-image: radial-gradient(circle, #ffffff05 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.28s ease; }
        @keyframes popIn { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
        .pop-in { animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        .shake { animation: shake 0.35s ease; }
        .nik-box {
          flex: 1; min-width: 0; height: 38px; border-radius: 7px;
          background: #111118; border: 1px solid #ffffff0d;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500;
          transition: all 0.15s;
        }
        .nik-box-filled { border-color: #AAFF0040; background: #AAFF0010; color: #AAFF00; }
        .nik-box-empty { color: #ffffff12; }
        .login-link { color: #AAFF00; cursor: pointer; font-weight: 600; transition: opacity 0.15s; }
        .login-link:hover { opacity: 0.7; }
        .confirm-row { display: flex; align-items: flex-start; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ffffff08; gap: 12px; }
        .confirm-row:last-child { border-bottom: none; }
        @media (max-width: 480px) {
          .card-pad { padding: 20px 16px !important; }
          .nik-box { height: 32px !important; font-size: 12px !important; }
          .step-label { display: none !important; }
        }
      `}</style>

      <div className="dot-grid" />

      {/* Glow */}
      <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "#AAFF00", top: "-220px", right: "-180px", opacity: 0.06, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: 350, height: 350, borderRadius: "50%", background: "#00E5FF", bottom: "-120px", left: "-100px", opacity: 0.05, filter: "blur(70px)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>SuiMedis</span>
        </div>

        {/* ── Success State ── */}
        {done ? (
          <div className="pop-in" style={{ background: "#111118", border: "1px solid #AAFF0030", borderRadius: 20, padding: "40px 28px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#AAFF0015", border: "2px solid #AAFF0040", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>
              ✓
            </div>
            <h2 style={{ color: "#AAFF00", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8 }}>Registrasi Berhasil!</h2>
            <p style={{ color: "#ffffff50", fontSize: 13, lineHeight: 1.7, marginBottom: 6 }}>
              Akun Anda telah dibuat dan terdaftar di Sui blockchain.
            </p>
            <div style={{ margin: "20px 0", padding: "12px 16px", borderRadius: 10, background: "#0A0A0F", border: "1px solid #AAFF0015" }}>
              <p style={{ color: "#ffffff40", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>ID Pasien</p>
              <p style={{ color: "#AAFF00", fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>PAT-{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
            <p style={{ color: "#ffffff30", fontSize: 11, marginBottom: 24 }}>
              Wallet deterministik dibuat dari NIK + nama ibu kandung Anda.
            </p>
            <button className="btn-primary">Masuk ke Dashboard →</button>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 0 }}>
              {STEPS.map((s, i) => (
                <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: step > s.num ? "#AAFF00" : step === s.num ? "#AAFF0020" : "#ffffff08",
                      border: `1.5px solid ${step >= s.num ? "#AAFF00" : "#ffffff15"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.25s",
                    }}>
                      {step > s.num
                        ? <span style={{ color: "#0A0A0F", fontSize: 14, fontWeight: 700 }}>✓</span>
                        : <span style={{ color: step === s.num ? "#AAFF00" : "#ffffff30", fontSize: 12, fontWeight: 700 }}>{s.num}</span>
                      }
                    </div>
                    <span className="step-label" style={{ color: step === s.num ? "#AAFF00" : "#ffffff30", fontSize: 10, fontWeight: step === s.num ? 600 : 400, whiteSpace: "nowrap" }}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 1.5, background: step > s.num ? "#AAFF00" : "#ffffff10", margin: "0 8px", marginBottom: 18, transition: "background 0.25s" }} />
                  )}
                </div>
              ))}
            </div>

            {/* Card */}
            <div className="card-pad fade-up" key={step} style={{ background: "#111118", border: "1px solid #ffffff0d", borderRadius: 20, padding: "24px 24px" }}>

              {/* ── STEP 1: Identitas ── */}
              {step === 1 && (
                <div>
                  <div style={{ marginBottom: 22 }}>
                    <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px", marginBottom: 4 }}>Data Identitas</h2>
                    <p style={{ color: "#ffffff40", fontSize: 13 }}>Sesuai KTP — digunakan sebagai kunci enkripsi</p>
                  </div>

                  {/* NIK */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>NIK</label>

                    {/* Segment boxes */}
                    <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                      {Array.from({ length: 16 }).map((_, i) => {
                        const digit = nik.replace(/\s/g, "")[i];
                        return (
                          <div key={i} className={`nik-box ${digit ? "nik-box-filled" : "nik-box-empty"}`}>
                            {digit || "·"}
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress */}
                    <div style={{ height: 2, background: "#ffffff0d", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${nikProgress}%`, background: nikDigits === 16 ? "#AAFF00" : "#AAFF0070", borderRadius: 2, transition: "width 0.15s" }} />
                    </div>

                    <input
                      style={{ ...inputStyle("nik"), fontFamily: "'DM Mono', monospace", fontSize: 16, letterSpacing: "1px" }}
                      type="text" inputMode="numeric"
                      placeholder="3271 0000 0000 0000"
                      value={nik}
                      onChange={(e) => { setNik(formatNik(e.target.value)); setErrors(p => ({ ...p, nik: "" })); }}
                      onFocus={() => setFocused("nik")}
                      onBlur={() => setFocused(null)}
                      maxLength={19}
                      autoComplete="off"
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                      {errors.nik
                        ? <p className="shake" style={{ color: "#FF6B6B", fontSize: 11 }}>⚠ {errors.nik}</p>
                        : <p style={{ color: "#ffffff20", fontSize: 11 }}>16 digit tanpa spasi/tanda baca</p>
                      }
                      <p style={{ color: nikDigits === 16 ? "#AAFF00" : "#ffffff25", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{nikDigits}/16</p>
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>Nama Lengkap</label>
                    <input
                      style={inputStyle("nama")}
                      type="text"
                      placeholder="Sesuai KTP"
                      value={namaLengkap}
                      onChange={(e) => { setNamaLengkap(e.target.value); setErrors(p => ({ ...p, nama: "" })); }}
                      onFocus={() => setFocused("nama")}
                      onBlur={() => setFocused(null)}
                      autoComplete="name"
                    />
                    {errors.nama && <p className="shake" style={{ color: "#FF6B6B", fontSize: 11, marginTop: 5 }}>⚠ {errors.nama}</p>}
                  </div>

                  {/* Nama Ibu Kandung */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>Nama Ibu Kandung</label>
                    <div style={{ position: "relative" }}>
                      <input
                        style={{ ...inputStyle("ibu"), paddingRight: 44 }}
                        type={showIbu ? "text" : "password"}
                        placeholder="Nama ibu kandung sesuai KTP"
                        value={ibuKandung}
                        onChange={(e) => { setIbuKandung(e.target.value); setErrors(p => ({ ...p, ibu: "" })); }}
                        onFocus={() => setFocused("ibu")}
                        onBlur={() => setFocused(null)}
                        autoComplete="off"
                      />
                      <button onClick={() => setShowIbu(!showIbu)}
                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: showIbu ? "#AAFF00" : "#ffffff30", transition: "color 0.15s" }}>
                        {showIbu ? "👁" : "🙈"}
                      </button>
                    </div>
                    {errors.ibu
                      ? <p className="shake" style={{ color: "#FF6B6B", fontSize: 11, marginTop: 5 }}>⚠ {errors.ibu}</p>
                      : <p style={{ color: "#ffffff20", fontSize: 11, marginTop: 5 }}>Dipakai sbg seed wallet — tidak disimpan plaintext</p>
                    }
                  </div>

                  <button className="btn-primary" onClick={next}>
                    Lanjut ke Data Kontak →
                  </button>
                </div>
              )}

              {/* ── STEP 2: Kontak ── */}
              {step === 2 && (
                <div>
                  <div style={{ marginBottom: 22 }}>
                    <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px", marginBottom: 4 }}>Data Kontak</h2>
                    <p style={{ color: "#ffffff40", fontSize: 13 }}>Untuk notifikasi dan verifikasi akun</p>
                  </div>

                  {/* No HP */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>Nomor HP</label>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#ffffff30", fontSize: 13, fontFamily: "'DM Mono', monospace", pointerEvents: "none" }}>🇮🇩 +62</div>
                      <input
                        style={{ ...inputStyle("hp"), paddingLeft: 68, fontFamily: "'DM Mono', monospace" }}
                        type="tel" inputMode="numeric"
                        placeholder="0812-3456-7890"
                        value={noHp}
                        onChange={(e) => { setNoHp(formatPhone(e.target.value)); setErrors(p => ({ ...p, hp: "" })); }}
                        onFocus={() => setFocused("hp")}
                        onBlur={() => setFocused(null)}
                        autoComplete="tel"
                      />
                    </div>
                    {errors.hp && <p className="shake" style={{ color: "#FF6B6B", fontSize: 11, marginTop: 5 }}>⚠ {errors.hp}</p>}
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ color: "#ffffff50", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>Email</label>
                    <input
                      style={inputStyle("email")}
                      type="email" inputMode="email"
                      placeholder="budi@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      autoComplete="email"
                    />
                    {errors.email && <p className="shake" style={{ color: "#FF6B6B", fontSize: 11, marginTop: 5 }}>⚠ {errors.email}</p>}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-ghost" style={{ flex: "0 0 auto", width: "auto", padding: "13px 18px" }} onClick={() => setStep(1)}>← Kembali</button>
                    <button className="btn-primary" onClick={next}>Review Data →</button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Konfirmasi ── */}
              {step === 3 && (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px", marginBottom: 4 }}>Konfirmasi Data</h2>
                    <p style={{ color: "#ffffff40", fontSize: 13 }}>Pastikan semua data benar sebelum mendaftar</p>
                  </div>

                  {/* Summary */}
                  <div style={{ background: "#0A0A0F", border: "1px solid #ffffff0a", borderRadius: 14, padding: "4px 16px", marginBottom: 18 }}>
                    {[
                      { label: "NIK", value: nik, mono: true },
                      { label: "Nama Lengkap", value: namaLengkap },
                      { label: "Nama Ibu Kandung", value: "••••••••••••" },
                      { label: "No HP", value: noHp },
                      { label: "Email", value: email },
                    ].map((row) => (
                      <div key={row.label} className="confirm-row">
                        <span style={{ color: "#ffffff40", fontSize: 12, flexShrink: 0, minWidth: 120 }}>{row.label}</span>
                        <span style={{ color: "#fff", fontSize: 13, fontWeight: 500, textAlign: "right", fontFamily: row.mono ? "'DM Mono', monospace" : "inherit", wordBreak: "break-all" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Blockchain info */}
                  <div style={{ background: "#AAFF0008", border: "1px solid #AAFF0020", borderRadius: 12, padding: "12px 14px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⛓</span>
                    <div>
                      <p style={{ color: "#AAFF00", fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Akan didaftarkan ke Sui Blockchain</p>
                      <p style={{ color: "#ffffff40", fontSize: 11, lineHeight: 1.6 }}>
                        NIK dan nama ibu kandung di-hash sebelum dikirim. Data asli tidak pernah tersimpan di server. Wallet deterministik dibuat otomatis.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-ghost" style={{ flex: "0 0 auto", width: "auto", padding: "13px 18px" }} onClick={() => setStep(2)}>← Kembali</button>
                    <button className="btn-primary" onClick={submit} disabled={loading}>
                      {loading ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <svg className="spinner" width="15" height="15" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="#0A0A0F" strokeWidth="2" strokeDasharray="20 18" />
                          </svg>
                          Mendaftarkan ke blockchain...
                        </span>
                      ) : "Daftar Sekarang →"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login link */}
            <p style={{ textAlign: "center", color: "#ffffff35", fontSize: 13, marginTop: 20 }}>
              Sudah punya akun?{" "}
              <span className="login-link">Masuk di sini</span>
            </p>

            {/* Security note */}
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ fontSize: 11 }}>🔒</span>
              <p style={{ color: "#ffffff18", fontSize: 11 }}>Data dienkripsi end-to-end · Tersimpan di Sui blockchain</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}