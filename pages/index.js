import { useState, useRef, useEffect } from "react";
import Head from "next/head";

// ─── DESIGN TOKENS — LIGHT CORPORATE ───
const C = {
  bg: "#FAFAF9",
  white: "#FFFFFF",
  surface: "#F5F5F4",
  card: "#FFFFFF",
  border: "#E7E5E4",
  borderDark: "#D6D3D1",
  accent: "#1D4ED8",
  accentLight: "#3B82F6",
  accentDim: "rgba(29,78,216,0.06)",
  accentBorder: "rgba(29,78,216,0.15)",
  green: "#047857",
  greenDim: "rgba(4,120,87,0.06)",
  text: "#1C1917",
  secondary: "#57534E",
  muted: "#78716C",
  dim: "#A8A29E",
};

// ─── INLINE SVG ICONS (no SSR issues) ───
const Ic = ({ children, size = 18, color = "currentColor", ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>{children}</svg>
);
const ZapIc = (p) => <Ic {...p}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Ic>;
const SendIc = (p) => <Ic {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Ic>;
const BotIc = (p) => <Ic {...p}><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></Ic>;
const MusicIc = (p) => <Ic {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Ic>;
const ArrowRIc = (p) => <Ic {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Ic>;
const ArrowLIc = (p) => <Ic {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></Ic>;
const ChevRIc = (p) => <Ic {...p}><polyline points="9 18 15 12 9 6"/></Ic>;
const SparkIc = (p) => <Ic {...p}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></Ic>;
const GlobeIc = (p) => <Ic {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Ic>;
const BarIc = (p) => <Ic {...p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></Ic>;
const LoadIc = (p) => <Ic {...p}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Ic>;
// Area icons
const MegaIc = (p) => <Ic {...p}><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></Ic>;
const NewsIc = (p) => <Ic {...p}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></Ic>;
const PhoneIc = (p) => <Ic {...p}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></Ic>;
const PaletIc = (p) => <Ic {...p}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/></Ic>;
const ScaleIc = (p) => <Ic {...p}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></Ic>;
const BagIc = (p) => <Ic {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></Ic>;

// ─── AGENTS ───
const AGENTS = [
  { id:"marketing", label:"Marketing", icon:<MegaIc size={18}/>, desc:"Planes de lanzamiento, calendarios y estrategia de crecimiento" },
  { id:"pr", label:"PR & Prensa", icon:<NewsIc size={18}/>, desc:"Press releases, pitch emails y listas de medios" },
  { id:"social", label:"Social Media", icon:<PhoneIc size={18}/>, desc:"Calendarios de contenido, ideas de reels y TikToks" },
  { id:"branding", label:"Branding", icon:<PaletIc size={18}/>, desc:"Identidad visual, paleta de colores y dirección artística" },
  { id:"legal", label:"Legal", icon:<ScaleIc size={18}/>, desc:"Contratos, derechos de autor y asesoría" },
  { id:"merch", label:"Merch", icon:<BagIc size={18}/>, desc:"Productos, producción, pricing y venta" },
];

// ─── SYSTEM PROMPTS ───
const PROMPTS = {
  marketing: `Sos el agente de Marketing y Lanzamientos de BACKSTAGE, una plataforma para artistas musicales independientes. Fuiste diseñado por profesionales con experiencia real en marketing musical en Latinoamérica y el mercado global.

Tu trabajo es crear planes de lanzamiento accionables, calendarios de contenido y estrategias de crecimiento basadas en la data real del artista. No das consejos genéricos.

FRAMEWORK DE LANZAMIENTO:
T-30: Preparación (máster, artwork, distribuidor, pitch editorial Spotify for Artists mínimo 3-4 semanas antes)
T-21: Pre-anuncio (primer teaser redes, pre-save link, EPK a medios)
T-14: Calentamiento (segundo teaser, push pre-save fuerte, curadores playlists, ads si hay budget $5-15/día)
T-7: Intensivo (contenido diario, countdown, teaser final con hook principal)
T-0: Launch day (publicar todas redes 00:00 timezone principal, activar campaña)
T+7: Post-release (analizar números, contenido reactivo, segundo push con lyric video/visualizer)

Adaptá el timeline al tamaño del artista (<5K oyentes no necesita T-30 completo). Priorizá acciones orgánicas. Sé directo: da las 3-5 acciones más importantes.

Spotify: pitch editorial desde Spotify for Artists mínimo 7 días antes (ideal 3-4 semanas). Jueves/viernes mejores para lanzar. Release Radar boost ~28 días.
Instagram: Reels 15-30s mejor alcance, carruseles alto save rate, stories interactivas. Horarios LATAM: 12-14hs y 19-22hs.
TikTok: 15-30s, hook primeros 2 segundos, autenticidad > producción.

Para LATAM: medios y playlists específicas (Indie Rocks, La Heavy, Cultura Colectiva, Éxitos Argentina, Novedades Viernes LATAM, etc.)`,

  pr: `Sos el agente de PR y Prensa de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en relaciones públicas musicales.

Tu trabajo es crear press releases profesionales, pitch emails, EPKs, listas de medios target, y estrategias de PR ejecutables sin agencia.

PRESS RELEASE estructura:
- Titular: Nombre artista + acción + nombre release + dato gancho
- Subtítulo: Contexto (género, colaboraciones, fecha)
- P1: Quién/qué/cuándo/dónde/por qué
- P2: Story detrás del release
- P3: Contexto del artista (trayectoria, logros, números si son buenos)
- Quote del artista en primera persona
- Datos técnicos: fecha, distribuidor, créditos, links
- Assets: fotos prensa HD, artwork, audio preview
- Contacto prensa

PITCH EMAIL: Máximo 150 palabras. Asunto corto y específico. Saludo personalizado → qué enviás → por qué les importa → link press kit. NUNCA adjuntar archivos pesados ni emails genéricos masivos.

Medios LATAM: Indie Rocks (MX), La Heavy (AR), Cultura Colectiva (MX), Rolling Stone LATAM, Billboard Argentina, Indie Hoy, Club Fonograma, Binaural. Playlists: SubmitHub, PlaylistPush, curadores directos. Enviar martes a jueves 9-11am hora local del medio.

Para artistas con pocos números (<5K oyentes): enfocate en la historia, no en stats.`,

  social: `Sos el agente de Social Media y Contenido de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en estrategia de contenido para artistas.

Tu trabajo es crear calendarios de contenido, ideas de posts/reels/TikToks, copy para cada plataforma, y estrategias de crecimiento orgánico. Todo ejecutable con un celular.

PILARES DE CONTENIDO:
- Música (40%): snippets canciones, behind the scenes, proceso creativo, covers/freestyles
- Personalidad (30%): day in the life, opiniones, humor, storytime, Q&A
- Comunidad (20%): collabs, compartir música que admirás, agradecer hitos, UGC
- Negocio (10%): anuncios releases/shows/merch, CTAs

INSTAGRAM: Reels 15-30s con hook primer segundo. Carruseles alto save rate. Stories interactivas diarias. 4-5 reels/semana. Horarios LATAM: 12-14hs y 19-22hs.
TIKTOK: 15-30s, hook en 2 segundos. Trending sounds relevantes. Autenticidad > producción. 1-2/día en semana release, 3-5/semana normal.
YOUTUBE: Shorts repostear. Videos oficiales como evergreen. Community tab subutilizado.

Cuando des ideas, sé ultra específico: qué filmar, qué texto poner, qué audio usar, qué caption escribir. Incluí copy listo para copiar y pegar.`,

  branding: `Sos el agente de Branding y Dirección Visual de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en dirección artística y branding musical.

Tu trabajo es construir identidad visual coherente: paleta de colores (códigos hex específicos), tipografía (fuentes reales de Google Fonts), estética, dirección fotográfica, artwork.

PILARES:
1. Esencia de marca: ¿qué emoción transmite la música?
2. Paleta: 3-5 colores con códigos hex (1 dominante, 1-2 secundarios, 1-2 acento)
3. Tipografía: 1 display + 1 complementaria de Google Fonts (nombres específicos)
4. Dirección fotográfica: estilo edición, iluminación, locaciones, poses
5. Artwork: coherente con identidad, 3000x3000px mínimo

Paletas por género:
- Trap/Urbano: negros, rojos, dorados, neón sobre oscuro
- Indie/Dream pop: pasteles, lavanda, celeste, cremas
- Rock: alto contraste, B&W, rojo
- Electrónica: cian, magenta, azul profundo

Herramientas accesibles: Canva (gratis), Coolors.co (paletas), Google Fonts. Siempre dá hex específicos, nombres de fuentes reales, referencias visuales concretas.`,

  legal: `Sos el agente de Legal y Contratos de BACKSTAGE. Fuiste diseñado por profesionales con experiencia en derecho del entretenimiento musical.

IMPORTANTE: NO sos abogado. Siempre aclarás que para firmar contratos reales debe consultar un profesional legal.

ÁREAS:
- Derechos de autor (composición = letra+melodía, pertenece al compositor)
- Derechos conexos (fonograma = grabación, pertenece a quien paga)
- Publishing = administración de derechos de composición
- Registro: DNDA (Argentina), INDAUTOR (México), DNDA (Colombia)

CONTRATOS: Distribución (no exclusivo). Sello (CUIDADO cesión perpetua). Management (15-20%). Split sheet (ANTES de publicar). Producción. Feat. Sync. Booking.

RED FLAGS: cesión perpetuidad, deals 360, exclusividad mundial, períodos >3 años sin salida, advances recoupables, royalties <15-20%.

SIEMPRE cerrá con disclaimer de consultar profesional legal.`,

  merch: `Sos el agente de Merch y Tienda de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en producción textil y e-commerce para artistas.

PRODUCTOS: Remeras (margen 60-75%), Hoodies (alto ticket), Gorras (bajo costo), Tote bags (margen altísimo), Stickers (costo casi cero).

DISEÑO: El merch debe ser lindo de usar aunque no conozcas al artista. Tendencias: diseños oversized, tipografía bold, referencias sutiles.

PRODUCCIÓN: DTF (1-100u, ideal indie). Serigrafía (100+). Sublimación (full print). Bordado (premium). POD (cero riesgo, menor margen 20-40%).

PRICING LATAM: Costo x 3-4. Remera: $3-5 → $12-20 USD. Hoodie: $8-12 → $25-45.

VENTA: Shows (10-20% conversión), tienda online, drops limitados, bundles.

Para artistas <1K fans: 1-2 productos, tirajes chicos o POD. Crear urgencia: edición limitada, pre-order 48hs.`
};

const SUGGESTIONS = {
  marketing: ["Armame un plan de lanzamiento para mi single", "Mejor día y horario para lanzar", "Estrategia con bajo presupuesto"],
  pr: ["Escribime un press release", "Armame un pitch email para blogs", "Medios target para mi género"],
  social: ["Calendario semanal de contenido", "Ideas de reels para mi próximo single", "Frecuencia ideal de publicación"],
  branding: ["Proponé una identidad visual completa", "Necesito una paleta de colores", "Tipografía para mi proyecto"],
  legal: ["Qué revisar en un contrato con sello", "Qué es un split sheet", "Diferencia derechos de autor y fonograma"],
  merch: ["Qué productos vender primero", "Cuánto cobrar por una remera", "Plan de lanzamiento de merch"],
};

function buildSystemPrompt(agentId, artist) {
  const base = PROMPTS[agentId];
  const ctx = artist ? `

CONTEXTO DEL ARTISTA:
- Nombre: ${artist.name || "No especificado"}
- Género: ${artist.genre || "No especificado"}
- Oyentes Spotify: ${artist.listeners || "No especificado"}
- Top ciudades: ${artist.cities || "No especificado"}
- Instagram: ${artist.instagram || "No especificado"}
- Próximo release: ${artist.nextRelease || "No especificado"}
- Objetivo: ${artist.goal || "No especificado"}` : "";
  return base + ctx + "\n\nRespondé en español. Sé directo, práctico y accionable. Tono profesional pero cercano.";
}

// ─── ONBOARDING ───
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name:"", genre:"", listeners:"", cities:"", instagram:"", nextRelease:"", goal:"" });
  const fields = [
    { key:"name", label:"Nombre artístico", ph:"Ej: Luna Roja", req:true },
    { key:"genre", label:"Género musical", ph:"Ej: Trap, Indie Rock, Pop Urbano" },
    { key:"listeners", label:"Oyentes mensuales en Spotify", ph:"Ej: 5.000 o 'no sé'" },
    { key:"cities", label:"Ciudades principales de tu audiencia", ph:"Ej: Buenos Aires, CDMX, Bogotá" },
    { key:"instagram", label:"Instagram", ph:"Ej: @lunaroja, 2.500 seguidores" },
    { key:"nextRelease", label:"Próximo release", ph:"Ej: Single 'Noche Eterna', marzo 2026" },
    { key:"goal", label:"Objetivo principal a 6 meses", ph:"Ej: Llegar a 10K oyentes, primer show" },
  ];
  const advance = () => { if (step < fields.length) setStep(step + 1); else onComplete(data); };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:40, color:C.text }}>
      <div style={{ maxWidth:500, width:"100%" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:48 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ZapIc size={20} color="white" />
          </div>
          <span style={{ fontFamily:"'DM Mono', monospace", fontWeight:500, fontSize:18, letterSpacing:-0.5 }}>BACKSTAGE</span>
        </div>

        {step === 0 && (
          <div>
            <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:-0.8, marginBottom:12, lineHeight:1.2 }}>Configurá tu perfil de artista</h1>
            <p style={{ color:C.secondary, fontSize:16, marginBottom:8, lineHeight:1.6 }}>Con tu información, cada agente IA te da recomendaciones personalizadas.</p>
            <p style={{ color:C.muted, fontSize:14, marginBottom:32 }}>Solo el nombre es obligatorio.</p>
            <button onClick={() => setStep(1)} style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 28px", background:C.accent, color:"white", border:"none", borderRadius:8, fontSize:15, fontWeight:600, cursor:"pointer" }}>
              Comenzar <ArrowRIc size={16} />
            </button>
          </div>
        )}

        {step >= 1 && step <= fields.length && (
          <div>
            <div style={{ display:"flex", gap:4, marginBottom:32 }}>
              {fields.map((_, i) => <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i < step ? C.accent : C.border, transition:"background 0.3s" }} />)}
            </div>
            <p style={{ fontSize:13, color:C.muted, marginBottom:8 }}>Paso {step} de {fields.length}</p>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>
              {fields[step - 1].label} {fields[step - 1].req && <span style={{ color:C.accent }}>*</span>}
            </h2>
            <input
              autoFocus
              value={data[fields[step - 1].key]}
              onChange={e => setData({ ...data, [fields[step - 1].key]: e.target.value })}
              onKeyDown={e => { if (e.key === "Enter") advance(); }}
              placeholder={fields[step - 1].ph}
              style={{ width:"100%", padding:"12px 16px", borderRadius:8, border:`1.5px solid ${C.border}`, background:C.white, color:C.text, fontSize:15, marginBottom:24, outline:"none" }}
            />
            <div style={{ display:"flex", gap:10 }}>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 20px", background:"transparent", color:C.muted, border:`1px solid ${C.border}`, borderRadius:8, fontSize:14, cursor:"pointer" }}>
                  <ArrowLIc size={14} /> Atrás
                </button>
              )}
              <button
                onClick={advance}
                disabled={step === 1 && !data.name.trim()}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 24px", background:(step === 1 && !data.name.trim()) ? C.border : C.accent, color:(step === 1 && !data.name.trim()) ? C.muted : "white", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:(step === 1 && !data.name.trim()) ? "not-allowed" : "pointer" }}>
                {step < fields.length ? <>Siguiente <ArrowRIc size={14} /></> : <>Entrar <ChevRIc size={14} /></>}
              </button>
              {step > 1 && step < fields.length && (
                <button onClick={() => onComplete(data)} style={{ padding:"10px 16px", background:"transparent", color:C.dim, border:"none", fontSize:13, cursor:"pointer" }}>Saltar</button>
              )}
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
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior:"smooth" }); }, [msgs]);
  useEffect(() => { setMsgs([]); }, [agent.id]);

  const send = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput("");
    setMsgs(m => [...m, { role:"user", text:userMsg }]);
    setLoading(true);

    const history = [...msgs, { role:"user", text:userMsg }].map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt(agent.id, artist),
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("\n") || "Error al recibir respuesta.";
      setMsgs(m => [...m, { role:"assistant", text:reply }]);
    } catch {
      setMsgs(m => [...m, { role:"assistant", text:"Error de conexión. Intentá de nuevo." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Header */}
      <div style={{ padding:"18px 28px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:14, background:C.white }}>
        <div style={{ width:40, height:40, borderRadius:10, background:C.accentDim, border:`1px solid ${C.accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.accent }}>
          {agent.icon}
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, color:C.text }}>Agente de {agent.label}</div>
          <div style={{ fontSize:13, color:C.muted }}>{agent.desc}</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex:1, overflowY:"auto", padding:28, display:"flex", flexDirection:"column", gap:16, background:C.bg }}>
        {msgs.length === 0 && (
          <div style={{ textAlign:"center", padding:"56px 20px" }}>
            <div style={{ width:56, height:56, borderRadius:14, background:C.accentDim, border:`1px solid ${C.accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", color:C.accent }}>
              {agent.icon}
            </div>
            <h3 style={{ fontSize:18, fontWeight:700, marginBottom:6, color:C.text }}>Agente de {agent.label}</h3>
            <p style={{ color:C.muted, fontSize:14, maxWidth:400, margin:"0 auto 28px", lineHeight:1.5 }}>
              {agent.desc}. Seleccioná una consulta o escribí la tuya.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
              {(SUGGESTIONS[agent.id] || []).map(s => (
                <button key={s} onClick={() => send(s)} style={{ padding:"9px 18px", borderRadius:8, border:`1px solid ${C.border}`, background:C.white, color:C.secondary, fontSize:13, cursor:"pointer", lineHeight:1.3, transition:"all 0.15s" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth:"76%", padding:"14px 18px", borderRadius:14, fontSize:14, lineHeight:1.7, whiteSpace:"pre-wrap",
              background: m.role === "user" ? C.accent : C.white,
              color: m.role === "user" ? "white" : C.text,
              border: m.role === "user" ? "none" : `1px solid ${C.border}`,
              borderBottomRightRadius: m.role === "user" ? 4 : 14,
              borderBottomLeftRadius: m.role !== "user" ? 4 : 14,
              boxShadow: m.role !== "user" ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
            }}>
              {m.role !== "user" && (
                <div style={{ fontSize:11, color:C.accent, fontWeight:600, marginBottom:6, display:"flex", alignItems:"center", gap:4 }}>
                  <BotIc size={12} /> Agente {agent.label}
                </div>
              )}
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display:"flex" }}>
            <div style={{ padding:"14px 18px", borderRadius:14, borderBottomLeftRadius:4, background:C.white, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8, color:C.muted, fontSize:14, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              <LoadIc size={16} style={{ animation:"spin 1s linear infinite" }} /> Pensando...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding:16, borderTop:`1px solid ${C.border}`, display:"flex", gap:10, background:C.white }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Escribí tu consulta..."
          disabled={loading}
          style={{ flex:1, padding:"12px 16px", borderRadius:8, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:14, outline:"none", opacity:loading ? 0.5 : 1 }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{ padding:"12px 20px", borderRadius:8, border:"none", background:(!input.trim() || loading) ? C.border : C.accent, color:(!input.trim() || loading) ? C.dim : "white", fontWeight:600, cursor:(!input.trim() || loading) ? "not-allowed" : "pointer", fontSize:14, display:"flex", alignItems:"center", gap:6 }}>
          <SendIc size={16} />
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── MAIN APP ───
function AppDashboard({ artist }) {
  const [activeAgent, setActiveAgent] = useState("marketing");
  const agent = AGENTS.find(a => a.id === activeAgent);

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, color:C.text, overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:256, background:C.white, borderRight:`1px solid ${C.border}`, padding:"24px 16px", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 8px", marginBottom:6 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ZapIc size={16} color="white" />
          </div>
          <span style={{ fontFamily:"'DM Mono', monospace", fontWeight:500, fontSize:16, letterSpacing:-0.5 }}>BACKSTAGE</span>
        </div>
        <div style={{ padding:"4px 8px 24px", fontSize:12, color:C.dim, borderBottom:`1px solid ${C.border}`, marginBottom:20 }}>Plataforma para artistas</div>

        <div style={{ fontSize:11, fontWeight:600, color:C.dim, textTransform:"uppercase", letterSpacing:1, padding:"0 8px", marginBottom:10 }}>Agentes IA</div>
        {AGENTS.map(a => (
          <button key={a.id} onClick={() => setActiveAgent(a.id)} style={{
            display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px",
            borderRadius:8, border:"none", cursor:"pointer", marginBottom:2, fontSize:14,
            textAlign:"left", transition:"all 0.15s",
            background: activeAgent === a.id ? C.accentDim : "transparent",
            color: activeAgent === a.id ? C.accent : C.secondary,
            fontWeight: activeAgent === a.id ? 600 : 400,
          }}>
            <span style={{ opacity: activeAgent === a.id ? 1 : 0.6 }}>{a.icon}</span> {a.label}
          </button>
        ))}

        <div style={{ flex:1 }} />

        <div style={{ padding:16, background:C.surface, borderRadius:10, border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:(artist.listeners || artist.cities) ? 10 : 0 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <MusicIc size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>{artist.name}</div>
              <div style={{ fontSize:12, color:C.muted }}>{artist.genre || "Sin género"}</div>
            </div>
          </div>
          {artist.listeners && <div style={{ fontSize:12, color:C.muted, display:"flex", alignItems:"center", gap:6 }}><BarIc size={12} /> {artist.listeners} oyentes</div>}
          {artist.cities && <div style={{ fontSize:12, color:C.muted, marginTop:3, display:"flex", alignItems:"center", gap:6 }}><GlobeIc size={12} /> {artist.cities}</div>}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <Chat agent={agent} artist={artist} />
      </div>
    </div>
  );
}

// ─── PAGE ───
export default function Home() {
  const [artist, setArtist] = useState(null);
  return (
    <>
      <Head>
        <title>BACKSTAGE — Agentes IA para Artistas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`*{margin:0;padding:0;box-sizing:border-box}body{background:${C.bg};font-family:'DM Sans',system-ui,sans-serif}::selection{background:${C.accent};color:white}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:9px}input:focus{outline:none;border-color:${C.accent}!important}`}</style>
      </Head>
      {!artist
        ? <Onboarding onComplete={d => setArtist(d)} />
        : <AppDashboard artist={artist} />
      }
    </>
  );
}
