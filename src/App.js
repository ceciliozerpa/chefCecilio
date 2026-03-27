import React, { useState, useEffect, useRef, useCallback } from "react";

// --- CONSTANTES DE ARQUITECTURA (SSOT) ---
const CATEGORY_VISUAL = {
  Postres:  { emoji: "🍰", bg: "linear-gradient(135deg,#f8c8d4,#f4a0b0)", color: "#8b2252" },
  Carnes:   { emoji: "🥩", bg: "linear-gradient(135deg,#d4846a,#b85c3a)", color: "#3d1a0e" },
  Vegano:   { emoji: "🥗", bg: "linear-gradient(135deg,#a8d8a0,#6bb86a)", color: "#1a4a1a" },
  Pasta:    { emoji: "🍝", bg: "linear-gradient(135deg,#f5d88a,#e8b84b)", color: "#5a3a00" },
  Sopas:    { emoji: "🍲", bg: "linear-gradient(135deg,#f0b97a,#d4844a)", color: "#4a1e00" },
  Desayuno: { emoji: "🥐", bg: "linear-gradient(135deg,#fde9b0,#f5c842)", color: "#5a3a00" },
  General:  { emoji: "👨‍🍳", bg: "linear-gradient(135deg,#c8d8f0,#8aabdc)", color: "#1a2a4a" },
};

// --- COMPONENTES MODULARES ---

function TimerWidget({ category, onClose }) {
  const [seconds, setSeconds] = useState(600);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  // Optimización: Uso de useRef para evitar recrear el intervalo
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

  const formatTime = s => {
    const mins = String(Math.floor(s / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:999,background:'#0f0f0f',border:'1px solid #2a2a2a',borderRadius:20,padding:'20px 24px',width:210,boxShadow:'0 0 60px rgba(255,90,20,0.2)',fontFamily:'monospace'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <span style={{color:'#ff5a14',fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase'}}>⏱ ChefKiKe Timer</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#666',cursor:'pointer'}}>✕</button>
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:42,fontWeight:900,color:seconds === 0 ? '#ff5a14' : '#fff'}}>{formatTime(seconds)}</div>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button onClick={() => setRunning(!running)} style={{flex:1,background:running?'#1a1a1a':'#ff5a14',color:'#fff',borderRadius:10,padding:'9px',cursor:'pointer'}}>
            {running ? '⏸ Pausa' : '▶ Iniciar'}
          </button>
          <button onClick={() => {setSeconds(600); setRunning(false);}} style={{background:'#1a1a1a',color:'#666',borderRadius:10,padding:'9px 12px',cursor:'pointer'}}>↺</button>
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

  // ARQUITECTURA: Lógica de negocio extraída
  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // NOTA DEL ARQUITECTO: En producción, cambia esta URL por tu propia Vercel Edge Function
      // para no exponer tu API KEY de Anthropic.
      const response = await fetch('/api/analyze-recipe', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: url })
      });

      if (!response.ok) throw new Error("Fallo en la comunicación con la IA");

      const data = await response.json();
      setRecipe(data);
    } catch (e) {
      setError("No pude analizar la receta. Intenta con ingredientes específicos.");
      console.error("Architect Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f7f3ee',padding:'36px 16px'}}>
      {/* Header Modular */}
      <div style={{textAlign:'center',marginBottom:44}}>
        <h1 style={{fontSize:'clamp(40px,8vw,70px)',fontWeight:900,fontStyle:'italic'}}>
          Chef<span style={{color:'#ff5a14'}}>KiKe</span>
        </h1>
        <p style={{fontFamily:'monospace',fontSize:11,color:'#aaa'}}>EXTRACCIÓN INTELIGENTE DE RECETAS</p>
      </div>

      {/* Input de Datos */}
      <div style={{maxWidth:600,margin:'0 auto 40px',display:'flex',gap:10}}>
        <input 
          style={{flex:1,padding:16,borderRadius:14,border:'2px solid #ddd'}}
          placeholder="Pega un enlace o escribe: 'Tacos de pastor'..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleFetch}
          disabled={loading}
          style={{background:'#ff5a14',color:'#fff',padding:'0 24px',borderRadius:14,cursor:'pointer'}}
        >
          {loading ? '...' : '→ Extraer'}
        </button>
      </div>

      {/* Renderizado Condicional de la Entidad Receta */}
      {recipe && (
        <div style={{maxWidth:700,margin:'0 auto',background:'#fff',borderRadius:24,boxShadow:'0 10px 40px rgba(0,0,0,0.1)',overflow:'hidden'}}>
           <div style={{background: (CATEGORY_VISUAL[recipe.category] || CATEGORY_VISUAL.General).bg, padding: 40, textAlign: 'center'}}>
              <div style={{fontSize: 80}}>{(CATEGORY_VISUAL[recipe.category] || CATEGORY_VISUAL.General).emoji}</div>
              <h2 style={{color: '#fff', fontSize: 28}}>{recipe.title}</h2>
           </div>
           {/* ... Resto de la UI de ingredientes y pasos ... */}
        </div>
      )}

      {error && <div style={{color:'red',textAlign:'center'}}>{error}</div>}
    </div>
  );
}
