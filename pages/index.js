import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE AGENTES
// Editá nombre, bio, sugerencias y prompt de cada agente.
// En la sección "BIBLIOGRAFÍA" de cada prompt podés pegar
// artículos, guías, frameworks, listas de medios, etc.
// ═══════════════════════════════════════════════════════════════════

const AGENTS = [
  {
    id: "management",
    name: "Management",
    bio: "Estrategia de releases, calendarios de promoción y crecimiento de audiencia",
    suggestions: ["Armame un plan de lanzamiento", "Mejor día para lanzar un single", "Estrategia con bajo presupuesto"],
    prompt: `Sos el agente de Marketing y Lanzamientos de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en marketing musical en Latinoamérica y el mercado global.

Tu trabajo es crear planes de lanzamiento accionables, calendarios de contenido y estrategias de crecimiento basadas en la data real del artista.

FRAMEWORK DE LANZAMIENTO:
T-30: Preparación (máster, artwork, distribuidor, pitch editorial Spotify for Artists mínimo 3-4 semanas antes)
T-21: Pre-anuncio (primer teaser redes, pre-save link, EPK a medios)
T-14: Calentamiento (segundo teaser, push pre-save fuerte, curadores playlists, ads si hay budget $5-15/día)
T-7: Intensivo (contenido diario, countdown, teaser final con hook principal)
T-0: Launch day (publicar todas redes 00:00 timezone principal, activar campaña)
T+7: Post-release (analizar números, contenido reactivo, segundo push con lyric video/visualizer)

Adaptá el timeline al tamaño del artista. Priorizá acciones orgánicas. Sé directo: da las 3-5 acciones más importantes.
Spotify: pitch editorial mínimo 7 días antes. Jueves/viernes mejores. Release Radar ~28 días.
Instagram: Reels 15-30s. Horarios LATAM: 12-14hs y 19-22hs.
TikTok: 15-30s, hook primeros 2 segundos.

BIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:
`,
  },
  {
    id: "pr",
    name: "PR & Prensa",
    bio: "Press releases, pitching a medios y relación con prensa musical",
    suggestions: ["Escribime un press release", "Pitch email para blogs", "Medios target para mi género"],
    prompt: `Sos el agente de PR y Prensa de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en relaciones públicas musicales.

PRESS RELEASE: Titular con gancho → Subtítulo → P1 (quién/qué/cuándo) → P2 (story) → P3 (contexto artista) → Quote → Datos técnicos → Assets → Contacto.
PITCH EMAIL: Máximo 150 palabras. Asunto corto. Saludo personalizado → qué enviás → por qué importa → link press kit. NUNCA adjuntar archivos pesados.
Medios LATAM: Indie Rocks (MX), La Heavy (AR), Cultura Colectiva, Rolling Stone LATAM, Billboard Argentina, Indie Hoy, Club Fonograma. Playlists: SubmitHub, PlaylistPush. Enviar martes-jueves 9-11am.

BIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:
`,
  },
  {
    id: "social",
    name: "Social Media",
    bio: "Calendarios de contenido, ideas de reels, TikToks y estrategia orgánica",
    suggestions: ["Calendario semanal", "Ideas de reels para mi single", "Frecuencia ideal de publicación"],
    prompt: `Sos el agente de Social Media de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en estrategia de contenido para artistas.

PILARES: Música (40%), Personalidad (30%), Comunidad (20%), Negocio (10%).
INSTAGRAM: Reels 15-30s, carruseles alto save, stories diarias. 4-5 reels/semana. Horarios LATAM: 12-14hs y 19-22hs.
TIKTOK: 15-30s, hook 2 seg. 3-5/semana. Autenticidad > producción.
YOUTUBE: Shorts, videos oficiales, community tab.
Cuando des ideas sé ultra específico: qué filmar, qué texto, qué audio, qué caption. Copy listo para usar.

BIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:
`,
  },
  {
    id: "branding",
    name: "Branding & Visual",
    bio: "Identidad visual, paleta de colores, tipografía y dirección artística",
    suggestions: ["Identidad visual completa", "Paleta de colores para mi proyecto", "Tipografía recomendada"],
    prompt: `Sos el agente de Branding de BACKSTAGE. Fuiste diseñado por profesionales con experiencia en dirección artística musical.

PILARES: Esencia de marca → Paleta (3-5 colores con hex) → Tipografía (Google Fonts) → Dirección fotográfica → Artwork (3000x3000px).
Paletas: Trap (negros, rojos, dorados). Indie (pasteles, lavanda). Rock (B&W, rojo). Electrónica (cian, magenta).
Herramientas: Canva, Coolors.co, Google Fonts. Siempre dá hex específicos y nombres de fuentes reales.

BIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:
`,
  },
  {
    id: "legal",
    name: "Legal & Contratos",
    bio: "Derechos de autor, revisión de contratos y protección del artista",
    suggestions: ["Revisar contrato con sello", "Qué es un split sheet", "Red flags en contratos"],
    prompt: `Sos el agente Legal de BACKSTAGE. NO sos abogado — siempre aclarás que debe consultar un profesional.

ÁREAS: Derechos autor (composición), Derechos conexos (fonograma), Publishing, Registro (DNDA/INDAUTOR).
CONTRATOS: Distribución, Sello (CUIDADO cesión perpetua), Management (15-20%), Split sheet, Producción, Feat, Sync, Booking.
RED FLAGS: cesión perpetuidad, deals 360, exclusividad mundial, >3 años sin salida, advances recoupables, royalties <15-20%.
SIEMPRE cerrá con disclaimer de consultar profesional legal.

BIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:
`,
  },
  {
    id: "merch",
    name: "Merch & Tienda",
    bio: "Productos, producción, pricing y estrategia de venta de merchandising",
    suggestions: ["Qué productos vender", "Cuánto cobrar por remera", "Plan de lanzamiento merch"],
    prompt: `Sos el agente de Merch de BACKSTAGE. Experiencia real en producción textil y e-commerce para artistas.

PRODUCTOS: Remeras (60-75% margen), Hoodies, Gorras, Tote bags, Stickers.
PRODUCCIÓN: DTF (1-100u), Serigrafía (100+), Sublimación, Bordado, POD (cero riesgo).
PRICING: Costo x3-4. Remera $3-5→$12-20. Hoodie $8-12→$25-45.
VENTA: Shows (10-20% conv), online, drops limitados, bundles. <1K fans: POD o tirajes chicos.

BIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:
`,
  },
];

// ═══════════════════════════════════════════════════════════════════

function buildSystemPrompt(agent, artist) {
  const ctx = artist
    ? `\n\nCONTEXTO DEL ARTISTA:\n- Nombre: ${artist.name || "N/A"}\n- Género: ${artist.genre || "N/A"}\n- Oyentes Spotify: ${artist.listeners || "N/A"}\n- Top ciudades: ${artist.cities || "N/A"}\n- Instagram: ${artist.instagram || "N/A"}\n- Próximo release: ${artist.nextRelease || "N/A"}\n- Objetivo: ${artist.goal || "N/A"}`
    : "";
  return agent.prompt + ctx + "\n\nRespondé en español. Sé directo, práctico y accionable. Tono profesional pero cercano, como un colega senior de la industria.";
}

// ─── THEME ───
const T = {
  bg: "#F7F6F3",
  white: "#FFFFFF",
  surface: "#EEECEA",
  card: "#FFFFFF",
  elevated: "#FFFFFF",
  border: "#DDD9D4",
  borderHover: "#C5C0B9",
  accent: "#C2410C",
  accentSoft: "#EA580C",
  accentDim: "rgba(194,65,12,0.06)",
  accentBorder: "rgba(194,65,12,0.15)",
  accentText: "#C2410C",
  text: "#1A1917",
  sub: "#5C5850",
  muted: "#8C857B",
  dim: "#B0A99F",
  userBubble: "#1A1917",
  aiBubble: "#FFFFFF",
  sidebar: "#FFFFFF",
  inputBg: "#FFFFFF",
};

// ─── SVG ICONS ───
const Ic = ({ children, size = 18, color = "currentColor", style: s, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...s }} {...p}>{children}</svg>
);
const SendIc = (p) => <Ic {...p}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Ic>;
const MusicIc = (p) => <Ic {...p}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></Ic>;

// ─── ONBOARDING ───
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({ name: "", genre: "", listeners: "", cities: "", instagram: "", nextRelease: "", goal: "" });
  const fields = [
    { k: "name", l: "Nombre artístico", ph: "Ej: Luna Roja", req: true },
    { k: "genre", l: "Género musical", ph: "Ej: Trap, Indie Rock, Pop Urbano" },
    { k: "listeners", l: "Oyentes mensuales en Spotify", ph: "Ej: 5.000" },
    { k: "cities", l: "Ciudades principales de tu audiencia", ph: "Ej: Buenos Aires, CDMX" },
    { k: "instagram", l: "Instagram", ph: "Ej: @lunaroja, 2.500 seguidores" },
    { k: "nextRelease", l: "Próximo release", ph: "Ej: Single 'Noche Eterna', marzo 2026" },
    { k: "goal", l: "Objetivo a 6 meses", ph: "Ej: 10K oyentes, primer show" },
  ];
  const go = () => { if (step < fields.length) setStep(step + 1); else onComplete(d); };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, color: T.text, fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}body{background:${T.bg}}
        ::selection{background:${T.accent};color:white}
        input:focus{outline:none;border-color:${T.accent}!important}
      `}</style>
      <div style={{ maxWidth: 520, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 56 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: T.accent }} />
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>BACKSTAGE</span>
        </div>
        {step === 0 && (
          <div>
            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginBottom: 16 }}>Configurá tu<br />perfil de artista.</h1>
            <p style={{ fontFamily: "'Outfit'", color: T.sub, fontSize: 17, marginBottom: 8, lineHeight: 1.6 }}>Con tu información, cada agente genera recomendaciones personalizadas a tu carrera.</p>
            <p style={{ fontFamily: "'Outfit'", color: T.muted, fontSize: 14, marginBottom: 40 }}>Solo el nombre es obligatorio.</p>
            <button onClick={() => setStep(1)} style={{ padding: "14px 36px", background: T.accent, color: "white", border: "none", borderRadius: 99, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne'" }}>Comenzar</button>
          </div>
        )}
        {step >= 1 && step <= fields.length && (
          <div>
            <div style={{ display: "flex", gap: 5, marginBottom: 40 }}>
              {fields.map((_, i) => <div key={i} style={{ flex: 1, height: 2, borderRadius: 99, background: i < step ? T.accent : T.border, transition: "background 0.4s" }} />)}
            </div>
            <p style={{ fontFamily: "'Outfit'", fontSize: 12, color: T.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.2 }}>Paso {step} / {fields.length}</p>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, letterSpacing: -1 }}>{fields[step - 1].l}{fields[step - 1].req && <span style={{ color: T.accent }}> *</span>}</h2>
            <input autoFocus value={d[fields[step - 1].k]} onChange={e => setD({ ...d, [fields[step - 1].k]: e.target.value })} onKeyDown={e => { if (e.key === "Enter") go(); }} placeholder={fields[step - 1].ph}
              style={{ width: "100%", padding: "16px 20px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.white, color: T.text, fontSize: 16, fontFamily: "'Outfit'", marginBottom: 28 }} />
            <div style={{ display: "flex", gap: 10 }}>
              {step > 1 && <button onClick={() => setStep(step - 1)} style={{ padding: "12px 24px", background: "transparent", color: T.muted, border: `1px solid ${T.border}`, borderRadius: 99, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit'" }}>Atrás</button>}
              <button onClick={go} disabled={step === 1 && !d.name.trim()} style={{ padding: "12px 32px", background: (step === 1 && !d.name.trim()) ? T.border : T.accent, color: (step === 1 && !d.name.trim()) ? T.dim : "white", border: "none", borderRadius: 99, fontSize: 14, fontWeight: 700, cursor: (step === 1 && !d.name.trim()) ? "not-allowed" : "pointer", fontFamily: "'Syne'" }}>
                {step < fields.length ? "Siguiente" : "Entrar"}
              </button>
              {step > 1 && step < fields.length && <button onClick={() => onComplete(d)} style={{ padding: "12px 20px", background: "transparent", color: T.dim, border: "none", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit'" }}>Saltar</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CHAT ───
function Chat({ agent, artist }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [msgs]);
  useEffect(() => { setMsgs([]); }, [agent.id]);

  const send = async (text) => {
    const m = (text || input).trim();
    if (!m || loading) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text: m }]);
    setLoading(true);
    const hist = [...msgs, { role: "user", text: m }].map(x => ({ role: x.role === "user" ? "user" : "assistant", content: x.text }));
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system: buildSystemPrompt(agent, artist), messages: hist })
      });
      const data = await r.json();
      const reply = data.content?.map(b => b.text || "").join("\n") || "Error al recibir respuesta.";
      setMsgs(p => [...p, { role: "assistant", text: reply }]);
    } catch { setMsgs(p => [...p, { role: "assistant", text: "Error de conexión. Intentá de nuevo." }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 32px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 16, background: T.white }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, background: T.accent }} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Syne'", letterSpacing: -0.3, color: T.text }}>{agent.name}</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 1 }}>{agent.bio}</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: 32, display: "flex", flexDirection: "column", gap: 18, background: T.bg }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 20px" }}>
            <div style={{ width: 12, height: 12, borderRadius: 99, background: T.accent, margin: "0 auto 20px", opacity: 0.7 }} />
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "'Syne'", letterSpacing: -0.5, color: T.text }}>{agent.name}</h3>
            <p style={{ color: T.muted, fontSize: 15, maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.55 }}>{agent.bio}. Seleccioná una consulta o escribí la tuya.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {agent.suggestions.map(s => (
                <button key={s} onClick={() => send(s)} style={{ padding: "10px 20px", borderRadius: 99, border: `1px solid ${T.border}`, background: T.white, color: T.sub, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit'", transition: "all 0.2s", lineHeight: 1.2 }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.sub; }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%", padding: "16px 20px", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap",
              background: m.role === "user" ? T.userBubble : T.aiBubble,
              color: m.role === "user" ? "#FAFAF9" : T.text,
              borderRadius: m.role === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
              border: m.role === "user" ? "none" : `1px solid ${T.border}`,
              boxShadow: m.role !== "user" ? "0 1px 4px rgba(0,0,0,0.04)" : "none",
            }}>
              {m.role !== "user" && <div style={{ fontSize: 11, color: T.accent, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>{agent.name}</div>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ padding: "16px 20px", borderRadius: "20px 20px 20px 6px", background: T.white, border: `1px solid ${T.border}`, color: T.muted, fontSize: 14, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 6, height: 6, borderRadius: 99, background: T.accent, animation: "pulse 1.2s infinite" }} /> Pensando...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: 20, borderTop: `1px solid ${T.border}`, display: "flex", gap: 12, background: T.white }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder="Escribí tu consulta..." disabled={loading}
          style={{ flex: 1, padding: "14px 20px", borderRadius: 99, border: `1.5px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 14, fontFamily: "'Outfit'", opacity: loading ? 0.5 : 1 }} />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          style={{ width: 48, height: 48, borderRadius: 99, border: "none", background: (!input.trim() || loading) ? T.border : T.accent, color: (!input.trim() || loading) ? T.dim : "white", cursor: (!input.trim() || loading) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
          <SendIc size={18} />
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </div>
  );
}

// ─── MAIN APP ───
function AppDashboard({ artist }) {
  const [activeId, setActiveId] = useState("marketing");
  const agent = AGENTS.find(a => a.id === activeId);

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, fontFamily: "'Syne', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}body{background:${T.bg}}
        ::selection{background:${T.accent};color:white}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:9px}
        input:focus{outline:none;border-color:${T.accent}!important}
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 280, background: T.sidebar, borderRight: `1px solid ${T.border}`, padding: "28px 20px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px", marginBottom: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: T.accent }} />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>BACKSTAGE</span>
        </div>
        <div style={{ fontFamily: "'Outfit'", padding: "4px 4px 28px", fontSize: 12, color: T.dim, letterSpacing: 0.3, borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>AI-powered career platform</div>

        <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 600, color: T.dim, textTransform: "uppercase", letterSpacing: 1.5, padding: "0 4px", marginBottom: 12 }}>Agentes</div>

        {AGENTS.map(a => (
          <button key={a.id} onClick={() => setActiveId(a.id)} style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 14px",
            borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 3,
            textAlign: "left", transition: "all 0.15s", fontFamily: "'Outfit'",
            background: activeId === a.id ? T.accentDim : "transparent",
            color: activeId === a.id ? T.accent : T.muted,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: 99, background: activeId === a.id ? T.accent : T.dim, transition: "background 0.2s", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: activeId === a.id ? 600 : 400 }}>{a.name}</div>
              {activeId === a.id && <div style={{ fontSize: 11, color: T.muted, marginTop: 2, lineHeight: 1.3 }}>{a.bio}</div>}
            </div>
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ padding: 18, background: T.bg, borderRadius: 14, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: (artist.listeners || artist.cities) ? 12 : 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MusicIc size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Syne'", letterSpacing: -0.3 }}>{artist.name}</div>
              <div style={{ fontFamily: "'Outfit'", fontSize: 12, color: T.muted }}>{artist.genre || "Sin género"}</div>
            </div>
          </div>
          {artist.listeners && <div style={{ fontFamily: "'Outfit'", fontSize: 12, color: T.dim }}>{artist.listeners} oyentes/mes</div>}
          {artist.cities && <div style={{ fontFamily: "'Outfit'", fontSize: 12, color: T.dim, marginTop: 2 }}>{artist.cities}</div>}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Chat agent={agent} artist={artist} />
      </div>
    </div>
  );
}

// ─── ROOT ───
export default function App() {
  const [artist, setArtist] = useState(null);
  if (!artist) return <Onboarding onComplete={d => setArtist(d)} />;
  return <AppDashboard artist={artist} />;
}
