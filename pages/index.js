import { useState, useRef, useEffect } from "react";

/* ═══ AGENTS ═══ */
var AGENTS = [
  { id:"marketing", name:"Mkt. & Lanzamientos", bio:"Estrategia de releases, calendarios y crecimiento de audiencia", icon:"M",
    suggestions:["Armame un plan de lanzamiento","Mejor día para lanzar","Estrategia bajo presupuesto"],
    prompt:"Sos el agente de Marketing y Lanzamientos de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en marketing musical en Latinoamérica.\n\nFRAMEWORK DE LANZAMIENTO:\nT-30: Preparación (máster, artwork, distribuidor, pitch editorial Spotify for Artists mínimo 3-4 semanas antes)\nT-21: Pre-anuncio (primer teaser redes, pre-save link, EPK a medios)\nT-14: Calentamiento (segundo teaser, push pre-save fuerte, curadores playlists, ads si hay budget)\nT-7: Intensivo (contenido diario, countdown, teaser final)\nT-0: Launch day (publicar todas redes, activar campaña)\nT+7: Post-release (analizar números, contenido reactivo, segundo push)\n\nSpotify: pitch editorial mínimo 7 días antes. Jueves/viernes mejores. Release Radar ~28 días.\nInstagram: Reels 15-30s. Horarios LATAM: 12-14hs y 19-22hs.\nTikTok: 15-30s, hook primeros 2 segundos.\n\nBIBLIOGRAFÍA:\n" },
  { id:"pr", name:"PR & Prensa", bio:"Press releases, pitching a medios y relaciones con prensa", icon:"P",
    suggestions:["Escribime un press release","Pitch email para blogs","Medios target para mi género"],
    prompt:"Sos el agente de PR y Prensa de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en relaciones públicas musicales.\n\nPRESS RELEASE: Titular con gancho, Subtítulo, P1 (quién/qué/cuándo), P2 (story), P3 (contexto artista), Quote, Datos técnicos, Assets, Contacto.\nPITCH EMAIL: Máximo 150 palabras. Asunto corto. Saludo personalizado.\nMedios LATAM: Indie Rocks (MX), La Heavy (AR), Cultura Colectiva, Rolling Stone LATAM, Billboard Argentina, Indie Hoy, Club Fonograma.\n\nBIBLIOGRAFÍA:\n" },
  { id:"social", name:"Social Media", bio:"Calendarios de contenido, ideas de reels y TikToks", icon:"S",
    suggestions:["Calendario semanal","Ideas de reels para mi single","Frecuencia ideal"],
    prompt:"Sos el agente de Social Media de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en contenido para artistas.\n\nPILARES: Música (40%), Personalidad (30%), Comunidad (20%), Negocio (10%).\nINSTAGRAM: Reels 15-30s, carruseles, stories diarias. 4-5 reels/semana.\nTIKTOK: 15-30s, hook 2 seg. 3-5/semana.\nSé ultra específico: qué filmar, qué texto, qué audio, qué caption.\n\nBIBLIOGRAFÍA:\n" },
  { id:"branding", name:"Branding & Visual", bio:"Identidad visual, paleta de colores y dirección artística", icon:"B",
    suggestions:["Identidad visual completa","Paleta de colores","Tipografía recomendada"],
    prompt:"Sos el agente de Branding de BACKSTAGE. Fuiste diseñado por profesionales con experiencia en dirección artística musical.\n\nPILARES: Esencia de marca, Paleta (3-5 colores con hex), Tipografía (Google Fonts), Dirección fotográfica, Artwork.\nHerramientas: Canva, Coolors.co, Google Fonts. Siempre dá hex específicos y nombres de fuentes reales.\n\nBIBLIOGRAFÍA:\n" },
  { id:"legal", name:"Legal & Contratos", bio:"Derechos de autor, contratos y protección del artista", icon:"L",
    suggestions:["Revisar contrato con sello","Qué es un split sheet","Red flags en contratos"],
    prompt:"Sos el agente Legal de BACKSTAGE. NO sos abogado, siempre aclarás que debe consultar un profesional.\n\nCONTRATOS: Distribución, Sello (CUIDADO cesión perpetua), Management (15-20%), Split sheet, Producción, Feat, Sync, Booking.\nRED FLAGS: cesión perpetuidad, deals 360, exclusividad mundial, mas de 3 años sin salida, advances recoupables, royalties menores a 15-20%.\n\nBIBLIOGRAFÍA:\n" },
  { id:"merch", name:"Merch & Tienda", bio:"Productos, producción, pricing y venta de merchandising", icon:"T",
    suggestions:["Qué productos vender","Cuánto cobrar por remera","Plan de lanzamiento merch"],
    prompt:"Sos el agente de Merch de BACKSTAGE. Experiencia real en producción textil y e-commerce para artistas.\n\nPRODUCTOS: Remeras (60-75% margen), Hoodies, Gorras, Tote bags, Stickers.\nPRODUCCIÓN: DTF (1-100u), Serigrafía (100+), POD (cero riesgo).\nPRICING: Costo x3-4. Remera USD 3-5 costo, venta 12-20.\nVENTA: Shows (10-20% conv), online, drops limitados, bundles.\n\nBIBLIOGRAFÍA:\n" },
];

var MODULES = [
  {id:"agents",name:"Agentes IA",active:true},
  {id:"releases",name:"Release Planner",active:false},
  {id:"calendar",name:"Calendario",active:false},
  {id:"metrics",name:"Métricas",active:false},
  {id:"merchmod",name:"Merch Store",active:false},
  {id:"crm",name:"Contactos",active:false},
  {id:"finance",name:"Finanzas",active:false},
];

function buildSystemPrompt(agent,artist){
  var ctx="";
  if(artist){ctx="\n\nCONTEXTO DEL ARTISTA:";ctx+="\n- Nombre: "+(artist.name||"N/A");ctx+="\n- Género: "+(artist.genres||artist.genre||"N/A");
  if(artist.followers)ctx+="\n- Seguidores Spotify: "+artist.followers;if(artist.popularity)ctx+="\n- Popularidad Spotify: "+artist.popularity+"/100";
  if(artist.listeners)ctx+="\n- Oyentes mensuales: "+artist.listeners;if(artist.topTracks)ctx+="\n- Top tracks: "+artist.topTracks;
  if(artist.relatedArtists)ctx+="\n- Artistas similares: "+artist.relatedArtists;if(artist.cities)ctx+="\n- Top ciudades: "+artist.cities;
  if(artist.instagram)ctx+="\n- Instagram: "+artist.instagram;ctx+="\n- Objetivo: "+(artist.goal||"No especificado");}
  return agent.prompt+ctx+"\n\nRespondé en español. Sé directo, práctico y accionable. Tono profesional pero cercano.";
}

/* ═══ BRAND COLORS — Navy + Violet ═══ */
var BG="#F5F4F1",WH="#FFFFFF",BD="#DDDAD5",TX="#1B2045",SB="#4A4B6A",MT="#7E7F9A",DM="#B0B0C0";
var NAVY="#1B2045",VIOLET="#6D28D9",GRAD="linear-gradient(135deg, #1B2045, #6D28D9)",GRAD2="linear-gradient(135deg, #6D28D9, #4338CA)";
var AD="rgba(109,40,217,0.05)",AB="rgba(109,40,217,0.15)",AC=NAVY;

function fmt(n){if(!n&&n!==0)return"—";if(n>=1000000)return(n/1000000).toFixed(1)+"M";if(n>=1000)return(n/1000).toFixed(1)+"K";return String(n);}

/* ═══ ISOLOGO SVG — "A" with network nodes ═══ */
function IsoLogo(props){
  var s=props.size||40;
  return(
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id="bg" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#1B2045"/><stop offset="100%" stopColor="#6D28D9"/></linearGradient></defs>
      <rect width="48" height="48" rx="12" fill="url(#bg)"/>
      {/* A shape */}
      <path d="M16 34L24 14L32 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="19" y1="27" x2="29" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      {/* Network nodes */}
      <circle cx="24" cy="14" r="2.5" fill="white"/>
      <circle cx="16" cy="34" r="2.5" fill="white"/>
      <circle cx="32" cy="34" r="2.5" fill="white"/>
      <circle cx="19" cy="27" r="1.8" fill="white" opacity="0.7"/>
      <circle cx="29" cy="27" r="1.8" fill="white" opacity="0.7"/>
      {/* Connecting lines (network) */}
      <line x1="24" y1="14" x2="36" y2="10" stroke="white" strokeWidth="0.6" opacity="0.25"/>
      <line x1="24" y1="14" x2="12" y2="10" stroke="white" strokeWidth="0.6" opacity="0.25"/>
      <line x1="32" y1="34" x2="38" y2="38" stroke="white" strokeWidth="0.6" opacity="0.25"/>
      <line x1="16" y1="34" x2="10" y2="38" stroke="white" strokeWidth="0.6" opacity="0.25"/>
      <circle cx="36" cy="10" r="1.2" fill="white" opacity="0.3"/>
      <circle cx="12" cy="10" r="1.2" fill="white" opacity="0.3"/>
      <circle cx="38" cy="38" r="1.2" fill="white" opacity="0.3"/>
      <circle cx="10" cy="38" r="1.2" fill="white" opacity="0.3"/>
    </svg>
  );
}

function LogoFull(props){
  var s=props.scale||1;
  return(
    <div style={{display:"flex",alignItems:"center",gap:10*s}}>
      <IsoLogo size={32*s}/>
      <div>
        <div style={{fontSize:16*s,fontWeight:800,color:NAVY,letterSpacing:-0.5*s,lineHeight:1}}>BACKSTAGE</div>
        {s>1.2?<div style={{fontSize:10*s,color:MT,letterSpacing:1.5*s,textTransform:"uppercase",marginTop:2*s}}>AI-Powered Music Platform</div>:null}
      </div>
    </div>
  );
}

var STYLES = `*{margin:0;padding:0;box-sizing:border-box}body{background:${BG};font-family:system-ui,-apple-system,sans-serif}::selection{background:${VIOLET};color:white}input:focus{outline:none;border-color:${VIOLET}!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${BD};border-radius:9px}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes typing{0%,80%,100%{opacity:.15}40%{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.au{animation:fadeUp .6s ease both}.ai{animation:fadeIn .5s ease both}.as{animation:slideIn .35s ease both}.ac{animation:scaleIn .35s ease both}`;

/* ═══ SPLASH ═══ */
function Splash(props){
  var a=useState(false),s1=a[0],ss1=a[1];var b=useState(false),s2=b[0],ss2=b[1];var c=useState(false),s3=c[0],ss3=c[1];
  useEffect(function(){setTimeout(function(){ss1(true);},300);setTimeout(function(){ss2(true);},800);setTimeout(function(){ss3(true);},1300);},[]);
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,position:"relative",overflow:"hidden"}}>
      <style>{STYLES}</style>
      {/* Subtle gradient orb */}
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(109,40,217,0.06) 0%, transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"-20%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle, rgba(27,32,69,0.05) 0%, transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>

      <div style={{opacity:s1?1:0,transform:s1?"translateY(0) scale(1)":"translateY(20px) scale(0.95)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)",marginBottom:20}}>
        <IsoLogo size={72}/>
      </div>
      <div style={{opacity:s1?1:0,transform:s1?"translateY(0)":"translateY(16px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s",marginBottom:6}}>
        <span style={{fontSize:42,fontWeight:800,color:NAVY,letterSpacing:-2}}>BACKSTAGE</span>
      </div>
      <div style={{opacity:s2?1:0,transform:s2?"translateY(0)":"translateY(10px)",transition:"all 0.6s ease",marginBottom:48}}>
        <p style={{fontSize:16,color:MT,textAlign:"center",letterSpacing:1.5,textTransform:"uppercase"}}>AI-Powered Music Platform</p>
      </div>
      <div style={{opacity:s3?1:0,transform:s3?"scale(1)":"scale(0.9)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
        <button onClick={props.onStart} style={{padding:"16px 52px",background:GRAD,color:"white",border:"none",borderRadius:99,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 24px rgba(109,40,217,0.25)",transition:"transform 0.2s,box-shadow 0.2s"}}
          onMouseOver={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 32px rgba(109,40,217,0.35)";}}
          onMouseOut={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(109,40,217,0.25)";}}>
          Comenzar</button>
        <span style={{fontSize:12,color:DM}}>v1.0 Beta</span>
      </div>
      <div style={{position:"absolute",bottom:36,display:"flex",gap:28,opacity:s3?1:0,transition:"opacity 0.8s"}}>
        {["6 Agentes IA especializados","Data real de Spotify","Profesionales de la industria"].map(function(t){return <span key={t} style={{fontSize:12,color:DM,display:"flex",alignItems:"center",gap:6}}><div style={{width:4,height:4,borderRadius:99,background:VIOLET,opacity:0.4}}/>{t}</span>;})}
      </div>
    </div>
  );
}

/* ═══ ONBOARDING ═══ */
function Onboarding(props){
  var a=useState("search"),step=a[0],setStep=a[1];
  var b=useState(""),q=b[0],setQ=b[1];var c=useState([]),res=c[0],setRes=c[1];
  var d=useState(false),ld=d[0],setLd=d[1];var e=useState(null),sel=e[0],setSel=e[1];
  var f=useState(""),goal=f[0],setGoal=f[1];var g=useState(false),spE=g[0],setSpE=g[1];
  var h=useState(""),mN=h[0],smN=h[1];var i=useState(""),mG=i[0],smG=i[1];
  var j=useState(""),mL=j[0],smL=j[1];var k=useState(""),mC=k[0],smC=k[1];var l=useState(""),mI=l[0],smI=l[1];

  function search(){if(!q.trim()||ld)return;setLd(true);setRes([]);setSpE(false);
    fetch("/api/spotify?q="+encodeURIComponent(q.trim())).then(function(r){return r.json();}).then(function(d){if(d.error){setSpE(true);}else{setRes(d.artists||[]);}setStep("results");setLd(false);}).catch(function(){setSpE(true);setStep("results");setLd(false);});}
  function selArt(a){setLd(true);fetch("/api/spotify?id="+a.id).then(function(r){return r.json();}).then(function(d){
    var f={id:a.id,name:a.name,image:a.image,genres:"",followers:a.followers,popularity:a.popularity,topTracks:"",relatedArtists:""};
    if(d.artist&&d.artist.genres)f.genres=d.artist.genres.join(", ");else if(a.genres&&a.genres.length>0)f.genres=a.genres.join(", ");
    if(d.artist&&d.artist.followers)f.followers=d.artist.followers.total;if(d.artist)f.popularity=d.artist.popularity;
    if(d.topTracks&&d.topTracks.length>0)f.topTracks=d.topTracks.map(function(t){return t.name;}).join(", ");
    if(d.relatedArtists&&d.relatedArtists.length>0)f.relatedArtists=d.relatedArtists.map(function(x){return x.name;}).join(", ");
    setSel(f);setStep("goal");setLd(false);}).catch(function(){setSel({name:a.name,image:a.image,genres:a.genres?a.genres.join(", "):"",followers:a.followers,popularity:a.popularity});setStep("goal");setLd(false);});}
  function finMan(){if(!mN.trim())return;setSel({name:mN,genre:mG,listeners:mL,cities:mC,instagram:mI});setStep("goal");}
  function finish(){if(!sel)return;sel.goal=goal;props.onComplete(sel);}

  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:40,color:TX}}>
      <style>{STYLES}</style>
      <div style={{maxWidth:560,width:"100%"}} className="au">
        <div style={{marginBottom:48}}><LogoFull scale={1.1}/></div>

        {step==="search"&&(<div>
          <h1 style={{fontSize:32,fontWeight:800,letterSpacing:-1.5,lineHeight:1.05,marginBottom:12,color:NAVY}}>Conectá tu perfil de Spotify.</h1>
          <p style={{color:SB,fontSize:15,marginBottom:32,lineHeight:1.6}}>Los agentes trabajan con tu data real: géneros, popularidad, top tracks y artistas similares.</p>
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <input autoFocus value={q} onChange={function(e){setQ(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")search();}} placeholder="Nombre del artista..."
              style={{flex:1,padding:"14px 20px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:16,outline:"none"}}/>
            <button onClick={search} disabled={ld||!q.trim()} style={{padding:"14px 28px",background:(!q.trim()||ld)?BD:GRAD,color:(!q.trim()||ld)?DM:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:(!q.trim()||ld)?"not-allowed":"pointer"}}>
              {ld?"Buscando...":"Buscar"}</button></div>
          <button onClick={function(){smN("");setStep("manual");}} style={{background:"none",border:"none",color:MT,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Ingresar datos manualmente</button>
        </div>)}

        {step==="results"&&(<div className="au">
          {spE?(<div>
            <div style={{padding:28,background:WH,border:"1px solid "+BD,borderRadius:16,textAlign:"center",marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:99,background:"rgba(220,38,38,0.06)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
              <h3 style={{fontSize:17,fontWeight:700,color:NAVY,marginBottom:6}}>Spotify no disponible</h3>
              <p style={{fontSize:13,color:MT}}>Podés ingresar tus datos manualmente.</p></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function(){smN(q||"");setStep("manual");}} style={{padding:"12px 28px",background:GRAD,color:"white",border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:"pointer"}}>Ingresar manualmente</button>
              <button onClick={function(){setStep("search");setQ("");setSpE(false);}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Reintentar</button></div>
          </div>):(<div>
            <h2 style={{fontSize:22,fontWeight:700,color:NAVY,marginBottom:6}}>Seleccioná tu perfil</h2>
            <p style={{color:MT,fontSize:13,marginBottom:20}}>Resultados para "<strong>{q}</strong>"</p>
            {res.length===0&&!ld?<div style={{textAlign:"center",padding:"32px 0",color:MT}}>No se encontraron resultados.</div>:null}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {res.map(function(a,idx){return(
                <button key={a.id} onClick={function(){selArt(a);}} disabled={ld} className="au" style={{display:"flex",alignItems:"center",gap:16,padding:16,background:WH,border:"1px solid "+BD,borderRadius:14,cursor:ld?"wait":"pointer",textAlign:"left",width:"100%",transition:"all 0.2s",animationDelay:idx*50+"ms"}}
                  onMouseOver={function(e){e.currentTarget.style.borderColor=VIOLET;e.currentTarget.style.boxShadow="0 2px 12px rgba(109,40,217,0.08)";}}
                  onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.boxShadow="none";}}>
                  {a.image?<img src={a.image} alt="" style={{width:52,height:52,borderRadius:12,objectFit:"cover",flexShrink:0}}/>:
                  <div style={{width:52,height:52,borderRadius:12,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20,fontWeight:800,color:"white"}}>{a.name.charAt(0)}</div>}
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:600,color:NAVY}}>{a.name}</div><div style={{fontSize:12,color:MT,marginTop:2}}>{a.genres&&a.genres.length>0?a.genres.slice(0,3).join(", "):"Sin género"}</div></div>
                  <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:700,color:NAVY}}>{fmt(a.followers)}</div><div style={{fontSize:10,color:DM}}>seguidores</div></div>
                </button>);})}
            </div>
            <div style={{marginTop:20,display:"flex",gap:10}}>
              <button onClick={function(){setStep("search");setQ("");}} style={{padding:"10px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:13,cursor:"pointer"}}>Buscar otro</button>
              <button onClick={function(){smN(q||"");setStep("manual");}} style={{background:"none",border:"none",color:MT,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Ingresar manualmente</button></div>
          </div>)}
        </div>)}

        {step==="manual"&&(<div className="au">
          <h2 style={{fontSize:24,fontWeight:700,color:NAVY,marginBottom:6}}>Ingresá tus datos</h2>
          <p style={{color:MT,fontSize:13,marginBottom:24}}>Solo el nombre es obligatorio.</p>
          <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Nombre artístico <span style={{color:VIOLET}}>*</span></label>
            <input autoFocus value={mN} onChange={function(e){smN(e.target.value);}} placeholder="Ej: Luna Roja" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div>
          <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Género musical</label>
            <input value={mG} onChange={function(e){smG(e.target.value);}} placeholder="Ej: Trap, Indie Rock" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Oyentes mensuales</label>
              <input value={mL} onChange={function(e){smL(e.target.value);}} placeholder="Ej: 5.000" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Instagram</label>
              <input value={mI} onChange={function(e){smI(e.target.value);}} placeholder="@lunaroja" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div></div>
          <div style={{marginBottom:22}}><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Ciudades</label>
            <input value={mC} onChange={function(e){smC(e.target.value);}} placeholder="Buenos Aires, CDMX" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={finMan} disabled={!mN.trim()} style={{padding:"12px 32px",background:!mN.trim()?BD:GRAD,color:!mN.trim()?DM:"white",border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:!mN.trim()?"not-allowed":"pointer"}}>Continuar</button>
            <button onClick={function(){setStep("search");}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Volver</button></div>
        </div>)}

        {step==="goal"&&sel&&(<div className="au">
          <div style={{display:"flex",alignItems:"center",gap:16,padding:20,background:WH,border:"1px solid "+BD,borderRadius:16,marginBottom:20}}>
            {sel.image?<img src={sel.image} alt="" style={{width:60,height:60,borderRadius:14,objectFit:"cover"}}/>:
            <div style={{width:60,height:60,borderRadius:14,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"white"}}>{sel.name.charAt(0)}</div>}
            <div style={{flex:1}}><div style={{fontSize:17,fontWeight:700,color:NAVY}}>{sel.name}</div>
              <div style={{fontSize:13,color:MT,marginTop:2}}>{sel.genres||sel.genre||"Sin género"}</div>
              {sel.followers?<div style={{display:"flex",gap:16,marginTop:6}}><span style={{fontSize:12,color:SB}}><strong>{fmt(sel.followers)}</strong> seguidores</span>
                {sel.popularity?<span style={{fontSize:12,color:SB}}>Popularidad: <strong>{sel.popularity}/100</strong></span>:null}</div>:null}</div>
            <div style={{width:8,height:8,borderRadius:99,background:"#047857"}}/></div>
          {sel.topTracks?<div style={{marginBottom:16}}><div style={{fontSize:11,color:MT,textTransform:"uppercase",letterSpacing:1,marginBottom:5,fontWeight:600}}>Top tracks</div><div style={{fontSize:13,color:SB,lineHeight:1.5}}>{sel.topTracks}</div></div>:null}
          <h2 style={{fontSize:20,fontWeight:700,color:NAVY,marginBottom:6}}>Una última cosa</h2>
          <p style={{color:MT,fontSize:13,marginBottom:16}}>¿Tu objetivo en los próximos 6 meses? (opcional)</p>
          <input autoFocus value={goal} onChange={function(e){setGoal(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")finish();}}
            placeholder="Ej: 10K oyentes, lanzar EP, primer show..." style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none",marginBottom:22}}/>
          <div style={{display:"flex",gap:10}}>
            <button onClick={finish} style={{padding:"14px 36px",background:GRAD,color:"white",border:"none",borderRadius:99,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(109,40,217,0.2)"}}>Entrar a BACKSTAGE</button>
            <button onClick={function(){setStep("search");setQ("");setSel(null);setSpE(false);}} style={{padding:"14px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Cambiar</button></div>
        </div>)}
      </div>
    </div>
  );
}

/* ═══ TYPING ═══ */
function TypingDots(){return <div style={{display:"flex",gap:4,padding:"16px 20px",borderRadius:"18px 18px 18px 4px",background:WH,border:"1px solid "+BD,width:"fit-content",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
  {[0,1,2].map(function(i){return <div key={i} style={{width:6,height:6,borderRadius:99,background:VIOLET,animation:"typing 1.4s infinite",animationDelay:i*0.15+"s"}}/>;})}
</div>;}

/* ═══ CHAT ═══ */
function Chat(props){
  var agent=props.agent,artist=props.artist;
  var a=useState([]),msgs=a[0],setMsgs=a[1];var b=useState(""),input=b[0],setInput=b[1];
  var c=useState(false),ld=c[0],setLd=c[1];var ref=useRef(null);
  useEffect(function(){if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,ld]);
  useEffect(function(){setMsgs([]);},[agent.id]);
  function send(text){var m=(text||input||"").trim();if(!m||ld)return;setInput("");
    var nM=msgs.concat([{role:"user",text:m,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setMsgs(nM);setLd(true);
    var hist=nM.map(function(x){return{role:x.role==="user"?"user":"assistant",content:x.text};});
    fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:buildSystemPrompt(agent,artist),messages:hist})})
    .then(function(r){return r.json();}).then(function(data){
      var reply="Error al recibir respuesta.";if(data&&data.content)reply=data.content.map(function(b){return b.text||"";}).join("\n");
      else if(data&&data.error)reply="Error: "+JSON.stringify(data.error);
      setMsgs(function(p){return p.concat([{role:"assistant",text:reply,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);});setLd(false);
    }).catch(function(){setMsgs(function(p){return p.concat([{role:"assistant",text:"Error de conexión.",time:""}]);});setLd(false);});}
  var last=msgs.length>0?msgs[msgs.length-1]:null;var showFU=last&&last.role==="assistant"&&!ld;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"14px 28px",borderBottom:"1px solid "+BD,background:WH,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white"}}>{agent.icon}</div>
          <div><div style={{fontSize:14,fontWeight:700,color:NAVY}}>{agent.name}</div><div style={{fontSize:11,color:DM}}>Agentes IA &gt; {agent.name}</div></div></div>
        <div style={{display:"flex",gap:8}}>
          {["Exportar","Compartir"].map(function(t){return <button key={t} style={{padding:"5px 12px",borderRadius:8,border:"1px solid "+BD,background:"transparent",color:MT,fontSize:11,cursor:"pointer"}}>{t}</button>;})}
        </div></div>
      <div ref={ref} style={{flex:1,overflowY:"auto",padding:28,display:"flex",flexDirection:"column",gap:14,background:BG}}>
        {msgs.length===0?(<div style={{textAlign:"center",padding:"56px 20px"}} className="au">
          <div style={{width:48,height:48,borderRadius:12,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:18,fontWeight:700,color:"white"}}>{agent.icon}</div>
          <h3 style={{fontSize:19,fontWeight:700,color:NAVY,marginBottom:6}}>{agent.name}</h3>
          <p style={{color:MT,fontSize:14,maxWidth:400,margin:"0 auto 24px",lineHeight:1.5}}>{agent.bio}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {agent.suggestions.map(function(s){return <button key={s} onClick={function(){send(s);}} style={{padding:"9px 18px",borderRadius:99,border:"1px solid "+BD,background:WH,color:SB,fontSize:13,cursor:"pointer",transition:"all 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
              onMouseOver={function(e){e.currentTarget.style.borderColor=VIOLET;e.currentTarget.style.color=VIOLET;}}
              onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=SB;}}>{s}</button>;})}</div>
        </div>):null}
        {msgs.map(function(m,i){var u=m.role==="user";return(
          <div key={i} style={{display:"flex",justifyContent:u?"flex-end":"flex-start"}} className="as">
            <div style={{maxWidth:"75%"}}><div style={{padding:"14px 18px",fontSize:14,lineHeight:1.75,whiteSpace:"pre-wrap",
              background:u?NAVY:WH,color:u?"#F0F0F5":TX,borderRadius:u?"18px 18px 4px 18px":"18px 18px 18px 4px",
              border:u?"none":"1px solid "+BD,boxShadow:u?"none":"0 1px 4px rgba(0,0,0,0.04)"}}>
              {!u?<div style={{fontSize:10,color:VIOLET,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:0.8,display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:5,height:5,borderRadius:99,background:VIOLET}}/>{agent.name}</div>:null}
              {m.text}</div>
              {m.time?<div style={{fontSize:10,color:DM,marginTop:4,textAlign:u?"right":"left",padding:"0 4px"}}>{m.time}</div>:null}
            </div></div>);})}
        {ld?<TypingDots/>:null}
        {showFU?(<div style={{display:"flex",flexWrap:"wrap",gap:6,paddingLeft:4}} className="ai">
          {agent.suggestions.map(function(s){return <button key={s} onClick={function(){send(s);}} style={{padding:"7px 14px",borderRadius:99,border:"1px solid "+BD,background:WH,color:MT,fontSize:12,cursor:"pointer",transition:"all 0.2s"}}
            onMouseOver={function(e){e.currentTarget.style.borderColor=VIOLET;e.currentTarget.style.color=VIOLET;}}
            onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=MT;}}>{s}</button>;})}
        </div>):null}
      </div>
      <div style={{padding:14,borderTop:"1px solid "+BD,background:WH}}>
        <div style={{display:"flex",gap:10}}>
          <input value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")send();}} placeholder="Escribí tu consulta..." disabled={ld}
            style={{flex:1,padding:"12px 18px",borderRadius:99,border:"1.5px solid "+BD,background:BG,color:TX,fontSize:14,opacity:ld?0.5:1,outline:"none"}}/>
          <button onClick={function(){send();}} disabled={ld||!input.trim()}
            style={{width:44,height:44,borderRadius:99,border:"none",background:(!input.trim()||ld)?BD:GRAD,color:(!input.trim()||ld)?DM:"white",cursor:(!input.trim()||ld)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",boxShadow:(!input.trim()||ld)?"none":"0 2px 10px rgba(109,40,217,0.2)"}}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button></div></div>
    </div>);
}

function ModulePreview(props){var m=props.module;return(
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",background:BG,padding:40}}>
    <div className="ac" style={{background:WH,border:"1px solid "+BD,borderRadius:20,padding:48,textAlign:"center",maxWidth:400,boxShadow:"0 4px 24px rgba(0,0,0,0.04)"}}>
      <div style={{width:56,height:56,borderRadius:14,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg></div>
      <h3 style={{fontSize:20,fontWeight:700,color:NAVY,marginBottom:8}}>{m.name}</h3>
      <p style={{color:MT,fontSize:14,lineHeight:1.5,marginBottom:20}}>Este módulo estará disponible en la versión completa de BACKSTAGE.</p>
      <div style={{padding:"8px 20px",borderRadius:99,background:AD,border:"1px solid "+AB,display:"inline-block",fontSize:12,fontWeight:600,color:VIOLET}}>Próximamente</div>
    </div></div>);}

/* ═══ APP ═══ */
function AppDashboard(props){
  var artist=props.artist;
  var a=useState("agents"),mod=a[0],setMod=a[1];var b=useState("marketing"),agId=b[0],setAgId=b[1];
  var agent=AGENTS.find(function(a){return a.id===agId;});var modObj=MODULES.find(function(m){return m.id===mod;});
  return(
    <div style={{display:"flex",height:"100vh",background:BG,color:TX,overflow:"hidden"}}>
      <style>{STYLES}</style>
      <div style={{width:272,background:WH,borderRight:"1px solid "+BD,padding:"20px 14px",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"4px 8px 14px"}}><LogoFull scale={1}/></div>
        <div style={{margin:"0 8px 18px",padding:"9px 14px",borderRadius:10,background:GRAD,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:12,fontWeight:600,color:"white"}}>Plan Pro</span><span style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>Trial</span></div>
        <div style={{fontSize:10,fontWeight:600,color:DM,textTransform:"uppercase",letterSpacing:1.5,padding:"0 8px",marginBottom:8}}>Módulos</div>
        {MODULES.map(function(m){var act=mod===m.id;return(
          <button key={m.id} onClick={function(){setMod(m.id);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",background:act?AD:"transparent",color:act?VIOLET:MT,fontSize:13,fontWeight:act?600:400,fontFamily:"system-ui,sans-serif"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:5,height:5,borderRadius:99,background:act?VIOLET:DM}}/>{m.name}</div>
            {!m.active&&m.id!=="agents"?<span style={{fontSize:9,padding:"2px 7px",borderRadius:99,background:"rgba(0,0,0,0.03)",color:DM}}>Soon</span>:null}
          </button>);})}
        {mod==="agents"?(<div style={{marginTop:6,paddingTop:10,borderTop:"1px solid "+BD}}>
          <div style={{fontSize:10,fontWeight:600,color:DM,textTransform:"uppercase",letterSpacing:1.5,padding:"0 8px",marginBottom:6}}>Agentes</div>
          {AGENTS.map(function(ag){var act=agId===ag.id;return(
            <button key={ag.id} onClick={function(){setAgId(ag.id);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 10px",borderRadius:7,border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",background:act?AD:"transparent",color:act?VIOLET:DM,fontSize:12,fontFamily:"system-ui,sans-serif"}}>
              <div style={{width:22,height:22,borderRadius:6,background:act?GRAD:"rgba(0,0,0,0.03)",border:act?"none":"1px solid "+BD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:act?"white":DM}}>{ag.icon}</div>
              <div><div style={{fontWeight:act?600:400}}>{ag.name}</div>
                {act?<div style={{fontSize:10,color:MT,marginTop:1}}>{ag.bio}</div>:null}</div>
            </button>);})}
        </div>):null}
        <div style={{flex:1}}/>
        <div style={{padding:14,background:BG,borderRadius:12,border:"1px solid "+BD}}>
          {artist.image?(<div style={{width:"100%",height:56,borderRadius:10,backgroundImage:"url("+artist.image+")",backgroundSize:"cover",backgroundPosition:"center",marginBottom:10,position:"relative"}}>
            <div style={{position:"absolute",inset:0,borderRadius:10,background:"linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.6) 100%)"}}/>
            <div style={{position:"absolute",bottom:6,left:8,fontSize:12,fontWeight:700,color:"white"}}>{artist.name}</div></div>):
          (<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:36,height:36,borderRadius:10,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"white"}}>{artist.name.charAt(0)}</div>
            <div><div style={{fontSize:13,fontWeight:700,color:NAVY}}>{artist.name}</div><div style={{fontSize:11,color:MT}}>{artist.genres||artist.genre||"Sin género"}</div></div></div>)}
          <div style={{display:"flex",gap:12}}>
            {artist.followers?<div><div style={{fontSize:13,fontWeight:700,color:NAVY}}>{fmt(artist.followers)}</div><div style={{fontSize:9,color:DM,textTransform:"uppercase",letterSpacing:0.5}}>seguidores</div></div>:null}
            {artist.popularity?<div><div style={{fontSize:13,fontWeight:700,color:NAVY}}>{artist.popularity}</div><div style={{fontSize:9,color:DM,textTransform:"uppercase",letterSpacing:0.5}}>popularidad</div></div>:null}
            {artist.listeners?<div><div style={{fontSize:13,fontWeight:700,color:NAVY}}>{artist.listeners}</div><div style={{fontSize:9,color:DM,textTransform:"uppercase",letterSpacing:0.5}}>oyentes</div></div>:null}
          </div></div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>{mod==="agents"?<Chat agent={agent} artist={artist}/>:<ModulePreview module={modObj}/>}</div>
    </div>);
}

export default function Home(){
  var a=useState("splash"),scr=a[0],setScr=a[1];var b=useState(null),art=b[0],setArt=b[1];
  if(scr==="splash")return <Splash onStart={function(){setScr("onboard");}}/>;
  if(scr==="onboard"||!art)return <Onboarding onComplete={function(d){setArt(d);setScr("app");}}/>;
  return <AppDashboard artist={art}/>;
}
