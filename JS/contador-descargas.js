// contador-inits.js - Solo para el botón en inits.html

// Configuración (misma que en logica-subWeb.js)
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mike2Abraham/SPEED-ELECTRONIC-AUDIO-2.0/refs/heads/main/versions.txt";
const SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz0d0-kSEnoEcC05QY6NwU4nixx1mvd1dc0XMMRlvqA0OmsLLxyogBPeDz2p-PP_hjZfA/exec";

// Función para obtener la primera versión del TXT
async function obtenerPrimeraVersion() {
  try {
    const response = await fetch(`${GITHUB_RAW_URL}?t=${Date.now()}`);
    const data = await response.text();
    const primeraVersion = data.split('####')[1]; // Tomar la primera versión
    
    if (!primeraVersion) return null;
    
    const lines = primeraVersion.split('\n').filter(line => line.trim());
    return {
      nombre: lines[0] || 'Última versión',
      link: lines.find(l => l.includes('link:'))?.replace('link:', '').trim() || '#'
    };
  } catch (error) {
    console.error("Error al obtener versión:", error);
    return null;
  }
}

// Función para actualizar contador (simplificada)
async function actualizarContador(appName) {
  try {
    await fetch(`${SHEET_SCRIPT_URL}?app=${encodeURIComponent(appName)}&mode=inc`);
  } catch (error) {
    console.error("Error al actualizar contador:", error);
  }
}

// Mostrar modal simple (similar al que ya tienes)
function mostrarModalSimple(appName, link) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';
  
  modal.innerHTML = `
    <div style="background: black; padding: 20px; border-radius: 20px; text-align: center;">
      <h2>Preparando descarga de ${appName}...</h2>
      <div style="border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; 
           width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px auto;"></div>
      <p>La descarga comenzará automáticamente en <span id="cuenta-regresiva">3</span> segundos</p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  let count = 3;
  const interval = setInterval(() => {
    count--;
    const counterEl = document.getElementById('cuenta-regresiva');
    if (counterEl) counterEl.textContent = count;
    if (count <= 0) {
      clearInterval(interval);
      document.body.removeChild(modal);
      window.location.href = link;
    }
  }, 1000);
  
  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', () => {
    clearInterval(interval);
    document.body.removeChild(modal);
  });
}

// Inicializar botón en inits.html
async function initBotonPrincipal() {
  const btn = document.querySelector('#btn-ultima-version .btn-version');
  if (!btn) return;
  
  // Obtener datos de la primera versión
  const version = await obtenerPrimeraVersion();
  if (!version) return;
  
  // Configurar evento de clic
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    mostrarModalSimple(version.nombre, version.link);
    await actualizarContador(version.nombre);
  });
  
  // Opcional: Mostrar contador actual
  try {
    const response = await fetch(`${SHEET_SCRIPT_URL}?app=${encodeURIComponent(version.nombre)}&mode=get`);
    const count = await response.text();
    btn.innerHTML += `<span style="display: none; font-size: 0.8em;">Descargas: ${count}</span>`;
  } catch (error) {
    console.error("Error al obtener contador:", error);
  }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initBotonPrincipal);


// contador-visitas.js - Contador de visitas únicas
document.addEventListener('DOMContentLoaded', async () => {
  const VISITAS_KEY = 'ya_visito_speed';
  const SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-rNyzyNBs4IMx0QuGoZ827Uw9C1fYTdfffk7bfRINTsN3mExf8XgztaR6N_wDiYPG3g/exec";
  const NOMBRE_VISITAS = "visitas"; // Nombre fijo en Google Sheets

  // Verificar si ya visitó (usando localStorage)
  if (!localStorage.getItem(VISITAS_KEY)) {
    try {
      // Enviar petición para sumar +1 visita
      await fetch(`${SHEET_SCRIPT_URL}?app=${encodeURIComponent(NOMBRE_VISITAS)}&mode=inc`);
      localStorage.setItem(VISITAS_KEY, 'true'); // Marcar como visitado
    } catch (error) {
      console.error("Error al registrar visita:", error);
    }
  }

  // Obtener y mostrar el total de visitas
  try {
    const response = await fetch(`${SHEET_SCRIPT_URL}?app=${encodeURIComponent(NOMBRE_VISITAS)}&mode=get`);
    const totalVisitas = await response.text();
    
    // Mostrar debajo del mensaje de bienvenida
    const cartelon = document.getElementById('cartelon');
    if (cartelon) {
      const contadorHTML = `<div class="contador-visitas">👋 ¡Cantidad de visitas a la web: <strong>${totalVisitas}</strong>!</div>`;
      cartelon.insertAdjacentHTML('afterend', contadorHTML);
    }
  } catch (error) {
    console.error("Error al obtener visitas:", error);
  }
});