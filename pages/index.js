import { useState, useRef, useEffect } from "react";

/* ═══ AGENTS ═══ */
var AGENTS = [
  { id:"management", name:"Management & Estrategia", bio:"Visión global, planificación y desarrollo de carrera", icon:"M",
    suggestions:["Armar plan a 6 meses","Cómo organizar mi equipo","Prioridades del trimestre"],
    prompt:"Sos el agente de Management y Estrategia General de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en management musical." },
  { id:"marketing", name:"Mkt & Lanzamientos", bio:"Estrategia de releases, calendarios y crecimiento", icon:"L",
    suggestions:["Armame un plan de lanzamiento","Mejor día para lanzar","Estrategia bajo presupuesto"],
    prompt:"Sos el agente de Marketing y Lanzamientos de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en marketing musical." },
  { id:"content", name:"Creativo de Contenidos", bio:"Ideas de contenido, reels y estrategia de redes", icon:"C",
    suggestions:["Calendario semanal","Ideas de reels para mi single","Frecuencia ideal"],
    prompt:"Sos el agente Creativo de Contenidos de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en contenido para artistas." },
  { id:"branding", name:"Branding & Visual", bio:"Identidad visual, paleta de colores y dirección artística", icon:"B",
    suggestions:["Identidad visual completa","Paleta de colores","Tipografía recomendada"],
    prompt:"Sos el agente de Branding de BACKSTAGE. Fuiste diseñado por profesionales con experiencia en dirección artística musical." },
  { id:"legal", name:"Legal & Contratos", bio:"Derechos de autor, contratos y protección del artista", icon:"L",
    suggestions:["Revisar contrato con sello","Qué es un split sheet","Red flags en contratos"],
    prompt:"Sos el agente Legal de BACKSTAGE. NO sos abogado, siempre aclarás que debe consultar un profesional." },
  { id:"merch", name:"Merch y Tienda", bio:"Productos, producción, pricing y venta de merchandising", icon:"T",
    suggestions:["Qué productos vender","Cuánto cobrar por remera","Plan de lanzamiento merch"],
    prompt:"Sos el agente de Merch de BACKSTAGE. Experiencia real en producción textil y e-commerce para artistas." },
];

var MODULES = [
  {id:"dashboard",name:"Dashboard",active:true},
  {id:"agents",name:"Mis Agentes",active:true},
  {id:"releases",name:"Release Planner",active:false},
  {id:"calendar",name:"Calendario",active:false},
  {id:"metrics",name:"Métricas",active:false},
  {id:"merchmod",name:"Merch Store",active:false},
  {id:"finance",name:"Finanzas",active:false},
  {id:"crm",name:"Contactos",active:false},
];

function buildSystemPrompt(agent,artist){
  var ctx="";
  if(artist){ctx="\n\nCONTEXTO DEL ARTISTA:";ctx+="\n- Nombre: "+(artist.name||"N/A");ctx+="\n- Género: "+(artist.genres||artist.genre||"N/A");
  if(artist.listeners)ctx+="\n- Oyentes mensuales: "+artist.listeners;
  if(artist.instagram)ctx+="\n- Instagram: "+artist.instagram;ctx+="\n- Objetivo: "+(artist.goal||"No especificado");}
  return agent.prompt+ctx+"\n\nRespondé en español. Sé directo, práctico y accionable. Tono profesional pero cercano.";
}

/* ═══ BRAND COLORS — Orange Theme (#C2410C) ═══ */
var BG="#FDF8F5",WH="#FFFFFF",BD="#E6D5CC",TX="#431407",SB="#7C2D12",MT="#9A4D31",DM="#D4A38D";
var PRIMARY="#C2410C", DARK="#7C2D12", GRAD="linear-gradient(135deg, #C2410C, #EA580C)", GRAD2="linear-gradient(135deg, #EA580C, #F97316)";
var AD="rgba(194,65,12,0.08)",AB="rgba(194,65,12,0.18)",AC=DARK;

function fmt(n){if(!n&&n!==0)return"—";if(n>=1000000)return(n/1000000).toFixed(1)+"M";if(n>=1000)return(n/1000).toFixed(1)+"K";return String(n);}

/* ═══ ISOLOGO SVG ═══ */
function IsoLogo(props){
  var s=props.size||40;
  return(
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id="bg" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor={PRIMARY}/><stop offset="100%" stopColor="#EA580C"/></linearGradient></defs>
      <rect width="48" height="48" rx="12" fill="url(#bg)"/>
      <path d="M16 34L24 14L32 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="19" y1="27" x2="29" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function LogoFull(props){
  var s=props.scale||1;
  return(
    <div style={{display:"flex",alignItems:"center",gap:10*s}}>
      <IsoLogo size={32*s}/>
      <div>
        <div style={{fontSize:18*s,fontWeight:800,color:DARK,letterSpacing:-0.5*s,lineHeight:1}}>BACKSTAGE</div>
      </div>
    </div>
  );
}

var STYLES = `*{margin:0;padding:0;box-sizing:border-box}body{background:${BG};font-family:system-ui,-apple-system,sans-serif}::selection{background:${PRIMARY};color:white}input:focus{outline:none;border-color:${PRIMARY}!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${BD};border-radius:9px}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
.au{animation:fadeUp .6s ease both}.ai{animation:fadeIn .5s ease both}.as{animation:slideIn .35s ease both}.ac{animation:scaleIn .35s ease both}`;

/* ═══ SPLASH ═══ */
function Splash(props){
  var a=useState(false),s1=a[0],ss1=a[1];var c=useState(false),s3=c[0],ss3=c[1];
  useEffect(function(){setTimeout(function(){ss1(true);},300);setTimeout(function(){ss3(true);},800);},[]);
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,position:"relative",overflow:"hidden"}}>
      <style>{STYLES}</style>
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(194,65,12,0.06) 0%, transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>
      
      <div style={{opacity:s1?1:0,transform:s1?"translateY(0) scale(1)":"translateY(20px) scale(0.95)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)",marginBottom:20}}>
        <IsoLogo size={80}/>
      </div>
      <div style={{opacity:s1?1:0,transform:s1?"translateY(0)":"translateY(16px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s",marginBottom:48}}>
        {/* Agrandado el texto BACKSTAGE */}
        <span style={{fontSize:56,fontWeight:800,color:DARK,letterSpacing:-2}}>BACKSTAGE</span>
      </div>
      
      <div style={{opacity:s3?1:0,transform:s3?"scale(1)":"scale(0.9)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
        <button onClick={props.onStart} style={{padding:"16px 52px",background:GRAD,color:"white",border:"none",borderRadius:99,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 24px rgba(194,65,12,0.25)",transition:"transform 0.2s,box-shadow 0.2s"}}
          onMouseOver={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 32px rgba(194,65,12,0.35)";}}
          onMouseOut={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(194,65,12,0.25)";}}>
          Comenzar</button>
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
    var f={id:a.id,name:a.name,image:a.image,genres:""};
    if(d.artist&&d.artist.genres)f.genres=d.artist.genres.join(", ");else if(a.genres&&a.genres.length>0)f.genres=a.genres.join(", ");
    // Simulamos oyentes mensuales si no están por carga manual (ya que la API no los trae)
    f.listeners = "15.000"; 
    setSel(f);setStep("goal");setLd(false);}).catch(function(){setSel({name:a.name,image:a.image,genres:a.genres?a.genres.join(", "):""});setStep("goal");setLd(false);});}
  function finMan(){if(!mN.trim())return;setSel({name:mN,genre:mG,listeners:mL,cities:mC,instagram:mI});setStep("goal");}
  function finish(){if(!sel)return;sel.goal=goal;props.onComplete(sel);}

  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:40,color:TX}}>
      <style>{STYLES}</style>
      <div style={{maxWidth:560,width:"100%"}} className="au">
        <div style={{marginBottom:48}}><LogoFull scale={1.1}/></div>

        {step==="search"&&(<div>
          <h1 style={{fontSize:32,fontWeight:800,letterSpacing:-1.5,lineHeight:1.05,marginBottom:12,color:DARK}}>Conectá tu perfil de Spotify.</h1>
          <p style={{color:SB,fontSize:15,marginBottom:32,lineHeight:1.6}}>Los agentes trabajan con tu data real para darte mejores estrategias.</p>
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
              <h3 style={{fontSize:17,fontWeight:700,color:DARK,marginBottom:6}}>Spotify no disponible</h3>
              <p style={{fontSize:13,color:MT}}>Podés ingresar tus datos manualmente.</p></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function(){smN(q||"");setStep("manual");}} style={{padding:"12px 28px",background:GRAD,color:"white",border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:"pointer"}}>Ingresar manualmente</button>
              <button onClick={function(){setStep("search");setQ("");setSpE(false);}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Reintentar</button></div>
          </div>):(<div>
            <h2 style={{fontSize:22,fontWeight:700,color:DARK,marginBottom:6}}>Seleccioná tu perfil</h2>
            <p style={{color:MT,fontSize:13,marginBottom:20}}>Resultados para "<strong>{q}</strong>"</p>
            {res.length===0&&!ld?<div style={{textAlign:"center",padding:"32px 0",color:MT}}>No se encontraron resultados.</div>:null}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {res.map(function(a,idx){return(
                <button key={a.id} onClick={function(){selArt(a);}} disabled={ld} className="au" style={{display:"flex",alignItems:"center",gap:16,padding:16,background:WH,border:"1px solid "+BD,borderRadius:14,cursor:ld?"wait":"pointer",textAlign:"left",width:"100%",transition:"all 0.2s",animationDelay:idx*50+"ms"}}
                  onMouseOver={function(e){e.currentTarget.style.borderColor=PRIMARY;e.currentTarget.style.boxShadow="0 2px 12px rgba(194,65,12,0.08)";}}
                  onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.boxShadow="none";}}>
                  {a.image?<img src={a.image} alt="" style={{width:52,height:52,borderRadius:12,objectFit:"cover",flexShrink:0}}/>:
                  <div style={{width:52,height:52,borderRadius:12,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20,fontWeight:800,color:"white"}}>{a.name.charAt(0)}</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:600,color:DARK}}>{a.name}</div>
                    <div style={{fontSize:12,color:MT,marginTop:2}}>{a.genres&&a.genres.length>0?a.genres.slice(0,3).join(", "):"Sin género"}</div>
                  </div>
                </button>);})}
            </div>
            <div style={{marginTop:20,display:"flex",gap:10}}>
              <button onClick={function(){setStep("search");setQ("");}} style={{padding:"10px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:13,cursor:"pointer"}}>Buscar otro</button>
              <button onClick={function(){smN(q||"");setStep("manual");}} style={{background:"none",border:"none",color:MT,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Ingresar manualmente</button></div>
          </div>)}
        </div>)}

        {step==="manual"&&(<div className="au">
          <h2 style={{fontSize:24,fontWeight:700,color:DARK,marginBottom:6}}>Ingresá tus datos</h2>
          <p style={{color:MT,fontSize:13,marginBottom:24}}>Solo el nombre es obligatorio.</p>
          <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Nombre artístico <span style={{color:PRIMARY}}>*</span></label>
            <input autoFocus value={mN} onChange={function(e){smN(e.target.value);}} placeholder="Ej: Luna Roja" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div>
          <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Género musical</label>
            <input value={mG} onChange={function(e){smG(e.target.value);}} placeholder="Ej: Trap, Indie Rock" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Oyentes mensuales</label>
              <input value={mL} onChange={function(e){smL(e.target.value);}} placeholder="Ej: 5.000" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:5}}>Instagram</label>
              <input value={mI} onChange={function(e){smI(e.target.value);}} placeholder="@lunaroja" style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/></div></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={finMan} disabled={!mN.trim()} style={{padding:"12px 32px",background:!mN.trim()?BD:GRAD,color:!mN.trim()?DM:"white",border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:!mN.trim()?"not-allowed":"pointer"}}>Continuar</button>
            <button onClick={function(){setStep("search");}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Volver</button></div>
        </div>)}

        {step==="goal"&&sel&&(<div className="au">
          <div style={{display:"flex",alignItems:"center",gap:16,padding:20,background:WH,border:"1px solid "+BD,borderRadius:16,marginBottom:20}}>
            {sel.image?<img src={sel.image} alt="" style={{width:60,height:60,borderRadius:14,objectFit:"cover"}}/>:
            <div style={{width:60,height:60,borderRadius:14,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"white"}}>{sel.name.charAt(0)}</div>}
            <div style={{flex:1}}><div style={{fontSize:17,fontWeight:700,color:DARK}}>{sel.name}</div>
              <div style={{fontSize:13,color:MT,marginTop:2}}>{sel.genres||sel.genre||"Sin género"}</div>
            </div>
            <div style={{width:8,height:8,borderRadius:99,background:"#047857"}}/></div>
          <h2 style={{fontSize:20,fontWeight:700,color:DARK,marginBottom:6}}>Una última cosa</h2>
          <p style={{color:MT,fontSize:13,marginBottom:16}}>¿Tu objetivo en los próximos 6 meses? (opcional)</p>
          <input autoFocus value={goal} onChange={function(e){setGoal(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")finish();}}
            placeholder="Ej: 10K oyentes, lanzar EP, primer show..." style={{width:"100%",padding:"13px 18px",borderRadius:10,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none",marginBottom:22}}/>
          <div style={{display:"flex",gap:10}}>
            <button onClick={finish} style={{padding:"14px 36px",background:GRAD,color:"white",border:"none",borderRadius:99,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(194,65,12,0.2)"}}>Entrar a BACKSTAGE</button>
            <button onClick={function(){setStep("search");setQ("");setSel(null);setSpE(false);}} style={{padding:"14px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Cambiar</button></div>
        </div>)}
      </div>
    </div>
  );
}

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
      setMsgs(function(p){return p.concat([{role:"assistant",text:reply,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);});setLd(false);
    }).catch(function(){setMsgs(function(p){return p.concat([{role:"assistant",text:"Error de conexión.",time:""}]);});setLd(false);});}
  var last=msgs.length>0?msgs[msgs.length-1]:null;var showFU=last&&last.role==="assistant"&&!ld;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"14px 28px",borderBottom:"1px solid "+BD,background:WH,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white"}}>{agent.icon}</div>
          <div><div style={{fontSize:14,fontWeight:700,color:DARK}}>{agent.name}</div><div style={{fontSize:11,color:DM}}>Mis Agentes &gt; {agent.name}</div></div></div>
      </div>
      <div ref={ref} style={{flex:1,overflowY:"auto",padding:28,display:"flex",flexDirection:"column",gap:14,background:BG}}>
        {msgs.length===0?(<div style={{textAlign:"center",padding:"56px 20px"}} className="au">
          <div style={{width:48,height:48,borderRadius:12,background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:18,fontWeight:700,color:"white"}}>{agent.icon}</div>
          <h3 style={{fontSize:19,fontWeight:700,color:DARK,marginBottom:6}}>{agent.name}</h3>
          <p style={{color:MT,fontSize:14,maxWidth:400,margin:"0 auto 24px",lineHeight:1.5}}>{agent.bio}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {agent.suggestions.map(function(s){return <button key={s} onClick={function(){send(s);}} style={{padding:"9px 18px",borderRadius:99,border:"1px solid "+BD,background:WH,color:SB,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}
              onMouseOver={function(e){e.currentTarget.style.borderColor=PRIMARY;e.currentTarget.style.color=PRIMARY;}}
              onMouseOut={function(e){e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=SB;}}>{s}</button>;})}</div>
        </div>):null}
        {msgs.map(function(m,i){var u=m.role==="user";return(
          <div key={i} style={{display:"flex",justifyContent:u?"flex-end":"flex-start"}} className="as">
            <div style={{maxWidth:"75%"}}><div style={{padding:"14px 18px",fontSize:14,lineHeight:1.75,whiteSpace:"pre-wrap",
              background:u?DARK:WH,color:u?"#FFF":TX,borderRadius:u?"18px 18px 4px 18px":"18px 18px 18px 4px",
              border:u?"none":"1px solid "+BD,boxShadow:u?"none":"0 1px 4px rgba(0,0,0,0.04)"}}>
              {!u?<div style={{fontSize:10,color:PRIMARY,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:0.8,display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:5,height:5,borderRadius:99,background:PRIMARY}}/>{agent.name}</div>:null}
              {m.text}</div></div></div>);})}
        {ld?<div style={{display:"flex",gap:4,padding:"16px 20px",borderRadius:"18px 18px 18px 4px",background:WH,border:"1px solid "+BD,width:"fit-content"}}><div style={{width:6,height:6,borderRadius:99,background:PRIMARY}}/></div>:null}
        {showFU?(<div style={{display:"flex",flexWrap:"wrap",gap:6,paddingLeft:4}} className="ai">
          {agent.suggestions.map(function(s){return <button key={s} onClick={function(){send(s);}} style={{padding:"7px 14px",borderRadius:99,border:"1px solid "+BD,background:WH,color:MT,fontSize:12,cursor:"pointer"}}>{s}</button>;})}
        </div>):null}
      </div>
      <div style={{padding:14,borderTop:"1px solid "+BD,background:WH}}>
        <div style={{display:"flex",gap:10}}>
          <input value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")send();}} placeholder="Escribí tu consulta..." disabled={ld}
            style={{flex:1,padding:"12px 18px",borderRadius:99,border:"1.5px solid "+BD,background:BG,color:TX,fontSize:14,outline:"none"}}/>
          <button onClick={function(){send();}} disabled={ld||!input.trim()}
            style={{width:44,height:44,borderRadius:99,border:"none",background:(!input.trim()||ld)?BD:GRAD,color:(!input.trim()||ld)?DM:"white",cursor:(!input.trim()||ld)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            ►
          </button></div></div>
    </div>);
}

/* ═══ DASHBOARD ═══ */
function Dashboard(props){
  var artist = props.artist;
  var projs = [
    {name: "Luna Roja", step: 4},
    {name: "Llevame Contigo", step: 1},
    {name: "Gira Sur Visuals", step: 2},
    {name: "Fuego Noche (Demo)", step: 0}
  ];
  var steps = ["COMP.", "GRAB.", "PROD.", "MIX", "MASTER", "DELIVERY"];

  return (
    <div style={{padding:32, overflowY:"auto", height:"100%", background:BG}} className="au">
      {/* Header Info */}
      <div style={{display:"flex", alignItems:"center", gap:24, marginBottom:32, background:WH, padding:24, borderRadius:16, border:"1px solid "+BD}}>
        {artist.image ? <img src={artist.image} style={{width:100, height:100, borderRadius:20, objectFit:"cover"}}/> : 
        <div style={{width:100, height:100, borderRadius:20, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, fontWeight:800, color:"white"}}>{artist.name.charAt(0)}</div>}
        <div>
          <h1 style={{fontSize:32, fontWeight:800, color:DARK, letterSpacing:-1}}>{artist.name}</h1>
          <div style={{fontSize:14, color:MT, marginTop:4}}>{artist.genres || artist.genre || "Artista"}</div>
          {artist.listeners && <div style={{display:"inline-block", marginTop:12, padding:"6px 12px", background:AD, borderRadius:8, color:PRIMARY, fontSize:13, fontWeight:600}}>{fmt(artist.listeners)} Oyentes Mensuales</div>}
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20}}>
        {/* Próximos Eventos */}
        <div style={{background:WH, padding:20, borderRadius:16, border:"1px solid "+BD}}>
          <h3 style={{fontSize:16, fontWeight:700, color:DARK, marginBottom:16}}>📅 Próximos Eventos</h3>
          <ul style={{listStyle:"none", fontSize:14, color:SB, display:"flex", flexDirection:"column", gap:12}}>
            <li><span style={{fontWeight:700, color:PRIMARY, display:"inline-block", width:40}}>7/3</span> Show promocional</li>
            <li><span style={{fontWeight:700, color:PRIMARY, display:"inline-block", width:40}}>13/3</span> Grabación Estudio DORADO (8pm)</li>
            <li><span style={{fontWeight:700, color:PRIMARY, display:"inline-block", width:40}}>14/3</span> Shooting "Luna Roja"</li>
          </ul>
        </div>

        {/* Management To-Do */}
        <div style={{background:WH, padding:20, borderRadius:16, border:"1px solid "+BD}}>
          <h3 style={{fontSize:16, fontWeight:700, color:DARK, marginBottom:16}}>☑️ Management</h3>
          <ul style={{listStyle:"none", fontSize:14, color:SB, display:"flex", flexDirection:"column", gap:12}}>
            <li style={{display:"flex", gap:8}}><input type="checkbox" /> Hacer followup con Neo por featuring</li>
            <li style={{display:"flex", gap:8}}><input type="checkbox" /> Definir Makeup artist para video</li>
            <li style={{display:"flex", gap:8}}><input type="checkbox" /> Enviar assets a distribuidora</li>
          </ul>
        </div>
      </div>

      {/* Projects Management */}
      <div style={{background:WH, padding:20, borderRadius:16, border:"1px solid "+BD, marginBottom:20}}>
        <h3 style={{fontSize:16, fontWeight:700, color:DARK, marginBottom:20}}>🚀 Project Management</h3>
        <div style={{display:"flex", flexDirection:"column", gap:16}}>
          {projs.map(p => (
            <div key={p.name}>
              <div style={{fontSize:13, fontWeight:600, color:DARK, marginBottom:8}}>{p.name}</div>
              <div style={{display:"flex", gap:4}}>
                {steps.map((s, i) => (
                  <div key={s} style={{flex:1, textAlign:"center"}}>
                    <div style={{height:6, borderRadius:99, background: i <= p.step ? PRIMARY : BD, marginBottom:6, opacity: i === p.step ? 1 : i < p.step ? 0.4 : 1}}></div>
                    <div style={{fontSize:9, color: i === p.step ? PRIMARY : DM, fontWeight: i === p.step ? 700 : 500}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
        {/* Legales */}
        <div style={{background:WH, padding:20, borderRadius:16, border:"1px solid "+BD, display:"flex", flexDirection:"column", justifyContent:"center"}}>
          <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:12}}>
            <div style={{width:32, height:32, borderRadius:8, background:"rgba(220,38,38,0.1)", color:"#DC2626", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700}}>!</div>
            <h3 style={{fontSize:16, fontWeight:700, color:DARK}}>Alertas Legales</h3>
          </div>
          <p style={{fontSize:14, color:SB, marginBottom:16}}>Tienes <strong>2 documentos</strong> para revisar y firmar con vencimiento el 4/4.</p>
          <button style={{padding:"10px", background:WH, border:"1px solid "+BD, borderRadius:8, fontSize:13, fontWeight:600, color:DARK, cursor:"pointer"}}>Ver documentos</button>
        </div>

        {/* Finanzas */}
        <div style={{background:WH, padding:20, borderRadius:16, border:"1px solid "+BD}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
            <h3 style={{fontSize:16, fontWeight:700, color:DARK}}>💰 Finanzas (Marzo)</h3>
            <span style={{fontSize:11, color:MT, textDecoration:"underline", cursor:"pointer"}}>Filtrar</span>
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:8, marginBottom:16}}>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:13, color:SB}}><span>Regalías Cobradas</span><strong>$1,590</strong></div>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:13, color:SB}}><span>Derechos de Autor</span><strong>$2,543.50</strong></div>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:13, color:SB}}><span>Merch Revenue</span><strong>$3,565</strong></div>
          </div>
          <div style={{borderTop:"1px solid "+BD, paddingTop:12}}>
            <div style={{fontSize:11, fontWeight:700, color:MT, textTransform:"uppercase", marginBottom:8}}>Fees Pendientes</div>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:13, color:SB}}>
              <span>Colaboración Coca-Cola</span><span style={{color:DARK, fontWeight:600}}>$5,000 <span style={{fontSize:10, color:MT}}>(6/5)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModulePreview(props){var m=props.module;return(
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",background:BG,padding:40}}>
    <div className="ac" style={{background:WH,border:"1px solid "+BD,borderRadius:20,padding:48,textAlign:"center",maxWidth:400,boxShadow:"0 4px 24px rgba(0,0,0,0.04)"}}>
      <h3 style={{fontSize:20,fontWeight:700,color:DARK,marginBottom:8}}>{m.name}</h3>
      <p style={{color:MT,fontSize:14,lineHeight:1.5,marginBottom:20}}>Este módulo estará disponible en la versión completa de BACKSTAGE.</p>
      <div style={{padding:"8px 20px",borderRadius:99,background:AD,border:"1px solid "+AB,display:"inline-block",fontSize:12,fontWeight:600,color:PRIMARY}}>Próximamente</div>
    </div></div>);}

/* ═══ APP ═══ */
function AppDashboard(props){
  var artist=props.artist;
  var a=useState("dashboard"),mod=a[0],setMod=a[1];var b=useState("management"),agId=b[0],setAgId=b[1];
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
          <button key={m.id} onClick={function(){setMod(m.id);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",background:act?AD:"transparent",color:act?PRIMARY:MT,fontSize:13,fontWeight:act?600:400,fontFamily:"system-ui,sans-serif"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:5,height:5,borderRadius:99,background:act?PRIMARY:DM}}/>{m.name}</div>
            {!m.active&&m.id!=="agents"&&m.id!=="dashboard"?<span style={{fontSize:9,padding:"2px 7px",borderRadius:99,background:"rgba(0,0,0,0.03)",color:DM}}>Soon</span>:null}
          </button>);})}
        {mod==="agents"?(<div style={{marginTop:6,paddingTop:10,borderTop:"1px solid "+BD}}>
          {AGENTS.map(function(ag){var act=agId===ag.id;return(
            <button key={ag.id} onClick={function(){setAgId(ag.id);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 10px",borderRadius:7,border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",background:act?AD:"transparent",color:act?PRIMARY:DM,fontSize:12,fontFamily:"system-ui,sans-serif"}}>
              <div style={{width:22,height:22,borderRadius:6,background:act?GRAD:"rgba(0,0,0,0.03)",border:act?"none":"1px solid "+BD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:act?"white":DM}}>{ag.icon}</div>
              <div style={{fontWeight:act?600:400}}>{ag.name}</div>
            </button>);})}
        </div>):null}
        <div style={{flex:1}}/>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        {mod==="dashboard"?<Dashboard artist={artist}/>:mod==="agents"?<Chat agent={agent} artist={artist}/>:<ModulePreview module={modObj}/>}
      </div>
    </div>);
}

export default function Home(){
  var a=useState("splash"),scr=a[0],setScr=a[1];var b=useState(null),art=b[0],setArt=b[1];
  if(scr==="splash")return <Splash onStart={function(){setScr("onboard");}}/>;
  if(scr==="onboard"||!art)return <Onboarding onComplete={function(d){setArt(d);setScr("app");}}/>;
  return <AppDashboard artist={art}/>;
}
