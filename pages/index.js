import { useState, useRef, useEffect } from "react";

/* ═══ AGENTS CONFIG ═══ */
var AGENTS = [
  { id:"marketing", name:"Mkt. & Lanzamientos", bio:"Estrategia de releases, calendarios y crecimiento de audiencia",
    icon:"M",suggestions:["Armame un plan de lanzamiento","Mejor día para lanzar","Estrategia bajo presupuesto"],
    prompt:"Sos el agente de Marketing y Lanzamientos de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en marketing musical en Latinoamérica.\n\nFRAMEWORK DE LANZAMIENTO:\nT-30: Preparación (máster, artwork, distribuidor, pitch editorial Spotify for Artists mínimo 3-4 semanas antes)\nT-21: Pre-anuncio (primer teaser redes, pre-save link, EPK a medios)\nT-14: Calentamiento (segundo teaser, push pre-save fuerte, curadores playlists, ads si hay budget)\nT-7: Intensivo (contenido diario, countdown, teaser final)\nT-0: Launch day (publicar todas redes, activar campaña)\nT+7: Post-release (analizar números, contenido reactivo, segundo push)\n\nAdaptá el timeline al tamaño del artista. Priorizá acciones orgánicas. Sé directo.\nSpotify: pitch editorial mínimo 7 días antes. Jueves/viernes mejores. Release Radar ~28 días.\nInstagram: Reels 15-30s. Horarios LATAM: 12-14hs y 19-22hs.\nTikTok: 15-30s, hook primeros 2 segundos.\n\nCuando respondas, usá formato estructurado con secciones claras separadas por líneas en blanco. Usá — para items de lista. Marcá con MAYÚSCULAS los títulos de sección.\n\nBIBLIOGRAFÍA:\n" },
  { id:"pr", name:"PR & Prensa", bio:"Press releases, pitching a medios y relaciones con prensa",
    icon:"P",suggestions:["Escribime un press release","Pitch email para blogs","Medios target para mi género"],
    prompt:"Sos el agente de PR y Prensa de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en relaciones públicas musicales.\n\nPRESS RELEASE: Titular con gancho, Subtítulo, P1 (quién/qué/cuándo), P2 (story), P3 (contexto artista), Quote, Datos técnicos, Assets, Contacto.\nPITCH EMAIL: Máximo 150 palabras. Asunto corto. Saludo personalizado. NUNCA adjuntar archivos pesados.\nMedios LATAM: Indie Rocks (MX), La Heavy (AR), Cultura Colectiva, Rolling Stone LATAM, Billboard Argentina, Indie Hoy, Club Fonograma.\n\nCuando respondas, usá formato estructurado con secciones claras. Usá — para items de lista.\n\nBIBLIOGRAFÍA:\n" },
  { id:"social", name:"Social Media", bio:"Calendarios de contenido, ideas de reels y TikToks",
    icon:"S",suggestions:["Calendario semanal","Ideas de reels para mi single","Frecuencia ideal"],
    prompt:"Sos el agente de Social Media de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en contenido para artistas.\n\nPILARES: Música (40%), Personalidad (30%), Comunidad (20%), Negocio (10%).\nINSTAGRAM: Reels 15-30s, carruseles, stories diarias. 4-5 reels/semana.\nTIKTOK: 15-30s, hook 2 seg. 3-5/semana.\nSé ultra específico: qué filmar, qué texto, qué audio, qué caption.\n\nCuando respondas, usá formato estructurado. Usá — para items.\n\nBIBLIOGRAFÍA:\n" },
  { id:"branding", name:"Branding & Visual", bio:"Identidad visual, paleta de colores y dirección artística",
    icon:"B",suggestions:["Identidad visual completa","Paleta de colores","Tipografía recomendada"],
    prompt:"Sos el agente de Branding de BACKSTAGE. Fuiste diseñado por profesionales con experiencia en dirección artística musical.\n\nPILARES: Esencia de marca, Paleta (3-5 colores con hex), Tipografía (Google Fonts), Dirección fotográfica, Artwork.\nHerramientas: Canva, Coolors.co, Google Fonts. Siempre dá hex específicos y nombres de fuentes reales.\n\nBIBLIOGRAFÍA:\n" },
  { id:"legal", name:"Legal & Contratos", bio:"Derechos de autor, contratos y protección del artista",
    icon:"L",suggestions:["Revisar contrato con sello","Qué es un split sheet","Red flags en contratos"],
    prompt:"Sos el agente Legal de BACKSTAGE. NO sos abogado, siempre aclarás que debe consultar un profesional.\n\nCONTRATOS: Distribución, Sello (CUIDADO cesión perpetua), Management (15-20%), Split sheet, Producción, Feat, Sync, Booking.\nRED FLAGS: cesión perpetuidad, deals 360, exclusividad mundial, mas de 3 años sin salida, advances recoupables, royalties menores a 15-20%.\n\nBIBLIOGRAFÍA:\n" },
  { id:"merch", name:"Merch & Tienda", bio:"Productos, producción, pricing y venta de merchandising",
    icon:"T",suggestions:["Qué productos vender","Cuánto cobrar por remera","Plan de lanzamiento merch"],
    prompt:"Sos el agente de Merch de BACKSTAGE. Experiencia real en producción textil y e-commerce para artistas.\n\nPRODUCTOS: Remeras (60-75% margen), Hoodies, Gorras, Tote bags, Stickers.\nPRODUCCIÓN: DTF (1-100u), Serigrafía (100+), POD (cero riesgo).\nPRICING: Costo x3-4. Remera USD 3-5 costo, venta 12-20.\nVENTA: Shows (10-20% conv), online, drops limitados, bundles.\n\nBIBLIOGRAFÍA:\n" },
];

var MODULES = [
  {id:"agents",name:"Agentes IA",active:true},
  {id:"releases",name:"Release Planner",active:false},
  {id:"calendar",name:"Calendario",active:false},
  {id:"metrics",name:"Métricas",active:false},
  {id:"merch",name:"Merch Store",active:false},
  {id:"crm",name:"Contactos",active:false},
  {id:"finance",name:"Finanzas",active:false},
];

function buildSystemPrompt(agent,artist){
  var ctx="";
  if(artist){
    ctx="\n\nCONTEXTO DEL ARTISTA:";
    ctx+="\n- Nombre: "+(artist.name||"N/A");
    ctx+="\n- Género: "+(artist.genres||artist.genre||"N/A");
    if(artist.followers)ctx+="\n- Seguidores Spotify: "+artist.followers;
    if(artist.popularity)ctx+="\n- Popularidad Spotify: "+artist.popularity+"/100";
    if(artist.listeners)ctx+="\n- Oyentes mensuales: "+artist.listeners;
    if(artist.topTracks)ctx+="\n- Top tracks: "+artist.topTracks;
    if(artist.relatedArtists)ctx+="\n- Artistas similares: "+artist.relatedArtists;
    if(artist.cities)ctx+="\n- Top ciudades: "+artist.cities;
    if(artist.instagram)ctx+="\n- Instagram: "+artist.instagram;
    ctx+="\n- Objetivo: "+(artist.goal||"No especificado");
  }
  return agent.prompt+ctx+"\n\nRespondé en español. Sé directo, práctico y accionable. Tono profesional pero cercano.";
}

var BG="#F7F6F3",WH="#FFFFFF",BD="#DDD9D4",AC="#C2410C",AD="rgba(194,65,12,0.06)",AB="rgba(194,65,12,0.15)",TX="#1A1917",SB="#5C5850",MT="#8C857B",DM="#B0A99F";

function fmt(n){if(!n&&n!==0)return"—";if(n>=1000000)return(n/1000000).toFixed(1)+"M";if(n>=1000)return(n/1000).toFixed(1)+"K";return String(n);}

function Logo(props) {
  var s = props.size || 1;
  return (
    <svg width={120*s} height={28*s} viewBox="0 0 120 28" fill="none">
      <rect x="0" y="4" width="20" height="20" rx="6" fill={AC}/>
      <path d="M7 11.5L10 8.5V19.5M10 19.5H7M10 19.5H13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="28" y="20.5" fontFamily="system-ui" fontWeight="800" fontSize="18" letterSpacing="-0.5" fill={TX}>BACKSTAGE</text>
    </svg>
  );
}

/* ─── GLOBAL STYLES ─── */
var STYLES = `*{margin:0;padding:0;box-sizing:border-box}body{background:${BG};font-family:system-ui,-apple-system,sans-serif}::selection{background:${AC};color:white}input:focus{outline:none;border-color:${AC}!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${BD};border-radius:9px}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes typing{0%,80%,100%{opacity:.2}40%{opacity:1}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.anim-up{animation:fadeUp .5s ease both}.anim-in{animation:fadeIn .4s ease both}.anim-slide{animation:slideIn .3s ease both}.anim-scale{animation:scaleIn .3s ease both}`;

/* ─── SPLASH ─── */
function Splash(props) {
  var s1=useState(false),show=s1[0],setShow=s1[1];
  var s2=useState(false),showTag=s2[0],setShowTag=s2[1];
  var s3=useState(false),showBtn=s3[0],setShowBtn=s3[1];
  useEffect(function(){setTimeout(function(){setShow(true);},200);setTimeout(function(){setShowTag(true);},700);setTimeout(function(){setShowBtn(true);},1100);},[]);

  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40}}>
      <style>{STYLES}</style>
      <div style={{opacity:show?1:0,transform:show?"translateY(0)":"translateY(20px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)",marginBottom:24}}>
        <svg width={240} height={56} viewBox="0 0 240 56" fill="none">
          <rect x="0" y="8" width="40" height="40" rx="12" fill={AC}/>
          <path d="M14 23L20 17V39M20 39H14M20 39H26" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="56" y="40" fontFamily="system-ui" fontWeight="800" fontSize="36" letterSpacing="-1.5" fill={TX}>BACKSTAGE</text>
        </svg>
      </div>
      <div style={{opacity:showTag?1:0,transform:showTag?"translateY(0)":"translateY(10px)",transition:"all 0.6s ease",marginBottom:48}}>
        <p style={{fontSize:18,color:MT,textAlign:"center",letterSpacing:0.3}}>The operating system for independent music careers</p>
      </div>
      <div style={{opacity:showBtn?1:0,transform:showBtn?"scale(1)":"scale(0.9)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <button onClick={props.onStart} style={{padding:"16px 48px",background:AC,color:"white",border:"none",borderRadius:99,fontSize:16,fontWeight:700,cursor:"pointer",letterSpacing:-0.3,boxShadow:"0 4px 20px rgba(194,65,12,0.25)",transition:"transform 0.2s, box-shadow 0.2s"}}
          onMouseOver={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 28px rgba(194,65,12,0.35)";}}
          onMouseOut={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(194,65,12,0.25)";}}>
          Comenzar
        </button>
        <span style={{fontSize:12,color:DM}}>v1.0 Beta</span>
      </div>
      <div style={{position:"absolute",bottom:32,display:"flex",gap:24}}>
        {["6 agentes IA","Data real de Spotify","Profesionales reales"].map(function(t){return <span key={t} style={{fontSize:12,color:DM,display:"flex",alignItems:"center",gap:6,opacity:showBtn?1:0,transition:"opacity 0.6s"}}><div style={{width:4,height:4,borderRadius:99,background:AC,opacity:0.5}}/>{t}</span>;})}
      </div>
    </div>
  );
}

/* ─── ONBOARDING ─── */
function Onboarding(props) {
  var s1=useState("search"),step=s1[0],setStep=s1[1];
  var s2=useState(""),query=s2[0],setQuery=s2[1];
  var s3=useState([]),results=s3[0],setResults=s3[1];
  var s4=useState(false),loading=s4[0],setLoading=s4[1];
  var s5=useState(null),selected=s5[0],setSelected=s5[1];
  var s6=useState(""),goal=s6[0],setGoal=s6[1];
  var s7=useState(false),spErr=s7[0],setSpErr=s7[1];
  var s8=useState(""),mN=s8[0],smN=s8[1];
  var s9=useState(""),mG=s9[0],smG=s9[1];
  var s10=useState(""),mL=s10[0],smL=s10[1];
  var s11=useState(""),mC=s11[0],smC=s11[1];
  var s12=useState(""),mI=s12[0],smI=s12[1];

  function search(){
    if(!query.trim()||loading)return;
    setLoading(true);setResults([]);setSpErr(false);
    fetch("/api/spotify?q="+encodeURIComponent(query.trim()))
    .then(function(r){return r.json();})
    .then(function(d){if(d.error){setSpErr(true);}else{setResults(d.artists||[]);}setStep("results");setLoading(false);})
    .catch(function(){setSpErr(true);setStep("results");setLoading(false);});
  }
  function selectArtist(a){
    setLoading(true);
    fetch("/api/spotify?id="+a.id).then(function(r){return r.json();}).then(function(d){
      var f={id:a.id,name:a.name,image:a.image,genres:"",followers:a.followers,popularity:a.popularity,topTracks:"",relatedArtists:""};
      if(d.artist&&d.artist.genres)f.genres=d.artist.genres.join(", ");else if(a.genres&&a.genres.length>0)f.genres=a.genres.join(", ");
      if(d.artist&&d.artist.followers)f.followers=d.artist.followers.total;
      if(d.artist)f.popularity=d.artist.popularity;
      if(d.topTracks&&d.topTracks.length>0)f.topTracks=d.topTracks.map(function(t){return t.name;}).join(", ");
      if(d.relatedArtists&&d.relatedArtists.length>0)f.relatedArtists=d.relatedArtists.map(function(x){return x.name;}).join(", ");
      setSelected(f);setStep("goal");setLoading(false);
    }).catch(function(){setSelected({name:a.name,image:a.image,genres:a.genres?a.genres.join(", "):"",followers:a.followers,popularity:a.popularity});setStep("goal");setLoading(false);});
  }
  function finishManual(){if(!mN.trim())return;setSelected({name:mN,genre:mG,listeners:mL,cities:mC,instagram:mI});setStep("goal");}
  function finish(){if(!selected)return;selected.goal=goal;props.onComplete(selected);}

  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:40,color:TX}}>
      <style>{STYLES}</style>
      <div style={{maxWidth:560,width:"100%"}} className="anim-up">
        <div style={{marginBottom:48}}><Logo/></div>

        {step==="search"&&(<div>
          <h1 style={{fontSize:34,fontWeight:800,letterSpacing:-1.8,lineHeight:1.05,marginBottom:12}}>Conectá tu perfil de Spotify.</h1>
          <p style={{color:SB,fontSize:15,marginBottom:32,lineHeight:1.6}}>Los agentes IA trabajan con tu data real: géneros, popularidad, top tracks y artistas similares.</p>
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <input autoFocus value={query} onChange={function(e){setQuery(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")search();}} placeholder="Nombre del artista..."
              style={{flex:1,padding:"14px 20px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:16,outline:"none",transition:"border-color 0.2s"}}/>
            <button onClick={search} disabled={loading||!query.trim()} style={{padding:"14px 28px",background:(!query.trim()||loading)?BD:AC,color:(!query.trim()||loading)?DM:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:(!query.trim()||loading)?"not-allowed":"pointer",transition:"all 0.2s"}}>
              {loading?"Buscando...":"Buscar"}</button>
          </div>
          <button onClick={function(){smN("");setStep("manual");}} style={{background:"none",border:"none",color:MT,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Ingresar datos manualmente</button>
        </div>)}

        {step==="results"&&(<div className="anim-up">
          {spErr?(<div>
            <div style={{padding:24,background:WH,border:"1px solid "+BD,borderRadius:16,textAlign:"center",marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:99,background:"rgba(220,38,38,0.06)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
              <h3 style={{fontSize:17,fontWeight:700,marginBottom:6}}>Spotify no disponible</h3>
              <p style={{fontSize:13,color:MT}}>La conexión con Spotify no está activa. Podés ingresar tus datos manualmente.</p>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function(){smN(query||"");setStep("manual");}} style={{padding:"12px 28px",background:AC,color:"white",border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:"pointer"}}>Ingresar manualmente</button>
              <button onClick={function(){setStep("search");setQuery("");setSpErr(false);}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Reintentar</button>
            </div>
          </div>):(<div>
            <h2 style={{fontSize:22,fontWeight:700,letterSpacing:-0.5,marginBottom:6}}>Seleccioná tu perfil</h2>
            <p style={{color:MT,fontSize:13,marginBottom:20}}>Resultados para "<strong>{query}</strong>"</p>
            {results.length===0&&!loading?<div style={{textAlign:"center",padding:"32px 0",color:MT}}><p style={{marginBottom:16}}>No se encontraron resultados.</p></div>:null}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {results.map(function(a,i){return(
                <button key={a.id} onClick={function(){selectArtist(a);}} disabled={loading} className="anim-up" style={{display:"flex",alignItems:"center",gap:16,padding:16,background:WH,border:"1px solid "+BD,borderRadius:14,cursor:loading?"wait":"pointer",textAlign:"left",width:"100%",transition:"border-color 0.2s,box-shadow 0.2s",animationDelay:i*60+"ms"}}
                  onMouseOver={function(e){e.currentTarget.style.borderColor=AC;e.currentTarget.style.boxShadow="0 2px 12px rgba(194,65,12,0.08)";}}
                  onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.boxShadow="none";}}>
                  {a.image?<img src={a.image} alt="" style={{width:52,height:52,borderRadius:12,objectFit:"cover",flexShrink:0}}/>:
                  <div style={{width:52,height:52,borderRadius:12,background:AD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18,fontWeight:700,color:AC}}>{a.name.charAt(0)}</div>}
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:600,color:TX}}>{a.name}</div><div style={{fontSize:12,color:MT,marginTop:2}}>{a.genres&&a.genres.length>0?a.genres.slice(0,3).join(", "):"Sin género"}</div></div>
                  <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:700,color:TX}}>{fmt(a.followers)}</div><div style={{fontSize:10,color:DM}}>seguidores</div></div>
                </button>);})}
            </div>
            <div style={{marginTop:20,display:"flex",gap:10}}>
              <button onClick={function(){setStep("search");setQuery("");}} style={{padding:"10px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:13,cursor:"pointer"}}>Buscar otro</button>
              <button onClick={function(){smN(query||"");setStep("manual");}} style={{background:"none",border:"none",color:MT,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Ingresar manualmente</button>
            </div>
          </div>)}
        </div>)}

        {step==="manual"&&(<div className="anim-up">
          <h2 style={{fontSize:24,fontWeight:700,letterSpacing:-0.8,marginBottom:6}}>Ingresá tus datos</h2>
          <p style={{color:MT,fontSize:13,marginBottom:24}}>Solo el nombre es obligatorio.</p>
          <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Nombre artístico <span style={{color:AC}}>*</span></label>
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
            <button onClick={finishManual} disabled={!mN.trim()} style={{padding:"12px 32px",background:!mN.trim()?BD:AC,color:!mN.trim()?DM:"white",border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:!mN.trim()?"not-allowed":"pointer"}}>Continuar</button>
            <button onClick={function(){setStep("search");}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Volver</button></div>
        </div>)}

        {step==="goal"&&selected&&(<div className="anim-up">
          <div style={{display:"flex",alignItems:"center",gap:16,padding:20,background:WH,border:"1px solid "+BD,borderRadius:16,marginBottom:20}}>
            {selected.image?<img src={selected.image} alt="" style={{width:60,height:60,borderRadius:14,objectFit:"cover"}}/>:
            <div style={{width:60,height:60,borderRadius:14,background:"linear-gradient(135deg, "+AC+", #E86028)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"white"}}>{selected.name.charAt(0)}</div>}
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:700}}>{selected.name}</div>
              <div style={{fontSize:13,color:MT,marginTop:2}}>{selected.genres||selected.genre||"Sin género"}</div>
              {selected.followers?<div style={{display:"flex",gap:16,marginTop:6}}>
                <span style={{fontSize:12,color:SB}}><strong>{fmt(selected.followers)}</strong> seguidores</span>
                {selected.popularity?<span style={{fontSize:12,color:SB}}>Pop: <strong>{selected.popularity}/100</strong></span>:null}</div>:null}
            </div>
            <div style={{width:8,height:8,borderRadius:99,background:"#047857"}}/>
          </div>
          {selected.topTracks?<div style={{marginBottom:16}}><div style={{fontSize:11,color:MT,textTransform:"uppercase",letterSpacing:1,marginBottom:5,fontWeight:600}}>Top tracks</div><div style={{fontSize:13,color:SB,lineHeight:1.5}}>{selected.topTracks}</div></div>:null}
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:6}}>Una última cosa</h2>
          <p style={{color:MT,fontSize:13,marginBottom:16}}>¿Tu objetivo en los próximos 6 meses? (opcional)</p>
          <input autoFocus value={goal} onChange={function(e){setGoal(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")finish();}}
            placeholder="Ej: 10K oyentes, lanzar EP, primer show..."
            style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none",marginBottom:22}}/>
          <div style={{display:"flex",gap:10}}>
            <button onClick={finish} style={{padding:"14px 36px",background:AC,color:"white",border:"none",borderRadius:99,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(194,65,12,0.2)"}}>Entrar a BACKSTAGE</button>
            <button onClick={function(){setStep("search");setQuery("");setSelected(null);setSpErr(false);}} style={{padding:"14px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Cambiar</button></div>
        </div>)}
      </div>
    </div>
  );
}

/* ─── TYPING INDICATOR ─── */
function TypingDots(){
  return <div style={{display:"flex",gap:4,padding:"16px 20px",borderRadius:"18px 18px 18px 4px",background:WH,border:"1px solid "+BD,width:"fit-content",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
    {[0,1,2].map(function(i){return <div key={i} style={{width:6,height:6,borderRadius:99,background:AC,animation:"typing 1.4s infinite",animationDelay:i*0.15+"s"}}/>;})}
  </div>;
}

/* ─── CHAT ─── */
function Chat(props) {
  var agent=props.agent,artist=props.artist;
  var mm=useState([]),msgs=mm[0],setMsgs=mm[1];
  var ii=useState(""),input=ii[0],setInput=ii[1];
  var ll=useState(false),loading=ll[0],setLoading=ll[1];
  var ref=useRef(null);
  useEffect(function(){if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,loading]);
  useEffect(function(){setMsgs([]);},[agent.id]);

  function send(text){
    var m=(text||input||"").trim();if(!m||loading)return;setInput("");
    var newM=msgs.concat([{role:"user",text:m,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);
    setMsgs(newM);setLoading(true);
    var hist=newM.map(function(x){return{role:x.role==="user"?"user":"assistant",content:x.text};});
    fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:buildSystemPrompt(agent,artist),messages:hist})})
    .then(function(r){return r.json();})
    .then(function(data){
      var reply="Error al recibir respuesta.";
      if(data&&data.content)reply=data.content.map(function(b){return b.text||"";}).join("\n");
      else if(data&&data.error)reply="Error: "+JSON.stringify(data.error);
      setMsgs(function(p){return p.concat([{role:"assistant",text:reply,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);});
      setLoading(false);
    }).catch(function(){setMsgs(function(p){return p.concat([{role:"assistant",text:"Error de conexión.",time:""}]);});setLoading(false);});
  }

  // Follow-up suggestions after AI response
  var lastMsg = msgs.length>0?msgs[msgs.length-1]:null;
  var showFollowUp = lastMsg&&lastMsg.role==="assistant"&&!loading;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header with breadcrumb */}
      <div style={{padding:"14px 32px",borderBottom:"1px solid "+BD,background:WH,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:10,background:AD,border:"1px solid "+AB,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:AC}}>{agent.icon}</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:TX}}>{agent.name}</div>
            <div style={{fontSize:11,color:DM}}>Agentes IA &gt; {agent.name}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+BD,background:"transparent",color:MT,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}
            title="Próximamente">
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            Exportar</button>
          <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+BD,background:"transparent",color:MT,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}
            title="Próximamente">
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            Compartir</button>
        </div>
      </div>

      {/* Messages */}
      <div ref={ref} style={{flex:1,overflowY:"auto",padding:32,display:"flex",flexDirection:"column",gap:16,background:BG}}>
        {msgs.length===0?(
          <div style={{textAlign:"center",padding:"56px 20px"}} className="anim-up">
            <div style={{width:52,height:52,borderRadius:14,background:AD,border:"1px solid "+AB,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:20,fontWeight:700,color:AC}}>{agent.icon}</div>
            <h3 style={{fontSize:20,fontWeight:700,marginBottom:6}}>{agent.name}</h3>
            <p style={{color:MT,fontSize:14,maxWidth:400,margin:"0 auto 28px",lineHeight:1.5}}>{agent.bio}. Seleccioná una consulta o escribí la tuya.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
              {agent.suggestions.map(function(s){return <button key={s} onClick={function(){send(s);}} style={{padding:"10px 20px",borderRadius:99,border:"1px solid "+BD,background:WH,color:SB,fontSize:13,cursor:"pointer",transition:"all 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}
                onMouseOver={function(e){e.currentTarget.style.borderColor=AC;e.currentTarget.style.color=AC;e.currentTarget.style.boxShadow="0 2px 8px rgba(194,65,12,0.1)";}}
                onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=SB;e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.03)";}}>{s}</button>;})}</div>
          </div>
        ):null}

        {msgs.map(function(m,i){var u=m.role==="user";return(
          <div key={i} style={{display:"flex",justifyContent:u?"flex-end":"flex-start"}} className="anim-slide">
            <div style={{maxWidth:"75%"}}>
              <div style={{padding:"16px 20px",fontSize:14,lineHeight:1.75,whiteSpace:"pre-wrap",
                background:u?"#1A1917":WH,color:u?"#FAFAF9":TX,
                borderRadius:u?"18px 18px 4px 18px":"18px 18px 18px 4px",
                border:u?"none":"1px solid "+BD,boxShadow:u?"none":"0 1px 4px rgba(0,0,0,0.04)"}}>
                {!u?<div style={{fontSize:10,color:AC,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:0.8,display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:5,height:5,borderRadius:99,background:AC}}/>{agent.name}</div>:null}
                {m.text}
              </div>
              {m.time?<div style={{fontSize:10,color:DM,marginTop:4,textAlign:u?"right":"left",padding:"0 4px"}}>{m.time}</div>:null}
            </div>
          </div>);})}

        {loading?<TypingDots/>:null}

        {/* Follow-up suggestions */}
        {showFollowUp?(
          <div style={{display:"flex",flexWrap:"wrap",gap:6,paddingLeft:4}} className="anim-in">
            {agent.suggestions.map(function(s){return <button key={s} onClick={function(){send(s);}} style={{padding:"7px 16px",borderRadius:99,border:"1px solid "+BD,background:WH,color:MT,fontSize:12,cursor:"pointer",transition:"all 0.2s"}}
              onMouseOver={function(e){e.currentTarget.style.borderColor=AC;e.currentTarget.style.color=AC;}}
              onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=MT;}}>{s}</button>;})}
          </div>
        ):null}
      </div>

      {/* Input */}
      <div style={{padding:16,borderTop:"1px solid "+BD,background:WH}}>
        <div style={{display:"flex",gap:10}}>
          <input value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")send();}} placeholder="Escribí tu consulta..." disabled={loading}
            style={{flex:1,padding:"13px 20px",borderRadius:99,border:"1.5px solid "+BD,background:BG,color:TX,fontSize:14,opacity:loading?0.5:1,outline:"none",transition:"border-color 0.2s"}}/>
          <button onClick={function(){send();}} disabled={loading||!input.trim()}
            style={{width:46,height:46,borderRadius:99,border:"none",background:(!input.trim()||loading)?BD:AC,color:(!input.trim()||loading)?DM:"white",cursor:(!input.trim()||loading)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",boxShadow:(!input.trim()||loading)?"none":"0 2px 10px rgba(194,65,12,0.2)"}}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MODULE PREVIEW (for non-active modules) ─── */
function ModulePreview(props){
  var m=props.module;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",background:BG,padding:40}}>
      <div className="anim-scale" style={{background:WH,border:"1px solid "+BD,borderRadius:20,padding:48,textAlign:"center",maxWidth:400,boxShadow:"0 4px 24px rgba(0,0,0,0.04)"}}>
        <div style={{width:56,height:56,borderRadius:14,background:AD,border:"1px solid "+AB,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={AC} strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        </div>
        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8}}>{m.name}</h3>
        <p style={{color:MT,fontSize:14,lineHeight:1.5,marginBottom:20}}>Este módulo estará disponible en la versión completa de BACKSTAGE.</p>
        <div style={{padding:"8px 20px",borderRadius:99,background:AD,border:"1px solid "+AB,display:"inline-block",fontSize:12,fontWeight:600,color:AC}}>Próximamente</div>
      </div>
    </div>
  );
}

/* ─── APP ─── */
function AppDashboard(props) {
  var artist=props.artist;
  var aa=useState("agents"),activeModule=aa[0],setActiveModule=aa[1];
  var bb=useState("marketing"),activeAgent=bb[0],setActiveAgent=bb[1];
  var agent=AGENTS.find(function(a){return a.id===activeAgent;});
  var mod=MODULES.find(function(m){return m.id===activeModule;});

  return (
    <div style={{display:"flex",height:"100vh",background:BG,color:TX,overflow:"hidden"}}>
      <style>{STYLES}</style>

      {/* Sidebar */}
      <div style={{width:280,background:WH,borderRight:"1px solid "+BD,padding:"20px 16px",display:"flex",flexDirection:"column"}}>
        {/* Logo */}
        <div style={{padding:"4px 8px 16px"}}><Logo/></div>

        {/* Tier badge */}
        <div style={{margin:"0 8px 20px",padding:"8px 14px",borderRadius:10,background:"linear-gradient(135deg, rgba(194,65,12,0.06), rgba(194,65,12,0.02))",border:"1px solid "+AB,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:12,fontWeight:600,color:AC}}>Plan Pro</span>
          <span style={{fontSize:10,color:MT}}>Trial activo</span>
        </div>

        {/* Modules */}
        <div style={{fontSize:10,fontWeight:600,color:DM,textTransform:"uppercase",letterSpacing:1.5,padding:"0 8px",marginBottom:8}}>Módulos</div>
        {MODULES.map(function(m){var act=activeModule===m.id;return(
          <button key={m.id} onClick={function(){setActiveModule(m.id);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 12px",borderRadius:9,border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",background:act?AD:"transparent",color:act?AC:MT,fontSize:13,fontWeight:act?600:400,fontFamily:"system-ui,sans-serif",transition:"all 0.15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:6,height:6,borderRadius:99,background:act?AC:DM}}/>{m.name}
            </div>
            {!m.active&&m.id!=="agents"?<span style={{fontSize:9,padding:"2px 8px",borderRadius:99,background:"rgba(0,0,0,0.04)",color:DM}}>Soon</span>:null}
          </button>);})}

        {/* Agent sub-nav (when agents module active) */}
        {activeModule==="agents"?(
          <div style={{marginTop:8,paddingTop:12,borderTop:"1px solid "+BD}}>
            <div style={{fontSize:10,fontWeight:600,color:DM,textTransform:"uppercase",letterSpacing:1.5,padding:"0 8px",marginBottom:8}}>Agentes</div>
            {AGENTS.map(function(a){var act=activeAgent===a.id;return(
              <button key={a.id} onClick={function(){setActiveAgent(a.id);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",background:act?"rgba(194,65,12,0.04)":"transparent",color:act?AC:DM,fontSize:12,fontFamily:"system-ui,sans-serif",transition:"all 0.15s"}}>
                <div style={{width:24,height:24,borderRadius:6,background:act?AD:"rgba(0,0,0,0.02)",border:act?"1px solid "+AB:"1px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:act?AC:DM}}>{a.icon}</div>
                <div><div style={{fontWeight:act?600:400}}>{a.name}</div>
                  {act?<div style={{fontSize:10,color:MT,marginTop:1}}>{a.bio}</div>:null}</div>
              </button>);})}
          </div>
        ):null}

        <div style={{flex:1}}/>

        {/* Artist card */}
        <div style={{padding:14,background:BG,borderRadius:14,border:"1px solid "+BD}}>
          {artist.image?(
            <div style={{width:"100%",height:60,borderRadius:10,backgroundImage:"url("+artist.image+")",backgroundSize:"cover",backgroundPosition:"center",marginBottom:10,position:"relative"}}>
              <div style={{position:"absolute",inset:0,borderRadius:10,background:"linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.5) 100%)"}}/>
              <div style={{position:"absolute",bottom:6,left:8,fontSize:12,fontWeight:700,color:"white"}}>{artist.name}</div>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg, "+AC+", #E86028)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"white"}}>{artist.name.charAt(0)}</div>
              <div><div style={{fontSize:13,fontWeight:700}}>{artist.name}</div><div style={{fontSize:11,color:MT}}>{artist.genres||artist.genre||"Sin género"}</div></div>
            </div>
          )}
          <div style={{display:"flex",gap:12}}>
            {artist.followers?<div><div style={{fontSize:13,fontWeight:700}}>{fmt(artist.followers)}</div><div style={{fontSize:9,color:DM,textTransform:"uppercase",letterSpacing:0.5}}>seguidores</div></div>:null}
            {artist.popularity?<div><div style={{fontSize:13,fontWeight:700}}>{artist.popularity}</div><div style={{fontSize:9,color:DM,textTransform:"uppercase",letterSpacing:0.5}}>popularidad</div></div>:null}
            {artist.listeners?<div><div style={{fontSize:13,fontWeight:700}}>{artist.listeners}</div><div style={{fontSize:9,color:DM,textTransform:"uppercase",letterSpacing:0.5}}>oyentes</div></div>:null}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        {activeModule==="agents"?<Chat agent={agent} artist={artist}/>:<ModulePreview module={mod}/>}
      </div>
    </div>
  );
}

/* ─── ROOT ─── */
export default function Home() {
  var ss=useState("splash"),screen=ss[0],setScreen=ss[1];
  var aa=useState(null),artist=aa[0],setArtist=aa[1];

  if(screen==="splash")return <Splash onStart={function(){setScreen("onboard");}}/>;
  if(screen==="onboard"||!artist)return <Onboarding onComplete={function(d){setArtist(d);setScreen("app");}}/>;
  return <AppDashboard artist={artist}/>;
}
