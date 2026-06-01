/**
 * Servicio de integración con queAFP.cl
 * Obtiene datos históricos de rentabilidades de AFPs
 */

class HistoricalDataService {
  constructor() {
    this.baseUrl = 'https://queafp.cl/api/v1';
    this.cache = {};
    this.cacheDuration = 24 * 60 * 60 * 1000; // 24 horas
  }

  /**
   * Obtiene valores de cuota históricos (últimos 30 días)
   */
  async obtenerHistoricoAFPs() {
    try {
      const cacheKey = 'historico_afps';
      const ahora = Date.now();

      // Verificar cache
      if (this.cache[cacheKey] && ahora - this.cache[cacheKey].timestamp < this.cacheDuration) {
        console.log('✓ Histórico AFPs obtenido del caché');
        return this.cache[cacheKey].data;
      }

      console.log('📊 Obteniendo histórico de rentabilidades desde queAFP.cl...');

      // Consultar API
      const response = await fetch(`${this.baseUrl}/shares.json`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        // Procesar datos y extraer información relevante
        const historicoProcessado = this.procesarDatosHistoricos(data);

        // Guardar en cache
        this.cache[cacheKey] = {
          data: historicoProcessado,
          timestamp: ahora
        };

        console.log(`✓ Histórico obtenido: ${historicoProcessado.afps.length} AFPs`);
        return historicoProcessado;
      }

      throw new Error('Formato de datos inválido');
    } catch (error) {
      console.error('Error obteniendo histórico:', error.message);
      return this.obtenerDatosDefecto();
    }
  }

  /**
   * Procesa datos del API para extraer rentabilidades
   */
  procesarDatosHistoricos(data) {
    const afpsMap = {};
    const fechas = new Set();

    // Agrupar por AFP
    data.forEach(registro => {
      const afp = registro.AFP || 'Desconocida';
      const fecha = registro.Fecha || new Date().toISOString().split('T')[0];

      if (!afpsMap[afp]) {
        afpsMap[afp] = [];
      }

      afpsMap[afp].push({
        fecha: fecha,
        valor: parseFloat(registro.Valor) || 0,
        rentabilidad: parseFloat(registro.Rentabilidad) || 0
      });

      fechas.add(fecha);
    });

    // Convertir a array ordenado
    const afps = Object.keys(afpsMap).map(nombreAFP => {
      const datos = afpsMap[nombreAFP]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 30); // Últimos 30 días

      const rentabilidades = datos.map(d => d.rentabilidad);
      const promedio = rentabilidades.length > 0
        ? rentabilidades.reduce((a, b) => a + b, 0) / rentabilidades.length
        : 0;

      return {
        nombre: nombreAFP,
        datos: datos.reverse(), // Ordenar de antiguo a nuevo
        promedio: parseFloat(promedio.toFixed(2)),
        minimo: Math.min(...rentabilidades),
        maximo: Math.max(...rentabilidades),
        actual: rentabilidades[rentabilidades.length - 1] || 0
      };
    });

    return {
      afps: afps,
      periodo: 'Últimos 30 días',
      ultimaActualizacion: new Date().toISOString(),
      fuente: 'queAFP.cl'
    };
  }

  /**
   * Datos por defecto si no se puede obtener la API
   */
  obtenerDatosDefecto() {
    console.log('⚠️ Usando datos históricos por defecto');
    return {
      afps: [
        {
          nombre: 'AFP Modelo',
          datos: this.generarDatosDemo('AFP Modelo'),
          promedio: 9.1,
          minimo: 8.9,
          maximo: 9.3,
          actual: 9.2
        },
        {
          nombre: 'AFP Habitat',
          datos: this.generarDatosDemo('AFP Habitat'),
          promedio: 6.4,
          minimo: 6.2,
          maximo: 6.6,
          actual: 6.43
        },
        {
          nombre: 'AFP Cuprum',
          datos: this.generarDatosDemo('AFP Cuprum'),
          promedio: 6.5,
          minimo: 6.3,
          maximo: 6.7,
          actual: 6.50
        }
      ],
      periodo: 'Últimos 30 días (datos referenciales)',
      ultimaActualizacion: new Date().toISOString(),
      fuente: 'Datos referenciales'
    };
  }

  /**
   * Genera datos demo para visualización
   */
  generarDatosDemo(nombreAFP) {
    const datos = [];
    const hoy = new Date();

    for (let i = 29; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];

      // Rentabilidad aleatoria realista (entre 6% y 9%)
      const rentabilidad = parseFloat((Math.random() * 3 + 6).toFixed(2));

      datos.push({
        fecha: fechaStr,
        valor: 25000 + Math.random() * 5000,
        rentabilidad: rentabilidad
      });
    }

    return datos;
  }
}

export default new HistoricalDataService();
