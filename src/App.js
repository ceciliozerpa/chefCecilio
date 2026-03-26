import { useState, useEffect, useRef } from "react";

const CATEGORY_VISUAL = {
  Postres:  { emoji: "🍰", bg: "linear-gradient(135deg,#f8c8d4,#f4a0b0)", color: "#8b2252" },
  Carnes:   { emoji: "🥩", bg: "linear-gradient(135deg,#d4846a,#b85c3a)", color: "#3d1a0e" },
  Vegano:   { emoji: "🥗", bg: "linear-gradient(135deg,#a8d8a0,#6bb86a)", color: "#1a4a1a" },
  Pasta:    { emoji: "🍝", bg: "linear-gradient(135deg,#f5d88a,#e8b84b)", color: "#5a3a00" },
  Sopas:    { emoji: "🍲", bg: "linear-gradient(135deg,#f0b97a,#d4844a)", color: "#4a1e00" },
  Desayuno: { emoji: "🥐", bg: "linear-gradient(135deg,#fde9b0,#f5c842)", color: "#5a3a00" },
  General:  { emoji: "👨‍🍳", bg: "linear-gradient(135deg,#c8d8f0,#8aabdc)", color: "#1a2a4a" },
};

function TimerWidget({ category, onClose }) {
  const [seconds, setSeconds] = useState(600);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSeconds(s => { if (s <= 1) { clearInterval(ref.current); setRunning(false); return 0; } return s - 1; });
      }, 1000);
    } else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const pct = ((600 - seconds) / 600) * 100;
  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:999,background:'#0f0f0f',border:'1px solid #2a2a2a',borderRadius:20,padding:'20px 24px',width:210,boxShadow:'0 0 60px rgba(255,90,20,0.2)',fontFamily:'monospace'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <span style={{color:'#ff5a14',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase'}}>⏱ ChefKiKe Timer</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#666',cursor:'pointer',fontSize:16}}>✕</button>
      </div>
      <div style={{textAlign:'center',marginBottom:12}}>
        <div style={{fontSize:42,fontWeight:900,color:seconds===0?'#ff5a14':'#fff',letterSpacing:-2,lineHeight:1}}>{fmt(seconds)}</div>
        <div style={{height:3,background:'#1a1a1a',borderRadius:10,marginTop:10,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#ff5a14,#ff9500)',borderRadius:10,transition:'width 1s linear'}}/>
        </div>
        <p style={{color:'#444',fontSize:9,marginTop:6,textTransform:'uppercase',letterSpacing:2}}>{category}</p>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>setRunning(r=>!r)} style={{flex:1,background:running?'#1a1a1a':'#ff5a14',color:running?'#ff5a14':'#fff',border:running?'1px solid #ff5a14':'none',borderRadius:10,padding:'9px 0',cursor:'pointer',fontWeight:700,fontSize:11,fontFamily:'monospace'}}>
          {running ? '⏸ Pausa' : '▶ Iniciar'}
        </button>
        <button onClick={()=>{setSeconds(600);setRunning(false);}} style={{background:'#1a1a1a',color:'#666',border:'none',borderRadius:10,padding:'9px 12px',cursor:'pointer',fontSize:14}}>↺</button>
      </div>
    </div>
  );
}

function CookingMode({ recipe, onClose }) {
  const [step, setStep] = useState(0);
  const steps = recipe.stepsArray?.length > 0 ? recipe.stepsArray : [recipe.steps];
  const vis = CATEGORY_VISUAL[recipe.category] || CATEGORY_VISUAL.General;
  return (
    <div style={{position:'fixed',inset:0,background:'#080808',zIndex:200,display:'flex',flexDirection:'column',overflowY:'auto'}}>
      <div style={{padding:'24px 36px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:46,height:46,borderRadius:14,background:vis.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{vis.emoji}</div>
          <div>
            <span style={{color:'#ff5a14',fontSize:10,letterSpacing:4,fontFamily:'monospace',textTransform:'uppercase'}}>Modo Cocina</span>
            <h1 style={{color:'#fff',fontSize:22,fontWeight:900,margin:'3px 0 0',fontStyle:'italic',fontFamily:'Georgia,serif'}}>{recipe.title}</h1>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{color:'#444',fontSize:13,fontFamily:'monospace'}}>{step+1} / {steps.length}</span>
          <button onClick={onClose} style={{background:'#1a1a1a',border:'none',color:'#fff',borderRadius:'50%',width:44,height:44,cursor:'pointer',fontSize:18}}>✕</button>
        </div>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px'}}>
        <div style={{maxWidth:760,width:'100%',borderLeft:'6px solid #ff5a14',paddingLeft:36}}>
          <p style={{fontSize:'clamp(22px,3.5vw,46px)',color:'#f0f0f0',lineHeight:1.6,fontStyle:'italic',fontWeight:400,margin:0,fontFamily:'Georgia,serif'}}>{steps[step]}</p>
        </div>
      </div>
      <div style={{padding:'20px 36px',borderTop:'1px solid #1a1a1a',display:'flex',gap:8,justifyContent:'center'}}>
        {steps.map((_,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{width:i===step?28:10,height:10,borderRadius:10,background:i===step?'#ff5a14':i<step?'#2a2a2a':'#1a1a1a',border:'none',cursor:'pointer',transition:'all 0.3s'}}/>
        ))}
      </div>
      <div style={{padding:'0 36px 28px',display:'flex',gap:12,justifyContent:'center'}}>
        <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} style={{background:'#1a1a1a',color:step===0?'#333':'#fff',border:'none',borderRadius:14,padding:'12px 28px',fontSize:13,fontWeight:700,cursor:step===0?'default':'pointer',fontFamily:'monospace'}}>← Anterior</button>
        <button onClick={()=>setStep(Math.min(steps.length-1,step+1))} disabled={step===steps.length-1} style={{background:step===steps.length-1?'#1a1a1a':'#ff5a14',color:'#fff',border:'none',borderRadius:14,padding:'12px 28px',fontSize:13,fontWeight:700,cursor:step===steps.length-1?'default':'pointer',fontFamily:'monospace'}}>
          {step===steps.length-1 ? '✓ ¡Listo!' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
}

export default function ChefKiKe() {
  const [url, setUrl] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipe = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(null); setRecipe(null);
    const prompt = `Eres ChefKiKe, un asistente culinario experto. El usuario quiere esta receta: "${url}"
Devuelve ÚNICAMENTE un JSON válido sin markdown ni texto extra:
{
  "title": "Nombre de la receta",
  "category": "una de: Postres, Carnes, Vegano, Pasta, Sopas, Desayuno, General",
  "ingredients": ["ingrediente 1 con cantidad","ingrediente 2","ingrediente 3","ingrediente 4","ingrediente 5","ingrediente 6"],
  "stepsArray": ["Paso 1: descripción","Paso 2: descripción","Paso 3: descripción","Paso 4: descripción"],
  "steps": "Resumen breve en 2 oraciones.",
  "tips": "Un tip profesional específico."
}`;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
      });
      const data = await res.json();
      const text = (data.content||[]).map(i=>i.text||'').join('');
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
      setRecipe(parsed); setShowTimer(true);
    } catch(e) { setError('No pude analizar esa receta. Intenta con otra descripción.'); }
    finally { setLoading(false); }
  };

  const vis = recipe ? (CATEGORY_VISUAL[recipe.category] || CATEGORY_VISUAL.General) : null;

  return (
    <div style={{minHeight:'100vh',background:'#f7f3ee',fontFamily:'Georgia,sans-serif',padding:'36px 16px 140px'}}>
      <div style={{textAlign:'center',marginBottom:44}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:10}}>
          <span style={{fontSize:18}}>🔥</span>
          <span style={{fontFamily:'monospace',fontSize:10,letterSpacing:4,color:'#aaa',textTransform:'uppercase'}}>Biblioteca Culinaria IA</span>
        </div>
        <h1 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontWeight:900,fontSize:'clamp(44px,9vw,78px)',color:'#1a1a1a',lineHeight:1,letterSpacing:-2,margin:0}}>
          Chef<span style={{color:'#ff5a14'}}>KiKe</span>
        </h1>
        <p style={{color:'#bbb',fontSize:11,fontFamily:'monospace',marginTop:10,letterSpacing:2}}>50,000 recetas · extracción inteligente · modo cocina</p>
      </div>

      <div style={{maxWidth:620,margin:'0 auto 44px',display:'flex',gap:10}}>
        <input style={{flex:1,padding:'15px 18px',borderRadius:14,border:'2px solid #e8e0d6',background:'#fff',fontSize:14,color:'#1a1a1a',fontFamily:'inherit',outline:'none'}}
          placeholder="Ej: pasta carbonara, tacos de pollo, tiramisú…"
          value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchRecipe()}
          onFocus={e=>e.target.style.boxShadow='0 0 0 2px #ff5a14'} onBlur={e=>e.target.style.boxShadow='none'}/>
        <button onClick={fetchRecipe} disabled={loading} style={{background:'#ff5a14',color:'#fff',border:'none',borderRadius:14,padding:'0 24px',fontWeight:700,fontSize:13,cursor:loading?'wait':'pointer',whiteSpace:'nowrap',fontFamily:'monospace',letterSpacing:1,opacity:loading?.7:1}}>
          {loading ? 'Analizando…' : '→ Extraer'}
        </button>
      </div>

      {error && <div style={{maxWidth:620,margin:'0 auto 28px',background:'#fff0ec',border:'1px solid #ffc4aa',borderRadius:12,padding:'13px 18px',color:'#c0390a',fontSize:13,textAlign:'center'}}>{error}</div>}

      {loading && (
        <div style={{textAlign:'center',padding:'60px 0'}}>
          <div style={{width:50,height:50,borderRadius:'50%',border:'3px solid #edddd0',borderTopColor:'#ff5a14',margin:'0 auto 16px',animation:'spin 0.8s linear infinite'}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{color:'#bbb',fontFamily:'monospace',fontSize:11,letterSpacing:3}}>ANALIZANDO RECETA…</p>
        </div>
      )}

      {recipe && vis && (
        <div style={{maxWidth:760,margin:'0 auto',background:'#fff',borderRadius:26,overflow:'hidden',boxShadow:'0 20px 80px rgba(0,0,0,0.09)',border:'1px solid #ede6dc'}}>
          <div style={{height:240,background:vis.bg,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
            <div style={{position:'absolute',width:300,height:300,borderRadius:'50%',background:'rgba(255,255,255,0.1)',top:-80,left:-60}}/>
            <div style={{position:'absolute',width:200,height:200,borderRadius:'50%',background:'rgba(255,255,255,0.08)',bottom:-60,right:-40}}/>
            <div style={{fontSize:100,lineHeight:1,zIndex:1,filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.12))',userSelect:'none'}}>{vis.emoji}</div>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.45))'}}/>
            <div style={{position:'absolute',bottom:20,left:24,right:24,display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:12}}>
              <div>
                <span style={{background:'rgba(255,255,255,0.2)',color:'#fff',padding:'3px 12px',borderRadius:30,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:'uppercase',fontFamily:'monospace',border:'1px solid rgba(255,255,255,0.3)'}}>{recipe.category}</span>
                <h2 style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'clamp(18px,3vw,26px)',color:'#fff',fontWeight:700,lineHeight:1.2,textShadow:'0 2px 8px rgba(0,0,0,0.3)',margin:'6px 0 0'}}>{recipe.title}</h2>
              </div>
              <button onClick={()=>setCookingMode(true)} style={{background:'rgba(255,255,255,0.95)',border:'none',borderRadius:12,padding:'9px 15px',display:'flex',alignItems:'center',gap:7,fontWeight:700,fontSize:11,cursor:'pointer',color:'#1a1a1a',fontFamily:'monospace',whiteSpace:'nowrap',flexShrink:0}}>⛶ COCINAR</button>
            </div>
          </div>
          <div style={{padding:'32px'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}}>
              <div>
                <h3 style={{fontSize:10,fontWeight:700,letterSpacing:3,color:'#ff5a14',textTransform:'uppercase',fontFamily:'monospace',margin:'0 0 14px',paddingBottom:10,borderBottom:'1px solid #f0e8de'}}>🍴 Ingredientes</h3>
                <ul style={{listStyle:'none',color:'#555',fontSize:14,lineHeight:1.9,padding:0,margin:0}}>
                  {(recipe.ingredients||[]).map((ing,i)=>(
                    <li key={i} style={{paddingLeft:14,position:'relative'}}><span style={{position:'absolute',left:0,color:'#ff5a14',fontWeight:900}}>·</span>{ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{fontSize:10,fontWeight:700,letterSpacing:3,color:'#ff5a14',textTransform:'uppercase',fontFamily:'monospace',margin:'0 0 14px',paddingBottom:10,borderBottom:'1px solid #f0e8de'}}>Preparación</h3>
                <p style={{color:'#666',fontSize:13.5,lineHeight:1.85,fontStyle:'italic',fontFamily:'Georgia,serif',margin:'0 0 16px'}}>{recipe.steps}</p>
                {recipe.tips && (
                  <div style={{background:'#fff8f4',borderLeft:'4px solid #ff5a14',borderRadius:10,padding:'11px 13px'}}>
                    <p style={{fontSize:12,color:'#c0500a',lineHeight:1.65,margin:0}}><strong style={{fontFamily:'monospace',fontSize:10}}>✦ TIP: </strong>{recipe.tips}</p>
                  </div>
                )}
              </div>
            </div>
            {recipe.stepsArray?.length > 1 && (
              <div style={{marginTop:28,paddingTop:24,borderTop:'1px solid #f0e8de'}}>
                <h3 style={{fontSize:10,fontWeight:700,letterSpacing:3,color:'#bbb',textTransform:'uppercase',fontFamily:'monospace',margin:'0 0 16px'}}>Paso a paso</h3>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {recipe.stepsArray.map((s,i)=>(
                    <div key={i} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                      <span style={{minWidth:28,height:28,background:vis.bg,color:vis.color,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,fontFamily:'monospace',flexShrink:0}}>{i+1}</span>
                      <p style={{fontSize:13.5,color:'#555',lineHeight:1.75,paddingTop:3,margin:0}}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showTimer && recipe && <TimerWidget category={recipe.category} onClose={()=>setShowTimer(false)}/>}
      {cookingMode && recipe && <CookingMode recipe={recipe} onClose={()=>setCookingMode(false)}/>}
    </div>
  );
}
