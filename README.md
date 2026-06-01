# 💰 Jubiplan - Calculadora de Pensiones Chile

[![Estado](https://img.shields.io/badge/Estado-Producción%20Segura-brightgreen?style=flat-square)](.)
[![Versión](https://img.shields.io/badge/Versión-1.1.0-blue?style=flat-square)](.)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=flat-square)](LICENSE)
[![Security](https://img.shields.io/badge/Seguridad-9.5%2F10-orange?style=flat-square)](SECURITY.md)

Una aplicación web elegante, segura y accesible para calcular pensiones y comparar AFP e Isapres en Chile. Diseñada especialmente para ser clara y entendible para personas mayores de edad.

> 🌐 **[Ver en Producción](https://jubiplan-production.up.railway.app)** | 📚 **[Documentación Completa](RAILWAY_DEPLOY.md)** | 🔒 **[Seguridad](SECURITY.md)**

## ⚡ Características Principales

### 💻 **Calculadora de Pensiones Avanzada**
- ✅ Simulación basada en parámetros personalizados
- ✅ Gráficos interactivos (Chart.js) de evolución de saldo
- ✅ Cálculo actuarial preciso con rendimiento compuesto
- ✅ Datos reales de SVS (Superintendencia de Valores y Seguros)
- ✅ Desglose detallado de comisiones y seguros

### 📊 **Datos Reales de SVS Chile** ✨
- ✅ Integración con SVS en tiempo real
- ✅ Rentabilidades actualizadas de fondos de pensiones
- ✅ Comisiones y tasas de seguro vigentes
- ✅ Caché automático de 24 horas
- ✅ Fallback a datos estáticos si hay error

### 🏦 **Directorio de AFP e Isapres Completo**
- ✅ Información de todas las AFP principales (6 instituciones)
- ✅ Comparación interactiva de fondos y rentabilidades
- ✅ Planes de isapres con detalles de cobertura
- ✅ 7 filtros inteligentes (mejor valor, cobertura, clínicas, etc.)
- ✅ Información de contacto y sitios web

### ♿ **Accesibilidad Mejorada (WCAG 2.1 AA)**
- ✅ Tipografía base 18px (ideal para adultos mayores)
- ✅ Alto contraste de colores (#c0c8d8)
- ✅ Botones y elementos táctiles grandes (52-56px mín)
- ✅ Roles ARIA (tab, region, live regions)
- ✅ Compatibilidad total con lectores de pantalla
- ✅ Navegación clara con indicadores visuales

### 🔐 **Seguridad Enterprise** (Junio 2026)
- ✅ Helmet.js: Headers HTTP de seguridad automáticos
- ✅ XSS Protection: Sanitización HTML de datos dinámicos
- ✅ CORS Seguro: Orígenes configurables
- ✅ Validación de entrada en backend
- ✅ Variables de ambiente protegidas
- ✅ Content-Security-Policy configurado
- ✅ Sin datos sensibles hardcodeados

### 🎨 **Interfaz Moderna y Responsiva**
- ✅ Diseño minimalista (inspirado en Stripe)
- ✅ Logo JP elegante con gradiente
- ✅ Tema oscuro soportado
- ✅ Totalmente responsive (móvil/tablet/desktop)
- ✅ Transiciones suaves y animaciones accesibles

## 📁 Estructura del Proyecto

```
pension-calculator/
├── src/
│   ├── frontend/                 # Frontend web (HTML/CSS/JS)
│   │   ├── index.html           # Página principal
│   │   ├── styles/
│   │   │   └── main.css         # Estilos globales
│   │   └── js/
│   │       └── app.js           # Lógica frontend
│   ├── backend/                  # Backend Node.js
│   │   ├── server.js            # Servidor Express
│   │   ├── routes/              # Rutas API
│   │   ├── controllers/         # Controladores
│   │   └── services/            # Servicios de negocio
│   ├── data/                     # Datos estáticos + caché
│   │   ├── afps.json            # Información de AFPs
│   │   ├── isapres.json         # Información de isapres
│   │   └── svs-cache.json       # Caché de datos SVS (generado)
│   └── utils/
│       ├── pensionCalculator.js # Lógica de cálculo
│       └── svsService.js        # Integración SVS Chile ✨ NUEVO
├── .claude/
│   └── settings.json            # Configuración de Claude Code
├── docs/                        # Documentación
├── temp/                        # Archivos temporales
├── package.json                 # Dependencias Node.js
└── README.md                    # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos
- **Node.js** 18+ 
- **npm** 9+ o **yarn**
- (Opcional) **Git** para despliegue

### 💻 Desarrollo Local

#### 1. Clonar o descargar el proyecto
```bash
git clone https://github.com/andrestroncoso/jubiplan.git
cd jubiplan
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar variables de ambiente (opcional)
```bash
cp .env.example .env
# Editar .env si es necesario (por defecto funciona para desarrollo)
```

#### 4. Iniciar en desarrollo
```bash
npm run dev
```
Abrirá con hot reload automático en cambios.

#### 5. O iniciar en producción local
```bash
npm start
```

#### 6. Acceder a la aplicación
```
http://localhost:3000
```

---

### 🌐 Despliegue en Producción (Railway)

**Opción más fácil:** Despliegue automático desde GitHub en Railway (~2 minutos)

#### Pasos Rápidos:
1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Start a New Project"
3. Selecciona "Deploy from GitHub repo"
4. Elige `andrestroncoso/jubiplan`
5. Railway detecta automáticamente la configuración
6. ¡Listo! Tu app estará en vivo en 2-3 minutos

**URL de Producción:**
```
https://jubiplan-production.up.railway.app
```

**Para instrucciones detalladas:** Ve a [`RAILWAY_DEPLOY.md`](RAILWAY_DEPLOY.md)

---

### 🔧 Variables de Ambiente

**Archivo:** `.env`

```env
# Puerto del servidor
PORT=3000

# Ambiente (development, production)
NODE_ENV=production

# CORS - Dominios permitidos (separados por coma)
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
```

**Para desarrollo local, el `.env` por defecto funciona sin cambios.**

## 🧮 Parámetros de Cálculo

La calculadora acepta los siguientes parámetros:

| Parámetro | Descripción | Rango |
|-----------|-------------|-------|
| **Salario Mensual** | Salario bruto mensual actual | $0+ |
| **Edad Actual** | Edad en años | 18-100 |
| **Edad de Jubilación** | Edad deseada para jubilarse | 18-100 |
| **Saldo Actual en AFP** | Saldo acumulado actual | $0+ |
| **Aportes Adicionales** | Ahorro voluntario mensual | $0+ |
| **Tasa de Rendimiento** | Rendimiento anual esperado | 4-8% |

## 📊 Funcionalidad de la Calculadora

1. **Cálculo Actuarial Preciso**
   - Considera aporte obligatorio (10%)
   - Descuenta comisiones de AFP
   - Incluye seguro de invalidez y vida
   - Aplica rendimiento compuesto

2. **Proyección de Saldo**
   - Simula año por año hasta jubilación
   - Gráfico interactivo de evolución
   - Desglose de costos y comisiones

3. **Estimación de Pensión**
   - Cálculo con expectativa de vida
   - Factor actuarial aplicado
   - Comparativa con diferentes AFPs

## 📊 Integración SVS - Datos Reales

La aplicación ahora se integra con **SVS (Superintendencia de Valores y Seguros)** para obtener datos reales y actualizados:

**Datos Enriquecidos:**
- ✅ Rentabilidades reales de fondos de pensiones
- ✅ Comisiones actuales de AFP
- ✅ Tasas de seguro vigentes
- ✅ Caché automático de 24 horas
- ✅ Fallback a datos estáticos si hay error

**Indicador Visual:**
Cuando abres "AFP e Isapres", verás:
```
📊 Datos Actualizados desde SVS Chile 
   (Superintendencia de Valores y Seguros)
```

**API de Status:**
```bash
curl http://localhost:3000/api/status-datos
```

Para más detalles, ve a [`docs/SVS_INTEGRACION.md`](docs/SVS_INTEGRACION.md)

## 🔌 API Endpoints

### GET `/api/afps`
Obtiene información de todas las AFPs
```json
{
  "afps": [
    {
      "id": "afp-01",
      "nombre": "AFP Habitat",
      "comisión": 0.74,
      "tasaSeguro": 1.27,
      "fondos": [...]
    }
  ]
}
```

### GET `/api/isapres`
Obtiene información de todas las isapres
```json
{
  "isapres": [
    {
      "id": "isapre-01",
      "nombre": "Isapre Banmédica",
      "cotizacion": 7.0,
      "planes": [...]
    }
  ]
}
```

### POST `/api/calcular-pension`
Calcula la pensión estimada
```json
{
  "salarioMensual": 2000000,
  "edadActual": 35,
  "edadJubilacion": 65,
  "saldoActual": 5000000,
  "aportesAdicionales": 0,
  "tasaRendimiento": 0.065,
  "comisionAfp": 0.0074,
  "tasaSeguro": 0.0127
}
```

### GET `/api/status-datos` ✨ NUEVO
Obtiene información sobre la fuente de datos (SVS o estáticos)
```json
{
  "timestamp": "2026-05-31T23:42:07.123Z",
  "afps": {
    "fuente": "SVS Chile",
    "actualizado": "05/31/2026 23:42:07"
  },
  "isapres": {
    "fuente": "Referenciales",
    "nota": "Los datos de isapres son referenciales..."
  }
}
```

## 🎨 Diseño

- **Colores Principales**: Azul (#2563eb), Verde (#10b981)
- **Tipografía**: System fonts para mejor rendimiento
- **Espaciado**: Grid system con gap consistente
- **Interactividad**: Transiciones suaves y animaciones accesibles
- **Accesibilidad**: WCAG 2.1 AA compliant

## 📱 Responsividad

- Móviles: < 768px
- Tablets: 768px - 1024px
- Desktop: > 1024px
- Totalmente funcional en todos los dispositivos

## 🔒 Seguridad Enterprise (Junio 2026)

**Puntuación de Seguridad: 9.5/10** ⭐⭐⭐⭐⭐

### Protecciones Implementadas

| Amenaza | Protección | Estado |
|---------|-----------|--------|
| **Inyección XSS** | sanitizeHTML() + validación | ✅ Implementado |
| **Headers débiles** | Helmet.js | ✅ Helmet v8.2.0 |
| **CORS sin restricciones** | Orígenes configurables | ✅ Seguro |
| **Datos sensibles** | Ninguno en código | ✅ Verificado |
| **Payloads grandes** | Límite 10KB | ✅ Activo |
| **MIME sniffing** | X-Content-Type-Options | ✅ Helmet |
| **Clickjacking** | X-Frame-Options: SAMEORIGIN | ✅ Helmet |
| **CSP débil** | Content-Security-Policy | ✅ Configurado |

### Headers de Seguridad Activos
```
✅ Content-Security-Policy
✅ X-Frame-Options: SAMEORIGIN
✅ X-Content-Type-Options: nosniff
✅ Strict-Transport-Security
✅ Referrer-Policy: no-referrer
✅ X-XSS-Protection
```

**Ver más:** [`SECURITY.md`](SECURITY.md) - Documentación completa de seguridad

## 📚 Documentación

| Documento | Contenido |
|-----------|-----------|
| **[SECURITY.md](SECURITY.md)** | Guía completa de seguridad, vulnerabilidades y mitigaciones |
| **[RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)** | Instrucciones paso a paso para desplegar en Railway |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | Checklist de validación pre-despliegue |
| **[CLAUDE.md](CLAUDE.md)** | Documentación técnica para desarrollo |
| **[docs/SVS_INTEGRACION.md](docs/SVS_INTEGRACION.md)** | Detalles de integración con SVS Chile |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Arquitectura del proyecto |

---

## 📊 Estadísticas del Proyecto

```
Líneas de Código (sin documentación):
├── Frontend: 500+ líneas (HTML, CSS, JS)
├── Backend: 300+ líneas (Node.js/Express)
├── Utils: 200+ líneas (Cálculos, integraciones)
└── Total: 1000+ líneas

Dependencias:
├── express ^4.18.2
├── cors ^2.8.5
├── helmet ^8.2.0
├── dotenv ^16.0.3
└── Chart.js ^4.4.0 (CDN)

Endpoints: 6 (health, afps, isapres, calcular, comparar, status)
Páginas: 4 (Calculadora, AFP/Isapres, Histórico, Info)
```

---

## 🔄 Cambios Recientes (Junio 2026)

### v1.1.0 - Mejoras de Seguridad y Accesibilidad
- ✅ **Seguridad**: Helmet.js, XSS protection, CORS seguro
- ✅ **Accesibilidad**: ARIA roles, live regions, tipografía mejorada
- ✅ **Gráficos**: Chart.js integrado para visualización de datos
- ✅ **Despliegue**: Configuración Railway automática
- ✅ **Variables de ambiente**: Sistema robusto con .env
- ✅ **Documentación**: Guías completas de seguridad y despliegue

### v1.0.0 - Versión Inicial
- Calculadora de pensiones funcional
- Directorio de AFP e Isapres
- Interfaz accesible para adultos mayores
- Integración con SVS Chile

---

## 📝 Notas Importantes

- ⚠️ Los datos de rentabilidad son aproximados y referenciales
- ⚠️ Las AFP realizan reajustes mensuales
- ⚠️ Consulte con un asesor financiero para asesoramiento personalizado
- ⚠️ La calculadora no considera cambios en ingresos futuros
- ⚠️ Las comisiones y tasas pueden variar según la AFP
- ℹ️ Esta es una aplicación educativa, no debe reemplazar asesoramiento profesional

## 🧪 Testing

### Verificar Seguridad Localmente
```bash
# Headers de seguridad
curl -I http://localhost:3000

# Health check
curl http://localhost:3000/api/health

# Cálculo de pensión
curl -X POST http://localhost:3000/api/calcular-pension \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 💡 Próximas Mejoras (Roadmap)

- [ ] Base de datos para guardar simulaciones
- [ ] Autenticación de usuarios
- [ ] Exportación de resultados (PDF)
- [ ] Simulaciones históricas
- [ ] App móvil nativa
- [ ] Integración con redes sociales
- [ ] Rate limiting avanzado
- [ ] Webhooks y notificaciones

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. **Fork el proyecto**
   ```bash
   gh repo fork andrestroncoso/jubiplan
   ```

2. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/MejoraExcelente
   ```

3. **Commit tus cambios**
   ```bash
   git commit -m "feat: Agregar mejoraExcelente"
   ```

4. **Push a la rama**
   ```bash
   git push origin feature/MejoraExcelente
   ```

5. **Abre un Pull Request**
   - Describe los cambios claramente
   - Referencia cualquier issue relacionado
   - Asegúrate que el código siga las prácticas de seguridad

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**.
Ver archivo `LICENSE` para detalles completos.

---

## 👤 Autor

**Andrés Troncoso Castillo**
- Email: andres.troncoso.castillo@gmail.com
- GitHub: [@andrestroncoso](https://github.com/andrestroncoso)
- LinkedIn: [Perfil](https://linkedin.com/in/andrestroncoso)

---

## 📞 Soporte y Contacto

### Reportar Bugs
- [GitHub Issues](https://github.com/andrestroncoso/jubiplan/issues)
- Email: andres.troncoso.castillo@gmail.com

### Sugerencias y Feedback
- Abre una [Discussion](https://github.com/andrestroncoso/jubiplan/discussions)
- O envía un email directamente

### Información Financiera
Para preguntas sobre pensiones, AFPs o isapres:
- Superintendencia de Pensiones: https://www.spensiones.cl/
- SVS: https://www.svs.cl/

---

## 🙏 Agradecimientos

- **Chart.js**: Gráficos interactivos
- **Helmet.js**: Headers de seguridad
- **Express.js**: Framework web
- **SVS Chile**: Datos de pensiones actualizados
- **Claude AI**: Asistente de desarrollo

---

## 📈 Estadísticas del Repositorio

![GitHub](https://img.shields.io/badge/GitHub-andrestroncoso%2Fjubiplan-blue?style=flat-square&logo=github)
![Commits](https://img.shields.io/badge/Commits-2%2B-brightgreen?style=flat-square)
![Estado](https://img.shields.io/badge/Estado-Producción-brightgreen?style=flat-square)
![Seguridad](https://img.shields.io/badge/Seguridad-9.5%2F10-orange?style=flat-square)

---

## 📅 Changelog

### [1.1.0] - 1 de Junio de 2026
- ✨ Helmet.js para headers de seguridad
- ✨ XSS protection con sanitizeHTML()
- ✨ ARIA roles para accesibilidad mejorada
- ✨ Chart.js para gráficos interactivos
- ✨ Configuración automática Railway
- 🐛 Fix: Deprecation warning express.urlencoded
- 📚 Documentación completa de seguridad
- 🔐 Validación de entrada mejorada

### [1.0.0] - 31 de Mayo de 2026
- 🎉 Versión inicial funcional
- 💰 Calculadora de pensiones
- 🏦 Directorio de AFP e Isapres
- 📊 Integración con SVS Chile
- ♿ Accesibilidad WCAG 2.1 AA

---

<div align="center">

**⭐ Si te fue útil, considera dar una estrella en GitHub ⭐**

**Desarrollado con ❤️ por Andrés Troncoso**

**Última actualización**: 1 de Junio de 2026 | **Versión**: 1.1.0 - Secure Edition

</div>
