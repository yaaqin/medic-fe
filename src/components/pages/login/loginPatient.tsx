"use client";

import { useState } from "react";

export default function Login() {
  const [nik, setNik] = useState("");
  const [ibuKandung, setIbuKandung] = useState("");
  const [showIbu, setShowIbu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nikFocused, setNikFocused] = useState(false);
  const [ibuFocused, setIbuFocused] = useState(false);

  const formatNik = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNik(formatNik(e.target.value));
    setError("");
  };

  const handleSubmit = () => {
    const rawNik = nik.replace(/\s/g, "");
    if (rawNik.length !== 16) {
      setError("NIK harus 16 digit.");
      return;
    }
    if (ibuKandung.trim().length < 3) {
      setError("Nama ibu kandung tidak valid.");
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const nikDigits = nik.replace(/\s/g, "").length;
  const progress = (nikDigits / 16) * 100;

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "20px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-field {
          width: 100%;
          background: #0A0A0F;
          border: 1px solid #ffffff0d;
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field::placeholder { color: #ffffff25; }
        .input-field:hover { border-color: #ffffff20; }
        .input-field-focused {
          border-color: #AAFF0060 !important;
          box-shadow: 0 0 0 3px #AAFF0012;
        }
        .input-nik { font-family: 'DM Mono', monospace; font-size: 16px; letter-spacing: 1px; }
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
          letter-spacing: 0.2px;
        }
        .login-btn:hover { background: #C8FF40; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
        .login-btn:disabled { background: #AAFF0040; color: #0A0A0F80; cursor: not-allowed; transform: none; }
        .register-link { color: #AAFF00; cursor: pointer; font-weight: 600; transition: opacity 0.15s; }
        .register-link:hover { opacity: 0.7; }
        .hospital-link { color: #ffffff50; cursor: pointer; font-size: 12px; transition: color 0.15s; text-decoration: none; display: block; text-align: center; }
        .hospital-link:hover { color: #00E5FF; }
        .eye-btn { background: transparent; border: none; cursor: pointer; color: #ffffff40; padding: 0; display: flex; align-items: center; transition: color 0.15s; }
        .eye-btn:hover { color: #AAFF00; }
        .nik-segment { display: inline-block; width: 44px; height: 40px; border-radius: 8px; background: #111118; border: 1px solid #ffffff0d; font-family: 'DM Mono', monospace; font-size: 15px; font-weight: 500; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .nik-segment-filled { border-color: #AAFF0040; color: #AAFF00; background: #AAFF0010; }
        .nik-segment-empty { color: #ffffff20; }
        .dot-grid { position: absolute; inset: 0; background-image: radial-gradient(circle, #ffffff06 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }
        .glow-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; opacity: 0.15; }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        .pulse { animation: pulse-ring 3s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.4s ease; }
        @media (max-width: 480px) {
          .card-pad { padding: 24px 20px !important; }
          .brand-title { font-size: 22px !important; }
          .nik-segment { width: 36px !important; height: 34px !important; font-size: 13px !important; }
        }
      `}</style>

      {/* Background effects */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div className="dot-grid" />
        <div className="glow-orb pulse" style={{ width: 500, height: 500, background: "#AAFF00", top: "-200px", left: "-150px" }} />
        <div className="glow-orb" style={{ width: 400, height: 400, background: "#00E5FF", bottom: "-150px", right: "-100px", opacity: 0.08 }} />
      </div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" />
              </svg>
            </div>
            <span className="brand-title" style={{ color: "#fff", fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px" }}>SuiMedis</span>
          </div>
          <p style={{ color: "#ffffff40", fontSize: 13 }}>Rekam medis terdesentralisasi di Sui Network</p>
        </div>

        {/* Card */}
        <div className="card-pad" style={{ background: "#111118", border: "1px solid #ffffff0d", borderRadius: 20, padding: "28px 28px" }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.4px", marginBottom: 4 }}>Masuk ke akun</h1>
            <p style={{ color: "#ffffff40", fontSize: 13 }}>Gunakan NIK dan nama ibu kandung Anda</p>
          </div>

          {/* NIK Display segments */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "#ffffff60", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 10 }}>
              NIK — Nomor Induk Kependudukan
            </label>

            {/* Segment preview */}
            <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
              {Array.from({ length: 16 }).map((_, i) => {
                const digit = nik.replace(/\s/g, "")[i];
                return (
                  <div key={i} className={`nik-segment ${digit ? "nik-segment-filled" : "nik-segment-empty"}`}
                    style={{ width: 44, height: 40, borderRadius: 8, background: digit ? "#AAFF0010" : "#111118", border: `1px solid ${digit ? "#AAFF0040" : "#ffffff0d"}`, fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", color: digit ? "#AAFF00" : "#ffffff10", transition: "all 0.15s" }}>
                    {digit || "·"}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div style={{ height: 2, background: "#ffffff0d", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: nikDigits === 16 ? "#AAFF00" : "#AAFF0080", borderRadius: 2, transition: "width 0.2s" }} />
            </div>

            {/* Actual input */}
            <input
              className={`input-field input-nik ${nikFocused ? "input-field-focused" : ""}`}
              type="text"
              inputMode="numeric"
              placeholder="3271 0000 0000 0000"
              value={nik}
              onChange={handleNikChange}
              onFocus={() => setNikFocused(true)}
              onBlur={() => setNikFocused(false)}
              maxLength={19}
              autoComplete="off"
            />
            <p style={{ color: "#ffffff25", fontSize: 11, marginTop: 6, textAlign: "right" }}>
              {nikDigits}/16 digit
            </p>
          </div>

          {/* Ibu Kandung */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "#ffffff60", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 8 }}>
              Nama Ibu Kandung
            </label>
            <div style={{ position: "relative" }}>
              <input
                className={`input-field ${ibuFocused ? "input-field-focused" : ""}`}
                type={showIbu ? "text" : "password"}
                placeholder="Nama ibu kandung sesuai KTP"
                value={ibuKandung}
                onChange={(e) => { setIbuKandung(e.target.value); setError(""); }}
                onFocus={() => setIbuFocused(true)}
                onBlur={() => setIbuFocused(false)}
                style={{ paddingRight: 44 }}
                autoComplete="off"
              />
              <button className="eye-btn" onClick={() => setShowIbu(!showIbu)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: showIbu ? "#AAFF00" : "#ffffff30", fontSize: 16, transition: "color 0.15s" }}>
                {showIbu ? "👁" : "🙈"}
              </button>
            </div>
            <p style={{ color: "#ffffff25", fontSize: 11, marginTop: 6 }}>
              Digunakan sebagai kunci enkripsi — tidak disimpan sebagai teks
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="shake" style={{ background: "#FF6B6B15", border: "1px solid #FF6B6B40", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>⚠</span>
              <p style={{ color: "#FF6B6B", fontSize: 13, fontWeight: 500 }}>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button className="login-btn" onClick={handleSubmit}
            disabled={loading || nikDigits !== 16 || ibuKandung.trim().length < 3}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg className="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#0A0A0F" strokeWidth="2" strokeDasharray="20 18" />
                </svg>
                Memverifikasi...
              </span>
            ) : "Masuk →"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#ffffff0d" }} />
            <span style={{ color: "#ffffff20", fontSize: 11 }}>atau</span>
            <div style={{ flex: 1, height: 1, background: "#ffffff0d" }} />
          </div>

          {/* Register */}
          <p style={{ textAlign: "center", color: "#ffffff40", fontSize: 13 }}>
            Belum punya akun?{" "}
            <span className="register-link">Daftar sekarang</span>
          </p>
        </div>

        {/* Hospital login link */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <a href="/hospital/login" className="hospital-link">
            Login sebagai dokter / rumah sakit →
          </a>
        </div>

        {/* Security note */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ fontSize: 11 }}>🔒</span>
          <p style={{ color: "#ffffff20", fontSize: 11, textAlign: "center" }}>
            Data dienkripsi end-to-end · Tersimpan di blockchain Sui
          </p>
        </div>
      </div>
    </div>
  );
}