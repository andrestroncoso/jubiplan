/**
 * Servicio de integración con Mindicador.cl
 * Obtiene UF, Dólar, IPC y otros indicadores económicos diarios
 */

class MindicadorService {
  constructor() {
    this.baseUrl = 'https://mindicador.cl/api';
    this.cache = {};
    this.cacheDuration = 24 * 60 * 60 * 1000; // 24 horas
  }

  /**
   * Obtiene el valor actual de UF desde Mindicador
   */
  async obtenerUF() {
    try {
      const cacheKey = 'uf_diaria';
      const ahora = Date.now();

      // Verificar cache
      if (this.cache[cacheKey] && ahora - this.cache[cacheKey].timestamp < this.cacheDuration) {
        console.log('✓ UF obtenida del caché');
        return this.cache[cacheKey].data;
      }

      // Consultar API
      const response = await fetch(`${this.baseUrl}/uf`);
      const data = await response.json();

      if (data.serie && data.serie.length > 0) {
        const ultimoValor = data.serie[0];
        const resultado = {
          valor: ultimoValor.valor,
          fecha: ultimoValor.fecha,
          fuente: 'Mindicador.cl'
        };

        // Guardar en cache
        this.cache[cacheKey] = {
          data: resultado,
          timestamp: ahora
        };

        console.log(`✓ UF obtenida: ${resultado.valor} (${resultado.fecha})`);
        return resultado;
      }

      throw new Error('No se encontraron datos de UF');
    } catch (error) {
      console.error('Error obteniendo UF:', error.message);
      return null;
    }
  }

  /**
   * Obtiene el valor actual de Dólar desde Mindicador
   */
  async obtenerDolar() {
    try {
      const cacheKey = 'dolar_diario';
      const ahora = Date.now();

      // Verificar cache
      if (this.cache[cacheKey] && ahora - this.cache[cacheKey].timestamp < this.cacheDuration) {
        console.log('✓ Dólar obtenido del caché');
        return this.cache[cacheKey].data;
      }

      // Consultar API
      const response = await fetch(`${this.baseUrl}/dolar`);
      const data = await response.json();

      if (data.serie && data.serie.length > 0) {
        const ultimoValor = data.serie[0];
        const resultado = {
          valor: ultimoValor.valor,
          fecha: ultimoValor.fecha,
          fuente: 'Mindicador.cl'
        };

        // Guardar en cache
        this.cache[cacheKey] = {
          data: resultado,
          timestamp: ahora
        };

        console.log(`✓ Dólar obtenido: ${resultado.valor} (${resultado.fecha})`);
        return resultado;
      }

      throw new Error('No se encontraron datos de Dólar');
    } catch (error) {
      console.error('Error obteniendo Dólar:', error.message);
      return null;
    }
  }

  /**
   * Obtiene UF y Dólar al mismo tiempo
   */
  async obtenerIndicadoresDelDia() {
    try {
      const [uf, dolar] = await Promise.all([
        this.obtenerUF(),
        this.obtenerDolar()
      ]);

      return {
        uf: uf || { valor: 0, fecha: 'N/A' },
        dolar: dolar || { valor: 0, fecha: 'N/A' },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo indicadores:', error.message);
      return null;
    }
  }

  /**
   * Formatea valor monetario para mostrar
   */
  formatearValor(valor) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }
}

export default new MindicadorService();
