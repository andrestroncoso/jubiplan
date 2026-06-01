# Arquitectura del Proyecto - Calculadora de Pensiones

## 🏗️ Descripción General

La aplicación sigue una arquitectura de **cliente-servidor** con separación clara entre capas:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Cliente)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ HTML/CSS/JavaScript Vanilla                      │   │
│  │ - Interfaz responsiva                            │   │
│  │ - Gestión de formularios                         │   │
│  │ - Renderizado de datos (AFPs/Isapres)            │   │
│  │ - Gráficos con Chart.js                          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
              ↕ HTTP/REST API (JSON)
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Servidor)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Express.js - Node.js                             │   │
│  │ - Rutas API REST                                 │   │
│  │ - Controllers (Controladores)                    │   │
│  │ - Services (Servicios de negocio)                │   │
│  │ - Utils (Utilidades y cálculos)                  │   │
│  └──────────────────────────────────────────────────┘   │
│                      ↓                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ DATA LAYER (Capa de Datos)                       │   │
│  │ - afps.json (Información de AFPs)                │   │
│  │ - isapres.json (Información de Isapres)          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📦 Capas de la Aplicación

### 1. **Frontend Layer** (`src/frontend/`)

#### Archivos Principales:
- **index.html** - Estructura base de la aplicación
  - Define la navegación (tabs)
  - Estructura de formularios
  - Contenedores para resultados

- **styles/main.css** - Estilos globales
  - Variables CSS (colores, tipografía)
  - Componentes reutilizables
  - Media queries para responsividad
  - Soporte para tema oscuro

- **js/app.js** - Lógica del cliente
  - Event listeners
  - Llamadas a API
  - Renderizado dinámico
  - Gráficos

#### Responsabilidades:
- Capturar input del usuario
- Validación básica en cliente
- Comunicación con API backend
- Presentación de datos
- Interactividad

### 2. **Backend Layer** (`src/backend/`)

#### server.js
- Punto de entrada de la aplicación
- Configuración de Express
- Middleware (CORS, JSON parser)
- Rutas principales

#### routes/
- Define endpoints de la API REST
- Mapeo de rutas a controladores
- Gestión de HTTP verbs (GET, POST)

#### controllers/
- Lógica de manejo de requests
- Validación de datos
- Orquestación de servicios
- Respuestas HTTP

#### services/
- Lógica de negocio
- Procesamiento de datos
- Cálculos complejos

### 3. **Data Layer** (`src/data/`)

#### afps.json
```json
{
  "afps": [
    {
      "id": "afp-01",
      "nombre": "AFP Habitat",
      "comisión": 0.74,
      "tasaSeguro": 1.27,
      "fondos": [ ... ]
    }
  ]
}
```

#### isapres.json
```json
{
  "isapres": [
    {
      "id": "isapre-01",
      "nombre": "Isapre Banmédica",
      "cotizacion": 7.0,
      "planes": [ ... ]
    }
  ]
}
```

### 4. **Utilities Layer** (`src/utils/`)

#### pensionCalculator.js
Clase `PensionCalculator` con métodos:

```javascript
class PensionCalculator {
  // Calcula pensión basada en parámetros
  calcularPension(params)
  
  // Calcula pensión mensual actuarial
  calcularPensionMensual(saldoFinal, edadJubilacion)
  
  // Compara diferentes AFPs
  compararAFPs(saldoFinal, afps)
  
  // Valida parámetros de entrada
  validarParametros(params)
}
```

## 🔄 Flujos de Datos

### Flujo 1: Cálculo de Pensión

```
Usuario ingresa datos
       ↓
Frontend valida (básico)
       ↓
Envía POST a /api/calcular-pension
       ↓
Backend valida parámetros
       ↓
PensionCalculator.calcularPension()
       ↓
Retorna resultado como JSON
       ↓
Frontend renderiza gráfico
       ↓
Muestra resultados al usuario
```

### Flujo 2: Cargar AFPs e Isapres

```
Usuario hace clic en tab "AFP e Isapres"
       ↓
Frontend solicita GET /api/afps
Frontend solicita GET /api/isapres (paralelo)
       ↓
Backend lee archivos JSON
       ↓
Retorna datos como JSON
       ↓
Frontend renderiza tarjetas
       ↓
Muestra instituciones al usuario
```

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/api/afps` | Obtiene todas las AFPs | JSON con datos de AFPs |
| GET | `/api/isapres` | Obtiene todas las isapres | JSON con datos de isapres |
| POST | `/api/calcular-pension` | Calcula pensión estimada | JSON con resultados |
| POST | `/api/comparar-afps` | Compara AFPs | JSON con comparativa |
| GET | `/api/health` | Estado del servidor | `{status: "OK"}` |

## 🔧 Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos, Grid, Flexbox
- **JavaScript (ES6+)** - Lógica interactiva
- **Chart.js** - Visualización de gráficos
- **Fetch API** - Comunicación AJAX

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Manejo de CORS
- **ES Modules** - Import/export moderno

### Herramientas
- **npm** - Gestor de paquetes
- **VSCode** - Editor de código

## 🏃 Flujo de Ejecución en Desarrollo

1. `npm install` - Instala dependencias
2. `npm run dev` - Inicia servidor con hot-reload
3. Servidor escucha en `http://localhost:3000`
4. Frontend se sirve desde `/` 
5. API disponible en `/api/`

## 🔐 Consideraciones de Seguridad

- **Validación en Backend**: Todos los datos se validan en servidor
- **CORS**: Configurado para desarrollo local
- **JSON Safe**: No se evalúa código dinámicamente
- **Sin Autenticación**: Datos públicos solamente
- **Headers Seguros**: Se recomienda en producción

## 📊 Cálculo de Pensiones - Detalles Técnicos

### Fórmula Básica:

```
Saldo_Final = Saldo_Inicial + Aportes_Anuales - Comisiones - Seguros + Rendimientos

Aporte_Mensual = Salario × 0.10

Pensión_Mensual = Saldo_Final / Factor_Actuarial
```

### Factor Actuarial:

```
Factor = Σ[1 / (1 + r)^n] para n en meses hasta jubilación
r = tasa de descuento (4% anual)
```

## 🔄 Patrón de Arquitectura

### MVC (Model-View-Controller)

- **Model**: Datos (JSON files, PensionCalculator)
- **View**: Frontend (HTML/CSS)
- **Controller**: Express routes y middleware

### Separación de Responsabilidades

Cada módulo tiene una responsabilidad única:
- Calculadora: solo lógica matemática
- Controllers: solo enrutamiento
- Frontend: solo presentación
- Data: solo almacenamiento

## 📈 Escalabilidad Futura

Posibles mejoras:
1. Base de datos (MongoDB/PostgreSQL)
2. Autenticación de usuarios
3. Persistencia de simulaciones
4. API Key protection
5. Caching de datos estáticos
6. CDN para static assets
7. Microservicios separados

## 📚 Referencias

- [Express.js Documentation](https://expressjs.com/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Chile AFP System](https://www.spensiones.cl/)
