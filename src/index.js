import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Creamos el túnel entre JS y el HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizamos la aplicación ChefKiKe
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/** * ARQUITECTO: 
 * He añadido los cierres de etiquetas (</...>) y paréntesis ( ); 
 * que faltaban en tu archivo de GitHub.
 */
