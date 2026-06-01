// Construir API_BASE dinámicamente basado en el host actual
const API_BASE = `${window.location.protocol}//${window.location.host}/api`;
let pensionChart = null;
let afpsData = null;
let isapresData = null;
let historicoChart = null;

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

  const formData = {
    salarioMensual: parseFloat(document.getElementById('salarioMensual').value),
    edadActual: parseInt(document.getElementById('edadActual').value),
    edadJubilacion: parseInt(document.getElementById('edadJubilacion').value),
    saldoActual: parseFloat(document.getElementById('saldoActual').value),
    aportesAdicionales: parseFloat(document.getElementById('aportesAdicionales').value),
    tasaRendimiento: 0.065,
    comisionAfp: 0.0074,
    tasaSeguro: 0.0127
  };

  loadingSpinner.style.display = 'flex';
  resultsSection.style.display = 'none';

  try {
    const response = await fetch(`${API_BASE}/calcular-pension`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error('Error en el cálculo');

    const resultado = await response.json();
    mostrarResultados(resultado);
  } catch (error) {
    console.error('Error:', error);
    alert('Error al calcular la pensión. Verifica los datos e intenta nuevamente.');
  } finally {
    loadingSpinner.style.display = 'none';
  }
});

function mostrarResultados(resultado) {
  document.getElementById('pensionMensual').textContent = formatearMoneda(resultado.pensionMensualEstimada);
  document.getElementById('saldoFinal').textContent = formatearMoneda(resultado.saldoFinal);
  document.getElementById('totalAportado').textContent = formatearMoneda(resultado.totalAportado);
  document.getElementById('totalComisiones').textContent = formatearMoneda(resultado.totalComisiones);

  crearGrafico(resultado.aportesRegimen);
  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function crearGrafico(datos) {
  const ctx = document.getElementById('balanceChart');
  if (!ctx) return;

  if (pensionChart) {
    pensionChart.destroy();
  }

  const labels = datos.map(d => `Año ${d.año}`);
  const values = datos.map(d => d.saldoAcumulado);

  pensionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Saldo Acumulado (CLP)',
        data: values,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: { size: 12 },
            usePointStyle: true
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatearMonedaCorta(value)
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
    const [afpsRes, isapresRes] = await Promise.all([
      fetch(`${API_BASE}/afps`),
      fetch(`${API_BASE}/isapres`)
    ]);

    if (!afpsRes.ok || !isapresRes.ok) throw new Error('Error cargando datos');

    afpsData = await afpsRes.json();
    isapresData = await isapresRes.json();

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
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <img src="${afp.logo}" alt="${sanitizeHTML(afp.nombre)}" style="width: 40px; height: 40px; border-radius: 6px; flex-shrink: 0; object-fit: contain; background: #f5f5f5;">
            <div class="institution-name" style="margin-bottom: 0;">${sanitizeHTML(afp.nombre)}</div>
          </div>
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
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <img src="${isapre.logo}" alt="${sanitizeHTML(isapre.nombre)}" style="width: 40px; height: 40px; border-radius: 6px; flex-shrink: 0; object-fit: contain; background: #f5f5f5;">
            <div class="institution-name" style="margin-bottom: 0;">${sanitizeHTML(isapre.nombre)}</div>
          </div>
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
    // Simular obtención de datos (en próxima iteración integraremos API real)
    const indicadores = {
      uf: 37895.50,
      dolar: 945.30
    };

    const ufValue = document.getElementById('ufValue');
    const dolarValue = document.getElementById('dolarValue');
    const indicadoresDiv = document.getElementById('indicadoresDelDia');

    if (ufValue && dolarValue && indicadoresDiv) {
      ufValue.textContent = formatearMoneda(indicadores.uf);
      dolarValue.textContent = formatearMoneda(indicadores.dolar);
      indicadoresDiv.style.display = 'flex';
    }
  } catch (error) {
    console.error('Error cargando indicadores:', error);
  }
}

// Cargar y mostrar histórico de rentabilidades
async function loadHistorico() {
  const historicoContainer = document.getElementById('historicoContainer');

  try {
    // Datos demo para esta iteración (en próxima integraremos API queAFP)
    const historicoData = {
      afps: [
        {
          nombre: 'AFP Modelo',
          actual: 9.2,
          promedio: 9.1,
          minimo: 8.9,
          maximo: 9.3,
          datos: generarDatosDemo(30, 8.9, 9.3)
        },
        {
          nombre: 'AFP Habitat',
          actual: 6.43,
          promedio: 6.4,
          minimo: 6.2,
          maximo: 6.6,
          datos: generarDatosDemo(30, 6.2, 6.6)
        },
        {
          nombre: 'AFP Cuprum',
          actual: 6.50,
          promedio: 6.5,
          minimo: 6.3,
          maximo: 6.7,
          datos: generarDatosDemo(30, 6.3, 6.7)
        }
      ]
    };

    mostrarHistorico(historicoData);
  } catch (error) {
    console.error('Error cargando histórico:', error);
    historicoContainer.innerHTML = '<p style="color: red;">Error al cargar el histórico</p>';
  }
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

  const labels = afp.datos.map(d => d.fecha);
  const values = afp.datos.map(d => d.rentabilidad);

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
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          pointRadius: 3,
          pointHoverRadius: 5
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
              font: { size: 11, weight: 'bold' },
              usePointStyle: true,
              color: '#8892b0',
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 11 },
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
              font: { size: 10 }
            },
            grid: {
              color: 'rgba(139, 146, 176, 0.1)',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              color: '#8892b0',
              maxRotation: 45,
              minRotation: 0,
              font: { size: 9 }
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
