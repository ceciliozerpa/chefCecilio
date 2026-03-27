import React, { useState, useEffect, useRef } from "react";

// --- CONSTANTES DE ARQUITECTURA ---
const CATEGORY_VISUAL = {
  Postres:  { emoji: "🍰", bg: "linear-gradient(135deg,#f8c8d4,#f4a0b0)", color: "#8b2252" },
  Carnes:   { emoji: "🥩", bg: "linear-gradient(135deg,#d4846a,#b85c3a)", color: "#3d1a0e" },
  Vegano:   { emoji: "🥗", bg: "linear-gradient(135deg,#a8d8a0,#6bb86a)", color: "#1a4a1a" },
  Pasta:    { emoji: "🍝", bg: "linear-gradient(135deg,#f5d88a,#e8b84b)", color: "#5a3a00" },
  Sopas:    { emoji: "🍲", bg: "linear-gradient(135deg,#f0b97a,#d4844a)", color: "#4a1e00" },
  Desayuno: { emoji: "🥐", bg: "linear-gradient(135deg,#fde9b0,#f5c842)", color: "#5a3a00" },
  General:  { emoji: "👨‍🍳", bg: "linear-gradient(135deg,#c8d8f0,#8aabdc)", color: "#1a2a4a" },
};

// --- COMPONENTE TIMER ---
function TimerWidget({ category, onClose }) {
  const [seconds, setSeconds] = useState(600);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:999,background:'#0f0f0f',border:'1px solid #2a2a2a',borderRadius:20,padding:'20px 24px',width:210,boxShadow:'0 0 60px rgba(255,90,20,0.2)',color:'#fff',fontFamily:'monospace'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
        <span style={{color:'#ff5a14',fontSize:9,fontWeight:700}}>⏱ TIMER CHEFKIKE</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#666',cursor:'pointer'}}>✕</button>
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:42,fontWeight:900}}>{formatTime(seconds)}</div>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button onClick={() => setRunning(!running)} style={{flex:1,background:'#ff5a14',border:'none',color:'#fff',borderRadius:10,padding:'9px',cursor:'pointer',fontWeight:700}}>
            {running ? 'PAUSA' : 'INICIAR'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ORQUESTADOR PRINCIPAL ---
export default function ChefKiKe() {
  const [url, setUrl] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // Llamamos a nuestra API local en Vercel
      const response = await fetch('/api/extract', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json();
      
      // La IA devuelve el texto en data.content[0].text. Lo convertimos a objeto.
      const rawText = data.content[0].text;
      const cleanJson = JSON.parse(rawText.replace(/```json|```/g, '').trim());
      
      setRecipe(cleanJson);
    } catch (e) {
      setError("No pude extraer la receta. Verifica que tu API_KEY esté bien configurada en Vercel.");
      console.error("Architect Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const vis = recipe ? (CATEGORY_VISUAL[recipe.category] || CATEGORY_VISUAL.General) : null;

  return (
    <div style={{minHeight:'100vh',background:'#f7f3ee',padding:'36px 16px',fontFamily:'Georgia,serif'}}>
      <div style={{textAlign:'center',marginBottom:44}}>
        <h1 style={{fontSize:'clamp(40px,8vw,70px)',fontWeight:900,fontStyle:'italic',margin:0}}>
          Chef<span style={{color:'#ff5a14'}}>KiKe</span>
        </h1>
        <p style={{color:'#aaa',fontSize:10,letterSpacing:2}}>EXTRACCIÓN INTELIGENTE DE RECETAS</p>
      </div>

      <div style={{maxWidth:600,margin:'0 auto 40px',display:'flex',gap:10}}>
        <input 
          style={{flex:1,padding:16,borderRadius:14,border:'2px solid #ddd',fontSize:14}}
          placeholder="Pega el enlace de la receta aquí..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleFetch}
          disabled={loading}
          style={{background:'#ff5a14',color:'#fff',padding:'0 24px',borderRadius:14,border:'none',fontWeight:700,cursor:loading?'wait':'pointer'}}
        >
          {loading ? 'Analizando...' : 'Extraer'}
        </button>
      </div>

      {error && <div style={{maxWidth:600,margin:'0 auto 20px',color:'red',textAlign:'center',background:'#fee',padding:10,borderRadius:10}}>{error}</div>}

      {recipe && vis && (
        <div style={{maxWidth:700,margin:'0 auto',background:'#fff',borderRadius:24,boxShadow:'0 10px 40px rgba(0,0,0,0.1)',overflow:'hidden'}}>
           <div style={{background: vis.bg, padding: 40, textAlign: 'center'}}>
              <div style={{fontSize: 80}}>{vis.emoji}</div>
              <h2 style={{color: '#fff', fontSize: 32, margin: '10px 0 0'}}>{recipe.title}</h2>
           </div>
           <div style={{padding: 30}}>
              <h3 style={{color: '#ff5a14', fontSize: 12, letterSpacing: 2}}>INGREDIENTES</h3>
              <ul style={{lineHeight: 1.8}}>
                {recipe.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
              <h3 style={{color: '#ff5a14', fontSize: 12, letterSpacing: 2, marginTop: 20}}>PASOS</h3>
              <ol style={{lineHeight: 1.8}}>
                {recipe.stepsArray?.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
           </div>
        </div>
      )}
      
      {recipe && <TimerWidget category={recipe.category} onClose={() => setRecipe(null)} />}
    </div>
  );
}
