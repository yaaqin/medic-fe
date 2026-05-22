"use client";

import { useState, useEffect, useRef } from "react";

// ── Animated counter hook ────────────────────────────────
function useCounter(target: number, duration = 1800, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

// ── Intersection observer hook ───────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Floating hex background ──────────────────────────────
function HexGrid() {
  const hexes = Array.from({ length: 18 }, (_, i) => ({
    x: (i % 6) * 18 + (Math.floor(i / 6) % 2) * 9,
    y: Math.floor(i / 6) * 16,
    delay: (i * 0.3) % 3,
    size: 8 + (i % 4) * 3,
    opacity: 0.04 + (i % 5) * 0.015,
  }));
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 100 50" preserveAspectRatio="xMidYMid slice">
      {hexes.map((h, i) => (
        <polygon key={i} points={`${h.x},${h.y - h.size * 0.5} ${h.x + h.size * 0.45},${h.y - h.size * 0.25} ${h.x + h.size * 0.45},${h.y + h.size * 0.25} ${h.x},${h.y + h.size * 0.5} ${h.x - h.size * 0.45},${h.y + h.size * 0.25} ${h.x - h.size * 0.45},${h.y - h.size * 0.25}`}
          fill="none" stroke="#AAFF00" strokeWidth="0.3" opacity={h.opacity}
          style={{ animation: `hexPulse ${3 + h.delay}s ease-in-out ${h.delay}s infinite alternate` }}
        />
      ))}
    </svg>
  );
}

// ── Mock UI preview card ─────────────────────────────────
function MockDashboard() {
  return (
    <div style={{ width: "100%", background: "#111118", borderRadius: 16, border: "1px solid #ffffff12", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header bar */}
      <div style={{ background: "#0D0D14", borderBottom: "1px solid #ffffff0d", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF6B6B", "#FFD93D", "#AAFF00"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ background: "#ffffff08", borderRadius: 6, padding: "3px 10px" }}>
          <span style={{ color: "#ffffff30", fontSize: 9 }}>suimedis.id/dashboard</span>
        </div>
        <div style={{ width: 20 }} />
      </div>
      {/* Content */}
      <div style={{ padding: "12px 14px" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
          {[
            { l: "Rekam Medis", v: "4", c: "#AAFF00" },
            { l: "Saldo SGT", v: "24.5", c: "#FFD93D" },
            { l: "EBG Log", v: "1", c: "#FF6B6B" },
          ].map(s => (
            <div key={s.l} style={{ background: "#0A0A0F", borderRadius: 8, padding: "8px 10px", border: "1px solid #ffffff08" }}>
              <p style={{ color: "#ffffff30", fontSize: 7, marginBottom: 3 }}>{s.l}</p>
              <p style={{ color: s.c, fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{s.v}</p>
            </div>
          ))}
        </div>
        {/* Record list */}
        {[
          { h: "PKM", d: "Hipertensi Grade II", t: "2024-05-18", c: "#AAFF00" },
          { h: "RSUD", d: "Konsultasi Kardiologi", t: "2024-05-10", c: "#FF6B6B" },
          { h: "PRK", d: "Diabetes Tipe 2", t: "2024-05-05", c: "#00E5FF" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #ffffff06" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: r.c + "18", border: `1px solid ${r.c}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: r.c, fontSize: 6, fontWeight: 700 }}>{r.h}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#ffffff80", fontSize: 9, fontWeight: 500 }}>{r.d}</p>
              <p style={{ color: "#ffffff25", fontSize: 7 }}>{r.t}</p>
            </div>
            <div style={{ background: "#AAFF0018", borderRadius: 4, padding: "2px 5px" }}>
              <span style={{ color: "#AAFF00", fontSize: 7, fontWeight: 700 }}>⛓ On-chain</span>
            </div>
          </div>
        ))}
        {/* Blockchain indicator */}
        <div style={{ marginTop: 8, background: "#AAFF0008", border: "1px solid #AAFF0018", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#AAFF00" }} />
          <span style={{ color: "#AAFF0070", fontSize: 8 }}>Sui Mainnet · Block #48,291,045 · Synced</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Landing Page ────────────────────────────────────
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const statsRef = useInView(0.3);
  const p1 = useCounter(1284, 1800, statsRef.inView);
  const p2 = useCounter(4871, 1800, statsRef.inView);
  const p3 = useCounter(12, 1200, statsRef.inView);
  const p4 = useCounter(99, 1400, statsRef.inView);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navScrolled = scrollY > 40;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300&family=DM+Mono:wght@400;500;600&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #AAFF0040; border-radius: 2px; }

        @keyframes hexPulse { from { opacity: 0.03; } to { opacity: 0.1; } }
        @keyframes floatY { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes floatY2 { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glowPulse { 0%,100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.08); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideLeft { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
        @keyframes marqueeLTR { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .hero-title { animation: fadeSlideUp 0.8s ease 0.1s both; }
        .hero-sub { animation: fadeSlideUp 0.8s ease 0.3s both; }
        .hero-cta { animation: fadeSlideUp 0.8s ease 0.5s both; }
        .hero-badge { animation: fadeSlideUp 0.8s ease 0.0s both; }
        .hero-visual { animation: fadeSlideLeft 1s ease 0.4s both; }
        .float1 { animation: floatY 4s ease-in-out infinite; }
        .float2 { animation: floatY2 5s ease-in-out 1s infinite; }
        .float3 { animation: floatY 3.5s ease-in-out 0.5s infinite; }
        .glow-orb { animation: glowPulse 5s ease-in-out infinite; }
        .glow-orb2 { animation: glowPulse 7s ease-in-out 2s infinite; }
        .spin-ring { animation: spinSlow 20s linear infinite; }
        .cursor-blink { animation: blink 1s step-end infinite; }
        .scanline { animation: scanline 3s linear infinite; }

        .nav-link { color: #ffffff50; font-size: 13px; font-weight: 500; cursor: pointer; transition: color 0.15s; text-decoration: none; }
        .nav-link:hover { color: #AAFF00; }

        .btn-primary { background: #AAFF00; color: #0A0A0F; border: none; border-radius: 12px; padding: 14px 28px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; letter-spacing: 0.2px; white-space: nowrap; }
        .btn-primary:hover { background: #C8FF40; transform: translateY(-2px); box-shadow: 0 8px 24px #AAFF0030; }
        .btn-ghost { background: transparent; color: #ffffff80; border: 1px solid #ffffff18; border-radius: 12px; padding: 13px 24px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .btn-ghost:hover { border-color: #ffffff35; color: #fff; }
        .btn-sm-ghost { background: transparent; color: #AAFF00; border: 1px solid #AAFF0035; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-sm-ghost:hover { background: #AAFF0012; border-color: #AAFF0060; }

        .feature-card { background: #111118; border: 1px solid #ffffff0d; border-radius: 18px; padding: 24px; transition: all 0.25s; cursor: default; }
        .feature-card:hover { border-color: #AAFF0030; background: #141420; transform: translateY(-3px); box-shadow: 0 12px 40px #0004; }

        .role-card { background: #111118; border: 1px solid #ffffff0d; border-radius: 20px; padding: 28px; transition: all 0.25s; }
        .role-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px #00000050; }

        .step-connector { flex: 1; height: 1px; background: linear-gradient(90deg, #AAFF0040, #AAFF0010); margin: 0 8px; margin-bottom: 28px; }

        .marquee-track { display: flex; gap: 32px; animation: marqueeLTR 20s linear infinite; white-space: nowrap; }

        .section-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .section-reveal.visible { opacity: 1; transform: translateY(0); }

        .problem-card { background: #0D0D14; border: 1px solid #FF6B6B18; border-radius: 14px; padding: 18px 20px; }
        .solution-card { background: #0D1a0D; border: 1px solid #AAFF0020; border-radius: 14px; padding: 18px 20px; }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
          .steps-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .step-connector { display: none !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .roles-grid { grid-template-columns: 1fr !important; }
          .ps-grid { grid-template-columns: 1fr !important; }
          .hero-title-text { font-size: clamp(40px, 12vw, 72px) !important; }
          .nav-links { display: none !important; }
          .hamburger-nav { display: flex !important; }
          .cta-section-inner { grid-template-columns: 1fr !important; text-align: center !important; }
          .cta-btns { justify-content: center !important; }
          .section-pad { padding: 60px 20px !important; }
          .hero-pad { padding: 100px 20px 60px !important; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Background glows ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div className="glow-orb" style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "#AAFF00", top: "-200px", left: "-150px", filter: "blur(120px)", opacity: 0.12 }} />
        <div className="glow-orb2" style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#00E5FF", bottom: "10%", right: "-100px", filter: "blur(120px)", opacity: 0.07 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff04 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.3s", background: navScrolled ? "rgba(10,10,15,0.9)" : "transparent", borderBottom: navScrolled ? "1px solid #ffffff0d" : "1px solid transparent", backdropFilter: navScrolled ? "blur(16px)" : "none", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 17, letterSpacing: "-0.5px" }}>SuiMedis</span>
          <span style={{ background: "#AAFF0018", color: "#AAFF00", border: "1px solid #AAFF0030", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.5px" }}>BETA</span>
        </div>

        {/* Nav links desktop */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Fitur", "Cara Kerja", "Untuk Siapa", "FAQ"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="nav-link">{l}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="/hospital/login" className="nav-link" style={{ fontSize: 12 }}>Login RS</a>
          <a href="/login">
            <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 9 }}>Masuk</button>
          </a>
          {/* Hamburger mobile */}
          <button className="hamburger-nav" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "#ffffff0d", border: "1px solid #ffffff12", borderRadius: 8, width: 36, height: 36, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, cursor: "pointer" }}>
            {[0,1,2].map(i => <span key={i} style={{ width: i===2?10:14, height: 1.5, background: "#fff", borderRadius: 2, display: "block" }} />)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, background: "#111118", borderBottom: "1px solid #ffffff0d", zIndex: 99, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {["Fitur", "Cara Kerja", "Untuk Siapa"].map(l => (
            <a key={l} href="#" className="nav-link" style={{ fontSize: 15 }} onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
          <div style={{ borderTop: "1px solid #ffffff0d", paddingTop: 14, display: "flex", gap: 10 }}>
            <a href="/login" style={{ flex: 1 }}><button className="btn-primary" style={{ width: "100%", borderRadius: 10 }}>Daftar Pasien</button></a>
            <a href="/hospital/login" style={{ flex: 1 }}><button className="btn-ghost" style={{ width: "100%", borderRadius: 10 }}>Login RS</button></a>
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ═══════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════ */}
        <section className="hero-pad" style={{ padding: "120px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 480px", gap: 60, alignItems: "center" }}>
            {/* Left */}
            <div>
              <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#AAFF0010", border: "1px solid #AAFF0025", borderRadius: 999, padding: "6px 14px", marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#AAFF00" }} />
                <span style={{ color: "#AAFF00", fontSize: 12, fontWeight: 600 }}>Dibangun di atas Sui Blockchain</span>
              </div>

              <h1 className="hero-title">
                <div className="hero-title-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 8vw, 88px)", lineHeight: 0.95, letterSpacing: "1px", color: "#fff", marginBottom: 6 }}>
                  REKAM MEDIS
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 8vw, 88px)", lineHeight: 0.95, letterSpacing: "1px", WebkitTextStroke: "1.5px #AAFF00", color: "transparent", marginBottom: 6 }}>
                  TERDESENTRALISASI
                </div>
                <div className="hero-title-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 8vw, 88px)", lineHeight: 0.95, letterSpacing: "1px", color: "#ffffff30" }}>
                  DI INDONESIA
                </div>
              </h1>

              <p className="hero-sub" style={{ color: "#ffffff55", fontSize: 16, lineHeight: 1.75, marginTop: 24, marginBottom: 32, maxWidth: 480 }}>
                Data medis Anda dienkripsi, tersimpan di blockchain Sui, dan bisa diakses oleh seluruh jaringan rumah sakit secara aman — tanpa satu pihak pun yang punya kendali penuh.
              </p>

              <div className="hero-cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="/register"><button className="btn-primary" style={{ fontSize: 15, padding: "15px 32px" }}>Daftar Gratis →</button></a>
                <a href="/hospital/login"><button className="btn-ghost" style={{ fontSize: 15, padding: "15px 28px" }}>Portal Rumah Sakit</button></a>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 32 }}>
                {[
                  { icon: "⛓", text: "Sui Blockchain" },
                  { icon: "🔐", text: "End-to-end Encrypted" },
                  { icon: "🇮🇩", text: "NIK-based Identity" },
                ].map(b => (
                  <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{b.icon}</span>
                    <span style={{ color: "#ffffff35", fontSize: 12, fontWeight: 500 }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Mock UI */}
            <div className="hero-visual float1" style={{ position: "relative" }}>
              {/* Decorative rings */}
              <div className="spin-ring" style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", border: "1px dashed #AAFF0020", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: -15, right: -15, width: 90, height: 90, borderRadius: "50%", border: "1px solid #AAFF0010", pointerEvents: "none" }} />

              {/* Floating chips */}
              <div className="float3" style={{ position: "absolute", top: -20, left: 20, background: "#111118", border: "1px solid #AAFF0030", borderRadius: 10, padding: "8px 12px", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#AAFF00" }} />
                  <span style={{ color: "#AAFF00", fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>Verified On-Chain ✓</span>
                </div>
              </div>

              <div className="float2" style={{ position: "absolute", bottom: 20, right: -20, background: "#111118", border: "1px solid #FF6B6B30", borderRadius: 10, padding: "8px 12px", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12 }}>🚨</span>
                  <span style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 600 }}>EBG Protected</span>
                </div>
              </div>

              <MockDashboard />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            MARQUEE STRIP
        ═══════════════════════════════════════════════ */}
        <div style={{ borderTop: "1px solid #ffffff08", borderBottom: "1px solid #ffffff08", padding: "14px 0", overflow: "hidden", background: "#0D0D14" }}>
          <div style={{ display: "flex", gap: 32, overflow: "hidden" }}>
            <div className="marquee-track">
              {["Sui Blockchain", "End-to-End Encryption", "NIK Identity", "IPFS Storage", "Multi-Hospital", "Zero Knowledge", "SGT Token", "Emergency Access", "Audit Trail", "Sui Blockchain", "End-to-End Encryption", "NIK Identity", "IPFS Storage", "Multi-Hospital", "Zero Knowledge", "SGT Token", "Emergency Access", "Audit Trail"].map((t, i) => (
                <span key={i} style={{ color: i % 3 === 0 ? "#AAFF00" : "#ffffff20", fontSize: 12, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0, display: "flex", alignItems: "center", gap: 32 }}>
                  {t} <span style={{ color: "#AAFF0030", fontSize: 8 }}>◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            PROBLEM vs SOLUTION
        ═══════════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#AAFF00", fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Problem → Solution</p>
            <h2 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.2 }}>
              Rekam medis konvensional<br />sudah ketinggalan zaman
            </h2>
          </div>

          <div className="ps-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Problems */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ color: "#FF6B6B", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>❌ Sebelum SuiMedis</p>
              {[
                "Data tersebar di banyak RS, tidak terhubung",
                "Pasien tidak bisa akses rekam medis sendiri",
                "Tidak ada audit trail — siapa saja bisa lihat data",
                "Kertas dan format tidak standar antar faskes",
                "Data bisa hilang, diubah, atau disalahgunakan",
              ].map((p, i) => (
                <div key={i} className="problem-card" style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: "#FF6B6B", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✕</span>
                  <p style={{ color: "#ffffff60", fontSize: 13, lineHeight: 1.5 }}>{p}</p>
                </div>
              ))}
            </div>

            {/* Solutions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ color: "#AAFF00", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>✓ Dengan SuiMedis</p>
              {[
                "Satu sumber kebenaran di blockchain Sui",
                "Pasien kontrol penuh atas data mereka",
                "Setiap akses tercatat immutable on-chain",
                "Format terstandarisasi, bisa diakses lintas RS",
                "Terenkripsi end-to-end, tidak bisa dimanipulasi",
              ].map((s, i) => (
                <div key={i} className="solution-card" style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: "#AAFF00", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <p style={{ color: "#ffffff70", fontSize: 13, lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            STATS
        ═══════════════════════════════════════════════ */}
        <section ref={statsRef.ref} style={{ padding: "60px 24px", background: "#0D0D14", borderTop: "1px solid #ffffff08", borderBottom: "1px solid #ffffff08" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 1000, margin: "0 auto" }}>
            {[
              { val: p1, suffix: "+", label: "Pasien Terdaftar", accent: "#AAFF00" },
              { val: p2, suffix: "+", label: "Rekam Medis On-Chain", accent: "#00E5FF" },
              { val: p3, suffix: "", label: "Rumah Sakit Terhubung", accent: "#FFD93D" },
              { val: p4, suffix: "%", label: "Uptime Blockchain", accent: "#FF6B6B" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", padding: "24px 16px" }}>
                <p style={{ color: s.accent, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, fontFamily: "'DM Mono', monospace", letterSpacing: "-2px", marginBottom: 6 }}>
                  {s.val.toLocaleString()}{s.suffix}
                </p>
                <p style={{ color: "#ffffff40", fontSize: 13, fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════════════ */}
        <section className="section-pad" id="cara-kerja" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#AAFF00", fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Cara Kerja</p>
            <h2 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.2 }}>
              3 langkah mudah
            </h2>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 0, alignItems: "flex-start" }}>
            {[
              { num: "01", icon: "🪪", title: "Daftar dengan NIK", desc: "Masukkan NIK dan nama ibu kandung Anda. Wallet blockchain deterministik dibuat otomatis — tidak perlu seed phrase.", color: "#AAFF00" },
              { num: "02", icon: "🏥", title: "RS Catat Rekam Medis", desc: "Dokter/RS membuat rekam medis. Data dienkripsi dengan kunci publik Anda dan disimpan terdesentralisasi di IPFS.", color: "#00E5FF" },
              { num: "03", icon: "🌐", title: "Akses Lintas RS", desc: "RS manapun bisa query rekam medis Anda langsung dari blockchain — dengan izin Anda. Setiap akses tercatat permanen.", color: "#FFD93D" },
            ].map((step, i) => (
              <>
                <div key={step.num} style={{ textAlign: "center", padding: "0 8px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: step.color + "15", border: `1px solid ${step.color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>
                    {step.icon}
                  </div>
                  <div style={{ display: "inline-block", background: step.color + "18", border: `1px solid ${step.color}30`, borderRadius: 6, padding: "2px 8px", marginBottom: 10 }}>
                    <span style={{ color: step.color, fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{step.num}</span>
                  </div>
                  <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.3px" }}>{step.title}</h3>
                  <p style={{ color: "#ffffff45", fontSize: 13, lineHeight: 1.65 }}>{step.desc}</p>
                </div>
                {i < 2 && <div key={`conn-${i}`} className="step-connector" />}
              </>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            FEATURES
        ═══════════════════════════════════════════════ */}
        <section className="section-pad" id="fitur" style={{ padding: "80px 24px", background: "#0D0D14", borderTop: "1px solid #ffffff08" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ color: "#AAFF00", fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Fitur Unggulan</p>
              <h2 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-1px" }}>
                Dirancang untuk keamanan<br />dan kemudahan
              </h2>
            </div>

            <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { icon: "⛓", title: "Immutable Blockchain", desc: "Setiap rekam medis dan akses tercatat permanen di Sui blockchain — tidak bisa dihapus atau dimanipulasi siapapun.", accent: "#AAFF00", big: false },
                { icon: "🔐", title: "Zero-Knowledge Identity", desc: "NIK + nama ibu kandung di-hash menjadi seed wallet deterministik. Data asli tidak pernah menyentuh server.", accent: "#00E5FF", big: false },
                { icon: "🚨", title: "Emergency Break Glass", desc: "Dokter terverifikasi bisa akses data darurat dalam kondisi mengancam jiwa. Wajib isi justifikasi. Sesi 15 menit, sekali pakai.", accent: "#FF6B6B", big: false },
                { icon: "🏥", title: "Multi-Hospital Network", desc: "RS manapun di jaringan bisa query rekam medis pasien langsung dari blockchain — tanpa integrasi antar sistem.", accent: "#FFD93D", big: false },
                { icon: "📤", title: "Export PDF On-Demand", desc: "Generate PDF rekam medis lengkap kapan saja. Biaya transparan dalam SGT token sesuai ukuran file.", accent: "#AAFF00", big: false },
                { icon: "💰", title: "SGT Token Economy", desc: "Ekosistem biaya yang adil: RS bayar per rekam, pasien bayar per export. Cross-hospital query gratis.", accent: "#FFD93D", big: false },
              ].map((f) => (
                <div key={f.title} className="feature-card">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: f.accent + "15", border: `1px solid ${f.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.2px" }}>{f.title}</h3>
                  <p style={{ color: "#ffffff45", fontSize: 13, lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            FOR WHO
        ═══════════════════════════════════════════════ */}
        <section className="section-pad" id="untuk-siapa" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#AAFF00", fontSize: 12, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Untuk Siapa</p>
            <h2 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-1px" }}>
              Satu platform, tiga aktor
            </h2>
          </div>

          <div className="roles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                icon: "👤", title: "Pasien", color: "#AAFF00",
                desc: "Kendalikan data medis Anda sepenuhnya. Lihat siapa yang mengakses, kapan, dan untuk apa.",
                points: ["Daftar dengan NIK — tanpa wallet", "Akses rekam medis dari RS manapun", "Export PDF kapan saja", "Audit trail akses data Anda"],
                cta: "Daftar Sekarang", href: "/register",
              },
              {
                icon: "🩺", title: "Dokter / Tenaga Medis", color: "#00E5FF",
                desc: "Akses riwayat medis lengkap pasien, bahkan dari RS berbeda — dalam satu platform.",
                points: ["Query rekam medis lintas RS", "Emergency Break Glass untuk kasus darurat", "Input rekam medis terstandarisasi", "Verifikasi identitas dokter via STR/SIP"],
                cta: "Login Dokter", href: "/hospital/login",
              },
              {
                icon: "🏥", title: "Rumah Sakit / Faskes", color: "#FFD93D",
                desc: "Bergabung ke jaringan RS SuiMedis. Kurangi redundansi data dan tingkatkan kualitas pelayanan.",
                points: ["Buat rekam medis terenkripsi", "Akses data pasien dari faskes lain", "Kelola wallet SGT untuk operasional", "Audit trail akses data pasien"],
                cta: "Login RS", href: "/hospital/login",
              },
            ].map((role) => (
              <div key={role.title} className="role-card" style={{ borderColor: role.color + "20" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: role.color + "15", border: `1px solid ${role.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 18 }}>
                  {role.icon}
                </div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.3px" }}>{role.title}</h3>
                <p style={{ color: "#ffffff45", fontSize: 13, lineHeight: 1.65, marginBottom: 18 }}>{role.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
                  {role.points.map((p) => (
                    <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: role.color, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
                      <span style={{ color: "#ffffff55", fontSize: 13 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <a href={role.href}>
                  <button className="btn-sm-ghost" style={{ width: "100%", color: role.color, borderColor: role.color + "35" }}>
                    {role.cta} →
                  </button>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            BLOCKCHAIN TRANSPARENCY STRIP
        ═══════════════════════════════════════════════ */}
        <section style={{ padding: "40px 24px", background: "#0D0D14", borderTop: "1px solid #AAFF0015", borderBottom: "1px solid #AAFF0015", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}><HexGrid /></div>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32, alignItems: "center", position: "relative", zIndex: 1 }}>
            {[
              { label: "Network", value: "Sui Mainnet", icon: "⛓" },
              { label: "Latest Block", value: "#48,291,045", icon: "📦" },
              { label: "Smart Contract", value: "0x9f3c...7d2b", icon: "📄" },
              { label: "Status", value: "Online", icon: "🟢" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <p style={{ color: "#ffffff25", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{item.label}</p>
                <p style={{ color: "#AAFF00", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{item.icon}</span> {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CTA FINAL
        ═══════════════════════════════════════════════ */}
        <section style={{ padding: "80px 24px 100px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", background: "linear-gradient(135deg, #1a2a1a 0%, #111118 50%, #1a1a30 100%)", border: "1px solid #AAFF0025", borderRadius: 24, padding: "52px 48px", position: "relative", overflow: "hidden" }}>
            {/* Decorative */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "#AAFF00", opacity: 0.06, filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "#00E5FF", opacity: 0.05, filter: "blur(50px)", pointerEvents: "none" }} />

            <div className="cta-section-inner" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center", position: "relative", zIndex: 1 }}>
              <div>
                <h2 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 12, lineHeight: 1.2 }}>
                  Mulai kendalikan data<br />medis Anda hari ini
                </h2>
                <p style={{ color: "#ffffff45", fontSize: 14, lineHeight: 1.7 }}>
                  Gratis untuk pasien. RS bayar per transaksi. Tidak ada lock-in, tidak ada vendor tunggal.
                </p>
              </div>
              <div className="cta-btns" style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
                <a href="/register"><button className="btn-primary" style={{ width: "100%", fontSize: 14, padding: "14px 24px" }}>Daftar sebagai Pasien →</button></a>
                <a href="/hospital/login"><button className="btn-ghost" style={{ width: "100%", fontSize: 13, padding: "12px 20px" }}>Portal Rumah Sakit</button></a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════ */}
        <footer style={{ borderTop: "1px solid #ffffff08", padding: "32px 24px", background: "#0D0D14" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "#AAFF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="#0A0A0F" /></svg>
              </div>
              <span style={{ color: "#ffffff60", fontSize: 13, fontWeight: 600 }}>SuiMedis</span>
              <span style={{ color: "#ffffff20", fontSize: 12 }}>© 2024</span>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Kebijakan Privasi", "Syarat Layanan", "Dokumentasi API", "GitHub"].map(l => (
                <a key={l} href="#" className="nav-link" style={{ fontSize: 12 }}>{l}</a>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "#AAFF0010", border: "1px solid #AAFF0020" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#AAFF00" }} />
              <span style={{ color: "#AAFF00", fontSize: 11, fontWeight: 600 }}>Sui Mainnet Online</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}