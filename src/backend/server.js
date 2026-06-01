import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import PensionCalculator from '../utils/pensionCalculator.js';
import svsService from '../utils/svsService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Seguridad: Headers HTTP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS: Permisivo para app educativa
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  credentials: false,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const calculator = new PensionCalculator();
const staticPath = join(__dirname, '../frontend');
const assetsPath = join(__dirname, '../../assets');

// Variables para almacenar datos en memoria (con enriquecimiento SVS)
let datosAFPsEnriquecidos = null;
let datosIsapres = null;
let cacheMIndicador = { uf: null, dolar: null, timestamp: null };

const dataPath = {
  afps: join(__dirname, '../data/afps.json'),
  isapres: join(__dirname, '../data/isapres.json')
};

// Datos base de AFPs para simular realismo
const afpsBase = {
  'Habitat': { rentabilidad: 6.43, minimo: 6.2, maximo: 6.6 },
  'Provida': { rentabilidad: 7.15, minimo: 6.9, maximo: 7.4 },
  'Modelo': { rentabilidad: 9.2, minimo: 8.9, maximo: 9.3 },
  'Integra': { rentabilidad: 8.65, minimo: 8.4, maximo: 8.8 },
  'Cuprum': { rentabilidad: 6.50, minimo: 6.3, maximo: 6.7 },
  'Sura': { rentabilidad: 7.80, minimo: 7.5, maximo: 8.0 }
};

// Función para generar variación realista diaria (±0.5%)
function generarVariacionDiaria(baseValue, minValue, maxValue) {
  const variacion = (Math.random() - 0.5) * 1.0; // ±0.5%
  const nuevoValor = baseValue + variacion;
  return Math.max(minValue, Math.min(maxValue, parseFloat(nuevoValor.toFixed(2))));
}

// Función para obtener UF y Dólar de Mindicador
async function obtenerIndicadoresMindicador() {
  try {
    const hoy = new Date().toLocaleDateString('en-CA'); // formato YYYY-MM-DD

    const [ufRes, dolarRes] = await Promise.all([
      fetch(`https://mindicador.cl/api/uf/${hoy}`),
      fetch(`https://mindicador.cl/api/dolar/${hoy}`)
    ]);

    if (!ufRes.ok || !dolarRes.ok) throw new Error('Error en API Mindicador');

    const ufData = await ufRes.json();
    const dolarData = await dolarRes.json();

    const uf = ufData.serie?.[0]?.valor || 40610.69;
    const dolar = dolarData.serie?.[0]?.valor || 892.89;

    return { uf, dolar, timestamp: new Date().toISOString() };
  } catch (error) {
    console.warn('Error obteniendo de Mindicador, usando valores fallback:', error.message);
    return { uf: 40610.69, dolar: 892.89, timestamp: new Date().toISOString() };
  }
}

function loadData(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (error) {
    console.error(`Error cargando datos de ${path}:`, error.message);
    return null;
  }
}

app.get('/api/afps', async (req, res) => {
  try {
    // Usar datos en caché si existen
    if (datosAFPsEnriquecidos) {
      return res.json(datosAFPsEnriquecidos);
    }

    // Cargar datos base
    const dataBase = loadData(dataPath.afps);
    if (!dataBase) {
      return res.status(500).json({ error: 'Error cargando datos de AFPs' });
    }

    // Enriquecer con datos reales de SVS
    datosAFPsEnriquecidos = await svsService.obtenerDatosEnriquecidos(dataBase);

    res.json(datosAFPsEnriquecidos);
  } catch (error) {
    console.error('Error en /api/afps:', error);
    const fallback = loadData(dataPath.afps);
    res.json(fallback || { afps: [], error: 'Usando datos estáticos' });
  }
});

app.get('/api/isapres', (req, res) => {
  // Las isapres no tienen API pública de SVS, pero podríamos agregar en futuro
  const data = loadData(dataPath.isapres);
  if (!data) {
    return res.status(500).json({ error: 'Error cargando datos de isapres' });
  }

  // Marcar como datos referenciales
  data.notaActualizacion = 'Datos referenciales de mayo 2026. Consultar directamente con isapres para valores actuales.';

  res.json(data);
});

app.post('/api/calcular-pension', (req, res) => {
  try {
    const validacion = calculator.validarParametros(req.body);

    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Parámetros inválidos',
        detalles: validacion.errores
      });
    }

    const resultado = calculator.calcularPension(req.body);
    res.json(resultado);
  } catch (error) {
    console.error('Error en cálculo:', error);
    res.status(500).json({ error: 'Error al calcular pensión' });
  }
});

app.post('/api/comparar-afps', (req, res) => {
  try {
    const { saldoFinal } = req.body;
    const afpsData = loadData(dataPath.afps);

    if (!afpsData) {
      return res.status(500).json({ error: 'Error cargando datos' });
    }

    const comparacion = calculator.compararAFPs(saldoFinal, afpsData.afps);
    res.json({ afps: comparacion });
  } catch (error) {
    console.error('Error en comparación:', error);
    res.status(500).json({ error: 'Error al comparar AFPs' });
  }
});

// Endpoint: Obtener UF y Dólar diarios con fecha de actualización
app.get('/api/indicadores-diarios', async (req, res) => {
  try {
    // Usar caché si es del mismo día
    const hoy = new Date().toISOString().split('T')[0];
    if (cacheMIndicador.timestamp && cacheMIndicador.timestamp.startsWith(hoy)) {
      return res.json({
        uf: cacheMIndicador.uf,
        dolar: cacheMIndicador.dolar,
        fecha_actualizacion: cacheMIndicador.timestamp,
        fuente: 'Mindicador.cl'
      });
    }

    const indicadores = await obtenerIndicadoresMindicador();
    cacheMIndicador = indicadores;

    res.json({
      uf: indicadores.uf,
      dolar: indicadores.dolar,
      fecha_actualizacion: indicadores.timestamp,
      fuente: 'Mindicador.cl'
    });
  } catch (error) {
    console.error('Error en /api/indicadores-diarios:', error);
    res.status(500).json({ error: 'Error obteniendo indicadores' });
  }
});

// Endpoint: Obtener AFPs con datos realistas y variaciones diarias
app.get('/api/afps-realistas', (req, res) => {
  try {
    const afpsRealistas = Object.entries(afpsBase).map(([nombre, datos]) => {
      const rentabilidadHoy = generarVariacionDiaria(
        datos.rentabilidad,
        datos.minimo,
        datos.maximo
      );

      // Simular rentabilidad ayer (variación anterior)
      const rentabilidadAyer = generarVariacionDiaria(
        datos.rentabilidad,
        datos.minimo,
        datos.maximo
      );

      const cambio = parseFloat((rentabilidadHoy - rentabilidadAyer).toFixed(2));

      return {
        nombre,
        rentabilidad_hoy: rentabilidadHoy,
        rentabilidad_ayer: rentabilidadAyer,
        cambio_diario: cambio,
        cambio_porcentaje: parseFloat(((cambio / rentabilidadAyer) * 100).toFixed(2)),
        rango_minimo: datos.minimo,
        rango_maximo: datos.maximo
      };
    }).sort((a, b) => b.rentabilidad_hoy - a.rentabilidad_hoy); // Ranking descendente

    res.json({
      afps: afpsRealistas,
      fecha_actualizacion: new Date().toISOString(),
      nota: 'Datos demo realistas con variaciones ±0.5% diarias. No son datos oficiales de SPensiones.'
    });
  } catch (error) {
    console.error('Error en /api/afps-realistas:', error);
    res.status(500).json({ error: 'Error obteniendo AFPs realistas' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    datosAFPs: datosAFPsEnriquecidos ? 'Cargados con datos reales SVS' : 'Listos para cargar'
  });
});

app.get('/api/status-datos', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    afps: {
      fuente: datosAFPsEnriquecidos && datosAFPsEnriquecidos.afps?.[0]?.datosRealesSVS ? 'SVS Chile' : 'Estáticos',
      actualizado: datosAFPsEnriquecidos?.afps?.[0]?.actualizadoEl || 'N/A'
    },
    isapres: {
      fuente: 'Referenciales',
      nota: 'Los datos de isapres son referenciales. Verificar directamente con las isapres.'
    }
  });
});

// Servir archivos estáticos DESPUÉS de todas las rutas de API
app.use(express.static(staticPath));
app.use('/assets', express.static(assetsPath));

// Ruta raíz explícita
app.get('/', (req, res) => {
  res.sendFile(join(staticPath, 'index.html'));
});

// Fallback para SPA - sirve index.html para rutas no encontradas (al final)
app.get('*', (req, res) => {
  res.sendFile(join(staticPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`\n✓ Servidor ejecutándose en http://localhost:${port}`);
  console.log('✓ API disponible en http://localhost:${port}/api/\n');
});
