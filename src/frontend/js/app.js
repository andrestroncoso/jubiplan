// Construir API_BASE dinámicamente basado en el host actual
const API_BASE = `${window.location.protocol}//${window.location.host}/api`;
let pensionChart = null;
let afpsData = null;
let isapresData = null;
let historicoChart = null;

// Tracking de última actualización de datos
let ultimaActualizacionIndicadores = null;
let ultimaActualizacionAfps = null;

// Función para actualizar fecha en footer
function actualizarFechaFooter() {
  const ultimaActualizacion = document.getElementById('ultimaActualizacion');
  if (!ultimaActualizacion) return;

  // Usar la fecha más reciente entre indicadores y AFPs
  let fechaMasReciente = ultimaActualizacionIndicadores || ultimaActualizacionAfps;

  if (!fechaMasReciente) {
    ultimaActualizacion.textContent = 'Última actualización: Cargando datos...';
    return;
  }

  const fecha = new Date(fechaMasReciente);
  const fechaFormato = fecha.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  ultimaActualizacion.textContent = `Última actualización: ${fechaFormato}`;
}

// Security: Sanitizar HTML de datos untrusted
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function createSafeElement(tag, className, content, isHTML = false) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (isHTML) {
    el.innerHTML = content;
  } else {
    el.textContent = content;
  }
  return el;
}

// DOM Elements
const form = document.getElementById('pensionForm');
const resultsSection = document.getElementById('resultsSection');
const loadingSpinner = document.getElementById('loadingSpinner');
const resetBtn = document.getElementById('resetBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const toggleBtns = document.querySelectorAll('.toggle-btn');
const afpsContainer = document.getElementById('afpsContainer');
const isapresContainer = document.getElementById('isapresContainer');

// Tab Navigation
tabBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tabName = e.target.dataset.tab;
    showTab(tabName);
  });
});

function showTab(tabName) {
  tabContents.forEach(content => content.classList.remove('active'));
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  document.getElementById(tabName).classList.add('active');
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
  }

  if (tabName === 'afps') {
    loadAFPsAndIsapres();
  } else if (tabName === 'historico') {
    loadHistorico();
  }
}

// Toggle AFP/Isapres
let filtroActualIsapre = 'mejor-valor';
const isapresFilterSection = document.getElementById('isapresFilterSection');

toggleBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const type = e.target.dataset.type;
    toggleBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    if (type === 'afps') {
      afpsContainer.style.display = 'grid';
      isapresContainer.style.display = 'none';
      isapresFilterSection.style.display = 'none';
    } else {
      afpsContainer.style.display = 'none';
      isapresContainer.style.display = 'grid';
      isapresFilterSection.style.display = 'block';
      mostrarIsapresConFiltro(filtroActualIsapre);
    }
  });
});

// Event listeners para filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filtroActualIsapre = e.target.dataset.filter;
    mostrarIsapresConFiltro(filtroActualIsapre);
  });
});

// Form Submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const salarioMensual = parseFloat(document.getElementById('salarioMensual').value);
  const edadActual = parseInt(document.getElementById('edadActual').value);
  const edadJubilacion = parseInt(document.getElementById('edadJubilacion').value);
  const saldoActual = parseFloat(document.getElementById('saldoActual').value);
  const aportesAdicionales = parseFloat(document.getElementById('aportesAdicionales').value) || 0;

  // Validación en cliente
  const validacionError = validarFormulario(salarioMensual, edadActual, edadJubilacion, saldoActual);
  if (validacionError) {
    mostrarError(validacionError);
    return;
  }

  const formData = {
    salarioMensual,
    edadActual,
    edadJubilacion,
    saldoActual,
    aportesAdicionales,
    tasaRendimiento: 0.065,
    comisionAfp: 0.0074,
    tasaSeguro: 0.0127
  };

  loadingSpinner.style.display = 'flex';
  resultsSection.style.display = 'none';
  limpiarError();

  try {
    const response = await fetch(`${API_BASE}/calcular-pension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.status === 200) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error en el cálculo');
    }

    const resultado = await response.json();
    mostrarResultados(resultado);
  } catch (error) {
    console.error('Error:', error);
    mostrarError('No se pudo calcular la pensión. Verifica tu conexión e intenta nuevamente.');
  } finally {
    loadingSpinner.style.display = 'none';
  }
});

function validarFormulario(salario, edadActual, edadJubilacion, saldo) {
  if (!salario || salario <= 0) return 'Ingresa un salario válido (mayor a $0)';
  if (!edadActual || edadActual < 18 || edadActual > 100) return 'Edad actual debe estar entre 18 y 100 años';
  if (!edadJubilacion || edadJubilacion < 55 || edadJubilacion > 100) return 'Edad de jubilación debe estar entre 55 y 100 años';
  if (edadJubilacion <= edadActual) return 'La edad de jubilación debe ser mayor que la edad actual';
  if (saldo < 0) return 'El saldo no puede ser negativo';
  return null;
}

function mostrarError(mensaje) {
  let errorDiv = document.getElementById('errorMessage');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.style.cssText = `
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--danger);
      border-radius: var(--border-radius);
      padding: 16px 20px;
      color: var(--danger);
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    `;
    form.parentNode.insertBefore(errorDiv, form);
  }
  errorDiv.textContent = '⚠️ ' + mensaje;
  errorDiv.style.display = 'block';
}

function limpiarError() {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

function mostrarResultados(resultado) {
  document.getElementById('pensionMensual').textContent = formatearMoneda(resultado.pensionMensualEstimada);
  document.getElementById('saldoFinal').textContent = formatearMoneda(resultado.saldoFinal);
  document.getElementById('totalAportado').textContent = formatearMoneda(resultado.totalAportado);
  document.getElementById('totalComisiones').textContent = formatearMoneda(resultado.totalComisiones);

  crearGrafico(resultado.aportesRegimen);
  limpiarError();
  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function crearGrafico(datos) {
  const ctx = document.getElementById('balanceChart');
  if (!ctx) return;

  if (pensionChart) {
    pensionChart.destroy();
  }

  const isMobile = esMovil();
  const labels = datos.map(d => `Año ${d.año}`);
  const values = datos.map(d => d.saldoAcumulado);

  pensionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Saldo Acumulado (CLP)',
        data: values,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: isMobile ? 2 : 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#fff',
        pointBorderWidth: isMobile ? 1 : 2,
        pointRadius: isMobile ? 2 : 4,
        pointHoverRadius: isMobile ? 3 : 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: { size: isMobile ? 10 : 12 },
            usePointStyle: true,
            padding: isMobile ? 8 : 12
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatearMonedaCorta(value),
            font: { size: isMobile ? 9 : 11 }
          }
        },
        x: {
          ticks: {
            font: { size: isMobile ? 8 : 10 }
          }
        }
      }
    }
  });
}

resetBtn.addEventListener('click', () => {
  form.reset();
  resultsSection.style.display = 'none';
  if (pensionChart) pensionChart.destroy();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Cargar AFPs e Isapres
async function loadAFPsAndIsapres() {
  if (afpsData && isapresData) return;

  try {
    const [afpsRes, isapresRes, afpsRealistasRes] = await Promise.all([
      fetch(`${API_BASE}/afps`),
      fetch(`${API_BASE}/isapres`),
      fetch(`${API_BASE}/afps-realistas`)
    ]);

    if (!afpsRes.ok || !isapresRes.ok) throw new Error('Error cargando datos');

    afpsData = await afpsRes.json();
    isapresData = await isapresRes.json();

    // Capturar fecha de actualización de AFPs realistas
    if (afpsRealistasRes.ok) {
      const afpsRealistas = await afpsRealistasRes.json();
      ultimaActualizacionAfps = afpsRealistas.fecha_actualizacion;
      actualizarFechaFooter();
    }

    mostrarAFPs();
    mostrarIsapres();
  } catch (error) {
    console.error('Error:', error);
    afpsContainer.innerHTML = '<p>Error cargando AFPs</p>';
    isapresContainer.innerHTML = '<p>Error cargando Isapres</p>';
  }
}

function mostrarAFPs() {
  // Calcular rentabilidad promedio de cada AFP y ordenar
  const afpsConRentabilidad = afpsData.afps.map(afp => {
    const rentabilidadPromedio = afp.fondos.reduce((sum, fondo) => sum + fondo.rentabilidadAnual, 0) / afp.fondos.length;
    return { ...afp, rentabilidadPromedio };
  }).sort((a, b) => b.rentabilidadPromedio - a.rentabilidadPromedio);

  const mejorRentabilidad = afpsConRentabilidad[0].rentabilidadPromedio;
  const datosRealSVS = afpsConRentabilidad[0]?.datosRealesSVS || false;

  // Limpiar contenedor
  afpsContainer.innerHTML = '';

  // Crear nota SVS si es necesario (FUERA del grid)
  if (datosRealSVS) {
    const notaSVS = document.createElement('div');
    notaSVS.style.cssText = 'background: rgba(0, 255, 136, 0.08); border: 1px solid rgba(0, 255, 136, 0.4); padding: 16px 20px; border-radius: 12px; margin-bottom: 30px; text-align: center; color: #00ff88; font-weight: 700; font-size: 0.9rem; line-height: 1.6;';
    notaSVS.innerHTML = `📊 Datos Actualizados desde SVS Chile<br><span style="font-size: 0.8rem; font-weight: 600; opacity: 0.9;">(Superintendencia de Valores y Seguros)</span>`;
    afpsContainer.appendChild(notaSVS);
  }

  // Crear div interno con clase grid para las tarjetas
  const gridDiv = document.createElement('div');
  gridDiv.className = 'institutions-grid';

  // Construir HTML solo de las tarjetas
  const htmlTarjetas = afpsConRentabilidad.map((afp, index) => {
    const esMejor = afp.rentabilidadPromedio === mejorRentabilidad;
    const puesto = index + 1;

    return `
      <div class="institution-card ${esMejor ? 'best-institution' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
          <div class="institution-name">${sanitizeHTML(afp.nombre)}</div>
          <div style="display: flex; gap: 8px; flex-direction: column; align-items: flex-end;">
            ${esMejor ? '<span style="background: linear-gradient(135deg, #00ff88, #00d9ff); color: #0a0e27; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.75rem;">🏆 MEJOR</span>' : ''}
            <span style="background: rgba(0, 217, 255, 0.2); color: var(--primary); padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.8rem;">Puesto ${puesto}</span>
          </div>
        </div>

        <div style="background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 12px; padding: 15px; margin-bottom: 20px;">
          <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Rentabilidad Promedio</div>
          <div style="font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #00d9ff, #00ff88); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            ${afp.rentabilidadPromedio.toFixed(2)}%
          </div>
        </div>

        <div class="institution-stat">
          <span class="stat-label">Comisión:</span>
          <span class="stat-value">${afp.comisión}%</span>
        </div>
        <div class="institution-stat">
          <span class="stat-label">Seguro:</span>
          <span class="stat-value">${afp.tasaSeguro}%</span>
        </div>

        <div style="margin-top: 20px;">
          <div style="font-weight: 700; margin-bottom: 12px; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.95rem;">Fondos Disponibles:</div>
          ${afp.fondos.map(fondo => `
            <div style="margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
              <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px;">${sanitizeHTML(fondo.nombre)}</div>
              <div style="font-size: 0.9rem; color: var(--text-secondary); margin: 4px 0;">
                <strong>Riesgo:</strong> ${sanitizeHTML(fondo.riesgo)}
              </div>
              <div style="font-size: 0.9rem; color: var(--text-secondary); margin: 4px 0;">
                <strong>Rentabilidad:</strong> <span style="color: var(--primary); font-weight: 700;">${Number(fondo.rentabilidadAnual).toFixed(2)}%</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 6px; font-style: italic;">
                ${sanitizeHTML(fondo.composicion)}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="institution-contact">
          <div class="contact-item"><strong>📞</strong> ${afp.telefonoAtención}</div>
          <div class="contact-item"><strong>🌐</strong> ${afp.website}</div>
        </div>
      </div>
    `;
  }).join('');

  // Asignar tarjetas al grid interno
  gridDiv.innerHTML = htmlTarjetas;

  // Agregar el grid al contenedor principal
  afpsContainer.appendChild(gridDiv);
}

function mostrarIsapresConFiltro(filtro) {
  if (!isapresData) return;

  let isapresOrdenadas = [...isapresData.isapres];

  // Ordenar según el filtro seleccionado
  switch(filtro) {
    case 'mejor-valor':
      isapresOrdenadas.sort((a, b) => {
        const mejorA = Math.min(...a.planes.map(p => p.montoDeducible));
        const mejorB = Math.min(...b.planes.map(p => p.montoDeducible));
        return mejorA - mejorB;
      });
      break;
    case 'mejor-cobertura':
      const coberturaScore = { 'Excelente': 3, 'Buena': 2, 'Regular': 1 };
      isapresOrdenadas.sort((a, b) => coberturaScore[b.cobertura] - coberturaScore[a.cobertura]);
      break;
    case 'mas-clinicas':
      isapresOrdenadas.sort((a, b) => b.clinicas - a.clinicas);
      break;
    case 'mas-farmacias':
      isapresOrdenadas.sort((a, b) => b.farmacias - a.farmacias);
      break;
    case 'urgencias':
      const urgenciasScore = { 'Excelente - 24/7': 3, 'Buena - 24/7': 2, 'Regular - 24/7': 1 };
      isapresOrdenadas.sort((a, b) => urgenciasScore[b.urgencias] - urgenciasScore[a.urgencias]);
      break;
    case 'cirugias':
      const cirugiasScore = { 'Excelente cobertura': 3, 'Buena cobertura': 2, 'Cobertura estándar': 1 };
      isapresOrdenadas.sort((a, b) => cirugiasScore[b.cirugias] - cirugiasScore[a.cirugias]);
      break;
    case 'puntuacion':
      isapresOrdenadas.sort((a, b) => b.puntuacionGeneral - a.puntuacionGeneral);
      break;
  }

  mostrarIsapres(isapresOrdenadas);
}

function mostrarIsapres(isapresOrdenadas = null) {
  const isapresAMostrar = isapresOrdenadas || isapresData.isapres;

  // Agregar información de mejor plan a cada isapre
  const isapresConInfo = isapresAMostrar.map(isapre => {
    const mejorPlan = isapre.planes.reduce((mejor, actual) =>
      actual.montoDeducible < mejor.montoDeducible ? actual : mejor
    );
    return {
      ...isapre,
      mejorDeducible: mejorPlan.montoDeducible,
      mejorPlan: mejorPlan
    };
  });

  const mejorEnFiltro = isapresConInfo[0];

  // Limpiar contenedor
  isapresContainer.innerHTML = '';

  // Crear nota de filtro (FUERA del grid)
  const notaFiltro = document.createElement('div');
  notaFiltro.style.cssText = 'background: rgba(167, 139, 250, 0.08); border: 1px solid rgba(167, 139, 250, 0.4); padding: 14px 18px; border-radius: 12px; margin-bottom: 25px; text-align: center; color: #a78bfa; font-weight: 600; font-size: 0.9rem;';

  let nombreFiltro = 'Mejor Valor';
  if (filtroActualIsapre === 'mejor-cobertura') nombreFiltro = 'Mejor Cobertura';
  else if (filtroActualIsapre === 'mas-clinicas') nombreFiltro = 'Más Clínicas';
  else if (filtroActualIsapre === 'mas-farmacias') nombreFiltro = 'Más Farmacias';
  else if (filtroActualIsapre === 'urgencias') nombreFiltro = 'Mejor Atención de Urgencias';
  else if (filtroActualIsapre === 'cirugias') nombreFiltro = 'Mejor Cobertura de Cirugías';
  else if (filtroActualIsapre === 'puntuacion') nombreFiltro = 'Mejor Calificación General';

  notaFiltro.innerHTML = `✨ Ordenadas por: <strong>${nombreFiltro}</strong>`;
  isapresContainer.appendChild(notaFiltro);

  // Crear div interno con clase grid para las tarjetas
  const gridDiv = document.createElement('div');
  gridDiv.className = 'institutions-grid';

  // Construir HTML solo de las tarjetas
  const htmlIsapres = isapresConInfo.map((isapre, index) => {
    const esMejor = index === 0;
    const puesto = index + 1;

    let badgeText = '🏆 MEJOR';
    if (filtroActualIsapre === 'mejor-cobertura') badgeText = '🏆 MEJOR COBERTURA';
    else if (filtroActualIsapre === 'mas-clinicas') badgeText = '🏆 MÁS CLÍNICAS';
    else if (filtroActualIsapre === 'mas-farmacias') badgeText = '🏆 MÁS FARMACIAS';
    else if (filtroActualIsapre === 'urgencias') badgeText = '🏆 MEJOR URGENCIAS';
    else if (filtroActualIsapre === 'cirugias') badgeText = '🏆 MEJOR CIRUGÍAS';
    else if (filtroActualIsapre === 'puntuacion') badgeText = '⭐ MEJOR CALIFICACIÓN';

    return `
      <div class="institution-card ${esMejor ? 'best-institution' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
          <div class="institution-name">${sanitizeHTML(isapre.nombre)}</div>
          <div style="display: flex; gap: 8px; flex-direction: column; align-items: flex-end;">
            ${esMejor ? `<span style="background: linear-gradient(135deg, #00ff88, #00d9ff); color: #0a0e27; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.75rem;">${badgeText}</span>` : ''}
            <span style="background: rgba(0, 217, 255, 0.2); color: var(--primary); padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.8rem;">Puesto ${puesto}</span>
          </div>
        </div>

        <div style="background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 12px; padding: 15px; margin-bottom: 20px;">
          <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Menor Deducible (Mejor Valor)</div>
          <div style="font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #00d9ff, #00ff88); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            ${formatearMoneda(isapre.mejorDeducible)}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 5px;">
            Plan: ${sanitizeHTML(isapre.mejorPlan.nombre)}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
          <div class="institution-stat" style="border-bottom: none; padding: 0;">
            <span class="stat-label">Cotización:</span>
            <span class="stat-value">${isapre.cotizacion}%</span>
          </div>
          <div class="institution-stat" style="border-bottom: none; padding: 0;">
            <span class="stat-label">Puntuación:</span>
            <span class="stat-value">${isapre.puntuacionGeneral}/10</span>
          </div>
        </div>

        <div style="background: rgba(0, 217, 255, 0.05); padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 3px solid var(--primary);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-tertiary); font-weight: 600;">🏥 Clínicas Convenidas</div>
              <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${isapre.clinicas}</div>
            </div>
            <div>
              <div style="font-size: 0.85rem; color: var(--text-tertiary); font-weight: 600;">💊 Farmacias Convenidas</div>
              <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${isapre.farmacias}</div>
            </div>
            <div>
              <div style="font-size: 0.85rem; color: var(--text-tertiary); font-weight: 600;">🚨 Urgencias</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: var(--success);">${isapre.urgencias}</div>
            </div>
            <div>
              <div style="font-size: 0.85rem; color: var(--text-tertiary); font-weight: 600;">🔪 Cirugías</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: var(--secondary);">${isapre.cirugias}</div>
            </div>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <div style="font-weight: 700; margin-bottom: 12px; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.95rem;">Planes Disponibles:</div>
          ${isapre.planes.map(plan => `
            <div style="margin-bottom: 15px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
              <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px;">${plan.nombre}</div>
              <div style="font-size: 0.9rem; color: var(--text-secondary); margin: 4px 0; background: rgba(167, 139, 250, 0.05); padding: 12px; border-radius: 8px; border-left: 3px solid var(--secondary);">
                <strong>Copago por Consulta:</strong> <span style="color: var(--primary); font-weight: 700;">${formatearMoneda(plan.copagoPrimeraConsulta)}</span>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 8px; line-height: 1.5;">
                  <strong>Explicación:</strong> Es lo que TÚ pagas de tu bolsillo <strong>cada vez que vas al médico o haces un examen.</strong>
                  <br><br>
                  <strong>Ejemplo:</strong> Si el copago es $850, pagas ese monto en cada consulta. Si tienes 4 consultas en un mes, pagas 4 × $850 = $3.400 en total.
                </div>
              </div>
              <div style="font-size: 0.9rem; color: var(--text-secondary); margin: 8px 0; background: rgba(0, 217, 255, 0.05); padding: 12px; border-radius: 8px; border-left: 3px solid var(--primary);">
                <strong>Deducible Mensual:</strong> <span style="color: ${plan.montoDeducible <= 20000 ? 'var(--success)' : plan.montoDeducible <= 40000 ? 'var(--primary)' : 'var(--danger)'}; font-weight: 700;">${formatearMoneda(plan.montoDeducible)}</span>
                <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 8px; line-height: 1.5;">
                  <strong>Explicación:</strong> Es el dinero total que acumulas en gastos médicos (consultas, exámenes, etc.) en un mes, antes de que la isapre empiece a cubrir más. <strong>Cada mes se reinicia.</strong>
                  <br><br>
                  <strong>Ejemplo:</strong> Si el deducible es $50.000 y gastas $8.000 en consultas, TÚ pagas esos $8.000. Si luego gastas más y alcanzas $50.000, a partir de ese punto la isapre cobre una parte.
                </div>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 8px;">
                📋 Incluye: ${plan.cobertura}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="institution-contact">
          <div class="contact-item"><strong>📞</strong> ${isapre.telefonoAtención}</div>
          <div class="contact-item"><strong>🌐</strong> ${isapre.website}</div>
        </div>
      </div>
    `;
  }).join('');

  // Asignar tarjetas al grid interno
  gridDiv.innerHTML = htmlIsapres;

  // Agregar el grid al contenedor principal
  isapresContainer.appendChild(gridDiv);
}

// Cargar indicadores del día (UF y Dólar)
async function cargarIndicadoresDelDia() {
  try {
    const ufValue = document.getElementById('ufValue');
    const dolarValue = document.getElementById('dolarValue');
    const indicadoresDiv = document.getElementById('indicadoresDelDia');
    const indicadoresLabel = document.getElementById('indicadoresLabel');

    // Show loading state
    if (indicadoresDiv) {
      indicadoresDiv.style.display = 'flex';
      indicadoresDiv.classList.add('loading-pulse');
    }
    if (ufValue && dolarValue) {
      ufValue.textContent = '...';
      dolarValue.textContent = '...';
    }

    // Obtener indicadores reales de Mindicador
    const response = await fetch(`${API_BASE}/indicadores-diarios`);
    const data = await response.json();

    if (ufValue && dolarValue && indicadoresDiv) {
      ufValue.textContent = formatearMoneda(data.uf);
      dolarValue.textContent = formatearMoneda(data.dolar);
      indicadoresDiv.classList.remove('loading-pulse');

      // Guardar fecha de última actualización
      ultimaActualizacionIndicadores = data.fecha_actualizacion;
      actualizarFechaFooter();

      // Mostrar fecha de actualización
      if (indicadoresLabel) {
        const fecha = new Date(data.fecha_actualizacion);
        const fechaFormato = fecha.toLocaleDateString('es-CL', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        indicadoresLabel.textContent = `Actualizado: ${fechaFormato}`;
        indicadoresLabel.style.fontSize = '0.8rem';
        indicadoresLabel.style.color = 'var(--text-tertiary)';
        indicadoresLabel.style.marginTop = '8px';
      }
    }
  } catch (error) {
    console.error('Error cargando indicadores:', error);
    const ufValue = document.getElementById('ufValue');
    const dolarValue = document.getElementById('dolarValue');
    if (ufValue && dolarValue) {
      ufValue.textContent = '-';
      dolarValue.textContent = '-';
    }
  }
}

// Cargar y mostrar histórico de rentabilidades
async function loadHistorico() {
  const historicoContainer = document.getElementById('historicoContainer');

  try {
    // Datos demo para esta iteración (en próxima integraremos API SPensiones)
    const historicoData = {
      afps: [
        {
          nombre: 'Habitat',
          actual: 6.43,
          promedio: 6.4,
          minimo: 6.2,
          maximo: 6.6,
          datos: generarDatosDemo(30, 6.2, 6.6)
        },
        {
          nombre: 'Provida',
          actual: 7.15,
          promedio: 7.1,
          minimo: 6.9,
          maximo: 7.4,
          datos: generarDatosDemo(30, 6.9, 7.4)
        },
        {
          nombre: 'Modelo',
          actual: 9.2,
          promedio: 9.1,
          minimo: 8.9,
          maximo: 9.3,
          datos: generarDatosDemo(30, 8.9, 9.3)
        },
        {
          nombre: 'Integra',
          actual: 8.65,
          promedio: 8.6,
          minimo: 8.4,
          maximo: 8.8,
          datos: generarDatosDemo(30, 8.4, 8.8)
        },
        {
          nombre: 'Cuprum',
          actual: 6.50,
          promedio: 6.5,
          minimo: 6.3,
          maximo: 6.7,
          datos: generarDatosDemo(30, 6.3, 6.7)
        },
        {
          nombre: 'Sura',
          actual: 7.80,
          promedio: 7.75,
          minimo: 7.5,
          maximo: 8.0,
          datos: generarDatosDemo(30, 7.5, 8.0)
        }
      ]
    };

    mostrarHistorico(historicoData);
  } catch (error) {
    console.error('Error cargando histórico:', error);
    historicoContainer.innerHTML = '<p style="color: red;">Error al cargar el histórico</p>';
  }
}

// Detectar si es dispositivo móvil
function esMovil() {
  return window.innerWidth < 768;
}

// Generar datos demo para gráfico
function generarDatosDemo(dias, minimo, maximo) {
  const datos = [];
  const hoy = new Date();

  for (let i = dias - 1; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const rentabilidad = parseFloat((Math.random() * (maximo - minimo) + minimo).toFixed(2));

    datos.push({
      fecha: fecha.toLocaleDateString('es-CL'),
      rentabilidad: rentabilidad
    });
  }

  return datos;
}

// Filtrar datos para móvil (mostrar cada 5 días)
function filtrarDatosMovil(datos) {
  if (!esMovil() || datos.length <= 10) return datos;

  // Mostrar cada 5 días en móvil
  return datos.filter((_, i) => i % 5 === 0 || i === datos.length - 1);
}

// Mostrar histórico con gráfico
function mostrarHistorico(historicoData) {
  const historicoContainer = document.getElementById('historicoContainer');

  let htmlHistorico = '';

  historicoData.afps.forEach((afp, index) => {
    const canvasId = `historico-chart-${index}`;

    htmlHistorico += `
      <div class="historico-afp-section">
        <div class="historico-afp-header">
          <h3>${sanitizeHTML(afp.nombre)}</h3>
          <div class="historico-stats">
            <div class="stat-mini">
              <span class="label">Hoy:</span>
              <span class="valor">${afp.actual.toFixed(2)}%</span>
            </div>
            <div class="stat-mini">
              <span class="label">Promedio:</span>
              <span class="valor">${afp.promedio.toFixed(2)}%</span>
            </div>
            <div class="stat-mini">
              <span class="label">Máximo:</span>
              <span class="valor" style="color: #00ff88;">${afp.maximo.toFixed(2)}%</span>
            </div>
            <div class="stat-mini">
              <span class="label">Mínimo:</span>
              <span class="valor" style="color: #ff6b6b;">${afp.minimo.toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="${canvasId}"></canvas>
        </div>
        <p class="historico-explicacion">
          📈 La línea muestra cómo la rentabilidad cambió cada día durante el mes.
          Las subidas y bajadas son completamente normales en los mercados financieros.
        </p>
      </div>
    `;
  });

  historicoContainer.innerHTML = htmlHistorico;

  // Crear gráficos
  historicoData.afps.forEach((afp, index) => {
    crearGraficoHistorico(afp, index);
  });
}

// Crear gráfico histórico con Chart.js
function crearGraficoHistorico(afp, index) {
  const canvasId = `historico-chart-${index}`;
  const ctx = document.getElementById(canvasId);

  if (!ctx) {
    console.warn(`Canvas ${canvasId} no encontrado`);
    return;
  }

  const isMobile = esMovil();
  const datosFiltrados = isMobile ? filtrarDatosMovil(afp.datos) : afp.datos;
  const labels = datosFiltrados.map(d => d.fecha);
  const values = datosFiltrados.map(d => d.rentabilidad);

  // Destruir gráfico anterior si existe
  if (window[`historicoChart${index}`]) {
    try {
      window[`historicoChart${index}`].destroy();
    } catch (e) {
      console.warn('Error destruyendo gráfico anterior');
    }
  }

  // Asignar color según AFP
  let borderColor = '#00d9ff';
  let backgroundColor = 'rgba(0, 217, 255, 0.1)';

  if (afp.nombre.includes('Habitat')) {
    borderColor = '#a78bfa';
    backgroundColor = 'rgba(167, 139, 250, 0.1)';
  } else if (afp.nombre.includes('Cuprum')) {
    borderColor = '#00ff88';
    backgroundColor = 'rgba(0, 255, 136, 0.1)';
  }

  try {
    window[`historicoChart${index}`] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Rentabilidad ${afp.nombre}`,
          data: values,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: isMobile ? 1.5 : 2.5,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: isMobile ? 0.5 : 1.5,
          pointRadius: isMobile ? 1.5 : 3,
          pointHoverRadius: isMobile ? 2.5 : 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: { size: isMobile ? 8 : 11, weight: 'bold' },
              usePointStyle: true,
              color: '#8892b0',
              padding: isMobile ? 8 : 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: isMobile ? 8 : 12,
            titleFont: { size: isMobile ? 10 : 12, weight: 'bold' },
            bodyFont: { size: isMobile ? 9 : 11 },
            borderColor: borderColor,
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => value.toFixed(2) + '%',
              color: '#8892b0',
              font: { size: isMobile ? 7 : 10 }
            },
            grid: {
              color: 'rgba(139, 146, 176, 0.1)',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              color: '#8892b0',
              maxRotation: isMobile ? 90 : 45,
              minRotation: isMobile ? 90 : 0,
              font: { size: isMobile ? 6 : 9 }
            },
            grid: {
              color: 'rgba(139, 146, 176, 0.1)',
              drawBorder: false
            }
          }
        }
      }
    });

    console.log(`✓ Gráfico ${afp.nombre} renderizado correctamente`);
  } catch (error) {
    console.error(`Error creando gráfico ${afp.nombre}:`, error);
  }
}

// Utility Functions
function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

function formatearMonedaCorta(valor) {
  if (valor >= 1000000) {
    return `$${(valor / 1000000).toFixed(1)}M`;
  }
  return `$${(valor / 1000).toFixed(0)}K`;
}

// Cargar Chart.js desde CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(script);

// Cargar indicadores del día cuando se abre la página
cargarIndicadoresDelDia();

console.log('✓ Aplicación cargada. API disponible en:', API_BASE);
