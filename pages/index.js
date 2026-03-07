import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   CONFIGURACIÓN DE AGENTES
   Editá nombre, bio, sugerencias y prompt de cada agente.
   En "BIBLIOGRAFÍA" podés pegar artículos, guías, frameworks, etc.
   ═══════════════════════════════════════════════════════════════════ */

var AGENTS = [
  { id: "marketing", name: "Mkt. & Lanzamientos", bio: "Estrategia de releases, calendarios y crecimiento de audiencia", suggestions: ["Armame un plan de lanzamiento", "Mejor día para lanzar un single", "Estrategia con bajo presupuesto"],
    prompt: "Sos el agente de Marketing y Lanzamientos de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en marketing musical en Latinoamérica.\n\nFRAMEWORK DE LANZAMIENTO:\nT-30: Preparación (máster, artwork, distribuidor, pitch editorial Spotify for Artists mínimo 3-4 semanas antes)\nT-21: Pre-anuncio (primer teaser redes, pre-save link, EPK a medios)\nT-14: Calentamiento (segundo teaser, push pre-save fuerte, curadores playlists, ads si hay budget)\nT-7: Intensivo (contenido diario, countdown, teaser final)\nT-0: Launch day (publicar todas redes, activar campaña)\nT+7: Post-release (analizar números, contenido reactivo, segundo push)\n\nAdaptá el timeline al tamaño del artista. Priorizá acciones orgánicas. Sé directo.\nSpotify: pitch editorial mínimo 7 días antes. Jueves/viernes mejores. Release Radar ~28 días.\nInstagram: Reels 15-30s. Horarios LATAM: 12-14hs y 19-22hs.\nTikTok: 15-30s, hook primeros 2 segundos.\n\nBIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:\n" },
  { id: "pr", name: "PR & Prensa", bio: "Press releases, pitching a medios y relación con prensa", suggestions: ["Escribime un press release", "Pitch email para blogs", "Medios target para mi género"],
    prompt: "Sos el agente de PR y Prensa de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en relaciones públicas musicales.\n\nPRESS RELEASE: Titular con gancho, Subtítulo, P1 (quién/qué/cuándo), P2 (story), P3 (contexto artista), Quote, Datos técnicos, Assets, Contacto.\nPITCH EMAIL: Máximo 150 palabras. Asunto corto. Saludo personalizado. NUNCA adjuntar archivos pesados.\nMedios LATAM: Indie Rocks (MX), La Heavy (AR), Cultura Colectiva, Rolling Stone LATAM, Billboard Argentina, Indie Hoy, Club Fonograma.\n\nBIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:\n" },
  { id: "social", name: "Social Media", bio: "Calendarios de contenido, ideas de reels, TikToks y estrategia", suggestions: ["Calendario semanal", "Ideas de reels para mi single", "Frecuencia ideal de publicación"],
    prompt: "Sos el agente de Social Media de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en contenido para artistas.\n\nPILARES: Música (40%), Personalidad (30%), Comunidad (20%), Negocio (10%).\nINSTAGRAM: Reels 15-30s, carruseles, stories diarias. 4-5 reels/semana.\nTIKTOK: 15-30s, hook 2 seg. 3-5/semana.\nCuando des ideas sé ultra específico: qué filmar, qué texto, qué audio, qué caption.\n\nBIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:\n" },
  { id: "branding", name: "Branding & Visual", bio: "Identidad visual, paleta de colores y dirección artística", suggestions: ["Identidad visual completa", "Paleta de colores", "Tipografía recomendada"],
    prompt: "Sos el agente de Branding de BACKSTAGE. Fuiste diseñado por profesionales con experiencia en dirección artística musical.\n\nPILARES: Esencia de marca, Paleta (3-5 colores con hex), Tipografía (Google Fonts), Dirección fotográfica, Artwork.\nHerramientas: Canva, Coolors.co, Google Fonts. Siempre dá hex específicos y nombres de fuentes reales.\n\nBIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:\n" },
  { id: "legal", name: "Legal & Contratos", bio: "Derechos de autor, contratos y protección del artista", suggestions: ["Revisar contrato con sello", "Qué es un split sheet", "Red flags en contratos"],
    prompt: "Sos el agente Legal de BACKSTAGE. NO sos abogado, siempre aclarás que debe consultar un profesional.\n\nCONTRATOS: Distribución, Sello (CUIDADO cesión perpetua), Management (15-20%), Split sheet, Producción, Feat, Sync, Booking.\nRED FLAGS: cesión perpetuidad, deals 360, exclusividad mundial, mas de 3 años sin salida, advances recoupables, royalties menores a 15-20%.\n\nBIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:\n" },
  { id: "merch", name: "Merch & Tienda", bio: "Productos, producción, pricing y venta de merchandising", suggestions: ["Qué productos vender", "Cuánto cobrar por remera", "Plan de lanzamiento merch"],
    prompt: "Sos el agente de Merch de BACKSTAGE. Experiencia real en producción textil y e-commerce para artistas.\n\nPRODUCTOS: Remeras (60-75% margen), Hoodies, Gorras, Tote bags, Stickers.\nPRODUCCIÓN: DTF (1-100u), Serigrafía (100+), POD (cero riesgo).\nPRICING: Costo x3-4. Remera USD 3-5 costo, venta 12-20.\nVENTA: Shows (10-20% conv), online, drops limitados, bundles.\n\nBIBLIOGRAFÍA Y CONOCIMIENTO ADICIONAL:\n" },
];

/* ═══════════════════════════════════════════════════════════════════ */

function buildSystemPrompt(agent, artist) {
  var ctx = "";
  if (artist) {
    ctx = "\n\nCONTEXTO DEL ARTISTA:";
    ctx += "\n- Nombre: " + (artist.name || "No especificado");
    ctx += "\n- Género: " + (artist.genre || "No especificado");
    ctx += "\n- Oyentes Spotify: " + (artist.listeners || "No especificado");
    ctx += "\n- Top ciudades: " + (artist.cities || "No especificado");
    ctx += "\n- Instagram: " + (artist.instagram || "No especificado");
    ctx += "\n- Próximo release: " + (artist.nextRelease || "No especificado");
    ctx += "\n- Objetivo: " + (artist.goal || "No especificado");
  }
  return agent.prompt + ctx + "\n\nRespondé en español. Sé directo, práctico y accionable. Tono profesional pero cercano.";
}

var BG = "#F7F6F3";
var WH = "#FFFFFF";
var BD = "#DDD9D4";
var AC = "#C2410C";
var AD = "rgba(194,65,12,0.06)";
var AB = "rgba(194,65,12,0.15)";
var TX = "#1A1917";
var SB = "#5C5850";
var MT = "#8C857B";
var DM = "#B0A99F";

function Onboarding(props) {
  var s = useState(0), step = s[0], setStep = s[1];
  var dd = useState({name:"",genre:"",listeners:"",cities:"",instagram:"",nextRelease:"",goal:""}), d = dd[0], setD = dd[1];
  var fields = [
    {k:"name",l:"Nombre artístico",ph:"Ej: Luna Roja",req:true},
    {k:"genre",l:"Género musical",ph:"Ej: Trap, Indie Rock, Pop Urbano"},
    {k:"listeners",l:"Oyentes mensuales en Spotify",ph:"Ej: 5.000"},
    {k:"cities",l:"Ciudades principales de tu audiencia",ph:"Ej: Buenos Aires, CDMX"},
    {k:"instagram",l:"Instagram",ph:"Ej: @lunaroja, 2.500 seguidores"},
    {k:"nextRelease",l:"Próximo release",ph:"Ej: Single marzo 2026"},
    {k:"goal",l:"Objetivo a 6 meses",ph:"Ej: 10K oyentes, primer show"},
  ];
  function upd(k,v){var n={};for(var x in d)n[x]=d[x];n[k]=v;setD(n);}
  function go(){if(step<fields.length)setStep(step+1);else props.onComplete(d);}
  var ok=step!==1||d.name.trim().length>0;

  if(step===0) return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:40,color:TX,fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:520,width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:56}}>
          <div style={{width:10,height:10,borderRadius:99,background:AC}}/>
          <span style={{fontWeight:800,fontSize:22,letterSpacing:-0.5}}>BACKSTAGE</span>
        </div>
        <h1 style={{fontSize:36,fontWeight:800,letterSpacing:-2,lineHeight:1.05,marginBottom:16}}>Configurá tu perfil de artista.</h1>
        <p style={{color:SB,fontSize:17,marginBottom:8,lineHeight:1.6}}>Con tu información, cada agente genera recomendaciones personalizadas.</p>
        <p style={{color:MT,fontSize:14,marginBottom:40}}>Solo el nombre es obligatorio.</p>
        <button onClick={function(){setStep(1);}} style={{padding:"14px 36px",background:AC,color:"white",border:"none",borderRadius:99,fontSize:15,fontWeight:700,cursor:"pointer"}}>Comenzar</button>
      </div>
    </div>
  );

  var f=fields[step-1];
  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:40,color:TX,fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:520,width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:56}}>
          <div style={{width:10,height:10,borderRadius:99,background:AC}}/>
          <span style={{fontWeight:800,fontSize:22,letterSpacing:-0.5}}>BACKSTAGE</span>
        </div>
        <div style={{display:"flex",gap:5,marginBottom:40}}>
          {fields.map(function(_,i){return <div key={i} style={{flex:1,height:2,borderRadius:99,background:i<step?AC:BD}}/>;})}</div>
        <p style={{fontSize:12,color:MT,marginBottom:10,textTransform:"uppercase",letterSpacing:1.2}}>Paso {step} / {fields.length}</p>
        <h2 style={{fontSize:26,fontWeight:700,marginBottom:24,letterSpacing:-1}}>{f.l}{f.req?<span style={{color:AC}}> *</span>:null}</h2>
        <input autoFocus value={d[f.k]} onChange={function(e){upd(f.k,e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"&&ok)go();}} placeholder={f.ph}
          style={{width:"100%",padding:"16px 20px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:16,marginBottom:28,outline:"none"}}/>
        <div style={{display:"flex",gap:10}}>
          {step>1?<button onClick={function(){setStep(step-1);}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Atrás</button>:null}
          <button onClick={function(){if(ok)go();}} style={{padding:"12px 32px",background:ok?AC:BD,color:ok?"white":DM,border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:ok?"pointer":"not-allowed"}}>
            {step<fields.length?"Siguiente":"Entrar"}</button>
          {step>1&&step<fields.length?<button onClick={function(){props.onComplete(d);}} style={{padding:"12px 20px",background:"transparent",color:DM,border:"none",fontSize:13,cursor:"pointer"}}>Saltar</button>:null}
        </div>
      </div>
    </div>
  );
}

function Chat(props) {
  var agent=props.agent, artist=props.artist;
  var mm=useState([]),msgs=mm[0],setMsgs=mm[1];
  var ii=useState(""),input=ii[0],setInput=ii[1];
  var ll=useState(false),loading=ll[0],setLoading=ll[1];
  var ref=useRef(null);
  useEffect(function(){if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs]);
  useEffect(function(){setMsgs([]);},[agent.id]);

  function send(text){
    var m=(text||input||"").trim();
    if(!m||loading)return;
    setInput("");
    var newM=msgs.concat([{role:"user",text:m}]);
    setMsgs(newM);
    setLoading(true);
    var hist=newM.map(function(x){return{role:x.role==="user"?"user":"assistant",content:x.text};});
    fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:buildSystemPrompt(agent,artist),messages:hist})})
    .then(function(r){return r.json();})
    .then(function(data){
      var reply="Error al recibir respuesta.";
      if(data&&data.content)reply=data.content.map(function(b){return b.text||"";}).join("\n");
      else if(data&&data.error)reply="Error: "+JSON.stringify(data.error);
      setMsgs(function(p){return p.concat([{role:"assistant",text:reply}]);});
      setLoading(false);
    })
    .catch(function(){
      setMsgs(function(p){return p.concat([{role:"assistant",text:"Error de conexión. Verificá que tengas crédito en la API."}]);});
      setLoading(false);
    });
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",fontFamily:"system-ui,sans-serif"}}>
      <div style={{padding:"20px 32px",borderBottom:"1px solid "+BD,display:"flex",alignItems:"center",gap:16,background:WH}}>
        <div style={{width:42,height:42,borderRadius:12,background:AD,border:"1px solid "+AB,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:8,height:8,borderRadius:99,background:AC}}/></div>
        <div><div style={{fontSize:16,fontWeight:700,color:TX}}>{agent.name}</div>
          <div style={{fontSize:13,color:MT,marginTop:1}}>{agent.bio}</div></div></div>
      <div ref={ref} style={{flex:1,overflowY:"auto",padding:32,display:"flex",flexDirection:"column",gap:18,background:BG}}>
        {msgs.length===0?(
          <div style={{textAlign:"center",padding:"64px 20px"}}>
            <div style={{width:12,height:12,borderRadius:99,background:AC,margin:"0 auto 20px",opacity:0.7}}/>
            <h3 style={{fontSize:22,fontWeight:700,marginBottom:8,color:TX}}>{agent.name}</h3>
            <p style={{color:MT,fontSize:15,maxWidth:420,margin:"0 auto 32px",lineHeight:1.55}}>{agent.bio}. Seleccioná una consulta o escribí la tuya.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
              {agent.suggestions.map(function(s){return <button key={s} onClick={function(){send(s);}} style={{padding:"10px 20px",borderRadius:99,border:"1px solid "+BD,background:WH,color:SB,fontSize:13,cursor:"pointer",lineHeight:1.2}}>{s}</button>;})}</div>
          </div>
        ):null}
        {msgs.map(function(m,i){var u=m.role==="user";return(
          <div key={i} style={{display:"flex",justifyContent:u?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"75%",padding:"16px 20px",fontSize:14,lineHeight:1.75,whiteSpace:"pre-wrap",background:u?"#1A1917":WH,color:u?"#FAFAF9":TX,borderRadius:u?"20px 20px 6px 20px":"20px 20px 20px 6px",border:u?"none":"1px solid "+BD,boxShadow:u?"none":"0 1px 4px rgba(0,0,0,0.04)"}}>
              {!u?<div style={{fontSize:11,color:AC,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:0.8}}>{agent.name}</div>:null}
              {m.text}</div></div>);})}
        {loading?(<div style={{display:"flex"}}><div style={{padding:"16px 20px",borderRadius:"20px 20px 20px 6px",background:WH,border:"1px solid "+BD,color:MT,fontSize:14}}>Pensando...</div></div>):null}
      </div>
      <div style={{padding:20,borderTop:"1px solid "+BD,display:"flex",gap:12,background:WH}}>
        <input value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")send();}} placeholder="Escribí tu consulta..." disabled={loading}
          style={{flex:1,padding:"14px 20px",borderRadius:99,border:"1.5px solid "+BD,background:BG,color:TX,fontSize:14,opacity:loading?0.5:1,outline:"none"}}/>
        <button onClick={function(){send();}} disabled={loading||!input.trim()}
          style={{width:48,height:48,borderRadius:99,border:"none",background:(!input.trim()||loading)?BD:AC,color:(!input.trim()||loading)?DM:"white",cursor:(!input.trim()||loading)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button></div></div>);
}

function AppDashboard(props) {
  var artist=props.artist;
  var aa=useState("marketing"),activeId=aa[0],setActiveId=aa[1];
  var agent=AGENTS.find(function(a){return a.id===activeId;});
  return (
    <div style={{display:"flex",height:"100vh",background:BG,color:TX,fontFamily:"system-ui,sans-serif",overflow:"hidden"}}>
      <div style={{width:280,background:WH,borderRight:"1px solid "+BD,padding:"28px 20px",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 4px",marginBottom:8}}>
          <div style={{width:10,height:10,borderRadius:99,background:AC}}/>
          <span style={{fontWeight:800,fontSize:18,letterSpacing:-0.5}}>BACKSTAGE</span></div>
        <div style={{padding:"4px 4px 28px",fontSize:12,color:DM,borderBottom:"1px solid "+BD,marginBottom:24}}>AI-powered career platform</div>
        <div style={{fontSize:11,fontWeight:600,color:DM,textTransform:"uppercase",letterSpacing:1.5,padding:"0 4px",marginBottom:12}}>Agentes</div>
        {AGENTS.map(function(a){var act=activeId===a.id;return(
          <button key={a.id} onClick={function(){setActiveId(a.id);}} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 14px",borderRadius:10,border:"none",cursor:"pointer",marginBottom:3,textAlign:"left",background:act?AD:"transparent",color:act?AC:MT,fontFamily:"system-ui,sans-serif"}}>
            <div style={{width:7,height:7,borderRadius:99,background:act?AC:DM,flexShrink:0}}/>
            <div><div style={{fontSize:14,fontWeight:act?600:400}}>{a.name}</div>
              {act?<div style={{fontSize:11,color:MT,marginTop:2,lineHeight:1.3}}>{a.bio}</div>:null}</div></button>);})}
        <div style={{flex:1}}/>
        <div style={{padding:18,background:BG,borderRadius:14,border:"1px solid "+BD}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:(artist.listeners||artist.cities)?12:0}}>
            <div style={{width:36,height:36,borderRadius:10,background:AC,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
            <div><div style={{fontSize:14,fontWeight:700}}>{artist.name}</div>
              <div style={{fontSize:12,color:MT}}>{artist.genre||"Sin género"}</div></div></div>
          {artist.listeners?<div style={{fontSize:12,color:DM}}>{artist.listeners} oyentes/mes</div>:null}
          {artist.cities?<div style={{fontSize:12,color:DM,marginTop:2}}>{artist.cities}</div>:null}</div></div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}><Chat agent={agent} artist={artist}/></div></div>);
}

export default function Home() {
  var aa=useState(null),artist=aa[0],setArtist=aa[1];
  if(!artist)return <Onboarding onComplete={function(d){setArtist(d);}}/>;
  return <AppDashboard artist={artist}/>;
}
