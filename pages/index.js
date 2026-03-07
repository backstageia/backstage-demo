import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   CONFIGURACIÓN DE AGENTES
   ═══════════════════════════════════════════════════════════════════ */

var AGENTS = [
  { id:"marketing", name:"Mkt. & Lanzamientos", bio:"Estrategia de releases, calendarios y crecimiento de audiencia", suggestions:["Armame un plan de lanzamiento","Mejor día para lanzar un single","Estrategia con bajo presupuesto"],
    prompt:"Sos el agente de Marketing y Lanzamientos de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en marketing musical en Latinoamérica.\n\nFRAMEWORK DE LANZAMIENTO:\nT-30: Preparación (máster, artwork, distribuidor, pitch editorial Spotify for Artists mínimo 3-4 semanas antes)\nT-21: Pre-anuncio (primer teaser redes, pre-save link, EPK a medios)\nT-14: Calentamiento (segundo teaser, push pre-save fuerte, curadores playlists, ads si hay budget)\nT-7: Intensivo (contenido diario, countdown, teaser final)\nT-0: Launch day (publicar todas redes, activar campaña)\nT+7: Post-release (analizar números, contenido reactivo, segundo push)\n\nAdaptá el timeline al tamaño del artista. Priorizá acciones orgánicas. Sé directo.\nSpotify: pitch editorial mínimo 7 días antes. Jueves/viernes mejores. Release Radar ~28 días.\nInstagram: Reels 15-30s. Horarios LATAM: 12-14hs y 19-22hs.\nTikTok: 15-30s, hook primeros 2 segundos.\n\nBIBLIOGRAFÍA:\n" },
  { id:"pr", name:"PR & Prensa", bio:"Press releases, pitching a medios y relación con prensa", suggestions:["Escribime un press release","Pitch email para blogs","Medios target para mi género"],
    prompt:"Sos el agente de PR y Prensa de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en relaciones públicas musicales.\n\nPRESS RELEASE: Titular con gancho, Subtítulo, P1 (quién/qué/cuándo), P2 (story), P3 (contexto artista), Quote, Datos técnicos, Assets, Contacto.\nPITCH EMAIL: Máximo 150 palabras. Asunto corto. Saludo personalizado. NUNCA adjuntar archivos pesados.\nMedios LATAM: Indie Rocks (MX), La Heavy (AR), Cultura Colectiva, Rolling Stone LATAM, Billboard Argentina, Indie Hoy, Club Fonograma.\n\nBIBLIOGRAFÍA:\n" },
  { id:"social", name:"Social Media", bio:"Calendarios de contenido, ideas de reels, TikToks y estrategia", suggestions:["Calendario semanal","Ideas de reels para mi single","Frecuencia ideal"],
    prompt:"Sos el agente de Social Media de BACKSTAGE. Fuiste diseñado por profesionales con experiencia real en contenido para artistas.\n\nPILARES: Música (40%), Personalidad (30%), Comunidad (20%), Negocio (10%).\nINSTAGRAM: Reels 15-30s, carruseles, stories diarias. 4-5 reels/semana.\nTIKTOK: 15-30s, hook 2 seg. 3-5/semana.\nSé ultra específico: qué filmar, qué texto, qué audio, qué caption.\n\nBIBLIOGRAFÍA:\n" },
  { id:"branding", name:"Branding & Visual", bio:"Identidad visual, paleta de colores y dirección artística", suggestions:["Identidad visual completa","Paleta de colores","Tipografía recomendada"],
    prompt:"Sos el agente de Branding de BACKSTAGE. Fuiste diseñado por profesionales con experiencia en dirección artística musical.\n\nPILARES: Esencia de marca, Paleta (3-5 colores con hex), Tipografía (Google Fonts), Dirección fotográfica, Artwork.\nHerramientas: Canva, Coolors.co, Google Fonts. Siempre dá hex específicos y nombres de fuentes reales.\n\nBIBLIOGRAFÍA:\n" },
  { id:"legal", name:"Legal & Contratos", bio:"Derechos de autor, contratos y protección del artista", suggestions:["Revisar contrato con sello","Qué es un split sheet","Red flags en contratos"],
    prompt:"Sos el agente Legal de BACKSTAGE. NO sos abogado, siempre aclarás que debe consultar un profesional.\n\nCONTRATOS: Distribución, Sello (CUIDADO cesión perpetua), Management (15-20%), Split sheet, Producción, Feat, Sync, Booking.\nRED FLAGS: cesión perpetuidad, deals 360, exclusividad mundial, mas de 3 años sin salida, advances recoupables, royalties menores a 15-20%.\n\nBIBLIOGRAFÍA:\n" },
  { id:"merch", name:"Merch & Tienda", bio:"Productos, producción, pricing y venta de merchandising", suggestions:["Qué productos vender","Cuánto cobrar por remera","Plan de lanzamiento merch"],
    prompt:"Sos el agente de Merch de BACKSTAGE. Experiencia real en producción textil y e-commerce para artistas.\n\nPRODUCTOS: Remeras (60-75% margen), Hoodies, Gorras, Tote bags, Stickers.\nPRODUCCIÓN: DTF (1-100u), Serigrafía (100+), POD (cero riesgo).\nPRICING: Costo x3-4. Remera USD 3-5 costo, venta 12-20.\nVENTA: Shows (10-20% conv), online, drops limitados, bundles.\n\nBIBLIOGRAFÍA:\n" },
];

function buildSystemPrompt(agent, artist) {
  var ctx = "";
  if (artist) {
    ctx = "\n\nCONTEXTO DEL ARTISTA:";
    ctx += "\n- Nombre: " + (artist.name || "No especificado");
    ctx += "\n- Género: " + (artist.genres || artist.genre || "No especificado");
    if (artist.followers) ctx += "\n- Seguidores Spotify: " + artist.followers;
    if (artist.popularity) ctx += "\n- Popularidad Spotify: " + artist.popularity + "/100";
    if (artist.listeners) ctx += "\n- Oyentes mensuales: " + artist.listeners;
    if (artist.topTracks) ctx += "\n- Top tracks: " + artist.topTracks;
    if (artist.relatedArtists) ctx += "\n- Artistas similares: " + artist.relatedArtists;
    if (artist.cities) ctx += "\n- Top ciudades: " + artist.cities;
    if (artist.instagram) ctx += "\n- Instagram: " + artist.instagram;
    ctx += "\n- Objetivo: " + (artist.goal || "No especificado");
  }
  return agent.prompt + ctx + "\n\nRespondé en español. Sé directo, práctico y accionable. Tono profesional pero cercano.";
}

var BG="#F7F6F3",WH="#FFFFFF",BD="#DDD9D4",AC="#C2410C",AD="rgba(194,65,12,0.06)",AB="rgba(194,65,12,0.15)",TX="#1A1917",SB="#5C5850",MT="#8C857B",DM="#B0A99F";

function formatNumber(n) {
  if (!n && n !== 0) return "—";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

/* ─── HYBRID ONBOARDING: Spotify search + manual fallback ─── */
function Onboarding(props) {
  var s1=useState("search"),step=s1[0],setStep=s1[1];
  // search | results | manual | goal
  var s2=useState(""),query=s2[0],setQuery=s2[1];
  var s3=useState([]),results=s3[0],setResults=s3[1];
  var s4=useState(false),loading=s4[0],setLoading=s4[1];
  var s5=useState(null),selected=s5[0],setSelected=s5[1];
  var s6=useState(""),goal=s6[0],setGoal=s6[1];
  var s7=useState(false),spotifyError=s7[0],setSpotifyError=s7[1];
  // Manual fields
  var s8=useState(""),mName=s8[0],setMName=s8[1];
  var s9=useState(""),mGenre=s9[0],setMGenre=s9[1];
  var s10=useState(""),mListeners=s10[0],setMListeners=s10[1];
  var s11=useState(""),mCities=s11[0],setMCities=s11[1];
  var s12=useState(""),mIG=s12[0],setMIG=s12[1];

  function search() {
    if (!query.trim() || loading) return;
    setLoading(true);
    setResults([]);
    setSpotifyError(false);
    fetch("/api/spotify?q=" + encodeURIComponent(query.trim()))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) {
          setSpotifyError(true);
          setStep("results");
          setLoading(false);
          return;
        }
        setResults(data.artists || []);
        setStep("results");
        setLoading(false);
      })
      .catch(function() {
        setSpotifyError(true);
        setStep("results");
        setLoading(false);
      });
  }

  function selectArtist(artist) {
    setLoading(true);
    fetch("/api/spotify?id=" + artist.id)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var full = {
          id: artist.id,
          name: artist.name,
          image: artist.image,
          genres: "",
          followers: artist.followers,
          popularity: artist.popularity,
          topTracks: "",
          relatedArtists: "",
        };
        if (data.artist && data.artist.genres) {
          full.genres = data.artist.genres.join(", ");
        } else if (artist.genres && artist.genres.length > 0) {
          full.genres = artist.genres.join(", ");
        }
        if (data.artist && data.artist.followers) {
          full.followers = data.artist.followers.total;
        }
        if (data.artist) {
          full.popularity = data.artist.popularity;
        }
        if (data.topTracks && data.topTracks.length > 0) {
          full.topTracks = data.topTracks.map(function(t) { return t.name; }).join(", ");
        }
        if (data.relatedArtists && data.relatedArtists.length > 0) {
          full.relatedArtists = data.relatedArtists.map(function(a) { return a.name; }).join(", ");
        }
        setSelected(full);
        setStep("goal");
        setLoading(false);
      })
      .catch(function() {
        // If detail fetch fails, use what we have
        setSelected({
          name: artist.name,
          image: artist.image,
          genres: artist.genres ? artist.genres.join(", ") : "",
          followers: artist.followers,
          popularity: artist.popularity,
        });
        setStep("goal");
        setLoading(false);
      });
  }

  function goManual() {
    setMName(query || "");
    setStep("manual");
  }

  function finishManual() {
    if (!mName.trim()) return;
    setSelected({
      name: mName,
      genre: mGenre,
      listeners: mListeners,
      cities: mCities,
      instagram: mIG,
    });
    setStep("goal");
  }

  function finish() {
    if (!selected) return;
    selected.goal = goal;
    props.onComplete(selected);
  }

  return (
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:40,color:TX,fontFamily:"system-ui,sans-serif"}}>
      <div style={{maxWidth:560,width:"100%"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:56}}>
          <div style={{width:10,height:10,borderRadius:99,background:AC}}/>
          <span style={{fontWeight:800,fontSize:22,letterSpacing:-0.5}}>BACKSTAGE</span>
        </div>

        {/* ─── SEARCH ─── */}
        {step === "search" && (
          <div>
            <h1 style={{fontSize:36,fontWeight:800,letterSpacing:-2,lineHeight:1.05,marginBottom:16}}>Buscá tu artista<br/>en Spotify.</h1>
            <p style={{color:SB,fontSize:16,marginBottom:32,lineHeight:1.6}}>Conectamos tu perfil de Spotify para que los agentes IA trabajen con tu data real.</p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <input autoFocus value={query} onChange={function(e){setQuery(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")search();}} placeholder="Nombre del artista..."
                style={{flex:1,padding:"14px 20px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:16,outline:"none"}}/>
              <button onClick={search} disabled={loading||!query.trim()} style={{padding:"14px 28px",background:(!query.trim()||loading)?BD:AC,color:(!query.trim()||loading)?DM:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:(!query.trim()||loading)?"not-allowed":"pointer"}}>
                {loading?"Buscando...":"Buscar"}
              </button>
            </div>
            <button onClick={function(){setMName("");setStep("manual");}} style={{background:"none",border:"none",color:MT,fontSize:13,cursor:"pointer",padding:0,textDecoration:"underline"}}>
              Ingresar datos manualmente
            </button>
          </div>
        )}

        {/* ─── RESULTS (Spotify or error) ─── */}
        {step === "results" && (
          <div>
            {spotifyError ? (
              <div>
                <h2 style={{fontSize:24,fontWeight:700,letterSpacing:-0.8,marginBottom:8}}>Spotify no disponible</h2>
                <p style={{color:MT,fontSize:14,marginBottom:6}}>La conexión con Spotify no está activa en este momento.</p>
                <p style={{color:MT,fontSize:14,marginBottom:24}}>Podés ingresar tus datos manualmente.</p>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={goManual} style={{padding:"12px 28px",background:AC,color:"white",border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:"pointer"}}>Ingresar datos manualmente</button>
                  <button onClick={function(){setStep("search");setQuery("");setSpotifyError(false);}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Reintentar</button>
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{fontSize:24,fontWeight:700,letterSpacing:-0.8,marginBottom:8}}>Seleccioná tu perfil</h2>
                <p style={{color:MT,fontSize:14,marginBottom:24}}>Resultados para "{query}"</p>

                {results.length === 0 && !loading && (
                  <div style={{textAlign:"center",padding:"32px 0",color:MT}}>
                    <p style={{fontSize:15,marginBottom:16}}>No se encontraron resultados.</p>
                  </div>
                )}

                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {results.map(function(a) {
                    return (
                      <button key={a.id} onClick={function(){selectArtist(a);}} disabled={loading} style={{display:"flex",alignItems:"center",gap:16,padding:16,background:WH,border:"1px solid "+BD,borderRadius:14,cursor:loading?"wait":"pointer",textAlign:"left",width:"100%"}}>
                        {a.image ? (
                          <img src={a.image} alt="" style={{width:56,height:56,borderRadius:12,objectFit:"cover",flexShrink:0}} />
                        ) : (
                          <div style={{width:56,height:56,borderRadius:12,background:AD,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={AC} strokeWidth={2}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                          </div>
                        )}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:15,fontWeight:600,color:TX}}>{a.name}</div>
                          <div style={{fontSize:12,color:MT,marginTop:2}}>{a.genres && a.genres.length > 0 ? a.genres.slice(0,3).join(", ") : "Sin género"}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:14,fontWeight:700,color:TX}}>{formatNumber(a.followers)}</div>
                          <div style={{fontSize:10,color:DM}}>seguidores</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div style={{marginTop:20,display:"flex",gap:10}}>
                  <button onClick={function(){setStep("search");setQuery("");}} style={{padding:"10px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Buscar otro</button>
                  <button onClick={goManual} style={{padding:"10px 24px",background:"transparent",color:MT,border:"none",fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Ingresar manualmente</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── MANUAL ENTRY ─── */}
        {step === "manual" && (
          <div>
            <h2 style={{fontSize:28,fontWeight:700,letterSpacing:-1,marginBottom:8}}>Ingresá tus datos</h2>
            <p style={{color:MT,fontSize:14,marginBottom:28}}>Solo el nombre es obligatorio. El resto ayuda a personalizar las recomendaciones.</p>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6}}>Nombre artístico <span style={{color:AC}}>*</span></label>
              <input autoFocus value={mName} onChange={function(e){setMName(e.target.value);}} placeholder="Ej: Luna Roja"
                style={{width:"100%",padding:"14px 18px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6}}>Género musical</label>
              <input value={mGenre} onChange={function(e){setMGenre(e.target.value);}} placeholder="Ej: Trap, Indie Rock, Pop Urbano"
                style={{width:"100%",padding:"14px 18px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6}}>Oyentes mensuales</label>
                <input value={mListeners} onChange={function(e){setMListeners(e.target.value);}} placeholder="Ej: 5.000"
                  style={{width:"100%",padding:"14px 18px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6}}>Instagram</label>
                <input value={mIG} onChange={function(e){setMIG(e.target.value);}} placeholder="Ej: @lunaroja"
                  style={{width:"100%",padding:"14px 18px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/>
              </div>
            </div>
            <div style={{marginBottom:24}}>
              <label style={{fontSize:12,fontWeight:600,color:MT,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6}}>Ciudades principales</label>
              <input value={mCities} onChange={function(e){setMCities(e.target.value);}} placeholder="Ej: Buenos Aires, CDMX, Bogotá"
                style={{width:"100%",padding:"14px 18px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none"}}/>
            </div>

            <div style={{display:"flex",gap:10}}>
              <button onClick={finishManual} disabled={!mName.trim()} style={{padding:"12px 32px",background:!mName.trim()?BD:AC,color:!mName.trim()?DM:"white",border:"none",borderRadius:99,fontSize:14,fontWeight:700,cursor:!mName.trim()?"not-allowed":"pointer"}}>Continuar</button>
              <button onClick={function(){setStep("search");}} style={{padding:"12px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Volver a buscar</button>
            </div>
          </div>
        )}

        {/* ─── GOAL (final step after Spotify or manual) ─── */}
        {step === "goal" && selected && (
          <div>
            {/* Selected artist card */}
            <div style={{display:"flex",alignItems:"center",gap:16,padding:20,background:WH,border:"1px solid "+BD,borderRadius:16,marginBottom:24}}>
              {selected.image ? (
                <img src={selected.image} alt="" style={{width:64,height:64,borderRadius:14,objectFit:"cover"}} />
              ) : (
                <div style={{width:64,height:64,borderRadius:14,background:AD,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={AC} strokeWidth={2}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
              )}
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:700,color:TX}}>{selected.name}</div>
                <div style={{fontSize:13,color:MT,marginTop:2}}>{selected.genres || selected.genre || "Sin género"}</div>
                {selected.followers ? (
                  <div style={{display:"flex",gap:16,marginTop:6}}>
                    <span style={{fontSize:12,color:SB}}><strong>{formatNumber(selected.followers)}</strong> seguidores</span>
                    {selected.popularity ? <span style={{fontSize:12,color:SB}}>Popularidad: <strong>{selected.popularity}/100</strong></span> : null}
                  </div>
                ) : null}
                {selected.listeners ? (
                  <div style={{fontSize:12,color:SB,marginTop:4}}>{selected.listeners} oyentes/mes</div>
                ) : null}
              </div>
              <div style={{width:8,height:8,borderRadius:99,background:"#047857"}}/>
            </div>

            {selected.topTracks ? (
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:MT,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:600}}>Top tracks</div>
                <div style={{fontSize:13,color:SB,lineHeight:1.6}}>{selected.topTracks}</div>
              </div>
            ) : null}

            {selected.relatedArtists ? (
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:MT,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:600}}>Artistas similares</div>
                <div style={{fontSize:13,color:SB,lineHeight:1.6}}>{selected.relatedArtists}</div>
              </div>
            ) : null}

            <h2 style={{fontSize:22,fontWeight:700,letterSpacing:-0.5,marginBottom:8}}>Una última cosa</h2>
            <p style={{color:MT,fontSize:14,marginBottom:16}}>¿Cuál es tu objetivo principal en los próximos 6 meses? (opcional)</p>
            <input autoFocus value={goal} onChange={function(e){setGoal(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")finish();}}
              placeholder="Ej: Llegar a 10K oyentes, lanzar EP, primer show..."
              style={{width:"100%",padding:"14px 20px",borderRadius:12,border:"1.5px solid "+BD,background:WH,color:TX,fontSize:15,outline:"none",marginBottom:24}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={finish} style={{padding:"14px 36px",background:AC,color:"white",border:"none",borderRadius:99,fontSize:15,fontWeight:700,cursor:"pointer"}}>Entrar a BACKSTAGE</button>
              <button onClick={function(){setStep("search");setQuery("");setSelected(null);setSpotifyError(false);}} style={{padding:"14px 24px",background:"transparent",color:MT,border:"1px solid "+BD,borderRadius:99,fontSize:14,cursor:"pointer"}}>Cambiar artista</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CHAT ─── */
function Chat(props) {
  var agent=props.agent,artist=props.artist;
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

/* ─── APP ─── */
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
        {/* Artist card */}
        <div style={{padding:16,background:BG,borderRadius:14,border:"1px solid "+BD}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            {artist.image ? (
              <img src={artist.image} alt="" style={{width:40,height:40,borderRadius:10,objectFit:"cover"}}/>
            ) : (
              <div style={{width:40,height:40,borderRadius:10,background:AC,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              </div>
            )}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{artist.name}</div>
              <div style={{fontSize:11,color:MT,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{artist.genres||artist.genre||"Sin género"}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:12}}>
            {artist.followers ? <div><div style={{fontSize:14,fontWeight:700}}>{formatNumber(artist.followers)}</div><div style={{fontSize:10,color:DM}}>seguidores</div></div> : null}
            {artist.popularity ? <div><div style={{fontSize:14,fontWeight:700}}>{artist.popularity}/100</div><div style={{fontSize:10,color:DM}}>popularidad</div></div> : null}
            {artist.listeners ? <div><div style={{fontSize:14,fontWeight:700}}>{artist.listeners}</div><div style={{fontSize:10,color:DM}}>oyentes/mes</div></div> : null}
          </div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}><Chat agent={agent} artist={artist}/></div></div>);
}

/* ─── PAGE ─── */
export default function Home() {
  var aa=useState(null),artist=aa[0],setArtist=aa[1];
  if(!artist)return <Onboarding onComplete={function(d){setArtist(d);}}/>;
  return <AppDashboard artist={artist}/>;
}
