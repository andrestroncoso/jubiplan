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

const dataPath = {
  afps: join(__dirname, '../data/afps.json'),
  isapres: join(__dirname, '../data/isapres.json')
};

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
