# CLAUDE.md - Documentación para Claude Code

## 🎯 Resumen del Proyecto

**Calculadora de Pensiones Chile** es una aplicación web elegante, minimalista y funcional que permite a los usuarios:
1. Calcular estimaciones de pensiones basadas en parámetros personalizados
2. Explorar y comparar AFP (Administradoras de Fondos de Pensiones)
3. Explorar y comparar Isapres (Seguros de Salud Privados)
4. Obtener información educativa sobre el sistema de pensiones chileno

## 🏗️ Estructura del Código

### Capas Principales:

**Frontend** (`src/frontend/`)
- HTML semántico + CSS moderno + JavaScript vanilla
- Interfaz responsiva diseñada para usuarios mayores
- Tablas navegables: Calculadora, AFP e Isapres, Información
- Gráficos con Chart.js para visualizar evolución de saldos

**Backend** (`src/backend/`)
- Express.js server en Node.js
- APIs REST para servir datos de AFPs/Isapres
- Endpoint para cálculo de pensiones
- CORS habilitado para desarrollo

**Data** (`src/data/`)
- `afps.json`: Información de 4 AFPs principales con fondos
- `isapres.json`: Información de 4 Isapres principales con planes

**Utils** (`src/utils/`)
- `pensionCalculator.js`: Clase con lógica de cálculo actuarial
- Métodos: calcularPension, calcularPensionMensual, compararAFPs, validarParametros

## 🚀 Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Desarrollo (hot reload)
npm run dev

# Producción
npm start

# Navegador
http://localhost:3000
```

## 📱 Interfaz

### Tab 1: Calculadora
- Formulario con parámetros (salario, edad actual, edad jubilación, saldo AFP, aportes adicionales)
- Validación de entrada en backend
- Resultados con tarjetas (pensión mensual, saldo final, totales, comisiones)
- Gráfico de evolución de saldo año por año

### Tab 2: AFP e Isapres
- Toggle entre AFP e Isapres
- Tarjetas de institución con información detallada
- Fondos/Planes con riesgo, rentabilidad, composición
- Contacto y sitios web

### Tab 3: Información
- Explicaciones sobre AFP, Isapres, fondos
- FAQ educativo
- Detalles sobre aportes y jubilación

## 🔌 API Endpoints

- `GET /api/afps` - Retorna todos los datos de AFPs
- `GET /api/isapres` - Retorna todos los datos de Isapres
- `POST /api/calcular-pension` - Calcula pensión (body: parámetros)
- `POST /api/comparar-afps` - Compara AFPs (body: saldoFinal)
- `GET /api/health` - Estado del servidor

## 🎨 Diseño

- **Color Primario**: Azul (#2563eb)
- **Color Secundario**: Verde (#10b981)
- **Tipografía**: System fonts
- **Accesibilidad**: WCAG 2.1 AA, tema oscuro soportado
- **Responsive**: Mobile-first, optimizado para todas las pantallas
- **Usuarios Target**: Personas mayores - texto grande, colores claros, interfaz intuitiva

## 🧮 Lógica de Cálculo

- Aporte obligatorio: 10% del salario
- Comisión AFP: ~0.74% del saldo
- Seguro de invalidez y vida: ~1.27%
- Rendimiento: 6.5% anual (ajustable)
- Expectativa de vida: 80 años
- Cálculo actuarial con factor de descuento

## 📦 Dependencias

- `express`: Framework web
- `cors`: Manejo de CORS
- `chart.js`: Gráficos (frontend, vía CDN)

## 🔐 Características de Seguridad

- Validación de parámetros en backend
- Sin datos sensibles almacenados
- CORS configurado
- Sin autenticación (datos públicos)

## 🚨 Notas Importantes

- Los datos de rendimiento (8.3%, 6.8%, etc.) son aproximados
- Las comisiones y tasas de seguro pueden cambiar
- El cálculo no considera cambios futuros en ingresos
- Educativo: usuarios deben consultar con asesor profesional

## 📁 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/backend/server.js` | Punto de entrada, configuración Express |
| `src/frontend/index.html` | Estructura HTML completa |
| `src/frontend/styles/main.css` | Todos los estilos (responsive, tema oscuro) |
| `src/frontend/js/app.js` | Lógica frontend, interactividad |
| `src/utils/pensionCalculator.js` | Clase principal de cálculo |
| `src/data/afps.json` | Datos de AFPs |
| `src/data/isapres.json` | Datos de Isapres |
| `package.json` | Dependencias y scripts |

## 🔧 Desarrollo

- Frontend ES6+ vanilla JavaScript, sin bundler necesario
- Backend usa ES Modules (`import`/`export`)
- Archivo JSON como "base de datos"
- No hay compilación necesaria

## 📝 Próximas Mejoras (Sugeridas)

1. Integración con base de datos real
2. Actualización automática de datos (webscraping)
3. Autenticación y perfil de usuario
4. Exportación de resultados (PDF)
5. Simulaciones guardadas
6. API Key protection
7. Más escenarios de cálculo
8. Comparativa más avanzada

## 🔗 Recursos Externos

- Datos basados en sistema de pensiones chileno
- Información de AFPs: https://www.spensiones.cl/
- Regulación: Superintendencia de Pensiones

---

**Última actualización**: 31 de Mayo 2026
**Versión**: 1.0.0
**Estado**: Funcional y listo para usar
